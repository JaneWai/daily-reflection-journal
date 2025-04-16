import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext';
import { ReflectionProvider } from './context/ReflectionContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ReflectionProvider>
        <App />
      </ReflectionProvider>
    </AuthProvider>
  </React.StrictMode>,
);
