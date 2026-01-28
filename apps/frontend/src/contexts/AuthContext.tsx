'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { parseJwtToken, JwtPayload } from '@/utils/jwt';

interface User {
  id: string;
  email?: string;
  username?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 로드 시 localStorage에서 토큰 가져오기
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const payload = parseJwtToken(storedToken);
      if (payload) {
        setToken(storedToken);
        setUser({ id: payload.sub });
      } else {
        // 유효하지 않은 토큰이면 제거
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string): boolean => {
    const payload = parseJwtToken(newToken);
    if (payload) {
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser({ id: payload.sub });
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token && !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
