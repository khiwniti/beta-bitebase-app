"use client"

import React, { useState } from 'react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { MessageCircle, X, Minimize2, Send } from 'lucide-react'

export function GlobalChatbot() {
  const [showChatbot, setShowChatbot] = useState(false)

  return (
    <>
      {/* Chatbot Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setShowChatbot(!showChatbot)}
          className={`
            relative rounded-full w-16 h-16 shadow-2xl border-2 backdrop-blur-sm transform hover:scale-110 transition-all duration-300
            ${showChatbot 
              ? 'bg-gray-100 hover:bg-gray-200 text-gray-600 border-gray-300' 
              : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white border-white/30'
            }
          `}
          size="lg"
        >
          {showChatbot ? (
            <X className="h-6 w-6" />
          ) : (
            <div className="relative flex items-center justify-center">
              <MessageCircle className="h-7 w-7" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border border-white"></div>
            </div>
          )}
        </Button>
      </div>

      {/* Chatbot Window */}
      {showChatbot && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200/50 z-40 overflow-hidden animate-in slide-in-from-bottom-4 backdrop-blur-sm">
          {/* Chatbot Header */}
          <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 rounded-full p-2 backdrop-blur-sm">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-white">BiteBase AI Assistant</h3>
                <p className="text-xs text-white/80 flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  Online • Ready to help with reports
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowChatbot(false)}
              className="text-white hover:bg-white/20 rounded-full"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 space-y-4 h-80 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
            {/* Welcome Message */}
            <div className="flex justify-start">
              <div className="max-w-xs px-4 py-3 rounded-2xl bg-white border border-gray-200/50 text-gray-800 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <MessageCircle className="h-3 w-3 text-indigo-600" />
                  <span className="text-xs font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">BiteBase AI</span>
                </div>
                <p className="text-sm">👋 Hello! I'm your BiteBase AI assistant. I can help you with:</p>
                <ul className="text-xs mt-2 space-y-1 text-gray-600">
                  <li>• Creating and managing reports</li>
                  <li>• Analyzing business data</li>
                  <li>• Understanding report templates</li>
                  <li>• Exporting and sharing reports</li>
                </ul>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  // Scroll to create report button if on reports page
                  const createBtn = document.querySelector('[data-testid="create-report-btn"]');
                  if (createBtn) {
                    createBtn.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    // Navigate to reports page
                    window.location.href = '/reports';
                  }
                }}
                className="text-xs bg-gradient-to-r from-indigo-100 to-purple-100 hover:from-indigo-200 hover:to-purple-200 px-3 py-2 rounded-full text-indigo-700 transition-all duration-200 border border-indigo-200/50"
              >
                📊 Create New Report
              </button>
              <button
                onClick={() => {
                  // Show template info
                  alert('We have 5 templates: Sales Analytics, Customer Insights, Inventory Management, Financial Performance, and Operational Performance.');
                }}
                className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 px-3 py-2 rounded-full text-purple-700 transition-all duration-200 border border-purple-200/50"
              >
                📋 View Templates
              </button>
              <button
                onClick={() => {
                  // Show export info
                  alert('You can export any report to PDF by clicking the Export button on each report card.');
                }}
                className="text-xs bg-gradient-to-r from-pink-100 to-indigo-100 hover:from-pink-200 hover:to-indigo-200 px-3 py-2 rounded-full text-pink-700 transition-all duration-200 border border-pink-200/50"
              >
                📤 Export Help
              </button>
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200/50 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Ask me about reports, analytics, or business insights..."
                className="flex-1 border-gray-300/50 focus:border-indigo-500 rounded-xl bg-white/80 backdrop-blur-sm"
              />
              <Button
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl shadow-lg"
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              Powered by <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-medium">BiteBase AI</span> • Enterprise Intelligence Platform
            </div>
          </div>
        </div>
      )}
    </>
  )
}