import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { getCurrentUser, loginUser, logoutUser, registerUser } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => User | null;
  register: (username: string, password: string, email?: string) => User | null;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username: string, password: string): User | null => {
    const loggedInUser = loginUser(username, password);
    if (loggedInUser) {
      setUser(loggedInUser);
      setIsAuthenticated(true);
      return loggedInUser;
    }
    return null;
  };

  const register = (username: string, password: string, email?: string): User | null => {
    const newUser = registerUser(username, password, email);
    if (newUser) {
      setUser(newUser);
      setIsAuthenticated(true);
      return newUser;
    }
    return null;
  };

  const logout = (): void => {
    logoutUser();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};