import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string | null;
  imageUrl: string;
}

interface AuthState {
  isSignedIn: boolean;
  user: User | null;
  getToken: () => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

// Simple auth state management without external dependencies
export function useAuth(): AuthState {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      setIsSignedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const getToken = async (): Promise<string | null> => {
    return localStorage.getItem('auth_token');
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    // Demo implementation - in real app, this would call your auth API
    const demoToken = btoa(JSON.stringify({
      sub: 'demo-user-' + Date.now(),
      email,
      name: email.split('@')[0],
      picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      exp: Date.now() + 86400000, // 24 hours
    }));
    
    const demoUser: User = {
      id: 'demo-user-' + Date.now(),
      name: email.split('@')[0],
      email,
      imageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };

    localStorage.setItem('auth_token', demoToken);
    localStorage.setItem('user_data', JSON.stringify(demoUser));
    
    setIsSignedIn(true);
    setUser(demoUser);
  };

  const signOut = (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setIsSignedIn(false);
    setUser(null);
  };

  return {
    isSignedIn,
    user,
    getToken,
    signIn,
    signOut,
  };
}
