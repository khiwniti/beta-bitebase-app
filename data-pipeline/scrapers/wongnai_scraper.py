"""
Wongnai restaurant and menu scraper
"""
import asyncio
import json
import re
import time
from datetime import datetime
from typing import Dict, List, Optional, Tuple
from urllib.parse import urljoin, urlparse, parse_qs
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import pandas as pd
from fake_useragent import UserAgent
from tenacity import retry, stop_after_attempt, wait_exponential

from config.settings import settings, WONGNAI_REGIONS, WONGNAI_CATEGORIES
from utils.logger import get_logger
from utils.datalake import datalake

logger = get_logger("wongnai_scraper")

class WongnaiScraper:
    """Scraper for Wongnai restaurant data"""
    
    def __init__(self):
        self.config = settings.scraping
        self.ua = UserAgent()
        self.session = requests.Session()
        self.driver = None
        
        # Setup session headers
        self.session.headers.update({
            'User-Agent': self.ua.random,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
        })
    
    def _setup_driver(self):
        """Setup Selenium WebDriver"""
        if self.driver is None:
            chrome_options = Options()
            if self.config.headless:
                chrome_options.add_argument('--headless')
            chrome_options.add_argument('--no-sandbox')
            chrome_options.add_argument('--disable-dev-shm-usage')
            chrome_options.add_argument('--disable-gpu')
            chrome_options.add_argument('--window-size=1920,1080')
            chrome_options.add_argument(f'--user-agent={self.ua.random}')
            
            self.driver = webdriver.Chrome(options=chrome_options)
            logger.info("Selenium WebDriver initialized")
    
    def _close_driver(self):
        """Close Selenium WebDriver"""
        if self.driver:
            self.driver.quit()
            self.driver = None
            logger.info("Selenium WebDriver closed")
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    def _make_request(self, url: str, use_selenium: bool = False) -> Optional[BeautifulSoup]:
        """
        Make HTTP request with retry logic
        
        Args:
            url: URL to request
            use_selenium: Whether to use Selenium for JavaScript rendering
            
        Returns:
            BeautifulSoup object or None if failed
        """
        try:
            if use_selenium:
                self._setup_driver()
                self.driver.get(url)
                
                # Wait for content to load
                WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((By.TAG_NAME, "body"))
                )
                
                html = self.driver.page_source
                return BeautifulSoup(html, 'html.parser')
            else:
                # Rotate user agent
                self.session.headers['User-Agent'] = self.ua.random
                
                response = self.session.get(url, timeout=self.config.timeout)
                response.raise_for_status()
                
                return BeautifulSoup(response.content, 'html.parser')
                
        except Exception as e:
            logger.error(f"Request failed for {url}: {str(e)}")
            raise
        finally:
            # Add delay between requests
            time.sleep(self.config.request_delay)
    
    def scrape_restaurant_listings(self, region: str, category: str = "restaurant", 
                                 max_pages: int = 10) -> List[Dict]:
        """
        Scrape restaurant listings from Wongnai
        
        Args:
            region: Region to scrape (e.g., 'bangkok')
            category: Category to scrape
            max_pages: Maximum number of pages to scrape
            
        Returns:
            List of restaurant data dictionaries
        """
        logger.info(f"Starting restaurant listing scrape for {region}/{category}")
        
        restaurants = []
        region_config = WONGNAI_REGIONS.get(region)
        
        if not region_config:
            logger.error(f"Unknown region: {region}")
            return restaurants
        
        base_url = f"{self.config.wongnai_base_url}/{region_config['url_path']}/{category}"
        
        for page in range(1, max_pages + 1):
            try:
                url = f"{base_url}?page={page}"
                logger.info(f"Scraping page {page}: {url}")
                
                soup = self._make_request(url, use_selenium=True)
                if not soup:
                    continue
                
                # Extract restaurant cards
                restaurant_cards = soup.find_all('div', class_=re.compile(r'restaurant.*card|listing.*item'))
                
                if not restaurant_cards:
                    # Try alternative selectors
                    restaurant_cards = soup.find_all('a', href=re.compile(r'/restaurant/'))
                
                if not restaurant_cards:
                    logger.warning(f"No restaurant cards found on page {page}")
                    break
                
                page_restaurants = []
                for card in restaurant_cards:
                    restaurant_data = self._extract_restaurant_from_card(card, region)
                    if restaurant_data:
                        page_restaurants.append(restaurant_data)
                
                restaurants.extend(page_restaurants)
                logger.info(f"Extracted {len(page_restaurants)} restaurants from page {page}")
                
                # Check if there are more pages
                if not self._has_next_page(soup):
                    logger.info("No more pages found")
                    break
                    
            except Exception as e:
                logger.error(f"Error scraping page {page}: {str(e)}")
                continue
        
        logger.info(f"Completed restaurant listing scrape: {len(restaurants)} restaurants")
        return restaurants
    
    def _extract_restaurant_from_card(self, card, region: str) -> Optional[Dict]:
        """Extract restaurant data from a listing card"""
        try:
            # Extract restaurant URL
            link = card.find('a', href=re.compile(r'/restaurant/'))
            if not link:
                link = card if card.name == 'a' else None
            
            if not link or not link.get('href'):
                return None
            
            restaurant_url = urljoin(self.config.wongnai_base_url, link['href'])
            
            # Extract basic info from card
            name_elem = card.find(['h2', 'h3', 'h4'], class_=re.compile(r'name|title'))
            if not name_elem:
                name_elem = card.find(text=re.compile(r'\w+'))
            
            name = name_elem.get_text(strip=True) if name_elem else "Unknown"
            
            # Extract rating
            rating_elem = card.find(class_=re.compile(r'rating|score'))
            rating = None
            if rating_elem:
                rating_text = rating_elem.get_text(strip=True)
                rating_match = re.search(r'(\d+\.?\d*)', rating_text)
                if rating_match:
                    rating = float(rating_match.group(1))
            
            # Extract price range
            price_elem = card.find(class_=re.compile(r'price|cost'))
            price_range = price_elem.get_text(strip=True) if price_elem else None
            
            # Extract cuisine type
            cuisine_elem = card.find(class_=re.compile(r'cuisine|category|type'))
            cuisine_type = cuisine_elem.get_text(strip=True) if cuisine_elem else None
            
            # Extract image
            img_elem = card.find('img')
            image_url = img_elem.get('src') or img_elem.get('data-src') if img_elem else None
            
            restaurant_data = {
                'name': name,
                'wongnai_url': restaurant_url,
                'rating': rating,
                'price_range': price_range,
                'cuisine_type': cuisine_type,
                'image_url': image_url,
                'region': region,
                'scraped_at': datetime.now().isoformat()
            }
            
            return restaurant_data
            
        except Exception as e:
            logger.error(f"Error extracting restaurant from card: {str(e)}")
            return None
    
    def _has_next_page(self, soup: BeautifulSoup) -> bool:
        """Check if there's a next page"""
        next_button = soup.find('a', class_=re.compile(r'next|pagination.*next'))
        return next_button is not None and not next_button.get('disabled')
    
    def scrape_restaurant_details(self, restaurant_url: str) -> Optional[Dict]:
        """
        Scrape detailed information for a specific restaurant
        
        Args:
            restaurant_url: URL of the restaurant page
            
        Returns:
            Detailed restaurant data dictionary
        """
        logger.info(f"Scraping restaurant details: {restaurant_url}")
        
        try:
            soup = self._make_request(restaurant_url, use_selenium=True)
            if not soup:
                return None
            
            # Extract detailed information
            details = {
                'wongnai_url': restaurant_url,
                'scraped_at': datetime.now().isoformat()
            }
            
            # Restaurant name
            name_elem = soup.find(['h1', 'h2'], class_=re.compile(r'name|title'))
            if name_elem:
                details['name'] = name_elem.get_text(strip=True)
            
            # Address
            address_elem = soup.find(class_=re.compile(r'address|location'))
            if address_elem:
                details['address'] = address_elem.get_text(strip=True)
            
            # Phone
            phone_elem = soup.find(class_=re.compile(r'phone|tel'))
            if phone_elem:
                details['phone'] = phone_elem.get_text(strip=True)
            
            # Website
            website_elem = soup.find('a', href=re.compile(r'http'))
            if website_elem and 'wongnai.com' not in website_elem['href']:
                details['website'] = website_elem['href']
            
            # Rating and reviews
            rating_elem = soup.find(class_=re.compile(r'rating|score'))
            if rating_elem:
                rating_text = rating_elem.get_text(strip=True)
                rating_match = re.search(r'(\d+\.?\d*)', rating_text)
                if rating_match:
                    details['rating'] = float(rating_match.group(1))
            
            review_count_elem = soup.find(class_=re.compile(r'review.*count|total.*review'))
            if review_count_elem:
                review_text = review_count_elem.get_text(strip=True)
                review_match = re.search(r'(\d+)', review_text)
                if review_match:
                    details['review_count'] = int(review_match.group(1))
            
            # Opening hours
            hours_elem = soup.find(class_=re.compile(r'hours|time|open'))
            if hours_elem:
                details['opening_hours'] = hours_elem.get_text(strip=True)
            
            # Price range
            price_elem = soup.find(class_=re.compile(r'price|cost'))
            if price_elem:
                details['price_range'] = price_elem.get_text(strip=True)
            
            # Cuisine type
            cuisine_elem = soup.find(class_=re.compile(r'cuisine|category|type'))
            if cuisine_elem:
                details['cuisine_type'] = cuisine_elem.get_text(strip=True)
            
            # Description
            desc_elem = soup.find(class_=re.compile(r'description|about|detail'))
            if desc_elem:
                details['description'] = desc_elem.get_text(strip=True)
            
            # Features/amenities
            features = []
            feature_elems = soup.find_all(class_=re.compile(r'feature|amenity|facility'))
            for elem in feature_elems:
                features.append(elem.get_text(strip=True))
            if features:
                details['features'] = features
            
            # Images
            images = []
            img_elems = soup.find_all('img')
            for img in img_elems:
                src = img.get('src') or img.get('data-src')
                if src and 'wongnai' in src:
                    images.append(src)
            if images:
                details['images'] = images[:10]  # Limit to 10 images
            
            # Extract coordinates from map or scripts
            coordinates = self._extract_coordinates(soup)
            if coordinates:
                details['latitude'] = coordinates['lat']
                details['longitude'] = coordinates['lng']
            
            return details
            
        except Exception as e:
            logger.error(f"Error scraping restaurant details for {restaurant_url}: {str(e)}")
            return None
    
    def _extract_coordinates(self, soup: BeautifulSoup) -> Optional[Dict]:
        """Extract latitude and longitude from page"""
        try:
            # Look for coordinates in script tags
            scripts = soup.find_all('script')
            for script in scripts:
                if script.string:
                    # Look for lat/lng patterns
                    lat_match = re.search(r'"lat":\s*([0-9.-]+)', script.string)
                    lng_match = re.search(r'"lng":\s*([0-9.-]+)', script.string)
                    
                    if lat_match and lng_match:
                        return {
                            'lat': float(lat_match.group(1)),
                            'lng': float(lng_match.group(1))
                        }
            
            # Look for Google Maps links
            map_links = soup.find_all('a', href=re.compile(r'maps\.google|google\.com/maps'))
            for link in map_links:
                href = link['href']
                # Extract coordinates from Google Maps URL
                coord_match = re.search(r'@([0-9.-]+),([0-9.-]+)', href)
                if coord_match:
                    return {
                        'lat': float(coord_match.group(1)),
                        'lng': float(coord_match.group(2))
                    }
            
            return None
            
        except Exception as e:
            logger.error(f"Error extracting coordinates: {str(e)}")
            return None
    
    def scrape_menu(self, restaurant_url: str) -> List[Dict]:
        """
        Scrape menu items for a restaurant
        
        Args:
            restaurant_url: URL of the restaurant page
            
        Returns:
            List of menu item dictionaries
        """
        logger.info(f"Scraping menu for: {restaurant_url}")
        
        try:
            # Navigate to menu section
            menu_url = restaurant_url.rstrip('/') + '/menu'
            soup = self._make_request(menu_url, use_selenium=True)
            
            if not soup:
                # Try alternative menu URL patterns
                menu_url = restaurant_url.rstrip('/') + '#menu'
                soup = self._make_request(menu_url, use_selenium=True)
            
            if not soup:
                return []
            
            menu_items = []
            
            # Find menu items
            item_elems = soup.find_all(class_=re.compile(r'menu.*item|dish|food'))
            
            for item_elem in item_elems:
                item_data = self._extract_menu_item(item_elem, restaurant_url)
                if item_data:
                    menu_items.append(item_data)
            
            logger.info(f"Extracted {len(menu_items)} menu items")
            return menu_items
            
        except Exception as e:
            logger.error(f"Error scraping menu for {restaurant_url}: {str(e)}")
            return []
    
    def _extract_menu_item(self, item_elem, restaurant_url: str) -> Optional[Dict]:
        """Extract menu item data from element"""
        try:
            # Item name
            name_elem = item_elem.find(['h3', 'h4', 'h5'], class_=re.compile(r'name|title'))
            if not name_elem:
                name_elem = item_elem.find(class_=re.compile(r'name|title'))
            
            if not name_elem:
                return None
            
            name = name_elem.get_text(strip=True)
            
            # Price
            price_elem = item_elem.find(class_=re.compile(r'price|cost'))
            price = None
            if price_elem:
                price_text = price_elem.get_text(strip=True)
                price_match = re.search(r'(\d+(?:,\d+)?(?:\.\d+)?)', price_text.replace(',', ''))
                if price_match:
                    price = float(price_match.group(1))
            
            # Description
            desc_elem = item_elem.find(class_=re.compile(r'description|detail'))
            description = desc_elem.get_text(strip=True) if desc_elem else None
            
            # Category
            category_elem = item_elem.find(class_=re.compile(r'category|type'))
            category = category_elem.get_text(strip=True) if category_elem else None
            
            # Image
            img_elem = item_elem.find('img')
            image_url = img_elem.get('src') or img_elem.get('data-src') if img_elem else None
            
            # Extract restaurant ID from URL
            restaurant_id = self._extract_restaurant_id(restaurant_url)
            
            item_data = {
                'restaurant_id': restaurant_id,
                'item_name': name,
                'description': description,
                'price': price,
                'category': category,
                'image_url': image_url,
                'scraped_at': datetime.now().isoformat()
            }
            
            return item_data
            
        except Exception as e:
            logger.error(f"Error extracting menu item: {str(e)}")
            return None
    
    def _extract_restaurant_id(self, restaurant_url: str) -> str:
        """Extract restaurant ID from URL"""
        # Extract ID from URL pattern like /restaurant/123-restaurant-name
        match = re.search(r'/restaurant/(\d+)', restaurant_url)
        if match:
            return match.group(1)
        
        # Fallback: use URL hash
        return str(hash(restaurant_url))
    
    def run_full_scrape(self, regions: List[str] = None, 
                       categories: List[str] = None,
                       max_pages_per_category: int = 5,
                       scrape_details: bool = True,
                       scrape_menus: bool = True) -> Dict:
        """
        Run a full scraping session
        
        Args:
            regions: List of regions to scrape
            categories: List of categories to scrape
            max_pages_per_category: Max pages per category
            scrape_details: Whether to scrape detailed restaurant info
            scrape_menus: Whether to scrape menu items
            
        Returns:
            Summary of scraping results
        """
        if regions is None:
            regions = list(WONGNAI_REGIONS.keys())
        
        if categories is None:
            categories = WONGNAI_CATEGORIES[:3]  # Limit to first 3 categories
        
        logger.info(f"Starting full scrape for regions: {regions}, categories: {categories}")
        
        results = {
            'restaurants': [],
            'menus': [],
            'summary': {
                'total_restaurants': 0,
                'total_menu_items': 0,
                'regions_scraped': len(regions),
                'categories_scraped': len(categories),
                'start_time': datetime.now().isoformat()
            }
        }
        
        try:
            # Scrape restaurant listings
            for region in regions:
                for category in categories:
                    logger.info(f"Scraping {region}/{category}")
                    
                    restaurants = self.scrape_restaurant_listings(
                        region, category, max_pages_per_category
                    )
                    
                    # Scrape detailed info for each restaurant
                    if scrape_details:
                        for i, restaurant in enumerate(restaurants):
                            logger.info(f"Scraping details for restaurant {i+1}/{len(restaurants)}")
                            
                            details = self.scrape_restaurant_details(restaurant['wongnai_url'])
                            if details:
                                restaurant.update(details)
                            
                            # Scrape menu if requested
                            if scrape_menus:
                                menu_items = self.scrape_menu(restaurant['wongnai_url'])
                                results['menus'].extend(menu_items)
                    
                    results['restaurants'].extend(restaurants)
            
            # Update summary
            results['summary']['total_restaurants'] = len(results['restaurants'])
            results['summary']['total_menu_items'] = len(results['menus'])
            results['summary']['end_time'] = datetime.now().isoformat()
            
            # Save to data lake
            if results['restaurants']:
                datalake.save_raw_data(
                    results['restaurants'], 
                    'wongnai', 
                    'restaurants'
                )
            
            if results['menus']:
                datalake.save_raw_data(
                    results['menus'],
                    'wongnai',
                    'menus'
                )
            
            logger.info(f"Scraping completed: {results['summary']}")
            return results
            
        except Exception as e:
            logger.error(f"Error in full scrape: {str(e)}")
            raise
        finally:
            self._close_driver()

# CLI interface
if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Wongnai Restaurant Scraper")
    parser.add_argument("--regions", nargs="+", default=["bangkok"], 
                       help="Regions to scrape")
    parser.add_argument("--categories", nargs="+", default=["restaurant"],
                       help="Categories to scrape")
    parser.add_argument("--max-pages", type=int, default=5,
                       help="Maximum pages per category")
    parser.add_argument("--no-details", action="store_true",
                       help="Skip detailed restaurant scraping")
    parser.add_argument("--no-menus", action="store_true", 
                       help="Skip menu scraping")
    
    args = parser.parse_args()
    
    scraper = WongnaiScraper()
    results = scraper.run_full_scrape(
        regions=args.regions,
        categories=args.categories,
        max_pages_per_category=args.max_pages,
        scrape_details=not args.no_details,
        scrape_menus=not args.no_menus
    )
    
    print(f"Scraping completed: {results['summary']}")