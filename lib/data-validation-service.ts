/**
 * Data Validation and Quality Assurance Service
 * Implements data validation, caching strategies, and transformation utilities
 */

// Data validation schemas
export interface ValidationSchema {
  required?: string[];
  types?: Record<string, string>;
  ranges?: Record<string, { min?: number; max?: number }>;
  patterns?: Record<string, RegExp>;
  custom?: Record<string, (value: any) => boolean>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number; // 0-100
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  hits: number;
  source: string;
}

export interface CacheStats {
  total_entries: number;
  hit_rate: number;
  miss_rate: number;
  memory_usage_mb: number;
  oldest_entry: string;
  most_accessed: string;
}

// Data Validation Service
export class DataValidationService {
  private static cache = new Map<string, CacheEntry<any>>();
  private static cacheStats = {
    hits: 0,
    misses: 0,
    total_requests: 0
  };

  // Restaurant data validation schema
  static readonly RESTAURANT_SCHEMA: ValidationSchema = {
    required: ["id", "name", "latitude", "longitude"],
    types: {
      id: "string",
      name: "string",
      latitude: "number",
      longitude: "number",
      rating: "number",
      price_range: "number"
    },
    ranges: {
      latitude: { min: -90, max: 90 },
      longitude: { min: -180, max: 180 },
      rating: { min: 0, max: 5 },
      price_range: { min: 1, max: 4 }
    },
    patterns: {
      phone: /^[\+]?[0-9\-\(\)\s]+$/,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    custom: {
      coordinates: (data: any) => {
        return data.latitude !== 0 || data.longitude !== 0;
      }
    }
  };

  // Economic data validation schema
  static readonly ECONOMIC_SCHEMA: ValidationSchema = {
    required: ["gdp_growth", "inflation_rate", "consumer_confidence"],
    types: {
      gdp_growth: "number",
      inflation_rate: "number",
      unemployment_rate: "number",
      consumer_confidence: "number",
      tourism_index: "number"
    },
    ranges: {
      gdp_growth: { min: -10, max: 15 },
      inflation_rate: { min: -5, max: 20 },
      unemployment_rate: { min: 0, max: 25 },
      consumer_confidence: { min: 0, max: 100 },
      tourism_index: { min: 0, max: 200 }
    }
  };

  // Social media data validation schema
  static readonly SOCIAL_MEDIA_SCHEMA: ValidationSchema = {
    required: ["platform", "sentiment_score", "mention_count"],
    types: {
      platform: "string",
      sentiment_score: "number",
      mention_count: "number",
      engagement_rate: "number"
    },
    ranges: {
      sentiment_score: { min: -1, max: 1 },
      mention_count: { min: 0, max: 100000 },
      engagement_rate: { min: 0, max: 1 }
    }
  };

  // Validate data against schema
  static validateData(data: any, schema: ValidationSchema): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    try {
      // Check required fields
      if (schema.required) {
        for (const field of schema.required) {
          if (data[field] === undefined || data[field] === null) {
            errors.push(`Missing required field: ${field}`);
            score -= 20;
          }
        }
      }

      // Check data types
      if (schema.types) {
        for (const [field, expectedType] of Object.entries(schema.types)) {
          if (data[field] !== undefined && typeof data[field] !== expectedType) {
            errors.push(`Invalid type for ${field}: expected ${expectedType}, got ${typeof data[field]}`);
            score -= 10;
          }
        }
      }

      // Check ranges
      if (schema.ranges) {
        for (const [field, range] of Object.entries(schema.ranges)) {
          const value = data[field];
          if (typeof value === 'number') {
            if (range.min !== undefined && value < range.min) {
              errors.push(`${field} value ${value} is below minimum ${range.min}`);
              score -= 15;
            }
            if (range.max !== undefined && value > range.max) {
              errors.push(`${field} value ${value} is above maximum ${range.max}`);
              score -= 15;
            }
          }
        }
      }

      // Check patterns
      if (schema.patterns) {
        for (const [field, pattern] of Object.entries(schema.patterns)) {
          const value = data[field];
          if (typeof value === 'string' && !pattern.test(value)) {
            warnings.push(`${field} does not match expected pattern`);
            score -= 5;
          }
        }
      }

      // Check custom validations
      if (schema.custom) {
        for (const [field, validator] of Object.entries(schema.custom)) {
          try {
            if (!validator(data)) {
              errors.push(`Custom validation failed for ${field}`);
              score -= 10;
            }
          } catch (error) {
            warnings.push(`Custom validation error for ${field}: ${error}`);
            score -= 5;
          }
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        score: Math.max(0, score)
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [`Validation error: ${error}`],
        warnings: [],
        score: 0
      };
    }
  }

  // Batch validation
  static validateBatch(dataArray: any[], schema: ValidationSchema): {
    results: ValidationResult[];
    summary: {
      total: number;
      valid: number;
      invalid: number;
      average_score: number;
      common_errors: string[];
    };
  } {
    const results = dataArray.map(data => this.validateData(data, schema));
    const valid = results.filter(r => r.isValid).length;
    const invalid = results.length - valid;
    const averageScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
    
    // Find common errors
    const errorCounts = new Map<string, number>();
    results.forEach(result => {
      result.errors.forEach(error => {
        errorCounts.set(error, (errorCounts.get(error) || 0) + 1);
      });
    });
    
    const commonErrors = Array.from(errorCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([error]) => error);

    return {
      results,
      summary: {
        total: results.length,
        valid,
        invalid,
        average_score: averageScore,
        common_errors: commonErrors
      }
    };
  }

  // Data transformation utilities
  static transformRestaurantData(rawData: any): any {
    try {
      return {
        id: String(rawData.id || rawData._id || ''),
        name: String(rawData.name || '').trim(),
        latitude: parseFloat(rawData.latitude || rawData.lat || 0),
        longitude: parseFloat(rawData.longitude || rawData.lng || rawData.lon || 0),
        rating: parseFloat(rawData.rating || rawData.avg_rating || 0),
        price_range: parseInt(rawData.price_range || rawData.priceRange || 2),
        cuisine: this.normalizeCuisine(rawData.cuisine || rawData.category),
        address: String(rawData.address || '').trim(),
        phone: this.normalizePhone(rawData.phone),
        website: this.normalizeUrl(rawData.website),
        review_count: parseInt(rawData.review_count || rawData.reviews || 0),
        last_updated: new Date().toISOString()
      };
    } catch (error) {
      console.error("Data transformation error:", error);
      return null;
    }
  }

  static transformEconomicData(rawData: any): any {
    try {
      return {
        gdp_growth: parseFloat(rawData.gdp_growth || rawData.gdpGrowth || 0),
        inflation_rate: parseFloat(rawData.inflation_rate || rawData.inflation || 0),
        unemployment_rate: parseFloat(rawData.unemployment_rate || rawData.unemployment || 0),
        consumer_confidence: parseFloat(rawData.consumer_confidence || rawData.consumerConfidence || 50),
        tourism_index: parseFloat(rawData.tourism_index || rawData.tourismIndex || 100),
        food_price_index: parseFloat(rawData.food_price_index || rawData.foodPriceIndex || 100),
        restaurant_sector_growth: parseFloat(rawData.restaurant_sector_growth || rawData.restaurantGrowth || 0),
        last_updated: new Date().toISOString(),
        source: rawData.source || "transformed"
      };
    } catch (error) {
      console.error("Economic data transformation error:", error);
      return null;
    }
  }

  // Caching strategies
  static setCachedData<T>(
    key: string, 
    data: T, 
    ttl: number = 30 * 60 * 1000, // 30 minutes default
    source: string = "unknown"
  ): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      hits: 0,
      source
    });
  }

  static getCachedData<T>(key: string): T | null {
    this.cacheStats.total_requests++;
    
    const entry = this.cache.get(key);
    if (!entry) {
      this.cacheStats.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.cacheStats.misses++;
      return null;
    }

    // Update hit count and stats
    entry.hits++;
    this.cacheStats.hits++;
    
    return entry.data;
  }

  static getCacheStats(): CacheStats {
    const entries = Array.from(this.cache.values());
    const hitRate = this.cacheStats.total_requests > 0 
      ? this.cacheStats.hits / this.cacheStats.total_requests 
      : 0;
    
    const oldestEntry = entries.reduce((oldest, entry) => 
      entry.timestamp < oldest.timestamp ? entry : oldest, 
      entries[0] || { timestamp: Date.now() }
    );
    
    const mostAccessed = entries.reduce((most, entry) => 
      entry.hits > most.hits ? entry : most, 
      entries[0] || { hits: 0, source: "none" }
    );

    // Estimate memory usage (rough calculation)
    const memoryUsage = entries.reduce((total, entry) => {
      return total + JSON.stringify(entry.data).length;
    }, 0) / (1024 * 1024); // Convert to MB

    return {
      total_entries: this.cache.size,
      hit_rate: hitRate,
      miss_rate: 1 - hitRate,
      memory_usage_mb: memoryUsage,
      oldest_entry: new Date(oldestEntry.timestamp).toISOString(),
      most_accessed: mostAccessed.source
    };
  }

  static clearCache(): void {
    this.cache.clear();
    this.cacheStats = { hits: 0, misses: 0, total_requests: 0 };
  }

  static clearExpiredCache(): number {
    const now = Date.now();
    let cleared = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        cleared++;
      }
    }
    
    return cleared;
  }

  // Utility methods
  private static normalizeCuisine(cuisine: any): string {
    if (Array.isArray(cuisine)) {
      return cuisine.join(', ');
    }
    if (typeof cuisine === 'string') {
      return cuisine.trim();
    }
    return 'General';
  }

  private static normalizePhone(phone: any): string {
    if (typeof phone !== 'string') return '';
    return phone.replace(/[^\d\+\-\(\)\s]/g, '').trim();
  }

  private static normalizeUrl(url: any): string {
    if (typeof url !== 'string') return '';
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  }

  // Data quality scoring
  static calculateDataQualityScore(data: any, schema: ValidationSchema): {
    completeness: number;
    accuracy: number;
    consistency: number;
    overall: number;
  } {
    const validation = this.validateData(data, schema);
    
    // Completeness: percentage of required fields present
    const requiredFields = schema.required || [];
    const presentFields = requiredFields.filter(field => 
      data[field] !== undefined && data[field] !== null && data[field] !== ''
    );
    const completeness = requiredFields.length > 0 
      ? (presentFields.length / requiredFields.length) * 100 
      : 100;

    // Accuracy: based on validation score
    const accuracy = validation.score;

    // Consistency: check for logical consistency
    let consistency = 100;
    if (data.rating && data.review_count) {
      // High ratings with very few reviews might be inconsistent
      if (data.rating > 4.5 && data.review_count < 5) {
        consistency -= 20;
      }
    }
    if (data.latitude === 0 && data.longitude === 0) {
      consistency -= 30; // Likely invalid coordinates
    }

    const overall = (completeness + accuracy + consistency) / 3;

    return {
      completeness,
      accuracy,
      consistency,
      overall
    };
  }
}

// Export the service
export const DataValidation = DataValidationService;