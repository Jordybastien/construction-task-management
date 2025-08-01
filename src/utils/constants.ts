const APP_NAME = 'construction_management';

export const COOKIES_IDENTIFIERS = Object.freeze({
  APP_LOCALE: `${APP_NAME}:app_locale`,
  COOKIE_CONSENT: `${APP_NAME}:cookie_consent`,
});

export const LOCAL_STORAGE_IDENTIFIERS = Object.freeze({
  TOKEN_STORE_KEY: `${APP_NAME}:token`,
  USER_STORE_KEY: `${APP_NAME}:user`,
  OFFLINE_QUEUE: `${APP_NAME}:offline_queue`,
});

export const storeKeys = Object.freeze({
  AUTH_STORAGE: `${APP_NAME}:auth_storage`,
});
