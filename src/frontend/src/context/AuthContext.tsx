import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';
import type { User, AuthResponse, LoginDto, RegisterDto } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  login: (dto: LoginDto) => Promise<AuthResponse>;
  register: (dto: RegisterDto) => Promise<AuthResponse>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser) as User;
      } catch {
        return null;
      }
    }
    return null;
  });

  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const me = await authApi.getCurrentUser();
      const mappedUser: User = {
        accountId: me.accountId,
        fullName: me.fullName,
        email: me.email,
        role: me.role,
        roleName: me.role === 1 ? 'Admin' : 'Staff',
      };
      setUser(mappedUser);
      localStorage.setItem('user', JSON.stringify(mappedUser));
    } catch {
      // If fetching user fails (e.g. invalid token), clear session
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [token]);

  useEffect(() => {
    if (token && !user) {
      refreshUser();
    }
  }, [token, user, refreshUser]);

  const login = async (dto: LoginDto): Promise<AuthResponse> => {
    const res = await authApi.login(dto);
    const mappedUser: User = {
      accountId: res.accountId,
      fullName: res.fullName,
      email: res.email,
      role: res.role,
      roleName: res.role === 1 ? 'Admin' : 'Staff',
    };

    setToken(res.token);
    setUser(mappedUser);
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(mappedUser));
    return res;
  };

  const register = async (dto: RegisterDto): Promise<AuthResponse> => {
    return await authApi.register(dto);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = isAuthenticated && user?.role === 1;
  const isStaff = isAuthenticated && user?.role === 0;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        isStaff,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
