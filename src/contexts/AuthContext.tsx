
import React, { createContext, useState, useContext, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
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

  const login = (userData: User) => {
    // Check if user exists in stored users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((u: User) => u.email === userData.email);
    
    if (!existingUser) {
      throw new Error("User does not exist");
    }
    
    localStorage.setItem('user', JSON.stringify(existingUser));
    setUser(existingUser);
    setIsAuthenticated(true);
  };

  const signup = (userData: Omit<User, "id" | "createdAt"> & { password: string }) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    const existingUser = users.find((u: User) => u.email === userData.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }
    
    // Create new user
    const newUser: User & { password: string } = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    // Store user in users array
    localStorage.setItem('users', JSON.stringify([...users, newUser]));
    
    // Store current user
    const { password, ...userWithoutPassword } = newUser;
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    
    // Update state
    setUser(userWithoutPassword);
    setIsAuthenticated(true);
    
    return userWithoutPassword;
  };

  const logout = () => {
    // Only remove the current user session, not the stored data
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
