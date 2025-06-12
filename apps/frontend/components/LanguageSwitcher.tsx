"use client"

import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' }
]

interface LanguageSwitcherProps {
  theme?: 'light' | 'dark';
}

export default function LanguageSwitcher({ 
  theme = 'light'
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage } = useLanguage()

  const handleLanguageChange = (newLocale: 'en' | 'th') => {
    setIsOpen(false)
    setLanguage(newLocale)
  }

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0]

  const buttonStyles = theme === 'dark' 
    ? "flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white hover:text-green-400 hover:bg-white/10 rounded-md transition-colors"
    : "flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"

  const dropdownStyles = theme === 'dark'
    ? "absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg ring-1 ring-white/20 z-20 border border-white/10"
    : "absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20"

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={buttonStyles}
        aria-label="Change language"
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="hidden sm:inline">{currentLanguage.name}</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className={dropdownStyles}>
            <div className="py-1">
              {languages.map((lang) => {
                const isSelected = language === lang.code
                const itemStyles = theme === 'dark'
                  ? `w-full text-left px-4 py-2 text-sm hover:bg-white/10 flex items-center space-x-3 ${
                      isSelected 
                        ? 'bg-white/5 text-green-400 font-medium' 
                        : 'text-gray-300'
                    }`
                  : `w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-3 ${
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
        </>
      )}
    </div>
  )
}