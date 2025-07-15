import { useLanguage } from '../contexts/LanguageContext';

export function useTranslations(namespace: string) {
  const { t } = useLanguage();
  
  return (key: string) => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    return t(fullKey);
  };
}