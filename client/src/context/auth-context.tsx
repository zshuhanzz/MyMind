import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import apiClient from '../config/api-client';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  loginAnonymous: () => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setState({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }
    try {
      const { data } = await apiClient.get<User>('/users/me');
      setState({ user: data, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem('accessToken');
      setState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', data.accessToken);
    setState({ user: data.user, isAuthenticated: true, isLoading: false });
  };

  const register = async (email: string, password: string, displayName: string) => {
    const { data } = await apiClient.post('/auth/register', { email, password, displayName });
    localStorage.setItem('accessToken', data.accessToken);
    setState({ user: data.user, isAuthenticated: true, isLoading: false });
  };

  const loginAnonymous = async () => {
    const { data } = await apiClient.post('/auth/anonymous');
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('anonymousToken', data.anonymousToken);
    setState({ user: data.user, isAuthenticated: true, isLoading: false });
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('anonymousToken');
    setState({ user: null, isAuthenticated: false, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, loginAnonymous, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
