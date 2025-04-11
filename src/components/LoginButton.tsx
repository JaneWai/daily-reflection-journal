import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { LogIn, LogOut } from 'lucide-react';

const LoginButton: React.FC = () => {
  const { isAuthenticated, user, login, logout } = useAuth();

  const googleLogin = useGoogleLogin({
    onSuccess: tokenResponse => {
      login(tokenResponse);
    },
    onError: error => {
      console.error('Login Failed:', error);
    },
    scope: 'https://www.googleapis.com/auth/drive.file email profile',
    flow: 'implicit',
    onNonOAuthError: (error) => {
      console.warn('OAuth configuration error:', error);
      // For preview mode, create a mock token response
      if (!import.meta.env.VITE_GOOGLE_CLIENT_ID || 
          import.meta.env.VITE_GOOGLE_CLIENT_ID === 'your-google-client-id') {
        login({ access_token: 'preview-token' });
      }
    }
  });

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-3">
        <img 
          src={user.picture} 
          alt={user.name} 
          className="w-8 h-8 rounded-full"
        />
        <span className="text-amber-800 hidden md:inline">{user.name}</span>
        <button
          onClick={logout}
          className="flex items-center gap-1 text-amber-700 hover:text-amber-900 transition-colors"
          title="Sign out"
        >
          <LogOut className="h-5 w-5" />
          <span className="hidden md:inline">Sign out</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => googleLogin()}
      className="flex items-center gap-2 py-2 px-4 bg-white text-amber-700 border border-amber-300 rounded-lg shadow-sm hover:bg-amber-50 transition-colors"
    >
      <LogIn className="h-5 w-5" />
      <span>Sign in with Google</span>
    </button>
  );
};

export default LoginButton;
