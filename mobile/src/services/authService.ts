import { api, setAuthToken } from './api';
import { saveToken, getToken, removeToken } from '../storage/tokenStorage';
import { User } from '../types/user';

export type AuthResult = {
  user: User;
  token: string;
};

export const register = async (name: string, email: string, password: string): Promise<AuthResult> => {
  const response = await api.post('/auth/register', { name, email, password });
  const result: AuthResult = response.data;
  await saveToken(result.token);
  setAuthToken(result.token);
  return result;
};

export const login = async (email: string, password: string): Promise<AuthResult> => {
  const response = await api.post('/auth/login', { email, password });
  const result: AuthResult = response.data;
  await saveToken(result.token);
  setAuthToken(result.token);
  return result;
};

export const getMe = async (): Promise<User> => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const logout = async (): Promise<void> => {
  await removeToken();
  setAuthToken();
};

export const restoreSession = async (): Promise<AuthResult | null> => {
  const token = await getToken();
  if (!token) return null;
  setAuthToken(token);
  const user = await getMe();
  return { token, user };
};
