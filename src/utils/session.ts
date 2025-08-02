import { LOCAL_STORAGE_IDENTIFIERS, storeKeys } from '@/utils/constants';

export const deleteToken = () => {
  localStorage.removeItem(LOCAL_STORAGE_IDENTIFIERS.TOKEN_STORE_KEY);
  localStorage.removeItem(LOCAL_STORAGE_IDENTIFIERS.USER_STORE_KEY);
  localStorage.removeItem(storeKeys.AUTH_STORAGE);
};

export const storeToken = (authToken: string) => {
  localStorage.setItem(LOCAL_STORAGE_IDENTIFIERS.TOKEN_STORE_KEY, authToken);
};

export const checkIsAuth = () => {
  return !!localStorage.getItem(LOCAL_STORAGE_IDENTIFIERS.TOKEN_STORE_KEY);
};
