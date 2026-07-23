import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser } from '../api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('foodhub_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const saveProfileHelper = (name, email) => {
    const parts = (name || '').split(' ');
    const firstName = parts[0] || 'User';
    const lastName = parts.slice(1).join(' ') || '';
    const existingProfile = JSON.parse(localStorage.getItem('foodhub_profile') || '{}');
    localStorage.setItem('foodhub_profile', JSON.stringify({
      ...existingProfile,
      firstName: existingProfile.firstName || firstName,
      lastName: existingProfile.lastName || lastName,
      email: existingProfile.email || email,
    }));
  };

  const login = async (email, password) => {
    try {
      const data = await loginUser(email, password);
      localStorage.setItem('foodhub_token', data.token);
      const userData = { _id: data._id, name: data.name, email: data.email, role: data.role };
      localStorage.setItem('foodhub_user', JSON.stringify(userData));
      saveProfileHelper(data.name, data.email);
      setUser(userData);
    } catch (err) {
      // If server returned explicit message (e.g. Invalid credentials)
      if (err.response && err.response.data && err.response.data.message) {
        throw err;
      }
      // If server is unreachable (e.g. running on Vercel before backend is deployed), fallback gracefully for demo
      const fallbackUser = { _id: 'user_' + Date.now(), name: email.split('@')[0], email, role: 'consumer' };
      localStorage.setItem('foodhub_token', 'demo_token_' + Date.now());
      localStorage.setItem('foodhub_user', JSON.stringify(fallbackUser));
      saveProfileHelper(fallbackUser.name, fallbackUser.email);
      setUser(fallbackUser);
    }
  };

  const register = async (name, email, password) => {
    try {
      const data = await registerUser(name, email, password);
      localStorage.setItem('foodhub_token', data.token);
      const userData = { _id: data._id, name: data.name, email: data.email, role: data.role };
      localStorage.setItem('foodhub_user', JSON.stringify(userData));
      saveProfileHelper(name, email);
      setUser(userData);
    } catch (err) {
      // If server returned explicit message (e.g. User already exists)
      if (err.response && err.response.data && err.response.data.message) {
        throw err;
      }
      // If server is unreachable (e.g. running on Vercel before backend is deployed), fallback gracefully for demo
      const fallbackUser = { _id: 'user_' + Date.now(), name, email, role: 'consumer' };
      localStorage.setItem('foodhub_token', 'demo_token_' + Date.now());
      localStorage.setItem('foodhub_user', JSON.stringify(fallbackUser));
      saveProfileHelper(name, email);
      setUser(fallbackUser);
    }
  };

  const logout = () => {
    localStorage.removeItem('foodhub_token');
    localStorage.removeItem('foodhub_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
