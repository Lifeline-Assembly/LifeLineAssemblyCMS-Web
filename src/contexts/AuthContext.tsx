import React, { createContext, useState, type ReactNode } from 'react';
import type { User } from '../constants/basic-types';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  login: (accessToken: string, refreshToken: string, userID: string) => void;
  saveUserData: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('access_token') || null);
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refresh_token') || null);
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userID') || null);

  const saveUserData = (userData: User) => setUser(userData);

  const login = (authAccessToken: string, authRefreshToken: string, authUserID: string) => {
    setAccessToken(authAccessToken);
    setRefreshToken(authRefreshToken);
    setUserId(authUserID);
    localStorage.setItem('access_token', authAccessToken);
    localStorage.setItem('refresh_token', authRefreshToken);
    localStorage.setItem('userID', authUserID);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, refreshToken, userId, login, saveUserData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export default AuthContext;