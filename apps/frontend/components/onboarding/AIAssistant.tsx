"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@bitebase/ui"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitebase/ui"
import { Input } from "@bitebase/ui"
import { Bot, Send, User, Sparkles, MessageSquare, CheckCircle, Target, TrendingUp } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  analysis?: RestaurantAnalysis
}

interface RestaurantData {
  restaurantName?: string
  cuisineType?: string
  concept?: string
  budget?: string
  targetAudience?: string
  location?: string
  diningStyle?: string
  priceRange?: string
  capacity?: string
  specialFeatures?: string[]
  goals?: string[]
  timeline?: string
  experience?: string
  marketingStrategy?: string
  uniqueSellingPoint?: string
  operatingHours?: string
  staffSize?: string
  additionalRequirements?: string[]
}

interface RestaurantAnalysis {
  marketOpportunity?: number
  competitionLevel?: string
  recommendations?: string[]
  riskFactors?: string[]
  successProbability?: number
}

interface AIAssistantProps {
  onDataExtracted?: (data: any) => void
  initialPrompt?: string
  className?: string
}

export function AIAssistant({ onDataExtracted, initialPrompt, className }: AIAssistantProps) {
  const { t, language } = useLanguage()

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: initialPrompt || t('initialPrompt'),
      timestamp: new Date()
    }
  ])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [restaurantData, setRestaurantData] = useState<RestaurantData>({})
  const [dataCompleteness, setDataCompleteness] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Essential data fields for initial market research
  const essentialFields = [
    'cuisineType', 'budget', 'targetAudience', 'location', 'concept'
  ]

  // All possible data fields for comprehensive analysis
  const allFields = [
    'restaurantName', 'cuisineType', 'concept', 'budget', 'targetAudience',
    'location', 'diningStyle', 'priceRange', 'capacity', 'timeline',
    'experience', 'uniqueSellingPoint'
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Calculate data completeness
    const filledEssentialFields = essentialFields.filter(field => restaurantData[field as keyof RestaurantData])
    const completeness = (filledEssentialFields.length / essentialFields.length) * 100
    setDataCompleteness(completeness)

    // Trigger callback when data changes
    if (onDataExtracted) {
      onDataExtracted({
        ...restaurantData,
        dataCompleteness: completeness,
        isEssentialComplete: completeness === 100
      })
    }
  }, [restaurantData, onDataExtracted])

  const extractDataFromConversation = (userInput: string): Partial<RestaurantData> => {
    const input = userInput.toLowerCase()
    const extractedData: Partial<RestaurantData> = {}

    // Extract restaurant name
    const namePatterns = [
      /(?:restaurant|place|business|establishment)?\s*(?:name|called|named)\s+(?:is\s+)?["']?([^"'.,!?]+)["']?/i,
      /(?:i'm|we're)\s+(?:opening|starting|planning)\s+["']?([^"'.,!?]+)["']?/i,
      /(?:it's|its)\s+(?:called|named)\s+["']?([^"'.,!?]+)["']?/i
    ]
    for (const pattern of namePatterns) {
      const match = userInput.match(pattern)
      if (match && match[1] && match[1].trim().length > 2) {
        extractedData.restaurantName = match[1].trim()
        break
      }
    }

    // Extract cuisine type with more comprehensive patterns
    const cuisineMap = {
      'italian': ['italian', 'pizza', 'pasta', 'mediterranean'],
      'thai': ['thai', 'pad thai', 'tom yum', 'green curry'],
      'chinese': ['chinese', 'dim sum', 'szechuan', 'cantonese'],
      'japanese': ['japanese', 'sushi', 'ramen', 'tempura', 'yakitori'],
      'korean': ['korean', 'kimchi', 'bulgogi', 'bibimbap'],
      'indian': ['indian', 'curry', 'tandoori', 'biryani', 'naan'],
      'mexican': ['mexican', 'tacos', 'burritos', 'quesadillas', 'enchiladas'],
      'american': ['american', 'burger', 'bbq', 'steakhouse', 'diner'],
      'french': ['french', 'bistro', 'brasserie', 'croissant'],
      'vietnamese': ['vietnamese', 'pho', 'banh mi', 'spring rolls'],
      'fusion': ['fusion', 'modern', 'contemporary', 'eclectic']
    }

    for (const [cuisine, keywords] of Object.entries(cuisineMap)) {
      if (keywords.some(keyword => input.includes(keyword))) {
        extractedData.cuisineType = cuisine.charAt(0).toUpperCase() + cuisine.slice(1)
        break
      }
    }

    // Extract budget with more patterns
    const budgetPatterns = [
      /budget\s+(?:is\s+|of\s+)?(?:around\s+|about\s+)?\$?(\d+(?:,\d{3})*(?:k|K|thousand|million|M)?)/i,
      /\$(\d+(?:,\d{3})*(?:k|K|thousand|million|M)?)\s+budget/i,
      /(?:have|got|with)\s+\$?(\d+(?:,\d{3})*(?:k|K|thousand|million|M)?)/i,
      /invest(?:ing|ment)?\s+\$?(\d+(?:,\d{3})*(?:k|K|thousand|million|M)?)/i
    ]

    for (const pattern of budgetPatterns) {
      const match = userInput.match(pattern)
      if (match && match[1]) {
        extractedData.budget = `$${match[1]}`
        break
      }
    }

    // Extract target audience
    const audienceMap = {
      'families': ['family', 'families', 'kids', 'children', 'parents'],
      'young professionals': ['professional', 'business', 'office', 'corporate', 'working'],
      'students': ['student', 'college', 'university', 'young people'],
      'tourists': ['tourist', 'visitor', 'traveler', 'sightseeing'],
      'locals': ['local', 'neighborhood', 'community', 'resident'],
      'fine dining': ['upscale', 'fine dining', 'luxury', 'high-end', 'sophisticated'],
      'casual diners': ['casual', 'relaxed', 'informal', 'everyday']
    }

    for (const [audience, keywords] of Object.entries(audienceMap)) {
      if (keywords.some(keyword => input.includes(keyword))) {
        extractedData.targetAudience = audience.charAt(0).toUpperCase() + audience.slice(1)
        break
      }
    }

    // Extract location
    const locationPatterns = [
      /(?:in|at|located|location)\s+([^.,!?]+?)(?:\s+(?:area|district|neighborhood|zone))?/i,
      /(?:downtown|city center|suburb|mall|shopping center|business district)/i
    ]

    for (const pattern of locationPatterns) {
      const match = userInput.match(pattern)
      if (match && match[1] && match[1].trim().length > 2) {
        extractedData.location = match[1].trim()
        break
      }
    }

    // Extract dining style
    const styleMap = {
      'fast casual': ['fast casual', 'quick service', 'counter service'],
      'fine dining': ['fine dining', 'upscale', 'formal', 'white tablecloth'],
      'casual dining': ['casual', 'family style', 'sit down'],
      'fast food': ['fast food', 'drive through', 'takeaway'],
      'cafe': ['cafe', 'coffee shop', 'bistro'],
      'food truck': ['food truck', 'mobile', 'street food']
    }

    for (const [style, keywords] of Object.entries(styleMap)) {
      if (keywords.some(keyword => input.includes(keyword))) {
        extractedData.diningStyle = style.charAt(0).toUpperCase() + style.slice(1)
        break
      }
    }

    // Extract capacity
    const capacityMatch = userInput.match(/(?:seat|capacity|accommodate)\s+(?:about\s+|around\s+)?(\d+)/i)
    if (capacityMatch) {
      extractedData.capacity = `${capacityMatch[1]} seats`
    }

    // Extract timeline
    const timelinePatterns = [
      /(?:open|opening|launch|start)\s+(?:in\s+)?(\d+\s+(?:months?|weeks?|years?))/i,
      /(?:within|in)\s+(\d+\s+(?:months?|weeks?|years?))/i
    ]

    for (const pattern of timelinePatterns) {
      const match = userInput.match(pattern)
      if (match && match[1]) {
        extractedData.timeline = match[1]
        break
      }
    }

    return extractedData
  }

  const generateAIResponse = (userInput: string, extractedData: Partial<RestaurantData>): { content: string, analysis?: RestaurantAnalysis } => {
    const input = userInput.toLowerCase()
    const currentData = { ...restaurantData, ...extractedData }

    // Determine what information is still needed
    const missingEssential = essentialFields.filter(field => !currentData[field as keyof RestaurantData])
    const missingOptional = allFields.filter(field =>
      !essentialFields.includes(field) && !currentData[field as keyof RestaurantData]
    )

    // Check if we have enough for initial market research
    const canDoInitialAnalysis = missingEssential.length === 0
    const hasComprehensiveData = missingOptional.length <= 2

    // Generate contextual responses based on extracted data and conversation flow
    let response = ""
    let analysis: RestaurantAnalysis | undefined

    if (Object.keys(extractedData).length > 0) {
      // Acknowledge what was extracted with natural language
      const extractedItems = Object.entries(extractedData)
        .map(([key, value]) => {
          if (language === 'th') {
            switch (key) {
              case 'cuisineType': return `อาหาร${value}`
              case 'restaurantName': return `ชื่อร้าน "${value}"`
              case 'budget': return `งบประมาณ ${value}`
              case 'targetAudience': return `กลุ่มลูกค้าเป้าหมาย: ${value}`
              case 'location': return `ทำเล: ${value}`
              case 'diningStyle': return `สไตล์${value}`
              case 'capacity': return `ความจุ: ${value}`
              case 'timeline': return `ระยะเวลา: ${value}`
              default: return `${key}: ${value}`
            }
          } else {
            switch (key) {
              case 'cuisineType': return `${value} cuisine`
              case 'restaurantName': return `restaurant name "${value}"`
              case 'budget': return `budget of ${value}`
              case 'targetAudience': return `target audience: ${value}`
              case 'location': return `location: ${value}`
              case 'diningStyle': return `${value} style`
              case 'capacity': return `capacity: ${value}`
              case 'timeline': return `timeline: ${value}`
              default: return `${key}: ${value}`
            }
          }
        })
        .join(', ')

      response = language === 'th'
        ? `✅ เข้าใจแล้วครับ! ผมจดไว้แล้ว: ${extractedItems} `
        : `✅ Got it! I've noted: ${extractedItems}. `
    }

    // Determine next question based on missing essential data
    if (missingEssential.length > 0) {
      const nextField = missingEssential[0]

      if (language === 'th') {
        switch (nextField) {
          case 'cuisineType':
            response += "คุณจะเสิร์ฟอาหารประเภทไหนครับ? (เช่น อาหารไทย อิตาเลียน เม็กซิกัน ฟิวชั่น หรืออื่นๆ)"
            break
          case 'budget':
            response += "งบประมาณโดยประมาณสำหรับร้านนี้เท่าไหร่ครับ? รวมค่าใช้จ่ายเริ่มต้น อุปกรณ์ และเงินทุนหมุนเวียนเริ่มต้นด้วยนะครับ"
            break
          case 'targetAudience':
            response += "กลุ่มลูกค้าเป้าหมายของคุณคือใครครับ? (เช่น ครอบครัว วัยทำงาน นักท่องเที่ยว คนท้องถิ่น หรือผู้ที่ชื่นชอบไฟน์ไดนิ่ง)"
            break
          case 'location':
            response += "คุณวางแผนจะเปิดที่ไหนครับ? ช่วยบอกเมือง เขต หรือย่านที่คุณกำลังพิจารณาหน่อยครับ"
            break
          case 'concept':
            response += "ช่วยอธิบายแนวคิดร้านอาหารของคุณหน่อยครับ? อะไรที่ทำให้ร้านคุณพิเศษหรือแตกต่างจากที่อื่น?"
            break
        }
      } else {
        switch (nextField) {
          case 'cuisineType':
            response += "What type of cuisine will you be serving? (e.g., Thai, Italian, Mexican, fusion, etc.)"
            break
          case 'budget':
            response += "What's your estimated budget for this restaurant? Please include startup costs, equipment, and initial operating capital."
            break
          case 'targetAudience':
            response += "Who is your target customer? (e.g., families, young professionals, tourists, locals, fine dining enthusiasts)"
            break
          case 'location':
            response += "Where are you planning to open? Please specify the city, district, or general area you're considering."
            break
          case 'concept':
            response += "Can you describe your restaurant concept? What makes it unique or special?"
            break
        }
      }
    } else if (canDoInitialAnalysis && !hasComprehensiveData) {
      // We have essential data, now gather additional details
      if (language === 'th') {
        if (!currentData.restaurantName) {
          response += "คุณจะตั้งชื่อร้านว่าอะไรครับ?"
        } else if (!currentData.diningStyle) {
          response += "คุณวางแผนจะทำสไตล์การรับประทานแบบไหนครับ? (แฟสต์แคชชวล ไฟน์ไดนิ่ง แคชชวลไดนิ่ง คาเฟ่ หรืออื่นๆ)"
        } else if (!currentData.capacity) {
          response += "คุณวางแผนจะรองรับลูกค้ากี่คนครับ?"
        } else if (!currentData.timeline) {
          response += "คุณวางแผนจะเปิดเมื่อไหร่ครับ?"
        } else if (!currentData.uniqueSellingPoint) {
          response += "จุดขายหลักหรือข้อได้เปรียบในการแข่งขันของร้านคุณคืออะไรครับ?"
        } else {
          response += "มีอะไรพิเศษเกี่ยวกับแนวคิดร้านอาหารของคุณที่อยากให้ผมรู้เพิ่มเติมไหมครับ?"
        }
      } else {
        if (!currentData.restaurantName) {
          response += "What will you name your restaurant?"
        } else if (!currentData.diningStyle) {
          response += "What dining style are you planning? (fast casual, fine dining, casual dining, cafe, etc.)"
        } else if (!currentData.capacity) {
          response += "How many customers do you plan to seat?"
        } else if (!currentData.timeline) {
          response += "When are you planning to open?"
        } else if (!currentData.uniqueSellingPoint) {
          response += "What will be your restaurant's unique selling point or competitive advantage?"
        } else {
          response += "Is there anything else special about your restaurant concept you'd like me to know?"
        }
      }
    } else if (canDoInitialAnalysis) {
      // Generate market analysis
      analysis = generateMarketAnalysis(currentData)

      if (language === 'th') {
        response += `\n\n🎯 **การวิเคราะห์ตลาดเสร็จสิ้น**\n\n`
        response += `**คะแนนโอกาสทางการตลาด: ${analysis.marketOpportunity}/10**\n`
        response += `**ระดับการแข่งขัน: ${analysis.competitionLevel}**\n`
        response += `**ความน่าจะเป็นของความสำเร็จ: ${analysis.successProbability}%**\n\n`

        if (analysis.recommendations && analysis.recommendations.length > 0) {
          response += `**คำแนะนำสำคัญ:**\n`
          analysis.recommendations.forEach((rec, index) => {
            response += `${index + 1}. ${rec}\n`
          })
        }

        if (analysis.riskFactors && analysis.riskFactors.length > 0) {
          response += `\n**ปัจจัยเสี่ยงที่ควรพิจารณา:**\n`
          analysis.riskFactors.forEach((risk, index) => {
            response += `⚠️ ${risk}\n`
          })
        }

        response += `\n💡 คุณอยากให้ผมช่วยหาทำเลที่สมบูรณ์แบบ หรือมีรายละเอียดเพิ่มเติมเกี่ยวกับแนวคิดของคุณที่อยากแชร์ครับ?`
      } else {
        response += `\n\n🎯 **MARKET ANALYSIS COMPLETE**\n\n`
        response += `**Market Opportunity Score: ${analysis.marketOpportunity}/10**\n`
        response += `**Competition Level: ${analysis.competitionLevel}**\n`
        response += `**Success Probability: ${analysis.successProbability}%**\n\n`

        if (analysis.recommendations && analysis.recommendations.length > 0) {
          response += `**Key Recommendations:**\n`
          analysis.recommendations.forEach((rec, index) => {
            response += `${index + 1}. ${rec}\n`
          })
        }

        if (analysis.riskFactors && analysis.riskFactors.length > 0) {
          response += `\n**Risk Factors to Consider:**\n`
          analysis.riskFactors.forEach((risk, index) => {
            response += `⚠️ ${risk}\n`
          })
        }

        response += `\n💡 Would you like me to help you find the perfect location, or do you have more details about your concept to share?`
      }
    }

    // Add encouraging context based on data quality
    if (canDoInitialAnalysis && analysis && analysis.marketOpportunity) {
      if (language === 'th') {
        if (analysis.marketOpportunity >= 8) {
          response += `\n\n🌟 แนวคิดของคุณมีศักยภาพทางการตลาดที่ยอดเยี่ยม! การผสมผสานระหว่างอาหาร${currentData.cuisineType} ที่เป้าหมายคือ${currentData.targetAudience} ใน${currentData.location} มีพื้นฐานที่แข็งแกร่งมากครับ`
        } else if (analysis.marketOpportunity >= 6) {
          response += `\n\n👍 แนวคิดของคุณมีศักยภาพทางการตลาดที่ดี และมีบางจุดที่สามารถปรับปรุงให้ดีขึ้นได้ครับ`
        }
      } else {
        if (analysis.marketOpportunity >= 8) {
          response += `\n\n🌟 Your concept shows excellent market potential! The combination of ${currentData.cuisineType} cuisine targeting ${currentData.targetAudience} in ${currentData.location} has strong fundamentals.`
        } else if (analysis.marketOpportunity >= 6) {
          response += `\n\n👍 Your concept has good market potential with some areas for optimization.`
        }
      }
    }

    return { content: response, analysis }
  }

  const generateMarketAnalysis = (data: Partial<RestaurantData>): RestaurantAnalysis => {
    // Simulate intelligent market analysis based on restaurant data
    let opportunityScore = 5
    let competitionLevel = "Medium"
    const recommendations: string[] = []
    const riskFactors: string[] = []

    // Analyze cuisine type popularity in Bangkok
    const bangkokCuisineScores: { [key: string]: number } = {
      'thai': 9, 'japanese': 8, 'korean': 8, 'italian': 7, 'chinese': 7,
      'american': 6, 'indian': 7, 'mexican': 8, 'vietnamese': 7, 'fusion': 9
    }

    if (data.cuisineType) {
      const cuisineScore = bangkokCuisineScores[data.cuisineType.toLowerCase()] || 6
      opportunityScore += (cuisineScore - 5) * 0.5

      if (cuisineScore >= 8) {
        recommendations.push(`${data.cuisineType} cuisine is highly popular in Bangkok market`)
      } else if (cuisineScore <= 5) {
        riskFactors.push(`${data.cuisineType} cuisine has limited market demand`)
      }
    }

    // Analyze budget adequacy
    if (data.budget) {
      const budgetNum = parseInt(data.budget.replace(/[^\d]/g, ''))
      if (budgetNum >= 500) {
        opportunityScore += 1
        recommendations.push("Strong budget allows for premium location and quality equipment")
      } else if (budgetNum >= 200) {
        recommendations.push("Moderate budget suitable for mid-tier locations")
      } else {
        riskFactors.push("Limited budget may restrict location and equipment options")
        opportunityScore -= 0.5
      }
    }

    // Analyze target audience
    if (data.targetAudience) {
      const audienceScores: { [key: string]: number } = {
        'young professionals': 8, 'tourists': 7, 'families': 7,
        'students': 6, 'locals': 8, 'fine dining': 6
      }

      const audienceScore = audienceScores[data.targetAudience.toLowerCase()] || 6
      opportunityScore += (audienceScore - 6) * 0.3

      if (audienceScore >= 7) {
        recommendations.push(`${data.targetAudience} segment shows strong spending power in Bangkok`)
      }
    }

    // Location analysis
    if (data.location && data.location.toLowerCase().includes('bangkok')) {
      opportunityScore += 1
      recommendations.push("Bangkok offers excellent market opportunities for restaurants")

      if (data.location.toLowerCase().includes('sukhumvit')) {
        opportunityScore += 0.5
        recommendations.push("Sukhumvit area has high expat and tourist traffic")
      } else if (data.location.toLowerCase().includes('silom')) {
        recommendations.push("Silom area excellent for business lunch market")
      }
    }

    // Determine competition level
    if (opportunityScore >= 8) {
      competitionLevel = "High"
      riskFactors.push("High competition requires strong differentiation")
    } else if (opportunityScore <= 6) {
      competitionLevel = "Low"
      recommendations.push("Lower competition provides market entry opportunities")
    }

    // Calculate success probability
    const successProbability = Math.min(95, Math.max(45, Math.round(opportunityScore * 10 + Math.random() * 10)))

    // Add general recommendations
    recommendations.push("Focus on unique menu items and excellent service")
    recommendations.push("Leverage social media marketing for Bangkok market")
    recommendations.push("Consider delivery partnerships (GrabFood, Foodpanda)")

    return {
      marketOpportunity: Math.round(opportunityScore * 10) / 10,
      competitionLevel,
      recommendations,
      riskFactors,
      successProbability
    }
  }

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const userInput = currentMessage
    setCurrentMessage("")
    setIsTyping(true)

    // Simulate AI processing
    setTimeout(() => {
      // Extract data from user input
      const extractedData = extractDataFromConversation(userInput)

      // Update restaurant data
      const updatedData = { ...restaurantData, ...extractedData }
      setRestaurantData(updatedData)

      // Generate AI response
      const { content: aiResponse, analysis } = generateAIResponse(userInput, extractedData)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        analysis
      }

      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500) // Slightly longer delay for more realistic AI processing
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className={`border-0 shadow-xl ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-gray-900">
          <div className="flex items-center">
            <Bot className="w-5 h-5 mr-2 text-indigo-600" />
            {language === 'th' ? 'ที่ปรึกษาร้านอาหาร AI' : 'AI Restaurant Consultant'}
            <Sparkles className="w-4 h-4 ml-2 text-yellow-500" />
          </div>
          <div className="flex items-center space-x-2">
            {dataCompleteness > 0 && (
              <div className="flex items-center text-sm text-gray-600">
                <Target className="w-4 h-4 mr-1" />
                {Math.round(dataCompleteness)}% {language === 'th' ? 'เสร็จสิ้น' : 'Complete'}
              </div>
            )}
            {dataCompleteness === 100 && (
              <CheckCircle className="w-5 h-5 text-green-600" />
            )}
          </div>
        </CardTitle>
        <CardDescription>
          {t('chatNaturally')}
        </CardDescription>
        {dataCompleteness > 0 && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-indigo-500 to-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${dataCompleteness}%` }}
              />
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto mb-4 space-y-4 p-4 bg-gray-50 rounded-lg">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md`}>
                {message.type === 'ai' && (
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-indigo-600" />
                  </div>
                )}
                <div
                  className={`px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white border border-gray-200 shadow-sm'
                  }`}
                >
                  <div className="text-sm whitespace-pre-line">{message.content}</div>

                  {/* Show market analysis if available */}
                  {message.analysis && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                      <div className="flex items-center mb-2">
                        <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                        <span className="text-sm font-semibold text-green-800">Market Analysis</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white p-2 rounded">
                          <span className="text-gray-600">Opportunity:</span>
                          <span className="font-bold text-green-600 ml-1">{message.analysis.marketOpportunity}/10</span>
                        </div>
                        <div className="bg-white p-2 rounded">
                          <span className="text-gray-600">Success Rate:</span>
                          <span className="font-bold text-blue-600 ml-1">{message.analysis.successProbability}%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-indigo-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {message.type === 'user' && (
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2 max-w-xs lg:max-w-md">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="bg-white border border-gray-200 shadow-sm px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="flex space-x-2">
          <Input
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={handleKeyDown}
            className="flex-1"
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!currentMessage.trim() || isTyping}
            className="bg-indigo-600 hover:bg-indigo-700 transition-all duration-300"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Smart Quick Suggestions */}
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {(() => {
              // Generate contextual suggestions based on current data
              let suggestions: string[] = []

              if (!restaurantData.cuisineType) {
                suggestions = ['Italian Restaurant', 'Thai Cuisine', 'Japanese Sushi', 'American Diner']
              } else if (!restaurantData.budget) {
                suggestions = ['$50,000 - $100,000', '$100,000 - $200,000', '$200,000 - $500,000', '$500,000+']
              } else if (!restaurantData.targetAudience) {
                suggestions = ['Young Professionals', 'Families', 'Students', 'Tourists']
              } else if (!restaurantData.location) {
                suggestions = ['Downtown Area', 'Shopping Mall', 'Residential Area', 'Business District']
              } else if (!restaurantData.diningStyle) {
                suggestions = ['Fast Casual', 'Fine Dining', 'Quick Service', 'Cafe Style']
              } else {
                suggestions = ['Market Analysis', 'Competition Research', 'Location Scouting', 'Financial Planning']
              }

              return suggestions.slice(0, 4).map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  className="text-xs border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200"
                  onClick={() => setCurrentMessage(suggestion)}
                >
                  {suggestion}
                </Button>
              ))
            })()}
          </div>

          {dataCompleteness === 100 && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center text-sm text-green-800">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="font-medium">{t('readyForResearch')}</span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                {t('readyForResearchDesc')}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
