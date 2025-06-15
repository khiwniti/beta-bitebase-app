'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import EnhancedBiteBaseAI from './EnhancedBiteBaseAI';
import { 
  MessageCircle, 
  X, 
  Languages
} from 'lucide-react';

interface ChatbotProps {
  className?: string;
}

const FloatingChatbot: React.FC<ChatbotProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'th'>('en');

  const translations = {
    en: {
      title: 'BiteBase Assistant',
      status: 'Online - Ready to help',
      placeholder: 'Ask about sales, customers, or menu performance...',
      inputPlaceholder: 'Ask me anything about your restaurant business...'
    },
    th: {
      title: 'ผู้ช่วย BiteBase',
      status: 'ออนไลน์ - พร้อมช่วยเหลือ',
      placeholder: 'สอบถามเกี่ยวกับยอดขาย, ลูกค้า, หรือประสิทธิภาพเมนู...',
      inputPlaceholder: 'ถามฉันเกี่ยวกับธุรกิจร้านอาหารของคุณ...'
    }
  };

  const t = translations[currentLanguage];

  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'en' ? 'th' : 'en');
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 z-50 ${className}`}
        size="lg"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-40 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-amber-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 ml-3 rounded-full animate-bounce flex-shrink-0 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600" aria-hidden="true">
                  <path d="M12 8V4H8"></path>
                  <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                  <path d="M2 14h2"></path>
                  <path d="M20 14h2"></path>
                  <path d="M15 13v2"></path>
                  <path d="M9 13v2"></path>
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-sm truncate">{t.title}</h2>
                <p className="text-xs text-amber-100 truncate">{t.status}</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 flex-shrink-0">
              <button 
                onClick={toggleLanguage}
                className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground text-white hover:bg-amber-700 transition-colors p-1.5 h-7 w-7 rounded-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-languages w-3.5 h-3.5" aria-hidden="true">
                  <path d="m5 8 6 6"></path>
                  <path d="m4 14 6-6 2-3"></path>
                  <path d="M2 5h12"></path>
                  <path d="M7 2h1"></path>
                  <path d="m22 22-5-10-5 10"></path>
                  <path d="M14 18h6"></path>
                </svg>
              </button>
              <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground text-white hover:bg-amber-700 transition-colors p-1.5 h-7 w-7 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings w-3.5 h-3.5" aria-hidden="true">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
              <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground text-white hover:bg-amber-700 transition-colors p-1.5 h-7 w-7 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-expand w-3.5 h-3.5" aria-hidden="true">
                  <path d="m15 15 6 6"></path>
                  <path d="m15 9 6-6"></path>
                  <path d="M21 16.2V21h-4.8"></path>
                  <path d="M21 7.8V3h-4.8"></path>
                  <path d="M3 16.2V21h4.8"></path>
                  <path d="m3 21 6-6"></path>
                  <path d="M3 7.8V3h4.8"></path>
                  <path d="M9 9 3 3"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Enhanced AI Assistant */}
          <div className="flex-1 overflow-hidden">
            <EnhancedBiteBaseAI
              userId="floating-chat-user"
              title=""
              placeholder={t.inputPlaceholder}
              defaultLanguage={currentLanguage}
              className="h-full border-0 shadow-none"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;