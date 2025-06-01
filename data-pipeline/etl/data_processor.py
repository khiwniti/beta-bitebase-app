"""
ETL Data Processor for restaurant and menu data
"""
import re
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Any
import pandas as pd
import numpy as np
from dataclasses import dataclass
from pathlib import Path

from config.settings import settings, RESTAURANT_SCHEMA, MENU_SCHEMA
from utils.logger import get_logger
from utils.datalake import datalake

logger = get_logger("data_processor")

@dataclass
class DataQualityReport:
    """Data quality assessment report"""
    total_records: int
    valid_records: int
    invalid_records: int
    quality_score: float
    issues: List[Dict]
    null_percentages: Dict[str, float]
    duplicate_count: int

class DataProcessor:
    """ETL processor for restaurant and menu data"""
    
    def __init__(self):
        self.config = settings.etl
        
    def process_restaurant_data(self, raw_data_path: str) -> Tuple[pd.DataFrame, DataQualityReport]:
        """
        Process raw restaurant data through ETL pipeline
        
        Args:
            raw_data_path: Path to raw restaurant data
            
        Returns:
            Tuple of (processed_dataframe, quality_report)
        """
        logger.info(f"Processing restaurant data from {raw_data_path}")
        
        # Load raw data
        raw_data = datalake.load_data(raw_data_path)
        
        if isinstance(raw_data, dict) and 'data' in raw_data:
            restaurants_data = raw_data['data']
        else:
            restaurants_data = raw_data
        
        # Convert to DataFrame
        df = pd.DataFrame(restaurants_data)
        logger.info(f"Loaded {len(df)} raw restaurant records")
        
        # Data cleaning and transformation
        df_cleaned = self._clean_restaurant_data(df)
        
        # Data enrichment
        df_enriched = self._enrich_restaurant_data(df_cleaned)
        
        # Data validation
        df_validated, quality_report = self._validate_restaurant_data(df_enriched)
        
        # Save processed data
        processed_path = datalake.save_processed_data(
            df_validated, 'wongnai', 'restaurants', 'cleaned'
        )
        
        logger.info(f"Processed restaurant data saved to {processed_path}")
        logger.info(f"Quality score: {quality_report.quality_score:.2f}")
        
        return df_validated, quality_report
    
    def _clean_restaurant_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean restaurant data"""
        logger.info("Cleaning restaurant data")
        
        df_clean = df.copy()
        
        # Remove duplicates based on wongnai_url
        initial_count = len(df_clean)
        df_clean = df_clean.drop_duplicates(subset=['wongnai_url'], keep='first')
        logger.info(f"Removed {initial_count - len(df_clean)} duplicate restaurants")
        
        # Clean restaurant names
        if 'name' in df_clean.columns:
            df_clean['name'] = df_clean['name'].astype(str)
            df_clean['name'] = df_clean['name'].str.strip()
            df_clean['name'] = df_clean['name'].replace('', np.nan)
        
        # Clean and standardize ratings
        if 'rating' in df_clean.columns:
            df_clean['rating'] = pd.to_numeric(df_clean['rating'], errors='coerce')
            # Cap ratings at 5.0
            df_clean.loc[df_clean['rating'] > 5.0, 'rating'] = 5.0
            df_clean.loc[df_clean['rating'] < 0.0, 'rating'] = np.nan
        
        # Clean review counts
        if 'review_count' in df_clean.columns:
            df_clean['review_count'] = pd.to_numeric(df_clean['review_count'], errors='coerce')
            df_clean.loc[df_clean['review_count'] < 0, 'review_count'] = 0
        
        # Clean coordinates
        for coord_col in ['latitude', 'longitude']:
            if coord_col in df_clean.columns:
                df_clean[coord_col] = pd.to_numeric(df_clean[coord_col], errors='coerce')
                
                # Validate coordinate ranges
                if coord_col == 'latitude':
                    df_clean.loc[(df_clean[coord_col] < -90) | (df_clean[coord_col] > 90), coord_col] = np.nan
                else:  # longitude
                    df_clean.loc[(df_clean[coord_col] < -180) | (df_clean[coord_col] > 180), coord_col] = np.nan
        
        # Clean phone numbers
        if 'phone' in df_clean.columns:
            df_clean['phone'] = df_clean['phone'].astype(str)
            df_clean['phone'] = df_clean['phone'].apply(self._clean_phone_number)
        
        # Clean addresses
        if 'address' in df_clean.columns:
            df_clean['address'] = df_clean['address'].astype(str)
            df_clean['address'] = df_clean['address'].str.strip()
            df_clean['address'] = df_clean['address'].replace('', np.nan)
        
        # Standardize price ranges
        if 'price_range' in df_clean.columns:
            df_clean['price_range'] = df_clean['price_range'].apply(self._standardize_price_range)
        
        # Clean cuisine types
        if 'cuisine_type' in df_clean.columns:
            df_clean['cuisine_type'] = df_clean['cuisine_type'].apply(self._clean_cuisine_type)
        
        # Parse and clean opening hours
        if 'opening_hours' in df_clean.columns:
            df_clean['opening_hours_parsed'] = df_clean['opening_hours'].apply(self._parse_opening_hours)
        
        # Clean features/amenities
        if 'features' in df_clean.columns:
            df_clean['features_cleaned'] = df_clean['features'].apply(self._clean_features)
        
        # Add processing timestamp
        df_clean['processed_at'] = datetime.now().isoformat()
        
        logger.info(f"Cleaned {len(df_clean)} restaurant records")
        return df_clean
    
    def _enrich_restaurant_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Enrich restaurant data with additional features"""
        logger.info("Enriching restaurant data")
        
        df_enriched = df.copy()
        
        # Generate unique restaurant ID
        df_enriched['restaurant_id'] = df_enriched.apply(self._generate_restaurant_id, axis=1)
        
        # Extract region from URL or address
        if 'region' not in df_enriched.columns:
            df_enriched['region'] = df_enriched['wongnai_url'].apply(self._extract_region_from_url)
        
        # Categorize price ranges
        if 'price_range' in df_enriched.columns:
            df_enriched['price_category'] = df_enriched['price_range'].apply(self._categorize_price_range)
        
        # Calculate rating category
        if 'rating' in df_enriched.columns:
            df_enriched['rating_category'] = df_enriched['rating'].apply(self._categorize_rating)
        
        # Extract business hours info
        if 'opening_hours_parsed' in df_enriched.columns:
            hours_info = df_enriched['opening_hours_parsed'].apply(self._extract_hours_info)
            df_enriched = pd.concat([df_enriched, pd.json_normalize(hours_info)], axis=1)
        
        # Add location-based features
        if 'latitude' in df_enriched.columns and 'longitude' in df_enriched.columns:
            df_enriched['location_quality'] = df_enriched.apply(self._assess_location_quality, axis=1)
        
        # Calculate data completeness score
        df_enriched['data_completeness'] = df_enriched.apply(self._calculate_completeness_score, axis=1)
        
        logger.info(f"Enriched {len(df_enriched)} restaurant records")
        return df_enriched
    
    def _validate_restaurant_data(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, DataQualityReport]:
        """Validate restaurant data and generate quality report"""
        logger.info("Validating restaurant data")
        
        issues = []
        total_records = len(df)
        
        # Check for required fields
        required_fields = ['name', 'wongnai_url']
        for field in required_fields:
            if field not in df.columns:
                issues.append({
                    'type': 'missing_column',
                    'field': field,
                    'severity': 'high'
                })
            else:
                null_count = df[field].isnull().sum()
                if null_count > 0:
                    issues.append({
                        'type': 'missing_values',
                        'field': field,
                        'count': null_count,
                        'percentage': (null_count / total_records) * 100,
                        'severity': 'high' if null_count / total_records > 0.1 else 'medium'
                    })
        
        # Calculate null percentages for all columns
        null_percentages = {}
        for col in df.columns:
            null_count = df[col].isnull().sum()
            null_percentages[col] = (null_count / total_records) * 100
        
        # Check for duplicates
        duplicate_count = df.duplicated(subset=['restaurant_id']).sum()
        if duplicate_count > 0:
            issues.append({
                'type': 'duplicates',
                'count': duplicate_count,
                'severity': 'medium'
            })
        
        # Validate data ranges
        if 'rating' in df.columns:
            invalid_ratings = ((df['rating'] < 0) | (df['rating'] > 5)).sum()
            if invalid_ratings > 0:
                issues.append({
                    'type': 'invalid_range',
                    'field': 'rating',
                    'count': invalid_ratings,
                    'severity': 'medium'
                })
        
        # Calculate quality score
        valid_records = total_records
        for issue in issues:
            if issue['type'] in ['missing_values', 'duplicates', 'invalid_range']:
                if issue['severity'] == 'high':
                    valid_records -= issue.get('count', 0) * 2
                else:
                    valid_records -= issue.get('count', 0)
        
        quality_score = max(0, valid_records / total_records)
        
        # Filter out low-quality records if enabled
        if self.config.enable_validation:
            df_validated = df[df['data_completeness'] >= 0.5].copy()
        else:
            df_validated = df.copy()
        
        quality_report = DataQualityReport(
            total_records=total_records,
            valid_records=len(df_validated),
            invalid_records=total_records - len(df_validated),
            quality_score=quality_score,
            issues=issues,
            null_percentages=null_percentages,
            duplicate_count=duplicate_count
        )
        
        return df_validated, quality_report
    
    def process_menu_data(self, raw_data_path: str) -> Tuple[pd.DataFrame, DataQualityReport]:
        """Process raw menu data"""
        logger.info(f"Processing menu data from {raw_data_path}")
        
        # Load raw data
        raw_data = datalake.load_data(raw_data_path)
        
        if isinstance(raw_data, dict) and 'data' in raw_data:
            menu_data = raw_data['data']
        else:
            menu_data = raw_data
        
        # Convert to DataFrame
        df = pd.DataFrame(menu_data)
        logger.info(f"Loaded {len(df)} raw menu records")
        
        # Data cleaning and transformation
        df_cleaned = self._clean_menu_data(df)
        
        # Data enrichment
        df_enriched = self._enrich_menu_data(df_cleaned)
        
        # Data validation
        df_validated, quality_report = self._validate_menu_data(df_enriched)
        
        # Save processed data
        processed_path = datalake.save_processed_data(
            df_validated, 'wongnai', 'menus', 'cleaned'
        )
        
        logger.info(f"Processed menu data saved to {processed_path}")
        return df_validated, quality_report
    
    def _clean_menu_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean menu data"""
        logger.info("Cleaning menu data")
        
        df_clean = df.copy()
        
        # Remove duplicates
        initial_count = len(df_clean)
        df_clean = df_clean.drop_duplicates(subset=['restaurant_id', 'item_name'], keep='first')
        logger.info(f"Removed {initial_count - len(df_clean)} duplicate menu items")
        
        # Clean item names
        if 'item_name' in df_clean.columns:
            df_clean['item_name'] = df_clean['item_name'].astype(str).str.strip()
            df_clean['item_name'] = df_clean['item_name'].replace('', np.nan)
        
        # Clean prices
        if 'price' in df_clean.columns:
            df_clean['price'] = pd.to_numeric(df_clean['price'], errors='coerce')
            df_clean.loc[df_clean['price'] < 0, 'price'] = np.nan
        
        # Clean descriptions
        if 'description' in df_clean.columns:
            df_clean['description'] = df_clean['description'].astype(str).str.strip()
            df_clean['description'] = df_clean['description'].replace('', np.nan)
        
        # Clean categories
        if 'category' in df_clean.columns:
            df_clean['category'] = df_clean['category'].apply(self._clean_menu_category)
        
        # Add processing timestamp
        df_clean['processed_at'] = datetime.now().isoformat()
        
        return df_clean
    
    def _enrich_menu_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Enrich menu data"""
        logger.info("Enriching menu data")
        
        df_enriched = df.copy()
        
        # Generate menu item ID
        df_enriched['menu_item_id'] = df_enriched.apply(self._generate_menu_item_id, axis=1)
        
        # Categorize prices
        if 'price' in df_enriched.columns:
            df_enriched['price_category'] = df_enriched['price'].apply(self._categorize_menu_price)
        
        # Extract ingredients from description
        if 'description' in df_enriched.columns:
            df_enriched['extracted_ingredients'] = df_enriched['description'].apply(self._extract_ingredients)
        
        # Detect allergens
        if 'description' in df_enriched.columns:
            df_enriched['potential_allergens'] = df_enriched['description'].apply(self._detect_allergens)
        
        # Calculate data completeness
        df_enriched['data_completeness'] = df_enriched.apply(self._calculate_menu_completeness, axis=1)
        
        return df_enriched
    
    def _validate_menu_data(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, DataQualityReport]:
        """Validate menu data"""
        logger.info("Validating menu data")
        
        issues = []
        total_records = len(df)
        
        # Check required fields
        required_fields = ['restaurant_id', 'item_name']
        for field in required_fields:
            if field not in df.columns:
                issues.append({
                    'type': 'missing_column',
                    'field': field,
                    'severity': 'high'
                })
            else:
                null_count = df[field].isnull().sum()
                if null_count > 0:
                    issues.append({
                        'type': 'missing_values',
                        'field': field,
                        'count': null_count,
                        'percentage': (null_count / total_records) * 100,
                        'severity': 'high'
                    })
        
        # Calculate null percentages
        null_percentages = {}
        for col in df.columns:
            null_count = df[col].isnull().sum()
            null_percentages[col] = (null_count / total_records) * 100
        
        # Check duplicates
        duplicate_count = df.duplicated(subset=['menu_item_id']).sum()
        
        # Calculate quality score
        quality_score = 1.0 - (len(issues) * 0.1)
        quality_score = max(0, quality_score)
        
        # Filter low-quality records
        if self.config.enable_validation:
            df_validated = df[df['data_completeness'] >= 0.3].copy()
        else:
            df_validated = df.copy()
        
        quality_report = DataQualityReport(
            total_records=total_records,
            valid_records=len(df_validated),
            invalid_records=total_records - len(df_validated),
            quality_score=quality_score,
            issues=issues,
            null_percentages=null_percentages,
            duplicate_count=duplicate_count
        )
        
        return df_validated, quality_report
    
    # Helper methods
    def _clean_phone_number(self, phone: str) -> Optional[str]:
        """Clean and standardize phone numbers"""
        if pd.isna(phone) or phone == 'nan':
            return None
        
        # Remove all non-digit characters except +
        cleaned = re.sub(r'[^\d+]', '', str(phone))
        
        # Thai phone number patterns
        if cleaned.startswith('+66'):
            return cleaned
        elif cleaned.startswith('66') and len(cleaned) >= 10:
            return '+' + cleaned
        elif cleaned.startswith('0') and len(cleaned) >= 9:
            return '+66' + cleaned[1:]
        elif len(cleaned) >= 8:
            return '+66' + cleaned
        
        return None
    
    def _standardize_price_range(self, price_range: str) -> Optional[str]:
        """Standardize price range values"""
        if pd.isna(price_range):
            return None
        
        price_str = str(price_range).lower().strip()
        
        if any(word in price_str for word in ['budget', 'cheap', 'inexpensive', '฿', 'under']):
            return 'budget'
        elif any(word in price_str for word in ['moderate', 'mid', 'average', '฿฿']):
            return 'moderate'
        elif any(word in price_str for word in ['expensive', 'high', 'premium', '฿฿฿']):
            return 'expensive'
        elif any(word in price_str for word in ['luxury', 'fine', 'upscale', '฿฿฿฿']):
            return 'luxury'
        
        return 'unknown'
    
    def _clean_cuisine_type(self, cuisine: str) -> Optional[str]:
        """Clean and standardize cuisine types"""
        if pd.isna(cuisine):
            return None
        
        cuisine_str = str(cuisine).lower().strip()
        
        # Map common variations
        cuisine_mapping = {
            'thai': ['thai', 'thailand', 'ไทย'],
            'chinese': ['chinese', 'china', 'จีน'],
            'japanese': ['japanese', 'japan', 'ญี่ปุ่น'],
            'korean': ['korean', 'korea', 'เกาหลี'],
            'italian': ['italian', 'italy', 'อิตาเลียน'],
            'american': ['american', 'usa', 'อเมริกัน'],
            'international': ['international', 'fusion', 'นานาชาติ'],
            'seafood': ['seafood', 'fish', 'ซีฟู้ด'],
            'bbq': ['bbq', 'barbecue', 'grill', 'ย่าง'],
            'cafe': ['cafe', 'coffee', 'คาเฟ่']
        }
        
        for standard, variations in cuisine_mapping.items():
            if any(var in cuisine_str for var in variations):
                return standard
        
        return cuisine_str
    
    def _parse_opening_hours(self, hours_str: str) -> Dict:
        """Parse opening hours string into structured data"""
        if pd.isna(hours_str):
            return {}
        
        try:
            hours_info = {
                'raw_text': str(hours_str),
                'is_24_hours': '24' in str(hours_str).lower(),
                'is_closed': any(word in str(hours_str).lower() for word in ['closed', 'ปิด']),
                'has_break': any(word in str(hours_str).lower() for word in ['break', 'พัก'])
            }
            
            # Extract time patterns (HH:MM format)
            time_pattern = r'(\d{1,2}):(\d{2})'
            times = re.findall(time_pattern, str(hours_str))
            
            if len(times) >= 2:
                hours_info['opening_time'] = f"{times[0][0]}:{times[0][1]}"
                hours_info['closing_time'] = f"{times[-1][0]}:{times[-1][1]}"
            
            return hours_info
            
        except Exception:
            return {'raw_text': str(hours_str)}
    
    def _clean_features(self, features) -> List[str]:
        """Clean and standardize features/amenities"""
        if pd.isna(features):
            return []
        
        if isinstance(features, str):
            # Try to parse as JSON
            try:
                features = json.loads(features)
            except:
                features = [features]
        
        if not isinstance(features, list):
            return []
        
        cleaned_features = []
        for feature in features:
            if isinstance(feature, str):
                feature_clean = feature.strip().lower()
                if feature_clean:
                    cleaned_features.append(feature_clean)
        
        return list(set(cleaned_features))  # Remove duplicates
    
    def _generate_restaurant_id(self, row) -> str:
        """Generate unique restaurant ID"""
        if 'wongnai_url' in row and pd.notna(row['wongnai_url']):
            # Extract ID from URL
            match = re.search(r'/restaurant/(\d+)', str(row['wongnai_url']))
            if match:
                return f"wongnai_{match.group(1)}"
        
        # Fallback: hash of name and URL
        name = str(row.get('name', ''))
        url = str(row.get('wongnai_url', ''))
        return f"wongnai_{hash(name + url) % 1000000}"
    
    def _extract_region_from_url(self, url: str) -> str:
        """Extract region from Wongnai URL"""
        if pd.isna(url):
            return 'unknown'
        
        url_str = str(url).lower()
        
        from config.settings import WONGNAI_REGIONS
        for region, config in WONGNAI_REGIONS.items():
            if config['url_path'] in url_str:
                return region
        
        return 'unknown'
    
    def _categorize_price_range(self, price_range: str) -> str:
        """Categorize price range into standard categories"""
        if pd.isna(price_range):
            return 'unknown'
        
        price_str = str(price_range).lower()
        
        if price_str in ['budget']:
            return 'low'
        elif price_str in ['moderate']:
            return 'medium'
        elif price_str in ['expensive']:
            return 'high'
        elif price_str in ['luxury']:
            return 'premium'
        
        return 'unknown'
    
    def _categorize_rating(self, rating: float) -> str:
        """Categorize rating into quality levels"""
        if pd.isna(rating):
            return 'unknown'
        
        if rating >= 4.5:
            return 'excellent'
        elif rating >= 4.0:
            return 'very_good'
        elif rating >= 3.5:
            return 'good'
        elif rating >= 3.0:
            return 'average'
        else:
            return 'below_average'
    
    def _extract_hours_info(self, hours_dict: Dict) -> Dict:
        """Extract additional hours information"""
        if not hours_dict:
            return {}
        
        info = {}
        
        if 'opening_time' in hours_dict and 'closing_time' in hours_dict:
            try:
                open_time = datetime.strptime(hours_dict['opening_time'], '%H:%M').time()
                close_time = datetime.strptime(hours_dict['closing_time'], '%H:%M').time()
                
                info['opens_early'] = open_time.hour < 8
                info['closes_late'] = close_time.hour > 22 or close_time.hour < 6
                info['lunch_hours'] = open_time.hour <= 12 and close_time.hour >= 14
                info['dinner_hours'] = open_time.hour <= 18 and close_time.hour >= 20
                
            except:
                pass
        
        info['is_24_hours'] = hours_dict.get('is_24_hours', False)
        info['is_closed'] = hours_dict.get('is_closed', False)
        
        return info
    
    def _assess_location_quality(self, row) -> str:
        """Assess quality of location data"""
        lat = row.get('latitude')
        lng = row.get('longitude')
        
        if pd.isna(lat) or pd.isna(lng):
            return 'no_coordinates'
        
        # Check if coordinates are in Thailand
        if 5.0 <= lat <= 21.0 and 97.0 <= lng <= 106.0:
            return 'valid_thailand'
        else:
            return 'invalid_coordinates'
    
    def _calculate_completeness_score(self, row) -> float:
        """Calculate data completeness score for restaurant"""
        important_fields = [
            'name', 'address', 'latitude', 'longitude', 
            'rating', 'cuisine_type', 'price_range'
        ]
        
        score = 0
        for field in important_fields:
            if field in row and pd.notna(row[field]) and str(row[field]).strip():
                score += 1
        
        return score / len(important_fields)
    
    def _clean_menu_category(self, category: str) -> Optional[str]:
        """Clean menu category"""
        if pd.isna(category):
            return None
        
        category_str = str(category).lower().strip()
        
        # Standard categories
        category_mapping = {
            'appetizer': ['appetizer', 'starter', 'ของทานเล่น'],
            'main_course': ['main', 'entree', 'อาหารจานหลัก'],
            'dessert': ['dessert', 'sweet', 'ของหวาน'],
            'beverage': ['drink', 'beverage', 'เครื่องดื่ม'],
            'soup': ['soup', 'ซุป'],
            'salad': ['salad', 'สลัด'],
            'rice': ['rice', 'ข้าว'],
            'noodle': ['noodle', 'pasta', 'ก๋วยเตี๋ยว']
        }
        
        for standard, variations in category_mapping.items():
            if any(var in category_str for var in variations):
                return standard
        
        return category_str
    
    def _generate_menu_item_id(self, row) -> str:
        """Generate unique menu item ID"""
        restaurant_id = str(row.get('restaurant_id', ''))
        item_name = str(row.get('item_name', ''))
        
        return f"{restaurant_id}_{hash(item_name) % 100000}"
    
    def _categorize_menu_price(self, price: float) -> str:
        """Categorize menu item price"""
        if pd.isna(price):
            return 'unknown'
        
        if price < 100:
            return 'budget'
        elif price < 300:
            return 'moderate'
        elif price < 600:
            return 'expensive'
        else:
            return 'premium'
    
    def _extract_ingredients(self, description: str) -> List[str]:
        """Extract potential ingredients from description"""
        if pd.isna(description):
            return []
        
        # Common Thai ingredients
        ingredients = [
            'chicken', 'pork', 'beef', 'fish', 'shrimp', 'crab',
            'rice', 'noodle', 'coconut', 'chili', 'garlic', 'onion',
            'tomato', 'cucumber', 'lettuce', 'carrot', 'mushroom',
            'ไก่', 'หมู', 'เนื้อ', 'ปลา', 'กุ้ง', 'ปู', 'ข้าว'
        ]
        
        found_ingredients = []
        desc_lower = str(description).lower()
        
        for ingredient in ingredients:
            if ingredient in desc_lower:
                found_ingredients.append(ingredient)
        
        return found_ingredients
    
    def _detect_allergens(self, description: str) -> List[str]:
        """Detect potential allergens in description"""
        if pd.isna(description):
            return []
        
        allergens = {
            'nuts': ['nut', 'peanut', 'almond', 'cashew', 'ถั่ว'],
            'dairy': ['milk', 'cheese', 'cream', 'butter', 'นม'],
            'eggs': ['egg', 'ไข่'],
            'seafood': ['fish', 'shrimp', 'crab', 'shellfish', 'ปลา', 'กุ้ง', 'ปู'],
            'soy': ['soy', 'tofu', 'ถั่วเหลือง'],
            'gluten': ['wheat', 'flour', 'bread', 'แป้ง']
        }
        
        found_allergens = []
        desc_lower = str(description).lower()
        
        for allergen, keywords in allergens.items():
            if any(keyword in desc_lower for keyword in keywords):
                found_allergens.append(allergen)
        
        return found_allergens
    
    def _calculate_menu_completeness(self, row) -> float:
        """Calculate data completeness for menu item"""
        important_fields = ['item_name', 'price', 'category', 'description']
        
        score = 0
        for field in important_fields:
            if field in row and pd.notna(row[field]) and str(row[field]).strip():
                score += 1
        
        return score / len(important_fields)

# CLI interface
if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Data Processor")
    parser.add_argument("--data-type", choices=['restaurants', 'menus'], required=True)
    parser.add_argument("--input-path", required=True, help="Path to raw data")
    parser.add_argument("--output-path", help="Path to save processed data")
    
    args = parser.parse_args()
    
    processor = DataProcessor()
    
    if args.data_type == 'restaurants':
        df, quality_report = processor.process_restaurant_data(args.input_path)
    else:
        df, quality_report = processor.process_menu_data(args.input_path)
    
    print(f"Processing completed:")
    print(f"- Total records: {quality_report.total_records}")
    print(f"- Valid records: {quality_report.valid_records}")
    print(f"- Quality score: {quality_report.quality_score:.2f}")
    print(f"- Issues found: {len(quality_report.issues)}")
    
    if args.output_path:
        df.to_parquet(args.output_path, index=False)
        print(f"Data saved to: {args.output_path}")