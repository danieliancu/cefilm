'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { SessionUser } from '@/types';

interface AuthContextValue {
  user: SessionUser | null;
  loading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  updateProfile: (data: { name?: string; avatarUrl?: string; password?: string }) => Promise<boolean>;
  subscribeVip: () => Promise<boolean>;
  addWatchlistItem: (data: { title: string; imdbId?: string; year?: string; notes?: string; synopsis?: string; reason?: string; director?: string }) => Promise<boolean>;
  removeWatchlistItem: (id: string) => Promise<boolean>;
  useTicket: () => Promise<boolean>;
  isVip: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const login = async (email: string, password: string) => {
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setAuthError(data.error || 'Eroare la autentificare');
        return false;
      }
      const data = await res.json();
      setUser(data.user);
      return true;
    } catch {
      setAuthError('Nu am reușit să comunicăm cu serverul');
      return false;
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      if (!res.ok) {
        const data = await res.json();
        setAuthError(data.error || 'Eroare la înregistrare');
        return false;
      }
      const data = await res.json();
      setUser(data.user);
      return true;
    } catch {
      setAuthError('Nu am reușit să comunicăm cu serverul');
      return false;
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
  };

  const updateProfile = async (data: { name?: string; avatarUrl?: string; password?: string }) => {
    setAuthError(null);
    try {
      const res = await fetch('/api/user/update', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const payload = await res.json();
        setAuthError(payload.error || 'Actualizarea a eșuat');
        return false;
      }
      const payload = await res.json();
      setUser((prev) => ({ ...(prev || payload.user), ...payload.user }));
      return true;
    } catch {
      setAuthError('Nu am reușit să comunicăm cu serverul');
      return false;
    }
  };

  const subscribeVip = async () => {
    setAuthError(null);
    try {
      const res = await fetch('/api/user/subscribe', {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) {
        const payload = await res.json();
        setAuthError(payload.error || 'Nu am putut activa VIP');
        return false;
      }
      const payload = await res.json();
      setUser((prev) => ({ ...(prev || payload.user), ...payload.user }));
      return true;
    } catch {
      setAuthError('Nu am reușit să comunicăm cu serverul');
      return false;
    }
  };

  const addWatchlistItem = async (data: { title: string; imdbId?: string; year?: string; notes?: string; synopsis?: string; reason?: string; director?: string }) => {
    if (!user) return false;
    try {
      const res = await fetch('/api/user/watchlist', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) return false;
      const payload = await res.json();
      setUser((prev) =>
        prev
          ? {
              ...prev,
              watchlist: [payload.item, ...(prev.watchlist || [])],
            }
          : prev,
      );
      return true;
    } catch {
      return false;
    }
  };

  const removeWatchlistItem = async (id: string) => {
    if (!user) return false;
    try {
      const res = await fetch(`/api/user/watchlist?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) return false;
      setUser((prev) =>
        prev
          ? {
              ...prev,
              watchlist: (prev.watchlist || []).filter((w) => w.id !== id),
            }
          : prev,
      );
      return true;
    } catch {
      return false;
    }
  };

  const useTicket = async () => {
    if (!user) return false;
    if (user.isVip) return true;
    try {
      const res = await fetch('/api/user/tickets', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'use' }),
      });
      if (!res.ok) return false;
      const payload = await res.json();
      setUser((prev) => ({ ...(prev || payload.user), ...payload.user }));
      return true;
    } catch {
      return false;
    }
  };

  const value: AuthContextValue = {
    user,
    loading,
    authError,
    login,
    register,
    logout,
    refresh,
    updateProfile,
    subscribeVip,
    addWatchlistItem,
    removeWatchlistItem,
    useTicket,
    isVip: !!user?.isVip,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
};
