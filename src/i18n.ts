import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enCommon from './locales/en/common.json';
import deCommon from './locales/de/common.json';
import { COOKIES_IDENTIFIERS } from './utils/constants';
import { getCookie } from './utils/cookies';

const getLanguageFromCookie = (): string => {
  return getCookie(COOKIES_IDENTIFIERS.APP_LOCALE) || 'en';
};

const resources = {
  en: {
    common: enCommon,
  },
  de: {
    common: deCommon,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: getLanguageFromCookie(),
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
