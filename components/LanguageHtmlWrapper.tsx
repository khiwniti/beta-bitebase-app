'use client';

import React, { useEffect, useState } from 'react';

export default function LanguageHtmlWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Get language from localStorage on client side
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'th')) {
      setLanguage(savedLanguage);
      document.documentElement.lang = savedLanguage;
    }

    // Listen for language changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'language' && e.newValue && (e.newValue === 'en' || e.newValue === 'th')) {
        setLanguage(e.newValue);
        document.documentElement.lang = e.newValue;
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <html lang={language} suppressHydrationWarning>
      {children}
    </html>
  );
}