'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import ImprovedBiteBaseAI from './ImprovedBiteBaseAI';
import { 
  MessageCircle, 
  X, 
  Languages,
  Minimize2,
  Maximize2,
  Settings,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Sparkles,
  Bot
} from 'lucide-react';

interface ChatbotProps {
  className?: string;
}

const FloatingChatbot: React.FC<ChatbotProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'th'>('en');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const translations = {
    en: {
      title: 'BiteBase Assistant',
      status: 'Online - Ready to help',
      statusTyping: 'AI is typing...',
      placeholder: 'Ask about sales, customers, or menu performance...',
      inputPlaceholder: 'Ask me anything about your restaurant business...',
      minimize: 'Minimize',
      expand: 'Expand',
      settings: 'Settings',
      language: 'Language',
      sound: 'Sound',
      theme: 'Theme'
    },
    th: {
      title: 'ผู้ช่วย BiteBase',
      status: 'ออนไลน์ - พร้อมช่วยเหลือ',
      statusTyping: 'AI กำลังพิมพ์...',
      placeholder: 'สอบถามเกี่ยวกับยอดขาย, ลูกค้า, หรือประสิทธิภาพเมนู...',
      inputPlaceholder: 'ถามฉันเกี่ยวกับธุรกิจร้านอาหารของคุณ...',
      minimize: 'ย่อเล็กสุด',
      expand: 'ขยาย',
      settings: 'การตั้งค่า',
      language: 'ภาษา',
      sound: 'เสียง',
      theme: 'ธีม'
    }
  };

  const t = translations[currentLanguage];

  // Load preferences from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('chatbot-language') as 'en' | 'th';
      const savedSound = localStorage.getItem('chatbot-sound');
      const savedTheme = localStorage.getItem('chatbot-theme');
      
      if (savedLanguage) setCurrentLanguage(savedLanguage);
      if (savedSound !== null) setSoundEnabled(savedSound === 'true');
      if (savedTheme !== null) setDarkMode(savedTheme === 'dark');
    }
  }, []);

  // Save preferences to localStorage
  const savePreference = (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  };

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'th' : 'en';
    setCurrentLanguage(newLanguage);
    savePreference('chatbot-language', newLanguage);
  };

  const toggleSound = () => {
    const newSound = !soundEnabled;
    setSoundEnabled(newSound);
    savePreference('chatbot-sound', newSound.toString());
  };

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    savePreference('chatbot-theme', newTheme ? 'dark' : 'light');
  };

  const handleToggleOpen = () => {
    setIsOpen(!isOpen);
    setHasNewMessage(false);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Simulate typing indicator
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Get chat window dimensions
  const getChatDimensions = () => {
    if (isExpanded) {
      return {
        width: 'w-[500px]',
        height: 'h-[700px]',
        bottom: 'bottom-6',
        right: 'right-6'
      };
    }
    if (isMinimized) {
      return {
        width: 'w-80',
        height: 'h-16',
        bottom: 'bottom-24',
        right: 'right-6'
      };
    }
    return {
      width: 'w-96',
      height: 'h-[600px]',
      bottom: 'bottom-24',
      right: 'right-6'
    };
  };

  const dimensions = getChatDimensions();

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleToggleOpen}
          className={`relative h-14 w-14 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 ${className} ${
            isOpen ? 'rotate-180' : ''
          }`}
          size="lg"
        >
          {isOpen ? (
            <X className="h-6 w-6 transition-transform duration-300" />
          ) : (
            <>
              <MessageCircle className="h-6 w-6 transition-transform duration-300" />
              {hasNewMessage && (
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full animate-pulse">
                  <div className="absolute inset-0 bg-red-500 rounded-full animate-ping"></div>
                </div>
              )}
            </>
          )}
        </Button>
        
        {/* Sparkle animation when AI is active */}
        {isTyping && (
          <div className="absolute -top-2 -left-2 text-yellow-400 animate-bounce">
            <Sparkles className="h-4 w-4" />
          </div>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div 
          ref={chatRef}
          className={`fixed ${dimensions.bottom} ${dimensions.right} ${dimensions.width} ${dimensions.height} ${
            darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
          } rounded-2xl shadow-2xl border z-40 flex flex-col overflow-hidden transition-all duration-300 ${
            isMinimized ? 'animate-in slide-in-from-bottom-2' : 'animate-in slide-in-from-bottom-4'
          }`}
        >
          {/* Header */}
          <div className={`${
            darkMode ? 'bg-gray-800 text-white' : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
          } px-4 py-3 flex items-center justify-between transition-colors duration-300`}>
            <div className="flex items-center space-x-3">
              <div className={`${
                darkMode ? 'bg-gray-700' : 'bg-white'
              } p-2 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
                isTyping ? 'animate-pulse' : ''
              }`}>
                <Bot className={`h-5 w-5 ${
                  darkMode ? 'text-amber-400' : 'text-amber-600'
                } transition-colors duration-300`} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-sm truncate">{t.title}</h2>
                <p className={`text-xs truncate transition-colors duration-300 ${
                  darkMode ? 'text-gray-300' : 'text-amber-100'
                }`}>
                  {isTyping ? t.statusTyping : t.status}
                </p>
              </div>
            </div>
            
            {!isMinimized && (
              <div className="flex items-center space-x-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className={`h-7 w-7 p-0 ${
                    darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-amber-600 text-white'
                  } transition-colors duration-300`}
                  title={t.language}
                >
                  <Languages className="h-3.5 w-3.5" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSound}
                  className={`h-7 w-7 p-0 ${
                    darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-amber-600 text-white'
                  } transition-colors duration-300`}
                  title={t.sound}
                >
                  {soundEnabled ? (
                    <Volume2 className="h-3.5 w-3.5" />
                  ) : (
                    <VolumeX className="h-3.5 w-3.5" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className={`h-7 w-7 p-0 ${
                    darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-amber-600 text-white'
                  } transition-colors duration-300`}
                  title={t.theme}
                >
                  {darkMode ? (
                    <Sun className="h-3.5 w-3.5" />
                  ) : (
                    <Moon className="h-3.5 w-3.5" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExpand}
                  className={`h-7 w-7 p-0 ${
                    darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-amber-600 text-white'
                  } transition-colors duration-300`}
                  title={t.expand}
                >
                  {isExpanded ? (
                    <Minimize2 className="h-3.5 w-3.5" />
                  ) : (
                    <Maximize2 className="h-3.5 w-3.5" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMinimize}
                  className={`h-7 w-7 p-0 ${
                    darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-amber-600 text-white'
                  } transition-colors duration-300`}
                  title={t.minimize}
                >
                  <Minimize2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
            
            {isMinimized && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMinimize}
                className={`h-7 w-7 p-0 ${
                  darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-amber-600 text-white'
                } transition-colors duration-300`}
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>

          {/* Improved AI Assistant */}
          {!isMinimized && (
            <div className="flex-1 overflow-hidden">
              <ImprovedBiteBaseAI
                userId="floating-chat-user"
                title=""
                placeholder={t.inputPlaceholder}
                defaultLanguage={currentLanguage}
                className={`h-full border-0 shadow-none ${
                  darkMode ? 'bg-gray-900 text-white' : 'bg-white'
                } transition-colors duration-300`}
                isFloating={true}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;