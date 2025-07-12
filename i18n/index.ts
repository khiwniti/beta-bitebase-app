import { createNavigation } from 'next-intl/navigation';

export const locales = ['en', 'th'] as const;
export const defaultLocale = 'en' as const;

// Create the shared navigation configuration
export const { Link, redirect, usePathname, useRouter } = createNavigation({ 
  locales,
  defaultLocale 
});