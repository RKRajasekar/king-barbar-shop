import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import LoginRequiredDialog from '../components/LoginRequiredDialog';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('king_barbar_token') || null);
  const [loading, setLoading] = useState(true);

  // Global Login Required Dialog State
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [loginPromptRedirectUrl, setLoginPromptRedirectUrl] = useState('/book');

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('king_barbar_token');
      if (storedToken) {
        try {
          const response = await api.get('/auth/me');
          if (response.data.success) {
            setUser(response.data.user);
          }
        } catch (error) {
          console.error('Session expired or invalid token:', error.message);
          localStorage.removeItem('king_barbar_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      const { user: loggedInUser, token: receivedToken } = response.data;
      localStorage.setItem('king_barbar_token', receivedToken);
      setToken(receivedToken);
      setUser(loggedInUser);
      return loggedInUser;
    }
    throw new Error(response.data.message || 'Login failed');
  };

  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.success) {
      const { user: registeredUser, token: receivedToken } = response.data;
      localStorage.setItem('king_barbar_token', receivedToken);
      setToken(receivedToken);
      setUser(registeredUser);
      return registeredUser;
    }
    throw new Error(response.data.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('king_barbar_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  const isAuthenticated = Boolean(user && token);
  const isAdmin = Boolean(user && user.role === 'ADMIN');

  // Trigger login required modal for guests
  const promptLogin = (redirectUrl = '/book') => {
    setLoginPromptRedirectUrl(redirectUrl);
    setIsLoginPromptOpen(true);
  };

  const closeLoginPrompt = () => {
    setIsLoginPromptOpen(false);
  };

  // Reusable auth gate for any booking action or link
  const requireAuth = (authenticatedCallback, redirectUrl = '/book') => {
    if (isAuthenticated) {
      if (typeof authenticatedCallback === 'function') {
        authenticatedCallback();
      }
      return true;
    } else {
      promptLogin(redirectUrl);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated,
        isAdmin,
        promptLogin,
        closeLoginPrompt,
        requireAuth,
      }}
    >
      {children}
      <LoginRequiredDialog
        open={isLoginPromptOpen}
        onClose={closeLoginPrompt}
        redirectUrl={loginPromptRedirectUrl}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

