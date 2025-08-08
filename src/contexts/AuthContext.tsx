
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

// Create a default guest user
const guestUser: User = {
  id: 'guest-user',
  name: 'Guest',
  email: 'guest@example.com',
  createdAt: new Date().toISOString()
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always start with an authenticated state using the guest user
  const [user, setUser] = useState<User | null>(guestUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Check for existing user data on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    } else {
      // If no user exists in localStorage, set the guest user
      localStorage.setItem('user', JSON.stringify(guestUser));
    }
  }, []);

  // These authentication functions are kept for backwards compatibility
  // but now they will always succeed and have minimal effect
  const login = (credentials: {email: string, password: string}) => {
    // Set a custom name if provided in email field (for guest personalization)
    const customName = credentials.email ? credentials.email.split('@')[0] : 'Guest';
    const customUser = {
      ...guestUser,
      name: customName.charAt(0).toUpperCase() + customName.slice(1), // Capitalize first letter
    };
    
    localStorage.setItem('user', JSON.stringify(customUser));
    setUser(customUser);
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
    
    return userWithoutPassword;
  };

  const logout = () => {
    // Reset to the guest user
    localStorage.setItem('user', JSON.stringify(guestUser));
    setUser(guestUser);
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
