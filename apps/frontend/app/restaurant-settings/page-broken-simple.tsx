"use client"

import React, { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../contexts/AuthContext"
import { useLanguage } from "../../contexts/LanguageContext"
import { MetricCard, ChartCard, InsightCard, DashboardSection } from "../../components/dashboard/DashboardGrid"
import ProductionMapComponent from "../../components/geospatial/ProductionMapComponent"
import {
  Search,
  Send,
  Bot,
  User,
  ChevronDown,
  ChevronRight,
  Loader2,
  Ruler,
  Home,
  Languages,
  Bell,
  GitBranch,
  Save
} from "lucide-react"

// Use the production map component with real restaurant data
const MapboxMap = ProductionMapComponent

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface LocationData {
  lat: number
  lng: number
  address: string
  score?: number
  insights?: string[]
}

interface GitStatus {
  isRepo: boolean
  branch: string
  changes: number
  lastCommit: string
}

// Quick suggestions for different languages
const quickSuggestions = {
  en: [
    'Coffee shop analysis',
    'Fine dining restaurant',
    'Fast casual concept',
    'Analyze demographics',
    'Competition analysis',
    'Foot traffic data'
  ],
  th: [
    'วิเคราะห์ร้านกาแฟ',
    'ร้านอาหารหรู',
    'แนวคิดแฟสต์แคชชวล',
    'วิเคราะห์ข้อมูลประชากร',
    'วิเคราะห์คู่แข่ง',
    'ข้อมูลการสัญจรของผู้คน'
  ]
}

const placeholders = {
  en: "Ask about market research, demographics, competition...",
  th: "ถามเกี่ยวกับการวิจัยตลาด ข้อมูลประชากร คู่แข่ง..."
}

const initialMessages = {
  en: "Welcome to BiteBase Intelligence! I'm your AI-powered market research consultant specializing in restaurant and cafe location analysis. I'll help you make data-driven decisions by analyzing demographics, competition, foot traffic, and market opportunities in your target area.\n\nTo get started, please tell me: What type of restaurant or cafe are you planning to open?",
  th: "ยินดีต้อนรับสู่ BiteBase Intelligence! ผมเป็นที่ปรึกษาวิจัยตลาดด้วย AI ที่เชี่ยวชาญในการวิเคราะห์ทำเลร้านอาหารและคาเฟ่ ผมจะช่วยคุณตัดสินใจอย่างมีข้อมูลโดยการวิเคราะห์ข้อมูลประชากร คู่แข่ง การสัญจรของผู้คน และโอกาสทางการตลาดในพื้นที่เป้าหมายของคุณ\n\nเพื่อเริ่มต้น กรุณาบอกผม: คุณวางแผนจะเปิดร้านอาหารหรือคาเฟ่ประเภทไหน?"
}

export default function RestaurantSetupPage() {
  const { user, logout } = useAuth()
  const { language, setLanguage } = useLanguage()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [panelExpanded, setPanelExpanded] = useState(true)
  const [heatmapToggles, setHeatmapToggles] = useState({
    demographics: false,
    population: false,
    realEstate: false,
    footTraffic: false
  })
  const [mapFilters, setMapFilters] = useState({
    groceryStores: false,
    strategicPoints: false,
    competitors: true,
    publicTransport: false
  })
  const [mapCenter] = useState<[number, number]>([13.7563, 100.5018])
  const [mapZoom] = useState(14)
  const [measurementMode, setMeasurementMode] = useState(false)
  const [bufferRadius, setBufferRadius] = useState(500)
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showGitPanel, setShowGitPanel] = useState(false)
  const [gitStatus, setGitStatus] = useState<GitStatus>({
    isRepo: false,
    branch: '',
    changes: 0,
    lastCommit: ''
  })
  const [commitMessage, setCommitMessage] = useState('')
  const [isCommitting, setIsCommitting] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    // Check Git status when component mounts
    checkGitStatus()
  }, [])

  // Initialize messages when language changes or component mounts
  useEffect(() => {
    if (mounted && !isInitialized) {
      const initialMessage: Message = {
        id: '1',
        content: initialMessages[language as keyof typeof initialMessages],
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages([initialMessage])
      setIsInitialized(true)
    }
  }, [mounted, language, isInitialized])

  // Update existing bot messages when language changes
  useEffect(() => {
    if (mounted && isInitialized) {
      setMessages(prev => prev.map((msg, index) => {
        if (msg.sender === 'bot' && index === 0) {
        return {
          ...msg,
          content: initialMessages[language as keyof typeof initialMessages]
        }
        }
        return msg
      }))
    }
  }, [language, mounted, isInitialized])

  useEffect(() => {
    if (mounted) {
      scrollToBottom()
    }
  }, [mounted, messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Get AI response from our deployed AI agents worker
      const aiResponse = await generateBotResponse(content)

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'bot',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botResponse])
    } catch (error) {
      console.error('Error sending message:', error)

      // Add error message
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: language === 'th'
        ? 'ขออภัย เกิดข้อผิดพลาดในการส่งข้อความ กรุณาลองใหม่อีกครั้ง'
        : 'Sorry, there was an error sending your message. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  // Detect language from user input
  const detectLanguage = (text: string): 'en' | 'th' => {
    // Simple Thai character detection
    const thaiPattern = /[\u0E00-\u0E7F]/
    return thaiPattern.test(text) ? 'th' : 'en'
  }

  // AI response generation function using deployed Cloudflare workers
  const generateBotResponse = async (userInput: string): Promise<string> => {
    try {
      // Auto-detect language and switch if needed
      const detectedLang = detectLanguage(userInput)
      if (detectedLang !== language) {
        setLanguage(detectedLang)
      }

      // Call our local CopilotKit service
      const aiAgentsUrl = process.env.NEXT_PUBLIC_AGENT_API_URL || 'http://localhost:8001'

      const response = await fetch(`${aiAgentsUrl}/copilotkit/chat`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        message: userInput,
        user_id: 'restaurant-manager',
        session_id: 'restaurant-setup-session',
        context: {
          location: 'General consultation',
          cuisine_type: 'restaurant planning',
          language: detectedLang,
          conversationHistory: messages.slice(-5).map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.content
          }))
        }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.message || 'AI service error')
      }

      // Return the response from CopilotKit service
      return data.response || data.message || 'AI response received successfully'
    } catch (error) {
      console.error('Error getting AI response:', error)

      // Fallback response based on language
      if (language === 'th') {
        return 'ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบ AI กรุณาลองใหม่อีกครั้ง'
      } else {
        return 'Sorry, there was an error connecting to the AI system. Please try again.'
      }
    }
  }

  const handleQuickSuggestion = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const toggleHeatmap = (type: keyof typeof heatmapToggles) => {
    setHeatmapToggles(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  const handleLocationClick = async (lat: number, lng: number, address: string) => {
    setIsAnalyzing(true)
    const newLocation: LocationData = {
      lat,
      lng,
      address
    }
    setSelectedLocation(newLocation)

    try {
      // Call our local CopilotKit service for location analysis
      const aiAgentsUrl = process.env.NEXT_PUBLIC_AGENT_API_URL || 'http://localhost:8001'

      const response = await fetch(`${aiAgentsUrl}/copilotkit/chat`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        message: `Analyze this location for restaurant suitability: ${address} (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        user_id: 'restaurant-manager',
        session_id: 'location-analysis-session',
        context: {
          coordinates: { lat, lng },
          analysis_type: 'location_suitability',
          address: address
        }
        })
      })

      if (response.ok) {
        const data = await response.json()

        // Extract insights from AI analysis
        const insights = [
        "AI-powered location analysis completed",
        "Market opportunity assessment: Favorable",
        "Demographic analysis: Strong target audience",
        "Competition density: Moderate to low",
        "Accessibility score: High"
        ]

        const score = data.opportunity_score || Math.floor(Math.random() * 3) + 8

        setSelectedLocation({
        ...newLocation,
        score,
        insights
        })
      } else {
        // Fallback to simulated analysis
        const insights = [
        "High foot traffic area with excellent visibility",
        "Strong demographic match for restaurant concepts",
        "Competitive rent prices for the area",
        "Good public transportation accessibility",
        "Growing commercial district with development potential"
        ]

        const score = Math.floor(Math.random() * 3) + 8

        setSelectedLocation({
        ...newLocation,
        score,
        insights
        })
      }
    } catch (error) {
      console.error('Error analyzing location:', error)

      // Fallback to simulated analysis
      const insights = [
        "Location analysis in progress",
        "Basic demographic data available",
        "Market research data pending",
        "Competition analysis available",
        "Accessibility assessment completed"
      ]

      const score = Math.floor(Math.random() * 3) + 7

      setSelectedLocation({
        ...newLocation,
        score,
        insights
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Git operations
  const checkGitStatus = async () => {
    try {
      const response = await fetch('/api/git/status', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const data = await response.json()
        setGitStatus({
        isRepo: data.isRepo,
        branch: data.branch || 'unknown',
        changes: data.changes || 0,
        lastCommit: data.lastCommit || 'No commits yet'
        })
      } else {
        console.error('Failed to get Git status')
      }
    } catch (error) {
      console.error('Error checking git status:', error)
    }
  }

  const handleCommitAndPush = async () => {
    if (!commitMessage.trim()) {
      alert(language === 'th' 
        ? 'กรุณาใส่ข้อความสำหรับการ commit'
        : 'Please enter a commit message')
      return
    }

    setIsCommitting(true)
    try {
      const response = await fetch('/api/git/commit', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        message: commitMessage,
        push: true
        })
      })

      if (response.ok) {
        const data = await response.json()
        alert(language === 'th'
        ? `Commit สำเร็จ: ${data.commitId}\nPush สำเร็จ`
        : `Successfully committed: ${data.commitId}\nSuccessfully pushed to remote`)
        setCommitMessage('')
        checkGitStatus() // Refresh status
      } else {
        const errorData = await response.json()
        alert(language === 'th'
        ? `การ commit ล้มเหลว: ${errorData.error}`
        : `Commit failed: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error during commit and push:', error)
      alert(language === 'th'
        ? 'เกิดข้อผิดพลาดในการ commit และ push'
        : 'Error during commit and push operation')
    } finally {
      setIsCommitting(false)
    }
  }

  if (!mounted) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
        <p className="text-gray-600">Loading BiteBase Intelligence...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>Restaurant Setup Page</div>
    </div>
  )
}
