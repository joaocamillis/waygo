import { api } from './api';

export const createSearch = async (payload: Record<string, unknown>) => {
  const response = await api.post('/rides/searches', payload);
  return response.data;
};

export const listSearches = async () => {
  const response = await api.get('/rides/searches');
  return response.data;
};
