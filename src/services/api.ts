import { LOCAL_STORAGE_IDENTIFIERS } from '@/utils/constants';
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_CONSTRUCTION_BACKEND_API_URL,
  timeout: 15000,
});

axiosClient.interceptors.request.use((request) => {
  const token = localStorage.getItem(LOCAL_STORAGE_IDENTIFIERS.TOKEN_STORE_KEY);

  if (token) {
    request.headers['Authorization'] = `Bearer ${token}`;
  }

  return request;
});

export default axiosClient;
