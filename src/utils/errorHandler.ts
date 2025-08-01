import { LOCAL_STORAGE_IDENTIFIERS } from '@/utils/constants';
import { checkIsAuth } from '@/utils/session';

export interface ErrorProps {
  code?: string;
  message?: string;
  isNetworkError?: boolean;
  is400?: boolean;
  is401?: boolean;
  is403?: boolean;
  is404?: boolean;
  is500?: boolean;
  meta?: any;
}

const deleteToken = () => {
  localStorage.removeItem(LOCAL_STORAGE_IDENTIFIERS.TOKEN_STORE_KEY);
  localStorage.removeItem(LOCAL_STORAGE_IDENTIFIERS.USER_STORE_KEY);
};

export const formatApiErrorResponse = (error: any): ErrorProps => {
  if (!navigator.onLine) {
    return {
      isNetworkError: true,
      code: 'NETWORK_ERROR',
      message: 'Error, Please make sure you are connected to the internet',
    };
  }

  if (!error?.response) {
    return { is500: true };
  }

  const { status, data } = error.response;

  const errorMap: Record<number, keyof ErrorProps> = {
    400: 'is400',
    401: 'is401',
    403: 'is403',
    404: 'is404',
  };

  const errorKey = errorMap[status] || 'is500';
  const errorResponse: ErrorProps = {
    [errorKey]: true,
    ...data,
  };

  if (status === 401) {
    if (checkIsAuth()) {
      window.location.href = '/';
      deleteToken();
    }
  }

  if (status === 401 || status === 403) {
    errorResponse.meta = error.response;
  }

  return errorResponse;
};
