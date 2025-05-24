import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import language resources
import enTranslation from '../locales/en.json';
import hiTranslation from '../locales/hi.json';

// Supported languages
export const LANGUAGES = {
  en: 'English',
  hi: 'हिंदी', // Hindi
  // Future languages to be added:
  // ta: 'தமிழ்', // Tamil
  // te: 'తెలుగు', // Telugu
  // bn: 'বাংলা', // Bengali
  // mr: 'मराठी', // Marathi
  // gu: 'ગુજરાતી', // Gujarati
  // kn: 'ಕನ್ನಡ', // Kannada
  // ml: 'മലയാളം', // Malayalam
};

// Initialize i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      hi: {
        translation: hiTranslation,
      },
    },
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;