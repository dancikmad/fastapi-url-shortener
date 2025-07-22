import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      setIsAuthenticated(true);
      // For now, we'll assume admin based on a simple check
      // In a real app, you'd decode the JWT or check user role from API
      setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await authService.login(email, password);
      setIsAuthenticated(true);
      // Check if admin (you can modify this based on your backend response)
      if (email.includes('admin')) {
        setIsAdmin(true);
        localStorage.setItem('isAdmin', 'true');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
  };

  const register = async (email: string, password: string) => {
    try {
      await authService.register(email, password);
      // Optionally auto-login after registration
      await login(email, password);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};