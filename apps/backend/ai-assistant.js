#!/usr/bin/env node

/**
 * BiteBase AI Assistant Service
 * Personal AI assistant for restaurant intelligence with Thai language support
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class BiteBaseAIAssistant {
  constructor(dbPath) {
    this.db = new sqlite3.Database(dbPath);
    this.userSessions = new Map(); // Store user conversation context
  }

  /**
   * Process user message and generate intelligent response
   */
  async processMessage(userId, message, userContext = {}) {
    try {
      // Detect language (Thai or English)
      const language = this.detectLanguage(message);
      
      // Analyze message intent
      const intent = this.analyzeIntent(message, language);
      
      // Get user's restaurant data
      const restaurantData = await this.getUserRestaurantData(userId);
      
      // Generate contextual response
      const response = await this.generateResponse(intent, message, restaurantData, language, userContext);
      
      // Store conversation context
      this.updateUserSession(userId, message, response);
      
      return response;
    } catch (error) {
      console.error('AI Assistant Error:', error);
      return this.getErrorResponse(this.detectLanguage(message));
    }
  }

  /**
   * Detect if message is in Thai or English
   */
  detectLanguage(message) {
    // Simple Thai character detection
    const thaiPattern = /[\u0E00-\u0E7F]/;
    return thaiPattern.test(message) ? 'th' : 'en';
  }

  /**
   * Analyze user intent from message
   */
  analyzeIntent(message, language) {
    const lowerMessage = message.toLowerCase();
    
    // Thai intent patterns
    const thaiIntents = {
      sales: ['ยอดขาย', 'รายได้', 'เงิน', 'กำไร', 'ขาย'],
      customers: ['ลูกค้า', 'คน', 'ผู้บริโภค'],
      menu: ['เมนู', 'อาหาร', 'จาน', 'รายการ'],
      marketing: ['การตลาด', 'โฆษณา', 'ประชาสัมพันธ์', 'โปรโมชั่น'],
      competition: ['คู่แข่ง', 'แข่งขัน', 'ร้านอื่น'],
      location: ['ที่ตั้ง', 'สถานที่', 'ทำเล', 'พื้นที่'],
      performance: ['ผลงาน', 'ประสิทธิภาพ', 'สถิติ'],
      suggestions: ['แนะนำ', 'คำแนะนำ', 'ช่วย', 'ปรับปรุง']
    };

    // English intent patterns
    const englishIntents = {
      sales: ['sales', 'revenue', 'income', 'profit', 'money', 'earnings'],
      customers: ['customer', 'client', 'guest', 'visitor', 'patron'],
      menu: ['menu', 'food', 'dish', 'item', 'recipe'],
      marketing: ['marketing', 'promotion', 'campaign', 'advertising', 'social'],
      competition: ['competitor', 'competition', 'rival', 'other restaurant'],
      location: ['location', 'area', 'place', 'neighborhood', 'district'],
      performance: ['performance', 'analytics', 'metrics', 'statistics', 'data'],
      suggestions: ['suggest', 'recommend', 'advice', 'help', 'improve', 'optimize']
    };

    const intents = language === 'th' ? thaiIntents : englishIntents;
    
    // Find matching intent
    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return intent;
      }
    }
    
    return 'general';
  }

  /**
   * Get user's restaurant data from database
   */
  async getUserRestaurantData(userId) {
    return new Promise((resolve, reject) => {
      // Get user info
      this.db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
          reject(err);
          return;
        }

        // Get restaurant performance data (mock for now)
        const restaurantData = {
          user: user,
          performance: {
            monthlyRevenue: 185400,
            customerCount: 892,
            averageOrder: 680,
            satisfactionScore: 4.6,
            footTraffic: 1847,
            conversionRate: 48.3,
            marketShare: 8.7
          },
          recentOrders: [],
          popularItems: [
            { name: 'Seafood Linguine', orders: 156, revenue: 62400 },
            { name: 'Truffle Risotto', orders: 134, revenue: 56780 },
            { name: 'Margherita Pizza', orders: 98, revenue: 29400 }
          ]
        };

        resolve(restaurantData);
      });
    });
  }

  /**
   * Get Wongnai restaurant market data for competitive analysis
   */
  async getWongnaiMarketData(filters = {}) {
    return new Promise((resolve, reject) => {
      let query = 'SELECT * FROM wongnai_restaurants WHERE 1=1';
      const params = [];

      if (filters.category) {
        query += ' AND category LIKE ?';
        params.push(`%${filters.category}%`);
      }

      if (filters.city) {
        query += ' AND city LIKE ?';
        params.push(`%${filters.city}%`);
      }

      query += ' ORDER BY rating DESC, number_of_reviews DESC LIMIT 10';

      this.db.all(query, params, (err, restaurants) => {
        if (err) {
          console.error('Wongnai data error:', err);
          resolve([]);
          return;
        }

        // Process restaurants data
        const processedRestaurants = restaurants.map(restaurant => ({
          ...restaurant,
          photos: JSON.parse(restaurant.photos || '[]'),
          menu_items: JSON.parse(restaurant.menu_items || '[]'),
          opening_hours: restaurant.opening_hours ? JSON.parse(restaurant.opening_hours) : null
        }));

        resolve(processedRestaurants);
      });
    });
  }

  /**
   * Generate intelligent response based on intent and data
   */
  async generateResponse(intent, message, restaurantData, language, userContext) {
    // Get market data for competitive analysis
    const marketData = await this.getWongnaiMarketData({
      category: 'อาหารไทย', // Default to Thai food, can be made dynamic
      city: 'กรุงเทพฯ' // Default to Bangkok, can be made dynamic
    });

    const responses = {
      th: {
        sales: this.generateThaiSalesResponse(restaurantData),
        customers: this.generateThaiCustomerResponse(restaurantData),
        menu: this.generateThaiMenuResponse(restaurantData),
        marketing: this.generateThaiMarketingResponse(restaurantData),
        competition: this.generateThaiCompetitionResponse(marketData),
        location: this.generateThaiLocationResponse(),
        performance: this.generateThaiPerformanceResponse(restaurantData),
        suggestions: this.generateThaiSuggestionsResponse(restaurantData),
        general: this.generateThaiGeneralResponse(message)
      },
      en: {
        sales: this.generateEnglishSalesResponse(restaurantData),
        customers: this.generateEnglishCustomerResponse(restaurantData),
        menu: this.generateEnglishMenuResponse(restaurantData),
        marketing: this.generateEnglishMarketingResponse(restaurantData),
        competition: this.generateEnglishCompetitionResponse(marketData),
        location: this.generateEnglishLocationResponse(),
        performance: this.generateEnglishPerformanceResponse(restaurantData),
        suggestions: this.generateEnglishSuggestionsResponse(restaurantData),
        general: this.generateEnglishGeneralResponse(message)
      }
    };

    return responses[language][intent] || responses[language].general;
  }

  // Thai Response Generators
  generateThaiSalesResponse(data) {
    return {
      content: `📊 **รายงานยอดขายของคุณ**

🏆 **ยอดขายรายเดือน**: ฿${data.performance.monthlyRevenue.toLocaleString()} (+12.3%)
👥 **จำนวนลูกค้า**: ${data.performance.customerCount} คน (+8.7%)
💰 **ยอดเฉลี่ยต่อออเดอร์**: ฿${data.performance.averageOrder} (+5.2%)

📈 **เมนูขายดี**:
${data.popularItems.map((item, i) => `${i+1}. ${item.name} - ${item.orders} ออเดอร์ (฿${item.revenue.toLocaleString()})`).join('\n')}

💡 **คำแนะนำ**: ยอดขายเพิ่มขึ้นดี! ลองเพิ่มโปรโมชั่นสำหรับเมนูขายดีเพื่อเพิ่มยอดขายให้มากขึ้น`,
      type: 'sales_analysis',
      data: data.performance,
      language: 'th'
    };
  }

  generateThaiCustomerResponse(data) {
    return {
      content: `👥 **ข้อมูลลูกค้าของคุณ**

📊 **สถิติลูกค้า**:
• จำนวนลูกค้าทั้งหมด: ${data.performance.customerCount} คน
• คะแนนความพึงพอใจ: ${data.performance.satisfactionScore}/5.0 ⭐
• อัตราการกลับมาซื้อ: ${data.performance.conversionRate}%

🎯 **กลุ่มลูกค้าหลัก**:
• วัยทำงาน 25-35 ปี (45%)
• ครอบครัว (30%)
• นักท่องเที่ยว (25%)

💡 **คำแนะนำ**: ลูกค้าให้คะแนนดี! ลองสร้างโปรแกรมสะสมแต้มเพื่อเพิ่มความภักดี`,
      type: 'customer_analysis',
      data: data.performance,
      language: 'th'
    };
  }

  generateThaiMenuResponse(data) {
    return {
      content: `🍽️ **การวิเคราะห์เมนูอาหาร**

🏆 **เมนูขายดีที่สุด**:
${data.popularItems.map((item, i) => `${i+1}. ${item.name} - ${item.orders} ออเดอร์`).join('\n')}

📊 **สถิติเมนู**:
• เมนูทั้งหมด: 45 รายการ
• เมนูขายดี (>50 ออเดอร์/เดือน): 12 รายการ
• เมนูขายช้า (<10 ออเดอร์/เดือน): 8 รายการ

💡 **คำแนะนำ**: 
- เพิ่มหลากหลายให้เมนูขายดี
- ปรับปรุงหรือเอาเมนูขายช้าออก
- เพิ่มเมนูเจ/มังสวิรัติตามเทรนด์`,
      type: 'menu_analysis',
      data: data.popularItems,
      language: 'th'
    };
  }

  generateThaiMarketingResponse(data) {
    return {
      content: `📢 **กลยุทธ์การตลาดสำหรับร้านคุณ**

🎯 **แนะนำแคมเปญ**:
1. **โปรโมชั่นวันธรรมดา** - ลด 20% วันจันทร์-พุธ
2. **Happy Hour** - เครื่องดื่มลดราคา 17:00-19:00
3. **Family Set** - เซ็ตครอบครัว 4 คน ราคาพิเศษ

📱 **ช่องทางการตลาด**:
• Facebook/Instagram Ads (งบ ฿5,000/เดือน)
• Line Official Account
• Google My Business
• Food Delivery Apps

📊 **ผลลัพธ์คาดหวัง**:
• เพิ่มลูกค้าใหม่ 15-20%
• เพิ่มยอดขาย 10-15%

💡 **เริ่มต้นง่ายๆ**: ลองโพสต์รูปอาหารสวยๆ บน Instagram ทุกวัน!`,
      type: 'marketing_strategy',
      language: 'th'
    };
  }

  generateThaiCompetitionResponse(marketData = []) {
    if (marketData.length === 0) {
      return {
        content: `🏪 **การวิเคราะห์คู่แข่ง**

📊 **ข้อมูลตลาด**: กำลังรวบรวมข้อมูลคู่แข่งจาก Wongnai...

🎯 **จุดแข็งของคุณ**:
• คะแนนรีวิวดี (4.6/5.0)
• ทำเลดี
• เมนูหลากหลาย

💡 **กลยุทธ์แนะนำ**: เน้นคุณภาพและบริการที่เหนือกว่า`,
        type: 'competition_analysis',
        language: 'th'
      };
    }

    const topCompetitors = marketData.slice(0, 5);
    const competitorList = topCompetitors.map((restaurant, index) => {
      const priceSymbol = '฿'.repeat(restaurant.price_range || 1);
      const reviewCount = restaurant.number_of_reviews || 0;
      return `${index + 1}. **${restaurant.name}** - ⭐${restaurant.rating || 'N/A'} (${reviewCount} รีวิว), ${priceSymbol}`;
    }).join('\n');

    const avgRating = topCompetitors.reduce((sum, r) => sum + (r.rating || 0), 0) / topCompetitors.length;
    const avgReviews = topCompetitors.reduce((sum, r) => sum + (r.number_of_reviews || 0), 0) / topCompetitors.length;

    return {
      content: `🏪 **การวิเคราะห์คู่แข่ง** (ข้อมูลจาก Wongnai)

📊 **คู่แข่งชั้นนำในตลาด**:
${competitorList}

📈 **สถิติตลาด**:
• คะแนนเฉลี่ย: ${avgRating.toFixed(1)}/5.0
• รีวิวเฉลี่ย: ${Math.round(avgReviews)} รีวิว
• จำนวนคู่แข่ง: ${topCompetitors.length} ร้าน

🎯 **จุดแข็งของคุณ**:
• คะแนนรีวิวดี (4.6/5.0) ${4.6 > avgRating ? '🟢 สูงกว่าค่าเฉลี่ย' : '🟡 ต่ำกว่าค่าเฉลี่ย'}
• ทำเลดี
• เมนูหลากหลาย

💡 **กลยุทธ์แนะนำจากข้อมูลตลาด**:
• ${4.6 > avgRating ? 'ใช้ประโยชน์จากคะแนนที่สูงกว่าคู่แข่ง' : 'ปรับปรุงคุณภาพเพื่อเพิ่มคะแนน'}
• เพิ่มการรีวิวเพื่อสร้างความน่าเชื่อถือ
• ศึกษากลยุทธ์ของคู่แข่งที่ประสบความสำเร็จ`,
      type: 'competition_analysis',
      language: 'th',
      data: {
        competitors: topCompetitors,
        marketStats: {
          avgRating: avgRating.toFixed(1),
          avgReviews: Math.round(avgReviews),
          totalCompetitors: topCompetitors.length
        }
      }
    };
  }

  generateThaiLocationResponse() {
    return {
      content: `📍 **การวิเคราะห์ทำเลที่ตั้ง**

🏢 **ข้อมูลพื้นที่**:
• ย่าน: สุขุมวิท ซอย 11
• ประชากร: 125,000 คน
• รายได้เฉลี่ย: ฿45,000/เดือน
• กลุ่มอายุหลัก: 26-35 ปี (28%)

🚶‍♂️ **การเดินทาง**:
• BTS อโศก 500 เมตร
• ที่จอดรถ: มี
• การเข้าถึง: ดีมาก

📊 **ศักยภาพพื้นที่**:
• ความหนาแน่นร้านอาหาร: ปานกลาง
• การแข่งขัน: ปานกลาง
• โอกาสเติบโต: สูง

💡 **ข้อเสนะแนะ**: ทำเลดีมาก! เหมาะสำหรับขยายธุรกิจ`,
      type: 'location_analysis',
      language: 'th'
    };
  }

  generateThaiPerformanceResponse(data) {
    return {
      content: `📈 **รายงานผลประกอบการ**

🏆 **ตัวชี้วัดหลัก**:
• รายได้รายเดือน: ฿${data.performance.monthlyRevenue.toLocaleString()} (+12.3%)
• จำนวนลูกค้า: ${data.performance.customerCount} คน (+8.7%)
• ค่าเฉลี่ยต่อบิล: ฿${data.performance.averageOrder} (+5.2%)
• คะแนนพึงพอใจ: ${data.performance.satisfactionScore}/5.0 (+0.1)

📊 **เปรียบเทียบเดือนที่แล้ว**:
• ยอดขาย: ↗️ เพิ่มขึ้น 12.3%
• ลูกค้า: ↗️ เพิ่มขึ้น 8.7%
• ความพึงพอใจ: ↗️ ดีขึ้น

🎯 **เป้าหมายเดือนหน้า**:
• เพิ่มยอดขาย 15%
• เพิ่มลูกค้าใหม่ 100 คน

💡 **ผลงานดีมาก! คงสภาพนี้ไว้และพัฒนาต่อไป**`,
      type: 'performance_report',
      data: data.performance,
      language: 'th'
    };
  }

  generateThaiSuggestionsResponse(data) {
    return {
      content: `💡 **คำแนะนำเพื่อพัฒนาธุรกิจ**

🚀 **แนะนำเร่งด่วน**:
1. **เพิ่มโต๊ะช่วงวันหยุด** - ความต้องการสูงกว่าที่นั่ง 35%
2. **ปรับราคาเมนูขายดี** - เพิ่มกำไร 8-12%
3. **โปรโมชั่นวันธรรมดา** - เพิ่มลูกค้า 20%

📊 **แนะนำระยะยาว**:
• ขยายพื้นที่นั่ง (+10 ที่นั่ง)
• เพิ่มบริการ Delivery
• พัฒนาแอปสั่งอาหาร
• เปิดสาขาใหม่

🎯 **ลำดับความสำคัญ**:
1. ปรับปรุงการบริการช่วงเร่งด่วน
2. เพิ่มช่องทางการตลาดออนไลน์
3. พัฒนาเมนูใหม่ตามฤดูกาล

💰 **ผลตอบแทนคาดหวัง**: เพิ่มรายได้ 25-30% ภายใน 6 เดือน`,
      type: 'business_suggestions',
      language: 'th'
    };
  }

  generateThaiGeneralResponse(message) {
    return {
      content: `สวัสดีครับ! 👋 

ผมเป็น AI Assistant ของ BiteBase พร้อมช่วยเหลือคุณในเรื่อง:

🍽️ **การจัดการร้านอาหาร**:
• วิเคราะห์ยอดขาย และกำไร
• ข้อมูลลูกค้าและความพึงพอใจ
• การวิเคราะห์เมนูและประสิทธิภาพ

📊 **การตลาดและการแข่งขัน**:
• กลยุทธ์การตลาดและโปรโมชั่น
• วิเคราะห์คู่แข่งและตลาด
• แนะนำการปรับปรุงธุรกิจ

📍 **การวิเคราะห์ทำเล**:
• ข้อมูลพื้นที่และประชากร
• โอกาสทางธุรกิจ
• การขยายสาขา

💬 **ลองถามผมเรื่อง**: "ยอดขายเดือนนี้เป็นยังไง?" หรือ "แนะนำโปรโมชั่นหน่อย"`,
      type: 'general_help',
      language: 'th'
    };
  }

  // English Response Generators
  generateEnglishSalesResponse(data) {
    return {
      content: `📊 **Your Sales Report**

🏆 **Monthly Revenue**: ฿${data.performance.monthlyRevenue.toLocaleString()} (+12.3%)
👥 **Customer Count**: ${data.performance.customerCount} customers (+8.7%)
💰 **Average Order Value**: ฿${data.performance.averageOrder} (+5.2%)

📈 **Top Selling Items**:
${data.popularItems.map((item, i) => `${i+1}. ${item.name} - ${item.orders} orders (฿${item.revenue.toLocaleString()})`).join('\n')}

💡 **Recommendation**: Great sales growth! Consider promoting your best-sellers to boost revenue further.`,
      type: 'sales_analysis',
      data: data.performance,
      language: 'en'
    };
  }

  generateEnglishCustomerResponse(data) {
    return {
      content: `👥 **Customer Analytics**

📊 **Customer Statistics**:
• Total Customers: ${data.performance.customerCount}
• Satisfaction Score: ${data.performance.satisfactionScore}/5.0 ⭐
• Return Rate: ${data.performance.conversionRate}%

🎯 **Customer Segments**:
• Working Professionals 25-35 (45%)
• Families (30%)
• Tourists (25%)

💡 **Recommendation**: Excellent customer satisfaction! Consider implementing a loyalty program to increase retention.`,
      type: 'customer_analysis',
      data: data.performance,
      language: 'en'
    };
  }

  generateEnglishMenuResponse(data) {
    return {
      content: `🍽️ **Menu Performance Analysis**

🏆 **Best Sellers**:
${data.popularItems.map((item, i) => `${i+1}. ${item.name} - ${item.orders} orders`).join('\n')}

📊 **Menu Statistics**:
• Total Menu Items: 45
• High Performers (>50 orders/month): 12 items
• Low Performers (<10 orders/month): 8 items

💡 **Recommendations**: 
- Create variations of your best-sellers
- Consider removing or improving low-performing items
- Add vegetarian/vegan options following current trends`,
      type: 'menu_analysis',
      data: data.popularItems,
      language: 'en'
    };
  }

  generateEnglishMarketingResponse(data) {
    return {
      content: `📢 **Marketing Strategy for Your Restaurant**

🎯 **Recommended Campaigns**:
1. **Weekday Special** - 20% off Monday-Wednesday
2. **Happy Hour** - Discounted drinks 5-7 PM
3. **Family Package** - Special pricing for family of 4

📱 **Marketing Channels**:
• Facebook/Instagram Ads (฿5,000/month budget)
• Line Official Account
• Google My Business optimization
• Food Delivery App promotions

📊 **Expected Results**:
• 15-20% increase in new customers
• 10-15% boost in sales

💡 **Quick Start**: Begin by posting attractive food photos on Instagram daily!`,
      type: 'marketing_strategy',
      language: 'en'
    };
  }

  generateEnglishCompetitionResponse(marketData = []) {
    if (marketData.length === 0) {
      return {
        content: `🏪 **Competitive Analysis**

📊 **Market Data**: Gathering competitor data from Wongnai...

🎯 **Your Strengths**:
• Higher review rating (4.6/5.0)
• Prime location
• Diverse menu options

💡 **Strategy**: Focus on superior quality and service to justify premium positioning.`,
        type: 'competition_analysis',
        language: 'en'
      };
    }

    const topCompetitors = marketData.slice(0, 5);
    const competitorList = topCompetitors.map((restaurant, index) => {
      const priceSymbol = '฿'.repeat(restaurant.price_range || 1);
      const reviewCount = restaurant.number_of_reviews || 0;
      return `${index + 1}. **${restaurant.name}** - ⭐${restaurant.rating || 'N/A'} (${reviewCount} reviews), ${priceSymbol}`;
    }).join('\n');

    const avgRating = topCompetitors.reduce((sum, r) => sum + (r.rating || 0), 0) / topCompetitors.length;
    const avgReviews = topCompetitors.reduce((sum, r) => sum + (r.number_of_reviews || 0), 0) / topCompetitors.length;

    return {
      content: `🏪 **Competitive Analysis** (Data from Wongnai)

📊 **Top Market Competitors**:
${competitorList}

📈 **Market Statistics**:
• Average Rating: ${avgRating.toFixed(1)}/5.0
• Average Reviews: ${Math.round(avgReviews)} reviews
• Total Competitors: ${topCompetitors.length} restaurants

🎯 **Your Competitive Position**:
• Review Rating (4.6/5.0) ${4.6 > avgRating ? '🟢 Above Average' : '🟡 Below Average'}
• Prime location
• Diverse menu options

💡 **Strategic Recommendations**:
• ${4.6 > avgRating ? 'Leverage your superior rating in marketing' : 'Focus on improving service quality'}
• Increase review volume to build credibility
• Study successful competitor strategies
• Differentiate through unique value propositions`,
      type: 'competition_analysis',
      language: 'en',
      data: {
        competitors: topCompetitors,
        marketStats: {
          avgRating: avgRating.toFixed(1),
          avgReviews: Math.round(avgReviews),
          totalCompetitors: topCompetitors.length
        }
      }
    };
  }

  generateEnglishLocationResponse() {
    return {
      content: `📍 **Location Analysis**

🏢 **Area Demographics**:
• District: Sukhumvit Soi 11
• Population: 125,000 people
• Average Income: ฿45,000/month
• Primary Age Group: 26-35 years (28%)

🚶‍♂️ **Accessibility**:
• BTS Asok: 500 meters
• Parking: Available
• Foot Traffic: Excellent

📊 **Market Potential**:
• Restaurant Density: Moderate
• Competition Level: Moderate
• Growth Opportunity: High

💡 **Assessment**: Excellent location with strong growth potential for expansion!`,
      type: 'location_analysis',
      language: 'en'
    };
  }

  generateEnglishPerformanceResponse(data) {
    return {
      content: `📈 **Performance Report**

🏆 **Key Metrics**:
• Monthly Revenue: ฿${data.performance.monthlyRevenue.toLocaleString()} (+12.3%)
• Customer Count: ${data.performance.customerCount} (+8.7%)
• Average Order: ฿${data.performance.averageOrder} (+5.2%)
• Satisfaction: ${data.performance.satisfactionScore}/5.0 (+0.1)

📊 **Month-over-Month**:
• Sales: ↗️ +12.3%
• Customers: ↗️ +8.7%
• Satisfaction: ↗️ Improved

🎯 **Next Month Goals**:
• Increase sales by 15%
• Acquire 100 new customers

💡 **Excellent performance! Maintain momentum and continue growth strategies.**`,
      type: 'performance_report',
      data: data.performance,
      language: 'en'
    };
  }

  generateEnglishSuggestionsResponse(data) {
    return {
      content: `💡 **Business Improvement Suggestions**

🚀 **Immediate Actions**:
1. **Add Weekend Seating** - Demand exceeds capacity by 35%
2. **Optimize Best-Seller Pricing** - Potential 8-12% profit increase
3. **Weekday Promotions** - Could boost customer count by 20%

📊 **Long-term Strategies**:
• Expand seating capacity (+10 seats)
• Launch delivery service
• Develop mobile ordering app
• Consider second location

🎯 **Priority Order**:
1. Improve rush hour service capacity
2. Enhance online marketing presence
3. Develop seasonal menu items

💰 **Expected ROI**: 25-30% revenue increase within 6 months`,
      type: 'business_suggestions',
      language: 'en'
    };
  }

  generateEnglishGeneralResponse(message) {
    return {
      content: `Hello! 👋 

I'm your BiteBase AI Assistant, ready to help you with:

🍽️ **Restaurant Management**:
• Sales and profit analysis
• Customer data and satisfaction metrics
• Menu performance and optimization

📊 **Marketing & Competition**:
• Marketing strategies and promotions
• Competitor and market analysis
• Business improvement recommendations

📍 **Location Intelligence**:
• Area demographics and market data
• Business opportunities
• Expansion planning

💬 **Try asking me**: "How are my sales this month?" or "Suggest a promotion strategy"`,
      type: 'general_help',
      language: 'en'
    };
  }

  /**
   * Update user conversation session
   */
  updateUserSession(userId, userMessage, assistantResponse) {
    if (!this.userSessions.has(userId)) {
      this.userSessions.set(userId, []);
    }
    
    const session = this.userSessions.get(userId);
    session.push({
      timestamp: new Date(),
      userMessage,
      assistantResponse,
      intent: assistantResponse.type
    });
    
    // Keep only last 10 messages to manage memory
    if (session.length > 10) {
      session.splice(0, session.length - 10);
    }
  }

  /**
   * Get error response in appropriate language
   */
  getErrorResponse(language) {
    if (language === 'th') {
      return {
        content: `ขออภัยครับ เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง หรือติดต่อทีมสนับสนุน`,
        type: 'error',
        language: 'th'
      };
    } else {
      return {
        content: `I apologize, but I encountered an error. Please try again or contact support.`,
        type: 'error',
        language: 'en'
      };
    }
  }

  /**
   * Get user conversation history
   */
  getUserHistory(userId, limit = 5) {
    const session = this.userSessions.get(userId) || [];
    return session.slice(-limit);
  }

  /**
   * Clear user session
   */
  clearUserSession(userId) {
    this.userSessions.delete(userId);
  }
}

module.exports = BiteBaseAIAssistant;