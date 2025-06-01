const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class WongnaiScraper {
    constructor() {
        this.baseUrl = 'https://www.wongnai.com/_api/businesses';
        this.headers = {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'th-TH,th;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        };
        this.dbPath = path.join(__dirname, 'bitebase-enhanced.db');
        this.delay = 2000; // 2 seconds delay between requests to be respectful
    }

    async initDatabase() {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbPath);
            
            // Create wongnai_restaurants table
            db.run(`
                CREATE TABLE IF NOT EXISTS wongnai_restaurants (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    wongnai_id TEXT UNIQUE NOT NULL,
                    name TEXT NOT NULL,
                    name_thai TEXT,
                    name_english TEXT,
                    branch TEXT,
                    category TEXT,
                    price_range INTEGER,
                    rating REAL DEFAULT 0,
                    number_of_reviews INTEGER DEFAULT 0,
                    latitude REAL,
                    longitude REAL,
                    address TEXT,
                    phone TEXT,
                    website TEXT,
                    opening_hours TEXT,
                    is_open BOOLEAN DEFAULT 1,
                    photos TEXT, -- JSON array of photo URLs
                    menu_items TEXT, -- JSON array of menu items
                    district TEXT,
                    city TEXT,
                    zipcode TEXT,
                    verified_info BOOLEAN DEFAULT 0,
                    verified_location BOOLEAN DEFAULT 0,
                    delivery_available BOOLEAN DEFAULT 0,
                    pickup_available BOOLEAN DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) {
                    console.error('Error creating wongnai_restaurants table:', err);
                    reject(err);
                } else {
                    console.log('✅ Wongnai restaurants table created/verified');
                    
                    // Create index for faster searches
                    db.run(`CREATE INDEX IF NOT EXISTS idx_wongnai_city ON wongnai_restaurants(city)`);
                    db.run(`CREATE INDEX IF NOT EXISTS idx_wongnai_category ON wongnai_restaurants(category)`);
                    db.run(`CREATE INDEX IF NOT EXISTS idx_wongnai_rating ON wongnai_restaurants(rating)`);
                    
                    db.close();
                    resolve();
                }
            });
        });
    }

    async fetchRestaurants(page = 1, size = 20, maxPages = 5) {
        try {
            console.log(`🔍 Fetching restaurants from Wongnai API - Page ${page}/${maxPages}`);
            
            const response = await axios.get(this.baseUrl, {
                headers: this.headers,
                params: {
                    'page.number': page,
                    'page.size': size
                },
                timeout: 10000
            });

            if (response.data && response.data.page && response.data.page.entities) {
                const restaurants = response.data.page.entities;
                console.log(`📊 Found ${restaurants.length} restaurants on page ${page}`);
                
                await this.saveRestaurants(restaurants);
                
                // Respect rate limiting
                await this.sleep(this.delay);
                
                // Continue to next page if we haven't reached max pages
                if (page < maxPages && restaurants.length === size) {
                    return await this.fetchRestaurants(page + 1, size, maxPages);
                }
                
                return {
                    success: true,
                    totalPages: page,
                    message: `Successfully scraped ${page} pages of restaurant data`
                };
            } else {
                throw new Error('Invalid response format from Wongnai API');
            }
        } catch (error) {
            console.error(`❌ Error fetching restaurants from page ${page}:`, error.message);
            return {
                success: false,
                error: error.message,
                page: page
            };
        }
    }

    async saveRestaurants(restaurants) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbPath);
            
            const stmt = db.prepare(`
                INSERT OR REPLACE INTO wongnai_restaurants (
                    wongnai_id, name, name_thai, name_english, branch, category, 
                    price_range, rating, number_of_reviews, latitude, longitude, 
                    address, phone, website, opening_hours, is_open, photos, 
                    menu_items, district, city, zipcode, verified_info, 
                    verified_location, delivery_available, pickup_available, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            `);

            let saved = 0;
            let errors = 0;

            restaurants.forEach(restaurant => {
                try {
                    const data = this.parseRestaurantData(restaurant);
                    stmt.run([
                        data.wongnai_id,
                        data.name,
                        data.name_thai,
                        data.name_english,
                        data.branch,
                        data.category,
                        data.price_range,
                        data.rating,
                        data.number_of_reviews,
                        data.latitude,
                        data.longitude,
                        data.address,
                        data.phone,
                        data.website,
                        data.opening_hours,
                        data.is_open,
                        data.photos,
                        data.menu_items,
                        data.district,
                        data.city,
                        data.zipcode,
                        data.verified_info,
                        data.verified_location,
                        data.delivery_available,
                        data.pickup_available
                    ], (err) => {
                        if (err) {
                            console.error(`Error saving restaurant ${data.name}:`, err.message);
                            errors++;
                        } else {
                            saved++;
                        }
                    });
                } catch (parseError) {
                    console.error('Error parsing restaurant data:', parseError.message);
                    errors++;
                }
            });

            stmt.finalize((err) => {
                if (err) {
                    console.error('Error finalizing statement:', err);
                    reject(err);
                } else {
                    console.log(`💾 Saved ${saved} restaurants, ${errors} errors`);
                    db.close();
                    resolve({ saved, errors });
                }
            });
        });
    }

    parseRestaurantData(restaurant) {
        // Extract category name (first category)
        const category = restaurant.categories && restaurant.categories.length > 0 
            ? restaurant.categories[0].name 
            : 'ไม่ระบุ';

        // Extract photos
        const photos = [];
        if (restaurant.defaultPhoto) {
            photos.push(restaurant.defaultPhoto.contentUrl);
        }
        if (restaurant.mainPhoto) {
            photos.push(restaurant.mainPhoto.contentUrl);
        }
        if (restaurant.photos && restaurant.photos.page && restaurant.photos.page.entities) {
            restaurant.photos.page.entities.forEach(photo => {
                if (photo.contentUrl && !photos.includes(photo.contentUrl)) {
                    photos.push(photo.contentUrl);
                }
            });
        }

        // Extract menu items
        const menuItems = [];
        if (restaurant.topFavourites) {
            restaurant.topFavourites.forEach(item => {
                menuItems.push(item.name);
            });
        }

        // Extract opening hours
        let openingHours = null;
        let isOpen = true;
        if (restaurant.hours && restaurant.hours.length > 0) {
            openingHours = JSON.stringify(restaurant.hours);
        }
        if (restaurant.workingHoursStatus) {
            isOpen = restaurant.workingHoursStatus.open || false;
        }

        // Extract address components
        let address = '';
        let district = '';
        let city = '';
        let zipcode = '';
        
        if (restaurant.contact && restaurant.contact.address) {
            address = restaurant.contact.address.street || '';
            if (restaurant.contact.address.district) {
                district = restaurant.contact.address.district.name || '';
            }
            if (restaurant.contact.address.city) {
                city = restaurant.contact.address.city.name || '';
            }
            zipcode = restaurant.zipcode || '';
        }

        return {
            wongnai_id: restaurant.publicId || restaurant.id.toString(),
            name: restaurant.displayName || restaurant.name || 'ไม่ระบุชื่อ',
            name_thai: restaurant.nameOnly ? restaurant.nameOnly.thai : null,
            name_english: restaurant.nameOnly ? restaurant.nameOnly.english : null,
            branch: restaurant.branch ? restaurant.branch.primary : null,
            category: category,
            price_range: restaurant.priceRange ? restaurant.priceRange.value : 0,
            rating: restaurant.statistic ? (restaurant.statistic.rating || 0) : 0,
            number_of_reviews: restaurant.statistic ? (restaurant.statistic.numberOfReviews || 0) : 0,
            latitude: restaurant.lat || null,
            longitude: restaurant.lng || null,
            address: address,
            phone: restaurant.contact ? restaurant.contact.callablePhoneno : null,
            website: restaurant.contact ? restaurant.contact.homepage : null,
            opening_hours: openingHours,
            is_open: isOpen,
            photos: JSON.stringify(photos),
            menu_items: JSON.stringify(menuItems),
            district: district,
            city: city,
            zipcode: zipcode,
            verified_info: restaurant.verifiedInfo || false,
            verified_location: restaurant.verifiedLocation || false,
            delivery_available: restaurant.deliveryInformation ? restaurant.deliveryInformation.hasDeliveryService : false,
            pickup_available: restaurant.pickupInformation ? restaurant.pickupInformation.available : false
        };
    }

    async getRestaurantStats() {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbPath);
            
            db.get(`
                SELECT 
                    COUNT(*) as total_restaurants,
                    COUNT(DISTINCT city) as total_cities,
                    COUNT(DISTINCT category) as total_categories,
                    AVG(rating) as avg_rating,
                    COUNT(CASE WHEN delivery_available = 1 THEN 1 END) as delivery_count,
                    COUNT(CASE WHEN pickup_available = 1 THEN 1 END) as pickup_count
                FROM wongnai_restaurants
            `, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    db.close();
                    resolve(row);
                }
            });
        });
    }

    async searchRestaurants(filters = {}) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbPath);
            
            let query = 'SELECT * FROM wongnai_restaurants WHERE 1=1';
            const params = [];

            if (filters.city) {
                query += ' AND city LIKE ?';
                params.push(`%${filters.city}%`);
            }

            if (filters.category) {
                query += ' AND category LIKE ?';
                params.push(`%${filters.category}%`);
            }

            if (filters.minRating) {
                query += ' AND rating >= ?';
                params.push(filters.minRating);
            }

            if (filters.priceRange) {
                query += ' AND price_range = ?';
                params.push(filters.priceRange);
            }

            if (filters.deliveryAvailable) {
                query += ' AND delivery_available = 1';
            }

            query += ' ORDER BY rating DESC, number_of_reviews DESC';
            
            if (filters.limit) {
                query += ' LIMIT ?';
                params.push(filters.limit);
            }

            db.all(query, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    db.close();
                    resolve(rows);
                }
            });
        });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = WongnaiScraper;

// CLI usage
if (require.main === module) {
    const scraper = new WongnaiScraper();
    
    async function main() {
        try {
            console.log('🚀 Starting Wongnai restaurant data scraping...');
            
            // Initialize database
            await scraper.initDatabase();
            
            // Fetch restaurants (5 pages = 100 restaurants)
            const result = await scraper.fetchRestaurants(1, 20, 5);
            
            if (result.success) {
                console.log(`✅ ${result.message}`);
                
                // Show statistics
                const stats = await scraper.getRestaurantStats();
                console.log('\n📊 Database Statistics:');
                console.log(`Total Restaurants: ${stats.total_restaurants}`);
                console.log(`Total Cities: ${stats.total_cities}`);
                console.log(`Total Categories: ${stats.total_categories}`);
                console.log(`Average Rating: ${stats.avg_rating?.toFixed(2) || 'N/A'}`);
                console.log(`Delivery Available: ${stats.delivery_count}`);
                console.log(`Pickup Available: ${stats.pickup_count}`);
                
                // Show sample restaurants
                console.log('\n🍽️ Sample Restaurants:');
                const samples = await scraper.searchRestaurants({ limit: 5 });
                samples.forEach((restaurant, index) => {
                    console.log(`${index + 1}. ${restaurant.name} (${restaurant.category}) - Rating: ${restaurant.rating} - ${restaurant.city}`);
                });
                
            } else {
                console.error(`❌ Scraping failed: ${result.error}`);
            }
            
        } catch (error) {
            console.error('❌ Fatal error:', error.message);
        }
    }
    
    main();
}