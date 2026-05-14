import axios from 'axios';

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://192.168.15.69:3333';

export const api = axios.create({
  baseURL,
});

export const setAuthToken = (token?: string) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export default api;
