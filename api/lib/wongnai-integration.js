// Wongnai-inspired restaurant data structure and API integration
// Based on https://www.wongnai.com/_api/businesses structure

const { pool } = require('./database');

// Enhanced restaurant data structure following Wongnai's pattern
class WongnaiStyleRestaurant {
  constructor(data) {
    this.id = data.id;
    this.publicId = data.publicId || `${data.id}bb`; // BiteBase suffix
    this.gid = data.gid || this.generateGid();
    
    // Name structure
    this.nameOnly = {
      primary: data.name,
      thai: data.name_thai || data.name,
      english: data.name_english || data.name
    };
    
    // Branch information
    this.branch = {
      primary: data.branch || "",
      thai: data.branch_thai || data.branch || "",
      english: data.branch_english || data.branch || ""
    };
    
    // URLs
    this.url = `restaurants/${this.publicId}-${this.slugify(data.name)}`;
    this.shortUrl = `r/${this.publicId}`;
    this.photosUrl = `${this.url}/photos`;
    this.menuUrl = `${this.url}/menu`;
    this.deliveryMenuUrl = `${this.url}/delivery-menu`;
    
    // Location data
    this.lat = parseFloat(data.latitude) || 0;
    this.lng = parseFloat(data.longitude) || 0;
    this.zipcode = data.zipcode || "";
    
    // Price range
    this.priceRange = this.mapPriceRange(data.price_range);
    
    // Basic info
    this.name = data.name;
    this.displayName = `${data.name}${data.branch ? ` ${data.branch}` : ''}`;
    this.description = data.description || "";
    
    // Categories (cuisine types)
    this.categories = this.mapCategories(data.cuisine, data.categories);
    
    // Photos
    this.defaultPhoto = this.mapPhoto(data.default_photo);
    this.mainPhoto = this.mapPhoto(data.main_photo);
    
    // Business status
    this.verified = data.verified || false;
    this.official = data.official || true;
    this.premium = data.premium || false;
    this.newBusiness = data.new_business || false;
    this.closed = data.closed || false;
    
    // Statistics
    this.statistic = {
      numberOfBookmarks: data.bookmarks_count || 0,
      numberOfPhotos: data.photos_count || 0,
      numberOfUserPhotos: data.user_photos_count || 0,
      rating: parseFloat(data.rating) || 0,
      numberOfReviews: data.reviews_count || 0,
      showRating: (data.reviews_count || 0) > 0,
      numberOfRatings: data.ratings_count || 0,
      numberOfVideos: data.videos_count || 0
    };
    
    // Contact information
    this.contact = this.mapContact(data);
    
    // Business hours
    this.hours = this.mapBusinessHours(data.business_hours);
    this.workingHoursStatus = this.getWorkingHoursStatus();
    
    // Features
    this.features = data.features || [];
    this.businessTags = data.business_tags || [];
    
    // Menu information
    this.menu = this.mapMenu(data);
    
    // Delivery/pickup
    this.pickupInformation = {
      available: data.pickup_available || false
    };
    this.deliveryInformation = {
      available: data.delivery_available || false,
      fee: data.delivery_fee || 0,
      minOrder: data.min_order || 0
    };
    
    // Top favorites (popular items)
    this.topFavourites = data.top_favourites || [];
    
    // Distance (if location-based search)
    this.distance = data.distance || null;
  }
  
