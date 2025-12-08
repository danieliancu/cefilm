'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/Button';
import { Footer } from '@/components/Footer';
import { WatchlistItem } from '@/types';
import { SEARCH_PLATFORMS } from '@/constants';

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { user, loading, logout, updateProfile, refresh, removeWatchlistItem } = useAuth();

  const getInitialLang = (): 'ro' | 'en' => {
    if (typeof window === 'undefined') return 'ro';
    const params = new URLSearchParams(window.location.search);
    const param = params.get('lang');
    if (param === 'ro' || param === 'en') return param;
    const stored = window.localStorage.getItem('cefilm_lang');
    if (stored === 'ro' || stored === 'en') return stored;
    const nav = navigator.language?.toLowerCase() || '';
    return nav.startsWith('ro') ? 'ro' : 'en';
  };
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [lang, setLang] = useState<'ro' | 'en'>(getInitialLang);
  const [openSynopsis, setOpenSynopsis] = useState<Record<string, boolean>>({});
  const [openReason, setOpenReason] = useState<Record<string, boolean>>({});
  const [openHistory, setOpenHistory] = useState<Record<string, boolean>>({});
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('cefilm_lang', lang);
      const url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      window.history.replaceState({}, '', url.toString());
    }
  }, [lang]);

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/?lang=${lang}`);
    }
  }, [loading, user, router, lang]);

  useEffect(() => {
    setName(user?.name || '');
  }, [user]);

  const watchlist = useMemo<WatchlistItem[]>(() => user?.watchlist || [], [user]);

  const t = (key: string) => {
    const dict: Record<string, { ro: string; en: string }> = {
      account: { ro: 'Contul meu', en: 'My account' },
      dashboard: { ro: 'Dashboard', en: 'Dashboard' },
      subtitle: { ro: 'Gestioneaza datele personale, biletele gratuite si upgrade-ul VIP pentru doar 25 lei/lună.', en: 'Manage profile, free tickets and upgrade to VIP for just 25 lei/month.' },
      backHome: { ro: 'Înapoi acasă', en: 'Back home' },
      tickets: { ro: 'Bilete', en: 'Tickets' },
      ticketsLeft: { ro: 'Tichete gratuite rămase', en: 'Free tickets left' },
      vipAccount: { ro: 'CONT VIP', en: 'VIP ACCOUNT' },
      watchlist: { ro: 'Watchlist', en: 'Watchlist' },
      status: { ro: 'Statut', en: 'Status' },
      standard: { ro: 'STANDARD', en: 'STANDARD' },
      vipActive: { ro: 'VIP ACTIV', en: 'VIP ACTIVE' },
      nonVip: { ro: 'Non-VIP', en: 'Non-VIP' },
      savedTitles: { ro: 'Titluri salvate pentru mai târziu.', en: 'Saved titles for later.' },
      unlimited: { ro: 'Upgrade pentru acces nelimitat si functii sociale.', en: 'Upgrade for unlimited access and social features.' },
      vipStatusDesc: { ro: 'Acces nelimitat si functii sociale.', en: 'Unlimited access and social features.' },
      personalData: { ro: 'Date personale', en: 'Personal data' },
      updateProfile: { ro: 'Profilul meu', en: 'My Profile' },
      displayName: { ro: 'Nume afișat', en: 'Display name' },
      save: { ro: 'Salvează', en: 'Save' },
      saving: { ro: 'Se salvează...', en: 'Saving...' },
      freeTickets: { ro: 'Bilete gratuite', en: 'Free tickets' },
      remaining: { ro: 'Rămase', en: 'Remaining' },
      addAt: { ro: 'Adăugat', en: 'Added' },
      inWatchlist: { ro: 'Șterge', en: 'Remove' },
      whatYouUnlock: { ro: 'Cu VIP ai acces la:', en: 'What you unlock with VIP' },
      featuresAfterUpgrade: { ro: 'Functii disponibile dupa upgrade', en: 'Features available after upgrade' },
      logout: { ro: 'Deconectare', en: 'Logout' },
      deleteAccount: { ro: 'Sterge contul', en: 'Delete account' },
      deleteDesc: {
        ro: 'Atenție: ștergerea contului va elimina toate datele (watchlist, istoric, abonament). Acțiune ireversibilă.',
        en: 'Warning: deleting your account removes all data (watchlist, history, subscription). This is permanent.'
      },
      deleteConfirm: {
        ro: 'Sigur vrei să ștergi contul? Acțiunea este ireversibilă.',
        en: 'Are you sure you want to delete your account? This cannot be undone.'
      },
      deleteCancel: { ro: 'Anulează', en: 'Cancel' },
      deleteConfirmAction: { ro: 'Șterge contul', en: 'Delete account' },
      toRecommendations: { ro: 'Înapoi la recomandări', en: 'Back to recommendations' },
      yourTitles: { ro: 'Titlurile tale', en: 'Your titles' },
      historyTitle: { ro: 'Istoric filme gasite', en: 'Found movies history' },
      ratingTitle: { ro: 'Ratingul filmelor', en: 'Rate movies' },
      discussionTitle: { ro: 'Discuții', en: 'Discuss with others' },
      vipHistory: { ro: 'Istoric', en: 'History' },
      historyEmpty: { ro: 'Nu există încă istoric salvat.', en: 'No history yet.' },
      preferences: { ro: 'Preferinte', en: 'Preferences' },
      answers: { ro: 'Intrebari si raspunsuri', en: 'Questions & answers' },
      viewDetails: { ro: 'Vezi detalii', en: 'View details' },
      hideDetails: { ro: 'Ascunde detalii', en: 'Hide details' },
      mainRecommendation: { ro: 'Recomandarea principala', en: 'Main recommendation' },
      alternatives: { ro: 'Alte optiuni', en: 'Alternatives' },
      quizName: { ro: 'Numele quiz-ului', en: 'Quiz name' },
      originalTitle: { ro: 'Titlu original', en: 'Original title' },
      genre: { ro: 'Gen', en: 'Genre' },
      director: { ro: 'Regizor', en: 'Director' },
      year: { ro: 'An', en: 'Year' },
    };
    return dict[key]?.[lang] ?? key;
  };

  const genreLabels: Record<string, { ro: string; en: string }> = {
    drama: { ro: 'Dramă', en: 'Drama' },
    comedy: { ro: 'Comedie', en: 'Comedy' },
    thriller: { ro: 'Thriller', en: 'Thriller' },
    horror: { ro: 'Horror', en: 'Horror' },
    scifi: { ro: 'SF', en: 'Sci-Fi' },
    romance: { ro: 'Romance', en: 'Romance' },
    action: { ro: 'Acțiune', en: 'Action' },
    adventure: { ro: 'Aventură', en: 'Adventure' },
    fantasy: { ro: 'Fantezie', en: 'Fantasy' },
    mystery: { ro: 'Mister', en: 'Mystery' },
    animation: { ro: 'Animație', en: 'Animation' },
    documentary: { ro: 'Documentar', en: 'Documentary' },
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-spin w-10 h-10 border-2 border-zinc-700 border-t-amber-500 rounded-full"></div>
      </div>
    );
  }

  const handleSaveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    if (newPassword && newPassword !== confirmPassword) {
      setFormError(lang === 'ro' ? 'Parolele nu coincid' : 'Passwords do not match');
      return;
    }
    setSaving(true);
    await updateProfile({ name, password: newPassword || undefined });
    await refresh();
    setSaving(false);
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSubscribe = async () => {
    setFormError(null);
    setSubscribing(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lang }),
      });
      if (res.status === 401) {
        router.push(`/?lang=${lang}`);
        return;
      }
      if (!res.ok) {
        setFormError(lang === 'ro' ? 'Nu am putut porni plata.' : 'Could not start checkout.');
        return;
      }
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setFormError(lang === 'ro' ? 'Nu am putut porni plata.' : 'Could not start checkout.');
    } finally {
      setSubscribing(false);
    }
  };

  const performDeleteAccount = async () => {
    setDeleting(true);
    try {
      const res = await fetch('/api/user/delete', { method: 'DELETE', credentials: 'include' });
      if (!res.ok) {
        setFormError(lang === 'ro' ? 'Nu am putut sterge contul.' : 'Could not delete account.');
        return;
      }
      await logout();
      router.push(`/?lang=${lang}`);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const vipPreview = [
    {
      title: t('historyTitle'),
      desc: lang === 'ro' ? 'Cronologia recomandarilor cu motivatiile primite.' : 'Timeline of recommendations and reasons.',
      progress: user.movieHistory?.length ? Math.min(100, user.movieHistory.length * 10) : 30,
    },
    {
      title: t('ratingTitle'),
      desc: lang === 'ro' ? 'Noteaza ce ai vazut si imbunatateste algoritmul pentru tine.' : 'Rate what you watched to improve matches.',
      progress: user.ratings?.length ? Math.min(100, user.ratings.length * 10) : 20,
    },
    {
      title: t('discussionTitle'),
      desc: lang === 'ro' ? 'Comentarii si conversatii pe baza recomandarilor primite.' : 'Comments and threads on your picks.',
      progress: user.discussions?.length ? Math.min(100, user.discussions.length * 10) : 15,
    },
  ];

  const remainingTickets = user.isVip ? null : user.freeTickets;
  const ticketLabel = user.isVip ? t('vipAccount') : t('ticketsLeft');
  const ticketText = user.isVip ? null : typeof remainingTickets === 'number' ? `${remainingTickets}/5` : '...';
  const ticketColor = user.isVip
    ? 'text-green-400'
    : typeof remainingTickets === 'number' && remainingTickets === 0
    ? 'text-red-500'
    : 'text-amber-500';
  const ticketLabelColor = user.isVip ? 'text-green-400' : 'text-amber-500';

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0f0f0f] to-black text-white flex flex-col">
      {/* Header (same style as landing) */}
      <header className="relative z-50 bg-gradient-to-b from-black/90 to-transparent border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6 flex justify-between items-center">
            <div className="flex flex-col cursor-pointer group" onClick={() => router.push(`/?lang=${lang}`)}>
                <div className="cinema-font text-xl md:text-3xl font-bold gold-text tracking-widest group-hover:scale-105 transition-transform duration-500">
                CEFILM?
                </div>
                <div className="hidden md:block text-[10px] text-zinc-500 uppercase tracking-[0.3em] mt-1 group-hover:text-zinc-400 transition-colors">
                    Your Movie Adviser
                </div>
            </div>
            <nav className="flex items-center gap-2 md:gap-8">
                <div className="flex items-center gap-2 bg-zinc-900 border border-amber-900/50 rounded px-2 md:px-3 py-1">
                    <span className={`text-[10px] md:text-xs uppercase tracking-[0.18em] font-bold whitespace-nowrap ${ticketLabelColor}`}>
                        {ticketLabel}{ticketText ? ':' : ''}
                    </span>
                    {ticketText && (
                        <span className={`cinema-font font-bold text-xs md:text-sm ${ticketColor}`}>
                            {ticketText}
                        </span>
                    )}
                </div>

                <button 
                    onClick={() => router.push(`/?view=category-select&lang=${lang}`)}
                    className="hidden lg:block text-zinc-400 hover:text-white uppercase text-xs tracking-[0.15em] transition-colors font-bold"
                >
                    {lang === 'ro' ? 'Alege un film' : 'Pick a movie'}
                </button>
                <button 
                    onClick={() => router.push(`/?view=how-it-works&lang=${lang}`)}
                    className="hidden lg:block text-zinc-400 hover:text-white uppercase text-xs tracking-[0.15em] transition-colors font-bold"
                >
                    {lang === 'ro' ? 'Cum funcționează' : 'How it works'}
                </button>
                
                <div className="relative">
                    <button 
                        onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                        className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors p-2"
                    >
                        <span className="uppercase text-xs font-bold">{lang}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                    </button>
                    
                    {isLangMenuOpen && (
                        <div className="absolute right-0 mt-2 w-16 bg-zinc-900 border border-zinc-700 rounded shadow-xl z-50">
                            <button 
                                onClick={() => { setLang('ro'); setIsLangMenuOpen(false); }}
                                className={`w-full text-left px-3 py-2 text-xs uppercase hover:bg-zinc-800 ${lang === 'ro' ? 'text-amber-500 font-bold' : 'text-zinc-300'}`}
                            >
                                RO
                            </button>
                            <button 
                                onClick={() => { setLang('en'); setIsLangMenuOpen(false); }}
                                className={`w-full text-left px-3 py-2 text-xs uppercase hover:bg-zinc-800 ${lang === 'en' ? 'text-amber-500 font-bold' : 'text-zinc-300'}`}
                            >
                                EN
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => router.push('/dashboard')}
                        className="relative text-amber-600 hover:text-amber-400 transition-colors p-2 rounded-full hover:bg-white/5"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.057a48.507 48.507 0 0111.186 0z" />
                        </svg>
                        {user && user.watchlist && user.watchlist.length > 0 && (
                          <span
                            className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] rounded-full px-1.5 py-[1px] leading-none border border-black/50"
                            style={{ width:"15px", height:"15px", display:"flex",alignItems:"center",justifyContent:"center" }}
                          >
                            {user.watchlist.length}
                          </span>
                        )}
                    </button>

                    <button 
                        onClick={() => router.push('/dashboard')}
                        className="relative flex items-center gap-2 text-amber-600 hover:text-amber-400 transition-colors p-2 rounded-full hover:bg-white/5"
                    >
                        {user ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 md:w-6 md:h-6 text-green-500">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V7.5a4.5 4.5 0 00-9 0v3m-.75 0h10.5c.414 0 .75.336.75.75v7.5a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75v-7.5c0-.414.336-.75.75-.75z" />
                            </svg>
                            {user.name && (
                              <span className="hidden md:inline text-xs text-green-400 whitespace-nowrap">
                                {user.name}
                              </span>
                            )}
                          </>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                    </button>
                </div>
            </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-10 flex-1 w-full">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-zinc-900/60 border border-amber-900/40 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
            <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">{t('account')}</p>
            <h1 className="text-3xl md:text-4xl cinema-font font-bold">{t('dashboard')}</h1>
            {!user.isVip && (
              <p className="text-zinc-400 max-w-xl">
                {t('subtitle')}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-xs text-zinc-300">
                {user.email}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  user.isVip ? 'bg-green-900/30 text-green-300 border border-green-700' : 'bg-red-900/20 text-red-200 border border-red-700/60'
                }`}
              >
                {user.isVip ? t('vipActive') : t('nonVip')}
              </span>
              {!user.isVip && (
                <button
                  onClick={handleSubscribe}
                  disabled={subscribing}
                  className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-orange-600 text-black border border-orange-700 hover:bg-orange-500 transition-colors"
                >
                {subscribing ? 'Se proceseaza...' : 'UPGRADE VIP (25 lei)'}
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col items-stretch gap-3 w-full md:w-auto">
            <button
              onClick={logout}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-300 transition-colors underline decoration-dotted"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V7.5a4.5 4.5 0 00-9 0v3m-.75 0h10.5c.414 0 .75.336.75.75v7.5a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75v-7.5c0-.414.336-.75.75-.75z" />
              </svg>
              Deconectare
            </button>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">{t('tickets')}</p>
            <div className="text-4xl font-bold mt-2 flex items-baseline gap-2">
              {user.isVip ? '∞' : user.freeTickets}
              {!user.isVip && <span className="text-sm text-zinc-500">/ 5</span>}
            </div>
            <div className="h-3 rounded-full bg-zinc-800 overflow-hidden mt-3">
              <div
                className={`h-full ${user.isVip ? 'bg-green-500' : 'bg-amber-500'}`}
                style={{ width: user.isVip ? '100%' : `${Math.min(100, (user.freeTickets / 5) * 100)}%` }}
              ></div>
            </div>
            <p className="text-zinc-400 mt-3">{t('freeTickets')}</p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">{t('watchlist')}</p>
            <div className="text-4xl font-bold mt-2">{watchlist.length}</div>
            <p className="text-zinc-400 mt-3">{t('savedTitles')}</p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">{t('status')}</p>
            <div className="text-4xl font-bold mt-2 text-amber-400">{user.isVip ? 'VIP' : t('standard')}</div>
            <p className="text-zinc-400 mt-3">
              {user.isVip ? t('vipStatusDesc') : t('unlimited')}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-zinc-900/60 border border-amber-900/30 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-amber-500">{t('personalData')}</p>
                <h2 className="text-2xl font-bold">{t('updateProfile')}</h2>
              </div>
            </div>
            <form className="space-y-4" onSubmit={handleSaveProfile}>
              <div>
                <label className="block text-zinc-400 text-xs uppercase tracking-[0.2em] mb-2">{t('displayName')}</label>
                <input
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 focus:border-amber-600 focus:outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Alex C."
                />
              </div>
              <div className="grid md:grid-cols-1 gap-4">
                <div>
                  <label className="block text-zinc-400 text-xs uppercase tracking-[0.2em] mb-2">
                    {lang === 'ro' ? 'Parolă nouă' : 'New password'}
                  </label>
                  <input
                    type="password"
                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 focus:border-amber-600 focus:outline-none"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={lang === 'ro' ? 'Minim 6 caractere' : 'At least 6 chars'}
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs uppercase tracking-[0.2em] mb-2">
                    {lang === 'ro' ? 'Confirmă parola' : 'Confirm password'}
                  </label>
                  <input
                    type="password"
                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 focus:border-amber-600 focus:outline-none"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              {formError && (
                <div className="text-red-400 text-sm">{formError}</div>
              )}
              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={saving}>{saving ? t('saving') : t('save')}</Button>
                {!user.isVip && (
                  <Button variant="secondary" type="button" onClick={handleSubscribe} disabled={subscribing}>
                    {subscribing ? 'Se proceseaza...' : 'UPGRADE VIP (25 lei)'}
                  </Button>
                )}
              </div>
            </form>

            {/* Danger zone: delete account */}
            <div className="mt-6 p-4 border border-red-800 bg-red-900/10 rounded-lg">
              <p className="text-sm text-red-300 font-semibold mb-2">{t('deleteAccount')}</p>
              <p className="text-xs text-red-200/80 mb-3">{t('deleteDesc')}</p>
              <Button
                type="button"
                variant="outline"
                className="border-red-700 text-red-300 hover:text-white hover:border-red-500"
                onClick={() => setShowDeleteModal(true)}
                disabled={deleting}
              >
                {deleting ? (lang === 'ro' ? 'Se sterge...' : 'Deleting...') : t('deleteAccount')}
              </Button>
            </div>
          </div>

        <div className="lg:col-span-2 bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">{t('watchlist')}</p>
              <h2 className="text-2xl font-bold">{t('yourTitles')}</h2>
            </div>
          </div>
          {watchlist.length === 0 && (
            <div className="text-zinc-500 text-sm">{lang === 'ro' ? 'Inca nu ai adaugat filme. Salveaza din pagina principala.' : 'No saved movies yet. Add from the main page.'}</div>
          )}
          <div className="grid md:grid-cols-1 gap-4">
            {watchlist.map((item) => {
              const addedDate = item.createdAt ? new Date(item.createdAt) : null;
              const addedText =
                addedDate && !isNaN(addedDate.getTime()) ? addedDate.toLocaleString('ro-RO') : '-';
              const imdbUrl = item.imdbId
                ? `https://www.imdb.com/title/${item.imdbId}/`
                : `https://www.imdb.com/find/?q=${encodeURIComponent(item.title)}`;
              return (
                <div key={item.id} className="p-4 bg-black/50 border border-zinc-800 rounded-lg">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-lg text-amber-200">{item.title}</h4>
                      <p className="text-xs text-zinc-500">
                        {item.year || '-'} {item.director ? '• ' + item.director : ''}
                      </p>
                    </div>
                    <button
                      onClick={async () => { await removeWatchlistItem(item.id); await refresh(); }}
                      className="text-[10px] uppercase bg-red-900 text-red-100 px-2 py-1 rounded border border-red-700 hover:bg-red-800 transition-colors"
                    >
                      {t('inWatchlist')}
                    </button>
                  </div>
                  {/* Intro hidden in dashboard watchlist as per request */}
                  <p className="text-[11px] text-zinc-500 mt-2">{t('addAt')}: {addedText}</p>

                  {/* Dropdowns for synopsis and reason if present */}
                  {(item.synopsis || item.reason) && (
                    <div className="mt-3 space-y-2">
                      {item.synopsis && (
                        <div className="border border-zinc-800 rounded-lg overflow-hidden">
                          <button
                            onClick={() => setOpenSynopsis((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                            className="w-full flex items-center justify-between px-3 py-2 bg-zinc-900 text-left text-xs font-bold text-amber-300"
                          >
                            <span>{lang === 'ro' ? 'Despre film' : 'About the movie'}</span>
                            <span className="text-[10px] text-zinc-400">{openSynopsis[item.id] ? '▲' : '▼'}</span>
                          </button>
                          {openSynopsis[item.id] && (
                            <div className="px-3 py-2 text-sm text-zinc-200 leading-relaxed bg-zinc-950">
                              {item.synopsis}
                            </div>
                          )}
                        </div>
                      )}

                      {item.reason && (
                        <div className="border border-zinc-800 rounded-lg overflow-hidden">
                          <button
                            onClick={() => setOpenReason((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                            className="w-full flex items-center justify-between px-3 py-2 bg-zinc-900 text-left text-xs font-bold text-amber-300"
                          >
                            <span>{lang === 'ro' ? 'De ce să te uiți' : 'Why watch'}</span>
                            <span className="text-[10px] text-zinc-400">{openReason[item.id] ? '▲' : '▼'}</span>
                          </button>
                          {openReason[item.id] && (
                            <div className="px-3 py-2 text-sm text-amber-100 leading-relaxed bg-zinc-950">
                              {item.reason}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                    <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-zinc-400">
                      <a href={imdbUrl} target="_blank" rel="noreferrer" className="text-[#f5c518] font-bold">
                        IMDb
                      </a>
                      {SEARCH_PLATFORMS.map((platform) => (
                        <a
                          key={platform.name}
                          href={`${platform.url}${encodeURIComponent(item.originalTitle || item.title)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="uppercase tracking-wide hover:text-white transition-colors"
                        >
                          {platform.name}
                        </a>
                      ))}
                    </div>
                </div>
              );
            })}
          </div>
        </div>


        </div>





        {user.isVip && (
          <div className="bg-zinc-900/70 border border-amber-900/40 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{t('vipHistory')}</h2>
              </div>
            </div>
            {!user.movieHistory?.length && (
              <div className="text-sm text-zinc-500">{t('historyEmpty')}</div>
            )}
            <div className="space-y-3">
              {user.movieHistory?.map((item) => {
                const createdDate = item.createdAt ? new Date(item.createdAt) : null;
                const createdText =
                  createdDate && !isNaN(createdDate.getTime()) ? createdDate.toLocaleString('ro-RO') : '-';
                const main = item.result;
                const prefList = (item.preferences || []).map((p) => genreLabels[p]?.[lang] ?? p);
                return (
                  <div key={item.id} className="p-4 bg-black/50 border border-zinc-800 rounded-lg">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p>
                          <span className="font-bold text-lg text-amber-200">{main?.title || item.quizName}</span>
                          <span style={{ display:"inline-block", marginLeft:"10px" }} className="text-[11px] text-zinc-500">{createdText}</span>                          
                        </p>
                      </div>
                      <button
                        onClick={() => setOpenHistory((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                        className="text-[11px] uppercase bg-zinc-800 text-zinc-200 px-2 py-1 rounded border border-zinc-700 hover:bg-zinc-700 transition-colors"
                      >
                        {openHistory[item.id] ? t('hideDetails') : t('viewDetails')}
                      </button>
                    </div>

                    {openHistory[item.id] && (
                      <div className="mt-3 space-y-3 text-sm text-zinc-200">
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{t('quizName')}</p>
                            <p className="font-semibold">{item.quizName}</p>
                            {prefList.length > 0 && (
                              <p className="text-xs text-zinc-400">
                                {t('preferences')}: {prefList.join(', ')}
                              </p>
                            )}
                          </div>
                          {item.answers?.length ? (
                            <div>
                              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{t('answers')}</p>
                              <ul className="mt-1 space-y-1 text-xs text-zinc-300">
                                {item.answers.map((qa, idx) => (
                                  <li key={`${item.id}-ans-${idx}`}>
                                    <span className="text-zinc-500">Q{idx + 1}:</span> {qa.question}{' '}
                                    <span className="text-amber-300">→ {qa.answer}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : null}
                        </div>

                        {main && (
                          <div className="grid md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{t('mainRecommendation')}</p>
                              <p className="font-semibold text-amber-100">{main.title}</p>
                              <p className="text-[11px] text-zinc-400">
                                {[main.originalTitle, main.genre, main.year, main.director]
                                  .filter(Boolean)
                                  .join(' • ')}
                              </p>
                            </div>
                            <div className="space-y-2">
                              {main.synopsis && (
                                <div className="text-xs text-zinc-300 bg-zinc-900 border border-zinc-800 rounded p-2">
                                  {main.synopsis}
                                </div>
                              )}
                              {main.reason && (
                                <div className="text-xs text-amber-200 bg-zinc-900 border border-amber-900/50 rounded p-2">
                                  {main.reason}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {item.alternatives?.length ? (
                          <div className="space-y-2">
                            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{t('alternatives')}</p>
                            <div className="grid md:grid-cols-3 gap-3">
                              {item.alternatives.map((alt, idx) => (
                                <div key={`${item.id}-alt-${idx}`} className="p-3 bg-zinc-900 border border-zinc-800 rounded">
                                  <p className="font-semibold text-zinc-100">{alt.title}</p>
                                  <p className="text-[11px] text-zinc-400">
                                    {[alt.originalTitle, alt.genre, alt.year, alt.director].filter(Boolean).join(' • ')}
                                  </p>
                                  {alt.synopsis && <p className="text-xs text-zinc-500 mt-2">{alt.synopsis}</p>}
                                  {alt.reason && <p className="text-xs text-amber-200 mt-1">{alt.reason}</p>}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!user.isVip && (
          <div className="bg-gradient-to-r from-red-950/40 via-zinc-900/80 to-black border border-red-900/60 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-red-400">Ce deblochezi cu VIP</p>
                <h2 className="text-2xl font-bold">Functii disponibile dupa upgrade</h2>
              </div>
              <Button onClick={handleSubscribe} disabled={subscribing}>
                UPGRADE VIP (25 lei)
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {vipPreview.map((item) => (
                <div key={item.title} className="p-4 bg-black/60 border border-red-900/40 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-lg">{item.title}</h4>
                    <span className="text-[10px] uppercase text-red-300">Blocat</span>
                  </div>
                  <p className="text-sm text-zinc-400">{item.desc}</p>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600" style={{ width: `${item.progress}%` }}></div>
                  </div>
                  <p className="text-[11px] text-zinc-500">Grafic demonstrativ al accesului</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete account modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !deleting && setShowDeleteModal(false)}></div>
          <div className="relative w-full max-w-md bg-zinc-900 border border-red-700 rounded-xl shadow-2xl p-6 text-center animate-fade-in-up">
            <div className="text-4xl mb-3 text-red-400">!</div>
            <h3 className="text-2xl font-bold text-white mb-2">{t('deleteAccount')}</h3>
            <p className="text-sm text-red-200 mb-4">{t('deleteConfirm')}</p>
            <p className="text-xs text-zinc-400 mb-6">{t('deleteDesc')}</p>
            <div className="flex flex-col gap-3">
              <Button
                type="button"
                variant="outline"
                className="border-zinc-700 text-zinc-300 hover:text-white"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                {t('deleteCancel')}
              </Button>
              <Button
                type="button"
                className="bg-red-700 hover:bg-red-600 border border-red-800 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                onClick={performDeleteAccount}
                disabled={deleting}
              >
                {deleting ? (lang === 'ro' ? 'Se sterge...' : 'Deleting...') : t('deleteConfirmAction')}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer
        onNavigate={(v) => (v === 'landing' ? router.push(`/?lang=${lang}`) : router.push(`/?lang=${lang}`))}
        lang={lang}
        isVip={!!user.isVip}
        onUpgrade={() => router.push('/dashboard')}
      />
    </div>
  );
};

export default DashboardPage;
