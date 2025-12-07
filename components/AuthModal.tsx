
import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { Language } from '../types';
import { getTranslation } from '../translations';
import { useAuth } from './auth/AuthProvider';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onRegistered?: () => void;
  onLoginSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, lang, onRegistered, onLoginSuccess }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { login, register, authError, refresh } = useAuth();

  useEffect(() => {
    setLocalError(authError);
  }, [authError]);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('Completează email și parolă');
      return;
    }

    if (!isSignIn && password !== confirmPassword) {
      setLocalError('Parolele nu coincid');
      return;
    }

    setSubmitting(true);
    const ok = isSignIn
      ? await login(email, password)
      : await register(email, password, name);

    setSubmitting(false);

    if (ok) {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
      if (!isSignIn && onRegistered) {
        onRegistered();
      } else {
        onClose();
      }
      await refresh();
      if (isSignIn && onLoginSuccess) {
        onLoginSuccess();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-zinc-900 border border-amber-900/50 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] p-8 animate-fade-in-up">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl cinema-font text-amber-500 mb-2">
            {isSignIn ? getTranslation('auth_signin_title', lang) : getTranslation('auth_signup_title', lang)}
          </h2>
          <div className="w-16 h-0.5 bg-red-800 mx-auto rounded-full"></div>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isSignIn && (
            <div>
              <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2">
                Nume (opțional)
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-white focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/50 transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2">
              {getTranslation('auth_email', lang)}
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-white focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/50 transition-all"
            />
          </div>
          
          <div>
            <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2">
              {getTranslation('auth_password', lang)}
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-white focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/50 transition-all"
            />
          </div>

          {!isSignIn && (
            <div>
              <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2">
                {getTranslation('auth_confirm_password', lang)}
              </label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-white focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/50 transition-all"
            />
          </div>
          )}

          {localError && (
            <div className="bg-red-900/40 border border-red-700 text-red-100 text-sm rounded p-3">
              {localError}
            </div>
          )}

          <Button fullWidth className="mt-6" disabled={submitting}>
             {submitting ? 'Se procesează...' : isSignIn ? getTranslation('auth_submit_signin', lang) : getTranslation('auth_submit_signup', lang)}
          </Button>
        </form>

        {/* Toggle View */}
        <div className="mt-6 text-center text-sm text-zinc-500">
          <span>{isSignIn ? getTranslation('auth_no_account', lang) : getTranslation('auth_has_account', lang)} </span>
          <button 
            onClick={() => setIsSignIn(!isSignIn)}
            className="text-amber-600 hover:text-amber-400 font-bold transition-colors ml-1"
          >
            {isSignIn ? getTranslation('auth_link_signup', lang) : getTranslation('auth_link_signin', lang)}
          </button>
        </div>

      </div>
    </div>
  );
};