  generateGid() {
    // Generate a unique GID similar to Wongnai's format
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 30; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  
  slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  
  mapPriceRange(priceRange) {
    const priceMap = {
      '$': { name: 'ต่ำกว่า 100 บาท', value: 1 },
      '$$': { name: '100-300 บาท', value: 2 },
      '$$$': { name: '300-600 บาท', value: 3 },
      '$$$$': { name: 'มากกว่า 600 บาท', value: 4 }
    };
    return priceMap[priceRange] || { name: 'ไม่ระบุ', value: 0 };
  }
  
  mapCategories(cuisine, additionalCategories = []) {
    const categoryMap = {
      'Italian': { id: 1, name: 'อิตาเลียน', internationalName: 'Italian' },
      'Japanese': { id: 2, name: 'ญี่ปุ่น', internationalName: 'Japanese' },
      'Mexican': { id: 3, name: 'เม็กซิกัน', internationalName: 'Mexican' },
      'French': { id: 4, name: 'ฝรั่งเศส', internationalName: 'French' },
      'American': { id: 5, name: 'อเมริกัน', internationalName: 'American' },
      'Thai': { id: 6, name: 'ไทย', internationalName: 'Thai' },
      'Chinese': { id: 7, name: 'จีน', internationalName: 'Chinese' },
      'Korean': { id: 8, name: 'เกาหลี', internationalName: 'Korean' },
      'Indian': { id: 9, name: 'อินเดีย', internationalName: 'Indian' },
      'Cafe': { id: 59, name: 'คาเฟ่', internationalName: 'Cafe' }
    };
    
    const categories = [];
    if (cuisine && categoryMap[cuisine]) {
      categories.push({
        ...categoryMap[cuisine],
        iconUrl: `https://static2.wongnai.com/static/7.9.1/category/common/images/color/${categoryMap[cuisine].id}.png`,
        iconFullUrl: `https://static2.wongnai.com/static/7.9.1/category/common/images/color/${categoryMap[cuisine].id}.png`
      });
    }
    
    return categories;
  }
  
  mapPhoto(photoData) {
    if (!photoData) return null;
    
    const photoId = photoData.id || this.generatePhotoId();
    return {
      photoId,
      url: `photos/${photoId}`,
      description: photoData.description || this.name,
      contentUrl: photoData.url || `https://img.wongnai.com/p/_-x_/default/${photoId}.jpg`,
      width: photoData.width || 1920,
      height: photoData.height || 1080,
      photoUrl: `photos/${photoId}`,
      thumbnailUrl: photoData.thumbnail || `https://img.wongnai.com/p/100x100/default/${photoId}.jpg`
    };
  }
  
  generatePhotoId() {
    return Array.from({length: 32}, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }
  
  mapContact(data) {
    const address = typeof data.address === 'string' ? JSON.parse(data.address) : data.address || {};
    const contactInfo = typeof data.contact_info === 'string' ? JSON.parse(data.contact_info) : data.contact_info || {};
    
    return {
      address: {
        street: address.street || '',
        hint: address.hint || '',
        subDistrict: { id: 1, name: address.subDistrict || '' },
        district: { id: 1, name: address.district || address.city || '' },
        city: { id: 1, name: address.city || '' }
      },
      businessno: contactInfo.businessno || null,
      homepage: contactInfo.website || null,
      facebookHomepage: contactInfo.facebook || null,
      email: contactInfo.email || null,
      callablePhoneno: contactInfo.phone || null,
      callablePhoneNumbers: contactInfo.phone ? [contactInfo.phone] : [],
      phoneno: contactInfo.phone || null,
      line: contactInfo.line || null,
      instagram: contactInfo.instagram || null
    };
  }
  
  mapBusinessHours(hoursData) {
    if (!hoursData) return [];
    
    const hours = typeof hoursData === 'string' ? JSON.parse(hoursData) : hoursData;
    const daysMap = {
      monday: 'จันทร์',
      tuesday: 'อังคาร', 
      wednesday: 'พุธ',
      thursday: 'พฤหัสบดี',
      friday: 'ศุกร์',
      saturday: 'เสาร์',
      sunday: 'อาทิตย์'
    };
    
    return Object.entries(hours).map(([day, time]) => ({
      day: daysMap[day] || day,
      dayEn: day,
      time: time === 'closed' ? 'ปิด' : time,
      timeEn: time,
      closed: time === 'closed'
    }));
  }
  
  getWorkingHoursStatus() {
    const now = new Date();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = dayNames[now.getDay()];
    const currentTime = now.toTimeString().slice(0, 5);
    
    const todayHours = this.hours.find(h => h.dayEn === currentDay);
    if (!todayHours || todayHours.closed) {
      return { status: 'closed', message: 'ปิด' };
    }
    
    if (todayHours.timeEn && todayHours.timeEn.includes('-')) {
      const [openTime, closeTime] = todayHours.timeEn.split('-');
      if (currentTime >= openTime && currentTime <= closeTime) {
        return { status: 'open', message: 'เปิด' };
      }
    }
    
    return { status: 'closed', message: 'ปิด' };
  }
  
  mapMenu(data) {
    return {
      texts: {
        url: this.menuUrl,
        numberOfItems: data.menu_items_count || 0,
        updatedTime: {
          iso: new Date().toISOString(),
          full: new Date().toLocaleString('th-TH'),
          timePassed: 'เพิ่งอัปเดต'
        },
        groupsUrl: `${this.menuUrl}/groups`
      },
      photos: null,
      previewedItems: data.preview_items || null
    };
  }
  
  // Convert to Wongnai API format
  toWongnaiFormat() {
    return {
      isOwner: false,
      id: this.id,
      eid: null,
      gid: this.gid,
      publicId: this.publicId,
      nameOnly: this.nameOnly,
      branch: this.branch,
      url: this.url,
      shortUrl: this.shortUrl,
      rUrl: this.url,
      rShortUrl: this.shortUrl,
      photosUrl: this.photosUrl,
      verifiedInfo: this.verified,
      verifiedLocation: this.verified,
      domain: { name: "MAIN", value: 1 },
      lat: this.lat,
      lng: this.lng,
      zipcode: this.zipcode,
      priceRange: this.priceRange,
      newBusiness: this.newBusiness,
      openingDate: null,
      name: this.name,
      displayName: this.displayName,
      chain: null,
      logo: null,
      categories: this.categories,
      defaultPhoto: this.defaultPhoto,
      place: null,
      placeInformation: null,
      targetViewGroupId: 1,
      isThailand: true,
      businessTags: this.businessTags,
      rating: this.statistic.rating,
      mainPhoto: this.mainPhoto,
      workingHoursStatus: this.workingHoursStatus,
      hours: this.hours,
      official: this.official,
      premium: this.premium,
      portraitMode: null,
      portraitModeCoverPhoto: null,
      featured: null,
      featuredId: null,
      featuredTarget: null,
      trackingRef: null,
      featuredMessage: null,
      iconFeatured: null,
      usersChoice: null,
      statistic: this.statistic,
      video: null,
      distance: this.distance,
      pickupInformation: this.pickupInformation,
      hasPreventiveMeasures: false,
      contact: this.contact,
      _ltr: null,
      bestDiscountDeal: null,
      bestSellingDeal: null,
      closed: this.closed,
      completeness: 5,
      dealsUrl: `${this.url}/deals`,
      moveToUrl: null,
      neighborhoods: null,
      topFavourites: this.topFavourites,
      logoUrl: null,
      ranking: null,
      menu: this.menu,
      photos: {
        page: {
          pageInformation: { number: 1, size: 8 },
          first: 1,
          last: 8,
          totalNumberOfPages: 1,
          totalNumberOfEntities: 8,
          entities: []
        }
      }
    };
  }
}

// Enhanced restaurant search with Wongnai-style response
async function searchRestaurantsWongnaiStyle(filters = {}) {
  const client = await pool.connect();
  try {
    let query = `
      SELECT r.*, 
             COUNT(uf.id) as bookmarks_count,
             0 as photos_count,
             0 as reviews_count
      FROM restaurants r
      LEFT JOIN user_favorites uf ON r.id = uf.restaurant_id
      WHERE r.is_active = true
    `;
    
    const params = [];
    let paramCount = 0;

    if (filters.cuisine) {
      paramCount++;
      query += ` AND LOWER(r.cuisine) LIKE LOWER($${paramCount})`;
      params.push(`%${filters.cuisine}%`);
    }

    if (filters.location) {
      paramCount++;
      query += ` AND LOWER(r.location) LIKE LOWER($${paramCount})`;
      params.push(`%${filters.location}%`);
    }

    if (filters.priceRange) {
      paramCount++;
      query += ` AND r.price_range = $${paramCount}`;
      params.push(filters.priceRange);
    }

    if (filters.minRating) {
      paramCount++;
      query += ` AND r.rating >= $${paramCount}`;
      params.push(parseFloat(filters.minRating));
    }

    query += ` GROUP BY r.id ORDER BY r.rating DESC, r.created_at DESC`;

    if (filters.limit) {
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      params.push(parseInt(filters.limit));
    }

    const result = await client.query(query, params);
    
    // Convert to Wongnai-style format
    const restaurants = result.rows.map(row => {
      const restaurant = new WongnaiStyleRestaurant(row);
      return restaurant.toWongnaiFormat();
    });

    // Wongnai-style pagination response
    const totalCount = restaurants.length;
    const pageSize = parseInt(filters.limit) || 20;
    const pageNumber = parseInt(filters.page) || 1;
    
    return {
      page: {
        pageInformation: {
          number: pageNumber,
          size: pageSize
        },
        first: 1,
        last: Math.min(pageSize, totalCount),
        totalNumberOfPages: Math.ceil(totalCount / pageSize),
        totalNumberOfEntities: totalCount,
        entities: restaurants
      }
    };
  } finally {
    client.release();
  }
}

// Get restaurant delivery menu (Wongnai-style)
async function getRestaurantDeliveryMenu(publicId) {
  const client = await pool.connect();
  try {
    // Extract restaurant ID from publicId
    const restaurantId = publicId.replace(/[^0-9]/g, '');
    
    const result = await client.query(`
      SELECT r.*
      FROM restaurants r
      WHERE r.id = $1 AND r.is_active = true
    `, [restaurantId]);

    if (result.rows.length === 0) {
      throw new Error('Restaurant not found');
    }

    const restaurant = result.rows[0];
    const menuData = restaurant.menu_data ? JSON.parse(restaurant.menu_data) : {};

    // Generate sample menu items based on cuisine
    const sampleMenuItems = generateSampleMenu(restaurant.cuisine, restaurant.name);

    return {
      restaurant: {
        id: restaurant.id,
        publicId: publicId,
        name: restaurant.name,
        cuisine: restaurant.cuisine,
        rating: parseFloat(restaurant.rating),
        priceRange: restaurant.price_range,
        location: restaurant.location,
        description: restaurant.description
      },
      menu: {
        categories: sampleMenuItems.categories,
        items: sampleMenuItems.items,
        lastUpdated: new Date().toISOString(),
        deliveryAvailable: restaurant.features?.includes('delivery') || true,
        minimumOrder: 200, // 200 THB minimum
        deliveryFee: 35, // 35 THB delivery fee
        estimatedDeliveryTime: "30-45 นาที",
        paymentMethods: ["cash", "credit_card", "mobile_banking", "e_wallet"]
      }
    };
  } finally {
    client.release();
  }
}

// Generate sample menu based on cuisine type
function generateSampleMenu(cuisine, restaurantName) {
  const menuTemplates = {
    Italian: {
      categories: [
        { id: 1, name: "Appetizers", nameEn: "Appetizers", nameTh: "อาหารเรียกน้ำย่อย" },
        { id: 2, name: "Pasta", nameEn: "Pasta", nameTh: "พาสต้า" },
        { id: 3, name: "Pizza", nameEn: "Pizza", nameTh: "พิซซ่า" },
        { id: 4, name: "Main Course", nameEn: "Main Course", nameTh: "อาหารจานหลัก" },
        { id: 5, name: "Desserts", nameEn: "Desserts", nameTh: "ของหวาน" },
        { id: 6, name: "Beverages", nameEn: "Beverages", nameTh: "เครื่องดื่ม" }
      ],
      items: [
        { id: 1, categoryId: 1, name: "Bruschetta", nameTh: "บรูสเคตต้า", price: 180, description: "Grilled bread with tomatoes, garlic, and basil", image: "bruschetta.jpg" },
        { id: 2, categoryId: 1, name: "Antipasto Platter", nameTh: "จานรวมอันติปาสโต", price: 320, description: "Selection of Italian cured meats and cheeses", image: "antipasto.jpg" },
        { id: 3, categoryId: 2, name: "Spaghetti Carbonara", nameTh: "สปาเก็ตตี้คาร์โบนาร่า", price: 280, description: "Classic pasta with eggs, cheese, and pancetta", image: "carbonara.jpg" },
        { id: 4, categoryId: 2, name: "Penne Arrabbiata", nameTh: "เพนเน่อาราบบิอาต้า", price: 250, description: "Spicy tomato sauce with garlic and chili", image: "arrabbiata.jpg" },
        { id: 5, categoryId: 3, name: "Margherita Pizza", nameTh: "พิซซ่ามาร์เกอริต้า", price: 350, description: "Fresh mozzarella, tomatoes, and basil", image: "margherita.jpg" },
        { id: 6, categoryId: 3, name: "Quattro Stagioni", nameTh: "พิซซ่าควัตโตรสตาจิโอนี", price: 420, description: "Four seasons pizza with various toppings", image: "quattro.jpg" },
        { id: 7, categoryId: 4, name: "Osso Buco", nameTh: "ออสโซบูโก", price: 580, description: "Braised veal shanks with vegetables", image: "ossobuco.jpg" },
        { id: 8, categoryId: 5, name: "Tiramisu", nameTh: "ทิรามิสุ", price: 150, description: "Classic Italian coffee-flavored dessert", image: "tiramisu.jpg" },
        { id: 9, categoryId: 6, name: "Italian Wine", nameTh: "ไวน์อิตาเลียน", price: 200, description: "Selection of Italian red and white wines", image: "wine.jpg" }
      ]
    },
    Japanese: {
      categories: [
        { id: 1, name: "Sushi", nameEn: "Sushi", nameTh: "ซูชิ" },
        { id: 2, name: "Sashimi", nameEn: "Sashimi", nameTh: "ซาชิมิ" },
        { id: 3, name: "Rolls", nameEn: "Rolls", nameTh: "โรล" },
        { id: 4, name: "Hot Dishes", nameEn: "Hot Dishes", nameTh: "อาหารร้อน" },
        { id: 5, name: "Beverages", nameEn: "Beverages", nameTh: "เครื่องดื่ม" }
      ],
      items: [
        { id: 1, categoryId: 1, name: "Salmon Nigiri", nameTh: "ซูชิแซลมอน", price: 80, description: "Fresh salmon over seasoned rice", image: "salmon_nigiri.jpg" },
        { id: 2, categoryId: 1, name: "Tuna Nigiri", nameTh: "ซูชิทูน่า", price: 90, description: "Fresh tuna over seasoned rice", image: "tuna_nigiri.jpg" },
        { id: 3, categoryId: 2, name: "Salmon Sashimi", nameTh: "ซาชิมิแซลมอน", price: 180, description: "Fresh sliced salmon", image: "salmon_sashimi.jpg" },
        { id: 4, categoryId: 3, name: "California Roll", nameTh: "แคลิฟอร์เนียโรล", price: 220, description: "Crab, avocado, and cucumber roll", image: "california_roll.jpg" },
        { id: 5, categoryId: 4, name: "Chicken Teriyaki", nameTh: "ไก่เทอริยากิ", price: 280, description: "Grilled chicken with teriyaki sauce", image: "teriyaki.jpg" },
        { id: 6, categoryId: 5, name: "Sake", nameTh: "สาเก", price: 150, description: "Traditional Japanese rice wine", image: "sake.jpg" }
      ]
    },
    Mexican: {
      categories: [
        { id: 1, name: "Tacos", nameEn: "Tacos", nameTh: "ทาโก้" },
        { id: 2, name: "Burritos", nameEn: "Burritos", nameTh: "บูร์ริโต้" },
        { id: 3, name: "Quesadillas", nameEn: "Quesadillas", nameTh: "เคซาดิญ่า" },
        { id: 4, name: "Appetizers", nameEn: "Appetizers", nameTh: "อาหารเรียกน้ำย่อย" },
        { id: 5, name: "Beverages", nameEn: "Beverages", nameTh: "เครื่องดื่ม" }
      ],
      items: [
        { id: 1, categoryId: 1, name: "Beef Tacos", nameTh: "ทาโก้เนื้อ", price: 120, description: "Soft tacos with seasoned beef", image: "beef_tacos.jpg" },
        { id: 2, categoryId: 1, name: "Chicken Tacos", nameTh: "ทาโก้ไก่", price: 110, description: "Soft tacos with grilled chicken", image: "chicken_tacos.jpg" },
        { id: 3, categoryId: 2, name: "Beef Burrito", nameTh: "บูร์ริโต้เนื้อ", price: 180, description: "Large flour tortilla with beef and beans", image: "beef_burrito.jpg" },
        { id: 4, categoryId: 3, name: "Cheese Quesadilla", nameTh: "เคซาดิญ่าชีส", price: 150, description: "Grilled tortilla with melted cheese", image: "quesadilla.jpg" },
        { id: 5, categoryId: 4, name: "Guacamole", nameTh: "กัวคาโมเล่", price: 80, description: "Fresh avocado dip with chips", image: "guacamole.jpg" },
        { id: 6, categoryId: 5, name: "Margarita", nameTh: "มาร์การิต้า", price: 180, description: "Classic tequila cocktail", image: "margarita.jpg" }
      ]
    }
  };

  const defaultMenu = {
    categories: [
      { id: 1, name: "Main Dishes", nameEn: "Main Dishes", nameTh: "อาหารจานหลัก" },
      { id: 2, name: "Beverages", nameEn: "Beverages", nameTh: "เครื่องดื่ม" }
    ],
    items: [
      { id: 1, categoryId: 1, name: "House Special", nameTh: "เมนูพิเศษของร้าน", price: 250, description: "Chef's recommended dish", image: "special.jpg" },
      { id: 2, categoryId: 2, name: "Fresh Juice", nameTh: "น้ำผลไม้สด", price: 80, description: "Freshly squeezed fruit juice", image: "juice.jpg" }
    ]
  };

  return menuTemplates[cuisine] || defaultMenu;
}

module.exports = {
  WongnaiStyleRestaurant,
  searchRestaurantsWongnaiStyle,
  getRestaurantDeliveryMenu
};