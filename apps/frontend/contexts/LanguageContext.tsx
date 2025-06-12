"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'en' | 'th'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

interface LanguageProviderProps {
  children: React.ReactNode
}

// Translation data
const translations = {
  en: {
    navigation: {
      home: "Home",
      features: "Features",
      blog: "Blog",
      changelog: "Changelog",
      pricing: "Pricing"
    },
    landing: {
      hero: {
        badge: "🚀 Now in Beta",
        title: "Restaurant Analytics Platform",
        subtitle: "Discover profitable locations, track competitors, and optimize operations with geospatial analytics and AI-driven insights that boost your bottom line.",
        cta: "Get Started",
        watchDemo: "Watch Demo",
        stats: {
          restaurants: "Restaurants Analyzed",
          revenue: "Average Revenue Increase",
          uptime: "Platform Uptime"
        }
      },
      features: {
        badge: "✨ Powerful Features",
        title: "Everything You Need to Succeed",
        subtitle: "Comprehensive tools and insights to help your restaurant thrive in a competitive market.",
        geospatialAnalytics: {
          title: "Geospatial Analytics"
        },
        aiInsights: {
          title: "AI-Powered Insights"
        },
        businessIntelligence: {
          title: "Business Intelligence"
        }
      },
      testimonials: {
        badge: "💬 Customer Stories",
        title: "Trusted by Restaurant Owners",
        subtitle: "See how BiteBase is helping restaurants grow and succeed.",
        stories: []
      },
      pricing: {
        badge: "💰 Simple Pricing",
        title: "Choose Your Plan",
        subtitle: "Start free and scale as you grow. No hidden fees, cancel anytime."
      }
    }
  },
  th: {
    navigation: {
      home: "หน้าแรก",
      features: "คุณสมบัติ",
      blog: "บล็อก",
      changelog: "บันทึกการเปลี่ยนแปลง",
      pricing: "ราคา"
    },
    landing: {
      hero: {
        badge: "🚀 เวอร์ชันเบต้า",
        title: "แพลตฟอร์มข่าวกรองร้านอาหาร",
        subtitle: "ค้นหาสถานที่ที่มีกำไร ติดตามคู่แข่ง และเพิ่มประสิทธิภาพการดำเนินงานด้วยการวิเคราะห์เชิงพื้นที่และข้อมูลเชิงลึกที่ขับเคลื่อนด้วย AI",
        cta: "เริ่มต้นใช้งาน",
        watchDemo: "ดูการสาธิต",
        stats: {
          restaurants: "ร้านอาหารที่วิเคราะห์",
          revenue: "การเพิ่มขึ้นของรายได้เฉลี่ย",
          uptime: "เวลาทำงานของแพลตฟอร์ม"
        }
      },
      features: {
        badge: "✨ คุณสมบัติที่ทรงพลัง",
        title: "ทุกสิ่งที่คุณต้องการเพื่อความสำเร็จ",
        subtitle: "เครื่องมือและข้อมูลเชิงลึกที่ครอบคลุมเพื่อช่วยให้ร้านอาหารของคุณเจริญเติบโตในตลาดที่มีการแข่งขัน",
        geospatialAnalytics: {
          title: "การวิเคราะห์เชิงพื้นที่"
        },
        aiInsights: {
          title: "ข้อมูลเชิงลึกที่ขับเคลื่อนด้วย AI"
        },
        businessIntelligence: {
          title: "ธุรกิจอัจฉริยะ"
        }
      },
      testimonials: {
        badge: "💬 เรื่องราวลูกค้า",
        title: "ได้รับความไว้วางใจจากเจ้าของร้านอาหาร",
        subtitle: "ดูว่า BiteBase ช่วยให้ร้านอาหารเติบโตและประสบความสำเร็จอย่างไร",
        stories: []
      },
      pricing: {
        badge: "💰 ราคาที่เรียบง่าย",
        title: "เลือกแผนของคุณ",
        subtitle: "เริ่มต้นฟรีและขยายตามที่คุณเติบโต ไม่มีค่าธรรมเนียมซ่อนเร้น ยกเลิกได้ตลอดเวลา"
      }
    }
  }
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load saved language preference from localStorage
    const savedLanguage = localStorage.getItem('preferred-language') as Language
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'th')) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('preferred-language', lang)
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div>{children}</div>
  }

  const t = (key: string): any => {
    const keys = key.split('.')
    let value: any = translations[language]

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Fallback to English if key not found
        value = translations.en
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey]
          } else {
            return key // Return key if not found
          }
        }
        break
      }
    }

    return value || key
  }

  // Add raw method for getting arrays
  t.raw = (key: string): any => {
    return t(key)
  }

  const value: LanguageContextType = {
    language,
    setLanguage,
    t
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
