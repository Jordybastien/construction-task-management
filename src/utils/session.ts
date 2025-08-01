import { LOCAL_STORAGE_IDENTIFIERS } from '@/utils/constants';

export const deleteToken = () => {
  localStorage.clear();
};

export const storeToken = (authToken: string) => {
  localStorage.setItem(LOCAL_STORAGE_IDENTIFIERS.TOKEN_STORE_KEY, authToken);
};

export const checkIsAuth = () => {
  return !!localStorage.getItem(LOCAL_STORAGE_IDENTIFIERS.TOKEN_STORE_KEY);
};
