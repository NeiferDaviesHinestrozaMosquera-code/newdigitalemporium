
import 'server-only'
import type { Locale } from './i18n-config' // We'll create this next

// Define a type for our dictionary structure for better type safety
// This should ideally match the structure of your JSON files
export type Dictionary = {
  [key: string]: string | Dictionary; // Allow nested objects for structured translations
};

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('@/locales/en.json').then((module) => module.default as Dictionary),
  es: () => import('@/locales/es.json').then((module) => module.default as Dictionary),
  fr: () => import('@/locales/fr.json').then((module) => module.default as Dictionary),
}

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  const load = dictionaries[locale] || dictionaries.en // Fallback to English
  return load();
}
