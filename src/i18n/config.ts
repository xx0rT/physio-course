import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from '../../messages/en.json';
import arTranslations from '../../messages/ar.json';
import csTranslations from '../../messages/cs.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      ar: {
        translation: arTranslations,
      },
      cs: {
        translation: csTranslations,
      },
    },
    lng: localStorage.getItem('locale') || 'cs',
    fallbackLng: 'cs',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
