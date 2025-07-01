"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Alert } from '../ui/alert'
import { bedrockService, type ConversationalQuery, type AIResponse, type Message } from '../../lib/bedrock-service'
import { 
  Send, 
  Mic, 
  MicOff, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Lightbulb,
  BarChart3,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react'

interface ConversationalAnalyticsProps {
  restaurantId: string;
  className?: string;
}

interface ChatMessage extends Message {
  id: string;
  isLoading?: boolean;
  response?: AIResponse;
}

export default function EnhancedConversationalAnalytics({ 
  restaurantId, 
  className = "" 
}: ConversationalAnalyticsProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // Sample restaurant context - replace with actual data
  const restaurantContext = {
    id: restaurantId,
    name: "Sample Restaurant",
    cuisine: ["Italian", "Mediterranean"],
    location: {
      lat: 40.7128,
      lng: -74.0060,
      address: "New York, NY"
    },
    priceRange: 3,
    operatingHours: {},
    metadata: {}
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initialize speech recognition if available
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const query: ConversationalQuery = {
        userInput: input.trim(),
        restaurantContext,
        conversationHistory: messages
      }

      const response = await bedrockService.processQuery(query)

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.narrative,
        timestamp: new Date(),
        response
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Failed to process query:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble processing your request right now. Please try again later or contact support if the issue persists.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleListening = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return <TrendingUp className="w-4 h-4" />
      case 'anomaly': return <AlertTriangle className="w-4 h-4" />
      case 'opportunity': return <Target className="w-4 h-4" />
      case 'risk': return <AlertTriangle className="w-4 h-4" />
      default: return <Lightbulb className="w-4 h-4" />
    }
  }

  const getChartIcon = (type: string) => {
    switch (type) {
      case 'line': return <LineChart className="w-4 h-4" />
      case 'bar': return <BarChart3 className="w-4 h-4" />
      case 'pie': return <PieChart className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  const suggestedQueries = [
    "What's driving my sales decline this month?",
    "Which location should I open next?",
    "How can I improve customer retention?",
    "Analyze my competitor's pricing strategy",
    "Generate a marketing strategy for lunch traffic"
  ]

  const handleSuggestedQuery = (query: string) => {
    setInput(query)
  }

  return (
    <div className={`flex flex-col h-full max-h-[800px] ${className}`}>
      {/* Header */}
      <div className="flex-none p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <h3 className="text-lg font-semibold text-gray-900">AI Restaurant Intelligence</h3>
        <p className="text-sm text-gray-600">Ask questions about your business in plain English</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">
              <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Start a conversation with your restaurant data</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 mb-3">Try asking:</p>
              {suggestedQueries.map((query, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="mx-1 mb-2"
                  onClick={() => handleSuggestedQuery(query)}
                >
                  {query}
                </Button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100'} rounded-lg p-3`}>
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>

              {/* AI Response Enhancements */}
              {message.role === 'assistant' && message.response && (
                <div className="mt-4 space-y-3">
                  {/* Insights */}
                  {message.response.insights.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Key Insights</h4>
                      <div className="space-y-2">
                        {message.response.insights.map((insight, index) => (
                          <Alert key={index} className="p-3">
                            <div className="flex items-start space-x-2">
                              {getInsightIcon(insight.type)}
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="text-sm font-medium">{insight.title}</span>
                                  <Badge variant={insight.priority === 'high' ? 'destructive' : insight.priority === 'medium' ? 'default' : 'secondary'}>
                                    {insight.priority}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-600">{insight.description}</p>
                              </div>
                            </div>
                          </Alert>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Items */}
                  {message.response.actionItems.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Recommended Actions</h4>
                      <div className="space-y-2">
                        {message.response.actionItems.map((action, index) => (
                          <Card key={index} className="p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{action.title}</span>
                              <Badge variant="outline">{action.implementationComplexity}</Badge>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">{action.description}</p>
                            <p className="text-xs text-blue-600">{action.estimatedImpact}</p>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Visualizations */}
                  {message.response.visualizations.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Suggested Charts</h4>
                      <div className="flex flex-wrap gap-2">
                        {message.response.visualizations.map((viz, index) => (
                          <Button key={index} variant="outline" size="sm" className="text-xs">
                            {getChartIcon(viz.type)}
                            <span className="ml-1">{viz.title}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Confidence Score */}
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>Confidence:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${message.response.confidence * 100}%` }}
                      />
                    </div>
                    <span>{Math.round(message.response.confidence * 100)}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-sm text-gray-600">Analyzing your data...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-none p-4 border-t bg-white">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your restaurant performance..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          {recognitionRef.current && (
            <Button
              type="button"
              variant={isListening ? "destructive" : "outline"}
              size="sm"
              onClick={toggleListening}
              disabled={isLoading}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          )}
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

// Speech recognition types are defined in types/speech.d.ts