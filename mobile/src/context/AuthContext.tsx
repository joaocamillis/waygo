import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types/user';
import * as authService from '../services/authService';
import LoadingState from '../components/LoadingState';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        const session = await authService.restoreSession();
        if (session) setUser(session.user);
      } catch {
        await authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await authService.login(email, password);
      setUser(result.user);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const result = await authService.register(name, email, password);
      setUser(result.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <AuthContext.Provider value={{ user, loading: false, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
