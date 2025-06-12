"use client"

import { useState, useEffect } from 'react'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' }
]

interface SimpleLanguageSwitcherProps {
  theme?: 'light' | 'dark';
}

export default function SimpleLanguageSwitcher({ 
  theme = 'light'
}: SimpleLanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState('en')

  useEffect(() => {
    // Load saved language preference from localStorage
    const savedLanguage = localStorage.getItem('preferred-language')
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'th')) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  const handleLanguageChange = (newLanguage: string) => {
    setIsOpen(false)
    setCurrentLanguage(newLanguage)
    localStorage.setItem('preferred-language', newLanguage)
    
    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: newLanguage } 
    }))
  }

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0]

  const buttonStyles = theme === 'dark' 
    ? "flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white hover:text-green-400 hover:bg-white/10 rounded-md transition-colors"
    : "flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"

  const dropdownStyles = theme === 'dark'
    ? "absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50"
    : "absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50"

  return (
    <div className="relative">
      {/* Language Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={buttonStyles}
      >
        <span className="text-lg">{currentLang.flag}</span>
        <span>{currentLang.name}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className={dropdownStyles}>
          <div className="py-1">
            {languages.map((lang) => {
              const isSelected = currentLanguage === lang.code
              const itemStyles = theme === 'dark'
                ? `w-full text-left px-4 py-2 text-sm hover:bg-white/10 flex items-center space-x-3 ${
                    isSelected 
                      ? 'bg-white/5 text-green-400 font-medium' 
                      : 'text-white'
                  }`
                : `w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-3 ${
                    isSelected 
                      ? 'bg-gray-50 text-primary-600 font-medium' 
                      : 'text-gray-700'
                  }`

              return (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={itemStyles}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.name}</span>
                  {isSelected && (
                    <span className={`ml-auto ${theme === 'dark' ? 'text-green-400' : 'text-primary-600'}`}>✓</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}