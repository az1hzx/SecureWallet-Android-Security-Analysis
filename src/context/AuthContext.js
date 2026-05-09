import React, { createContext, useState, useContext } from 'react';
import { API_BASE } from '../config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  });

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setUser(data.data.user);
      setToken(data.data.authToken);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setUser(data.data.user);
      setToken(data.data.authToken);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setUser(data.data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (name, email) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setUser(data.data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (imageSource) => {
    setLoading(true);
    try {
      const formData = new FormData();

      if (typeof imageSource === 'string') {
        // Native: imageSource is a file URI
        const filename = imageSource.split('/').pop();
        const ext = filename.split('.').pop();
        formData.append('image', {
          uri: imageSource,
          name: filename,
          type: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
        });
      } else {
        // Web: imageSource is a File object
        formData.append('image', imageSource);
      }

      const res = await fetch(`${API_BASE}/auth/upload-image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setUser(data.data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      register, login, logout, fetchProfile,
      updateProfile, changePassword, uploadImage,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
