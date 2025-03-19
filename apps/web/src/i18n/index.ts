import { translations } from './translations';

export type Language = 'en' | 'es';

export function useTranslation() {
  // Get the current language from localStorage or default to English
  const getLanguage = (): Language => {
    if (typeof window === 'undefined') return 'en';
    
    const storedLanguage = localStorage.getItem('language') as Language;
    return (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'es')) 
      ? storedLanguage 
      : 'en';
  };

  const t = (key: string): string => {
    const language = getLanguage();
    const keys = key.split('.');
    
    // Use unknown type instead of any
    let result: unknown = translations[language];
    
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = (result as Record<string, unknown>)[k];
      } else {
        // Fallback to English if the key doesn't exist in the current language
        let fallback: unknown = translations['en'];
        for (const fallbackKey of keys) {
          if (fallback && typeof fallback === 'object' && fallbackKey in fallback) {
            fallback = (fallback as Record<string, unknown>)[fallbackKey];
          } else {
            return key; // Return the key itself if not found in any language
          }
        }
        return typeof fallback === 'string' ? fallback : key;
      }
    }
    
    return typeof result === 'string' ? result : key;
  };

  // Function to handle template strings with variables
  const tWithVars = (key: string, vars: Record<string, string | number>): string => {
    let text = t(key);
    
    // Replace all variables in the format {{varName}}
    Object.entries(vars).forEach(([varName, value]) => {
      text = text.replace(new RegExp(`{{${varName}}}`, 'g'), String(value));
    });
    
    return text;
  };

  return { t, tWithVars, language: getLanguage() };
} 