"use client"

import { useState, useEffect } from 'react'
import { Globe } from 'lucide-react'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' }
]

interface LanguageSwitcherProps {
  currentLocale?: string;
  onLanguageChange?: (locale: string) => void;
}

export default function LanguageSwitcher({ 
  currentLocale = 'en', 
  onLanguageChange 
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLocale, setSelectedLocale] = useState(currentLocale)

  useEffect(() => {
    // Load saved language preference from localStorage
    const savedLocale = localStorage.getItem('preferred-language') || 'en'
    setSelectedLocale(savedLocale)
  }, [])

  const handleLanguageChange = (locale: string) => {
    setSelectedLocale(locale)
    localStorage.setItem('preferred-language', locale)
    setIsOpen(false)
    
    if (onLanguageChange) {
      onLanguageChange(locale)
    }
  }

  const currentLanguage = languages.find(lang => lang.code === selectedLocale) || languages[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
        aria-label="Change language"
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="hidden md:inline">{currentLanguage.name}</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
            <div className="py-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-3 ${
                    selectedLocale === language.code 
                      ? 'bg-gray-50 text-primary-600 font-medium' 
                      : 'text-gray-700'
                  }`}
                >
                  <span className="text-lg">{language.flag}</span>
                  <span>{language.name}</span>
                  {selectedLocale === language.code && (
                    <span className="ml-auto text-primary-600">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}