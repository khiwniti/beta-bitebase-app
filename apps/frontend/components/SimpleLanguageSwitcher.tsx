'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export function SimpleLanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-1">
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('en')}
        className="px-2 py-1 text-xs"
      >
        🇺🇸 EN
      </Button>
      <Button
        variant={language === 'th' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('th')}
        className="px-2 py-1 text-xs"
      >
        🇹🇭 TH
      </Button>
    </div>
  );
}