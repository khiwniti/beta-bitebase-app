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
    initialPrompt: "Hi! I'm your AI restaurant consultant. I'll help you set up your restaurant by gathering information about your concept, target market, and goals. What type of restaurant are you planning to open?",
    chatNaturally: "Chat naturally about your restaurant concept",
    readyForResearch: "Ready for market research!",
    readyForResearchDesc: "I have enough information to provide detailed market analysis and location recommendations.",
    suggestions: {
      cuisineType: [
        "Italian restaurant",
        "Thai cuisine",
        "Japanese sushi bar",
        "Mexican food"
      ],
      budget: [
        "Budget around $200K",
        "Investment of $500K",
        "Small budget under $100K",
        "Large budget over $1M"
      ],
      targetAudience: [
        "Targeting families",
        "Young professionals",
        "Tourists and visitors",
        "Local community"
      ],
      location: [
        "Downtown Bangkok",
        "Sukhumvit area",
        "Shopping mall location",
        "Residential neighborhood"
      ],
      diningStyle: [
        "Fast casual dining",
        "Fine dining experience",
        "Cafe style",
        "Food truck concept"
      ],
      additional: [
        "Tell me about your unique concept",
        "What makes you different?",
        "Any special features?",
        "Timeline for opening?"
      ]
    }
  },
  th: {
    initialPrompt: "สวัสดีครับ! ผมเป็นที่ปรึกษาร้านอาหาร AI ผมจะช่วยคุณตั้งร้านอาหารโดยรวบรวมข้อมูลเกี่ยวกับแนวคิด ตลาดเป้าหมาย และเป้าหมายของคุณ คุณวางแผนจะเปิดร้านอาหารประเภทไหนครับ?",
    chatNaturally: "คุยธรรมชาติเกี่ยวกับแนวคิดร้านอาหารของคุณ",
    readyForResearch: "พร้อมสำหรับการวิจัยตลาด!",
    readyForResearchDesc: "ผมมีข้อมูลเพียงพอที่จะให้การวิเคราะห์ตลาดและคำแนะนำทำเลที่ละเอียดแล้ว",
    suggestions: {
      cuisineType: [
        "ร้านอาหารอิตาเลียน",
        "อาหารไทย",
        "ซูชิบาร์ญี่ปุ่น",
        "อาหารเม็กซิกัน"
      ],
      budget: [
        "งบประมาณประมาณ 7 ล้านบาท",
        "การลงทุน 17 ล้านบาท",
        "งบประมาณน้อย ต่ำกว่า 3.5 ล้านบาท",
        "งบประมาณใหญ่ มากกว่า 35 ล้านบาท"
      ],
      targetAudience: [
        "เป้าหมายครอบครัว",
        "วัยทำงาน",
        "นักท่องเที่ยวและผู้มาเยือน",
        "ชุมชนท้องถิ่น"
      ],
      location: [
        "ใจกลางกรุงเทพ",
        "ย่านสุขุมวิท",
        "ทำเลในห้างสรรพสินค้า",
        "ย่านที่อยู่อาศัย"
      ],
      diningStyle: [
        "แฟสต์แคชชวล",
        "ไฟน์ไดนิ่ง",
        "สไตล์คาเฟ่",
        "แนวคิดฟู้ดทรัค"
      ],
      additional: [
        "เล่าให้ฟังเกี่ยวกับแนวคิดพิเศษของคุณ",
        "อะไรที่ทำให้คุณแตกต่าง?",
        "มีคุณสมบัติพิเศษอะไรไหม?",
        "กำหนดเวลาสำหรับการเปิด?"
      ]
    }
  }
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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
