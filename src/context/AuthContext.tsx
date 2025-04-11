import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (response: any) => void;
  logout: () => void;
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
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return localStorage.getItem('accessToken');
  });

  const isAuthenticated = !!user;

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    } else {
      localStorage.removeItem('accessToken');
    }
  }, [accessToken]);

  const login = (response: any) => {
    // Handle both credential-based login (from GoogleLogin component)
    // and token-based login (from useGoogleLogin hook)
    if (response.credential) {
      // Decode the JWT token to get user info
      const decodedToken = jwtDecode(response.credential);
      
      const newUser: User = {
        id: decodedToken.sub as string,
        name: decodedToken.name as string,
        email: decodedToken.email as string,
        picture: decodedToken.picture as string
      };
      
      setUser(newUser);
      setAccessToken(response.credential);
    } else if (response.access_token) {
      // For token-based login, fetch the user profile
      fetchUserInfo(response.access_token).then(userInfo => {
        if (userInfo) {
          setUser(userInfo);
          setAccessToken(response.access_token);
        }
      });
    }
  };

  const fetchUserInfo = async (token: string): Promise<User | null> => {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }
      
      const data = await response.json();
      
      return {
        id: data.sub,
        name: data.name,
        email: data.email,
        picture: data.picture
      };
    } catch (error) {
      console.error('Error fetching user info:', error);
      
      // Fallback for preview mode
      if (token.includes('preview') || !token.includes('.')) {
        return {
          id: 'preview-user-id',
          name: 'Preview User',
          email: 'preview@example.com',
          picture: 'https://ui-avatars.com/api/?name=Preview+User&background=f59e0b&color=fff'
        };
      }
      
      return null;
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
