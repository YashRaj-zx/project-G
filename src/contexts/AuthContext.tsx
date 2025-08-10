
import React, { createContext, useState, useContext, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: {email: string, password: string}) => void;
  logout: () => void;
  signup: (userData: Omit<User, "id" | "createdAt"> & { password: string }) => User;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check for existing user data on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (credentials: {email: string, password: string}) => {
    // Simple login - in real app this would validate against a backend
    const customName = credentials.email ? credentials.email.split('@')[0] : 'Guest';
    const customUser = {
      id: `user-${Date.now()}`,
      name: customName.charAt(0).toUpperCase() + customName.slice(1),
      email: credentials.email,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('user', JSON.stringify(customUser));
    setUser(customUser);
    setIsAuthenticated(true);
    return customUser;
  };

  const signup = (userData: Omit<User, "id" | "createdAt"> & { password: string }) => {
    const newUser = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    // Store user data without password
    const { password, ...userWithoutPassword } = newUser;
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    setUser(userWithoutPassword);
    setIsAuthenticated(true);
    
    return userWithoutPassword;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
