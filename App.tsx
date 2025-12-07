
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppState, QuizCategory, RecommendationResponse, Language, MovieRecommendation } from './types';
import { getQuizCategories } from './constants';
import { Quiz } from './components/Quiz';
import { MovieResult } from './components/MovieResult';
import { Button } from './components/Button';
import { Footer } from './components/Footer';
import { HowItWorks } from './components/HowItWorks';
import { AuthModal } from './components/AuthModal';
import { PricingSection } from './components/PricingSection';
import { getMovieRecommendation } from './services/geminiService';
import { getTranslation } from './translations';
import { useAuth } from './components/auth/AuthProvider';

interface AppProps {
  initialState?: AppState;
}

const App: React.FC<AppProps> = ({ initialState = 'landing' }) => {
  const router = useRouter();
  const { user, addWatchlistItem, useTicket, refresh } = useAuth();

  const getInitialLanguage = (): Language => {
    if (typeof window === 'undefined') return 'ro';
    const params = new URLSearchParams(window.location.search);
    const param = params.get('lang');
    if (param === 'ro' || param === 'en') return param;
    const stored = window.localStorage.getItem('cefilm_lang');
    if (stored === 'ro' || stored === 'en') return stored;
    const nav = navigator.language?.toLowerCase() || '';
    return nav.startsWith('ro') ? 'ro' : 'en';
  };

  const [appState, setAppState] = useState<AppState>(initialState);
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [recommendationResult, setRecommendationResult] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showAccountCreated, setShowAccountCreated] = useState(false);
  const [showAddedModal, setShowAddedModal] = useState<{open: boolean; title?: string}>({open: false});
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [dailyTickets, setDailyTickets] = useState<number | null>(null);

  // Support deep links from dashboard (?view=category-select / ?view=how-it-works)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    if (view === 'category-select') {
      setAppState('category-select');
    } else if (view === 'how-it-works') {
      setAppState('how-it-works');
    }
  }, []);
  
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  useEffect(() => {
    if (user && typeof user.freeTickets === 'number') {
      setDailyTickets(user.freeTickets);
    } else if (!user) {
      setDailyTickets(null); // show loading state until fetched
      fetch('/api/guest/tickets', { credentials: 'include' })
        .then((res) => res.json())
        .then((data) => {
          if (typeof data.remaining === 'number') setDailyTickets(data.remaining);
        })
        .catch(() => {});
    }
  }, [user]);

  // Hero Card Animation State
  // 0: Start (All gray)
  // 1: Step 1 Line Growing
  // 2: Step 1 Done (Check), Step 2 Line Growing
  // 3: Step 2 Done (Check), Step 3 Fades In
  // 4: Final Pause
  const [activeStep, setActiveStep] = useState(0);

  // Helper to change view and scroll to top
  const transitionTo = (newState: AppState) => {
    setAppState(newState);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update Page Title for SEO (State based only)
  useEffect(() => {
    const baseTitle = "CEFILM? - Your Movie Adviser";
    let pageTitle = baseTitle;

    switch(appState) {
        case 'how-it-works':
            pageTitle = `Cum funcționează | ${baseTitle}`;
            break;
        case 'category-select':
            pageTitle = `Alege Filmul | ${baseTitle}`;
            break;
        case 'quiz':
            pageTitle = `Quiz: ${selectedCategory?.title || 'Personalizat'} | ${baseTitle}`;
            break;
        case 'result':
            pageTitle = `Recomandare: ${recommendationResult?.main.title || 'Pentru Tine'} | ${baseTitle}`;
            break;
        default:
            pageTitle = baseTitle;
    }
    document.title = pageTitle;
  }, [appState, selectedCategory, recommendationResult]);

  // Available genres for filtering
  const genres = [
    { id: 'drama', key: 'genre_drama' },
    { id: 'comedy', key: 'genre_comedy' },
    { id: 'thriller', key: 'genre_thriller' },
    { id: 'horror', key: 'genre_horror' },
    { id: 'scifi', key: 'genre_scifi' },
    { id: 'romance', key: 'genre_romance' },
    { id: 'action', key: 'genre_action' },
    { id: 'adventure', key: 'genre_adventure' },
    { id: 'fantasy', key: 'genre_fantasy' },
    { id: 'mystery', key: 'genre_mystery' },
    { id: 'animation', key: 'genre_animation' },
    { id: 'documentary', key: 'genre_documentary' },
  ];

  const toggleGenre = (genreId: string) => {
    if (selectedGenres.includes(genreId)) {
        setSelectedGenres(selectedGenres.filter(g => g !== genreId));
    } else {
        setSelectedGenres([...selectedGenres, genreId]);
    }
  };

  const clearGenres = () => {
    setSelectedGenres([]);
  };

  const recordVipHistory = async ({
    quizName,
    preferences,
    answers,
    result,
  }: {
    quizName: string;
    preferences: string[];
    answers: { question: string; answer: string }[];
    result: RecommendationResponse;
  }) => {
    if (!user?.isVip) return;
    try {
      await fetch('/api/user/history', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizName,
          preferences,
          answers,
          result: {
            title: result.main.title,
            originalTitle: result.main.originalTitle,
            year: result.main.year,
            director: result.main.director,
            genre: result.main.genre,
            synopsis: result.main.synopsis,
            reason: result.main.reason,
            imdbId: result.main.imdbId,
          },
          alternatives: (result.alternatives || []).map((alt) => ({
            title: alt.title,
            originalTitle: alt.originalTitle,
            year: alt.year,
            director: alt.director,
            genre: alt.genre,
            synopsis: alt.synopsis,
            reason: alt.reason,
            imdbId: alt.imdbId,
          })),
          foundAt: new Date().toISOString(),
        }),
      });
      await refresh();
    } catch {
      // silent fail
    }
  };

  // Generate stars for background
  useEffect(() => {
    const container = document.getElementById('star-container');
    if (container && container.childElementCount === 0) {
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.top = `${Math.random() * 100}%`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 5}s`;
            container.appendChild(star);
        }
    }
  }, []);

  // Animation Loop for Hero Card with Variable Timing
  useEffect(() => {
    if (appState !== 'landing') return;

    let timeout: NodeJS.Timeout;

    if (activeStep === 4) {
        // Long pause at the end (Full ticket visible)
        timeout = setTimeout(() => {
            setActiveStep(0);
        }, 4000);
    } else {
        // Speed for line growing phases
        timeout = setTimeout(() => {
            setActiveStep(prev => prev + 1);
        }, 1500);
    }

    return () => clearTimeout(timeout);
  }, [activeStep, appState]);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    setIsLangMenuOpen(false);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('cefilm_lang', lang);
      const url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      window.history.replaceState({}, '', url.toString());
    }

    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  };

  // Persist language selection across navigation and update <html lang>
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('cefilm_lang', language);
      const url = new URL(window.location.href);
      url.searchParams.set('lang', language);
      window.history.replaceState({}, '', url.toString());
    }
  }, [language]);

  const goToDashboard = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleAddToWatchlist = async (movie: MovieRecommendation) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    await addWatchlistItem({
      title: movie.title,
      originalTitle: movie.originalTitle,
      imdbId: movie.imdbId,
      year: movie.year,
      notes: movie.synopsis,
      synopsis: movie.synopsis,
      reason: movie.reason,
      director: movie.director,
    });
    await refresh();
    setShowAddedModal({ open: true, title: movie.title });
  };

  const handleAccountCreated = () => {
    setShowAccountCreated(true);
    setIsAuthModalOpen(false);
  };

  const handleWelcome = () => {
    setShowWelcomeModal(true);
    setIsAuthModalOpen(false);
  };
  
  const startQuiz = (categoryId: string) => {
    const ticketsAvailable = user?.isVip ? 1 : user ? user.freeTickets : dailyTickets ?? 0;
    if (!user?.isVip && ticketsAvailable <= 0) {
        setShowSubscriptionModal(true);
        return;
    }

    const categories = getQuizCategories(language);
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setSelectedCategory(category);
      transitionTo('quiz');
      setError(null);
    }
  };

  const handleQuizComplete = async (answers: { question: string; answer: string }[]) => {
    if (!selectedCategory) return;
    
    transitionTo('analyzing');
    
    try {
      // Pass selectedGenres to the service
      const result = await getMovieRecommendation(selectedCategory.title, answers, language, selectedGenres);
      setRecommendationResult(result);
      await recordVipHistory({
        quizName: selectedCategory.title,
        preferences: selectedGenres,
        answers,
        result,
      });
      
      // Consume a ticket only on success
      if (user && !user.isVip) {
        await useTicket();
      } else if (!user) {
        try {
          const res = await fetch('/api/guest/tickets', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'use' }),
          });
          const data = await res.json();
          if (typeof data.remaining === 'number') {
            setDailyTickets(data.remaining);
          } else {
            setDailyTickets((prev) => Math.max(0, (prev ?? 0) - 1));
          }
        } catch {
          setDailyTickets((prev) => Math.max(0, (prev ?? 0) - 1));
        }
      }
      
      transitionTo('result');
    } catch (err) {
      setError(getTranslation('error_message', language));
      transitionTo('landing');
    }
  };

  const resetApp = () => {
    setSelectedCategory(null);
    setSelectedGenres([]);
    setRecommendationResult(null);
    setError(null);
    transitionTo('landing');
  };

  const startNewAnalysis = () => {
    // Resets state but goes directly to category selection
    setSelectedCategory(null);
    setSelectedGenres([]);
    setRecommendationResult(null);
    setError(null);
    transitionTo('category-select');
  };

  const handleNavigate = (view: 'landing' | 'how-it-works') => {
      if (view === 'how-it-works') {
        router.push('/cum-functioneaza');
      } else {
        router.push('/');
      }
      transitionTo(view);
  };

  const handleRefillTickets = () => {
      // Guests should not be able to reset; close modal only
      setShowSubscriptionModal(false);
  };

  // --- ICONS (Abstract SVG) ---
  const IconProfile = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );

  const IconWaveform = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  );

  const IconFilm = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0h-1.5m1.5 0l-1.5-1.5m-9.75 0l-1.5 1.5m0-1.5l1.5 1.5" />
    </svg>
  );

  const availableTickets = user?.isVip ? Number.POSITIVE_INFINITY : user ? user.freeTickets : dailyTickets;
  const ticketText = user?.isVip ? 'VIP' : availableTickets == null ? '...' : `${availableTickets}/5`;
  const ticketColor = user?.isVip
    ? 'text-green-400'
    : availableTickets == null
    ? 'text-zinc-500'
    : availableTickets === 0
    ? 'text-red-500'
    : 'text-amber-500';

  const startCheckout = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lang: language }),
      });
      if (res.status === 401) {
        setIsAuthModalOpen(true);
        return;
      }
      if (!res.ok) {
        setError(getTranslation('error_message', language));
        return;
      }
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url as string;
      }
    } catch {
      setError(getTranslation('error_message', language));
    }
  };

  const handleUpgrade = () => {
    if (user?.isVip) {
      router.push('/dashboard');
    } else {
      startCheckout();
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-black text-white overflow-hidden">
      
      {/* Background FX */}
      <div className="film-grain"></div>
      <div id="star-container" className="stars-container"></div>
      
      {/* Dynamic Background Images based on State */}
      <div className={`fixed inset-0 transition-opacity duration-1000 ease-in-out pointer-events-none z-0 ${appState === 'landing' ? 'opacity-30' : 'opacity-10'}`}>
         {/* A subtle red curtain or stage ambient light */}
         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-red-950/20"></div>
         <div className="spotlight"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 bg-gradient-to-b from-black/90 to-transparent border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6 flex justify-between items-center">
            {/* Logo Left */}
            <Link href="/" onClick={resetApp} className="flex flex-col cursor-pointer group">
                <div className="cinema-font text-xl md:text-3xl font-bold gold-text tracking-widest group-hover:scale-105 transition-transform duration-500">
                CEFILM?
                </div>
                {/* Desktop Subtitle */}
                <div className="hidden md:block text-[10px] text-zinc-500 uppercase tracking-[0.3em] mt-1 group-hover:text-zinc-400 transition-colors">
                    Your Movie Adviser
                </div>
            </Link>
            
            {/* Menu Right */}
            <nav className="flex items-center gap-2 md:gap-8">
                
                {/* TICKET COUNTER (Monetization UI) */}
                <div 
                    className="flex items-center gap-2 bg-zinc-900 border border-amber-900/50 rounded px-2 md:px-3 py-1 cursor-help"
                    title={getTranslation('tickets_tooltip', language)}
                >
                    <span className="text-lg md:text-xl">🎟️</span>
                    <span className={`cinema-font font-bold text-xs md:text-sm ${ticketColor}`}>
                        {ticketText}
                    </span>
                </div>

                <Link 
                    href="/alege-un-film"
                    className="hidden lg:block text-zinc-400 hover:text-white uppercase text-xs tracking-[0.15em] transition-colors font-bold"
                >
                    {getTranslation('nav_pick_movie', language)}
                </Link>
                <Link 
                    href="/cum-functioneaza"
                    className="hidden lg:block text-zinc-400 hover:text-white uppercase text-xs tracking-[0.15em] transition-colors font-bold"
                >
                    {getTranslation('nav_how_it_works', language)}
                </Link>
                
                {/* Language Switcher */}
                <div className="relative">
                    <button 
                        onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                        className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors p-2"
                    >
                        <span className="uppercase text-xs font-bold">{language}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                    </button>
                    
                    {isLangMenuOpen && (
                        <div className="absolute right-0 mt-2 w-16 bg-zinc-900 border border-zinc-700 rounded shadow-xl z-50">
                            <button 
                                onClick={() => changeLanguage('ro')}
                                className={`w-full text-left px-3 py-2 text-xs uppercase hover:bg-zinc-800 ${language === 'ro' ? 'text-amber-500 font-bold' : 'text-zinc-300'}`}
                            >
                                RO
                            </button>
                            <button 
                                onClick={() => changeLanguage('en')}
                                className={`w-full text-left px-3 py-2 text-xs uppercase hover:bg-zinc-800 ${language === 'en' ? 'text-amber-500 font-bold' : 'text-zinc-300'}`}
                            >
                                EN
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {/* Watchlist Icon */}
                    <button 
                        onClick={() => goToDashboard()}
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
                        onClick={() => goToDashboard()}
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

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        lang={language}
        onRegistered={handleAccountCreated}
        onLoginSuccess={handleWelcome}
      />

      {/* Account Created Modal */}
      {showAccountCreated && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowAccountCreated(false)}
          ></div>
          <div className="relative w-full max-w-md bg-zinc-900 border border-green-700 rounded-lg shadow-2xl p-8 text-center animate-fade-in-up">
            <div className="text-5xl mb-4 text-green-400">🔒</div>
            <h2 className="text-2xl font-bold text-white mb-2">Cont creat cu succes</h2>
            <p className="text-zinc-400 mb-6">Te-ai autentificat automat. Poți accesa dashboard-ul sau să continui să cauți filme.</p>
            <div className="flex flex-col gap-3">
              <Button fullWidth onClick={() => { router.push('/dashboard'); setShowAccountCreated(false); }}>Deschide Dashboard</Button>
              <Button variant="outline" fullWidth onClick={() => setShowAccountCreated(false)}>Continuă</Button>
            </div>
          </div>
        </div>
      )}

      {/* Watchlist Added Modal */}
      {showAddedModal.open && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowAddedModal({ open: false })}
          ></div>
          <div className="relative w-full max-w-md bg-zinc-900 border border-amber-600 rounded-lg shadow-2xl p-8 text-center animate-fade-in-up">
            <div className="text-4xl mb-4 text-amber-400">✓</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {language === 'ro' ? 'Adăugat în watchlist' : 'Added to watchlist'}
            </h2>
            <p className="text-zinc-400 mb-6">
              {showAddedModal.title}
            </p>
            <div className="space-y-3">
              <Button fullWidth onClick={() => setShowAddedModal({ open: false })}>
                {language === 'ro' ? 'Ok' : 'Ok'}
              </Button>
              <Button variant="outline" fullWidth onClick={() => { router.push('/dashboard'); setShowAddedModal({ open: false }); }}>
                {language === 'ro' ? 'Deschide dashboard' : 'Open dashboard'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowWelcomeModal(false)}
          ></div>
          <div className="relative w-full max-w-md bg-zinc-900 border border-green-600 rounded-lg shadow-2xl p-8 text-center animate-fade-in-up">
            <div className="text-4xl mb-4 text-green-400">🔒</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {language === 'ro' ? 'Bine ai revenit!' : 'Welcome back!'}
            </h2>
            <p className="text-zinc-400 mb-6">
              {language === 'ro' ? 'Te-ai autentificat cu succes.' : 'You signed in successfully.'}
            </p>
            <div className="space-y-3">
              <Button fullWidth onClick={() => setShowWelcomeModal(false)}>
                {language === 'ro' ? 'Continuă' : 'Continue'}
              </Button>
              <Button variant="outline" fullWidth onClick={() => { router.push('/dashboard'); setShowWelcomeModal(false); }}>
                {language === 'ro' ? 'Deschide dashboard' : 'Open dashboard'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription / Ticket Limit Modal */}
      {showSubscriptionModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity"
                onClick={() => setShowSubscriptionModal(false)}
            ></div>
            <div className="relative w-full max-w-md bg-zinc-900 border border-amber-600 rounded-lg shadow-2xl p-8 text-center animate-fade-in-up">
                 <div className="text-4xl mb-4">🎟️</div>
                 <h2 className="text-2xl cinema-font text-white mb-2">{getTranslation('sub_title', language)}</h2>
                 <p className="text-zinc-400 mb-8">{getTranslation('sub_desc', language)}</p>
                 <div className="space-y-3">
                    <Button
                      fullWidth
                      onClick={() => {
                        setShowSubscriptionModal(false);
                        handleUpgrade();
                      }}
                    >
                      {getTranslation('sub_btn_upgrade', language)}
                    </Button>
                    {/* Demo reset removed as requested */}
                 </div>
            </div>
          </div>
      )}

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow flex flex-col justify-center items-center">
        
        {error && (
            <div className="max-w-md mx-auto mb-8 p-4 bg-red-900/50 border border-red-700 text-red-200 text-center rounded backdrop-blur-md">
                {error}
            </div>
        )}

        {/* --- LANDING PAGE --- */}
        {appState === 'landing' && (
          <div className="w-full flex flex-col">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12 animate-fade-in">
                
                {/* Left Column: Text */}
                <div className="space-y-8 text-center lg:text-left order-2 lg:order-1">
                
                {/* Mobile-Only Badge */}
                <div className="md:hidden inline-block border border-amber-600/30 bg-amber-900/10 px-4 py-1 rounded-full text-amber-500 text-xs font-bold tracking-widest uppercase mb-4">
                    {getTranslation('landing_now_showing', language)}
                </div>
                
                {/* UPDATED TITLE STRUCTURE - Single Key, Pre-Line whitespace */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight cinema-font drop-shadow-2xl whitespace-pre-line text-white">
                    {getTranslation('landing_title', language)}
                </h1>
                
                <p className="text-lg md:text-xl text-zinc-400 font-light max-w-lg mx-auto lg:mx-0 leading-relaxed">
                    {getTranslation('landing_subtitle', language)}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6">
                    <Link
                        href="/alege-un-film"
                        className="text-sm px-8 py-5 rounded uppercase tracking-widest font-bold transition-all duration-300 cinema-font bg-red-800 hover:bg-red-700 text-white shadow-[0_0_40px_rgba(220,38,38,0.5)] border border-red-600 text-center w-full sm:w-64"
                    >
                      {getTranslation('btn_pick_movie', language)}
                    </Link>
                    <Link 
                        href="/cum-functioneaza"
                        className="px-8 py-5 border border-zinc-700 text-zinc-300 hover:text-white hover:border-white rounded transition-all cinema-font uppercase tracking-widest text-sm w-full sm:w-64 text-center"
                    >
                        {getTranslation('btn_how_it_works', language)}
                    </Link>
                </div>
                </div>

                {/* Right Column: Visual Process Card - CINEMA TICKET STYLE */}
                <div className="hidden lg:flex relative order-1 lg:order-2 justify-center perspective-1000">
                    <div className="relative w-96 h-[450px] bg-[#111] rounded-lg overflow-hidden flex flex-col shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white/5">
                        
                        {/* Ticket Perforations (Visual Simulation) */}
                        <div className="absolute top-[50%] -left-3 w-6 h-6 bg-black rounded-full z-20 border-r border-white/10"></div>
                        <div className="absolute top-[50%] -right-3 w-6 h-6 bg-black rounded-full z-20 border-l border-white/10"></div>
                        
                        {/* Top Section (Stub - Steps 1 & 2) */}
                        <div className="h-[50%] p-6 flex flex-col justify-center border-b-2 border-dashed border-zinc-800 relative bg-zinc-900">
                             
                             {/* Step 1 */}
                             <div className="flex items-center gap-5 mb-6">
                                 <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors duration-500 ${activeStep >= 1 ? 'bg-amber-900/20 border-amber-600 text-amber-500 shadow-[0_0_10px_rgba(217,119,6,0.3)]' : 'bg-zinc-900 border-zinc-700 text-zinc-600'}`}>
                                    <IconProfile />
                                 </div>
                                 <div className="flex-1">
                                     <div className="text-zinc-600 text-[10px] uppercase tracking-widest font-bold">Step 01</div>
                                     <div className={`font-bold cinema-font text-sm transition-colors duration-500 ${activeStep >= 1 ? 'text-amber-100' : 'text-zinc-600'}`}>{getTranslation('hero_step_1', language)}</div>
                                 </div>
                                 <div className="w-8 h-8 flex items-center justify-center">
                                    {activeStep > 1 ? (
                                        <span className="text-green-500 font-bold text-xl animate-fade-in">✓</span>
                                    ) : (
                                        <div className="w-full h-1 bg-zinc-800 rounded overflow-hidden">
                                            <div className={`h-full bg-amber-600 transition-all duration-[1500ms] ease-linear ${activeStep === 1 ? 'w-full' : 'w-0'}`}></div>
                                        </div>
                                    )}
                                 </div>
                             </div>

                             {/* Step 2 */}
                             <div className="flex items-center gap-5">
                                 <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors duration-500 ${activeStep >= 2 ? 'bg-amber-900/20 border-amber-600 text-amber-500 shadow-[0_0_10px_rgba(217,119,6,0.3)]' : 'bg-zinc-900 border-zinc-700 text-zinc-600'}`}>
                                    <IconWaveform />
                                 </div>
                                 <div className="flex-1">
                                     <div className="text-zinc-600 text-[10px] uppercase tracking-widest font-bold">Step 02</div>
                                     <div className={`font-bold cinema-font text-sm transition-colors duration-500 ${activeStep >= 2 ? 'text-amber-100' : 'text-zinc-600'}`}>{getTranslation('hero_step_2', language)}</div>
                                 </div>
                                 <div className="w-8 h-8 flex items-center justify-center">
                                    {activeStep > 2 ? (
                                        <span className="text-green-500 font-bold text-xl animate-fade-in">✓</span>
                                    ) : (
                                        <div className="w-full h-1 bg-zinc-800 rounded overflow-hidden">
                                            <div className={`h-full bg-amber-600 transition-all duration-[1500ms] ease-linear ${activeStep === 2 ? 'w-full' : 'w-0'}`}></div>
                                        </div>
                                    )}
                                 </div>
                             </div>
                        </div>

                        {/* Bottom Section (Main - Step 3) */}
                        <div className={`h-[50%] flex flex-col justify-center items-center text-center transition-all duration-700 p-6 ${activeStep >= 3 ? 'bg-gradient-to-b from-red-950/20 to-zinc-900' : 'bg-zinc-950'}`}>
                             
                             <div className={`transition-all duration-700 transform flex flex-col items-center ${activeStep >= 3 ? 'scale-100 opacity-100' : 'scale-90 opacity-20 blur-sm'}`}>
                                <div className={`w-16 h-16 rounded-full border-2 mb-4 flex items-center justify-center transition-colors duration-500 ${activeStep >= 3 ? 'border-red-600 text-red-500 bg-red-900/30 shadow-[0_0_20px_rgba(220,38,38,0.3)]' : 'border-zinc-800 text-zinc-700'}`}>
                                    <IconFilm />
                                </div>
                                
                                <div className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] mb-2">Step 03</div>
                                <h3 className={`text-2xl md:text-3xl cinema-font font-bold mb-3 ${activeStep >= 3 ? 'gold-text drop-shadow-lg' : 'text-zinc-700'}`}>
                                    {getTranslation('hero_step_3', language)}
                                </h3>
                                
                                {activeStep >= 3 ? (
                                    <div className="inline-block px-3 py-1 border border-green-500/50 rounded-full bg-green-900/20 text-green-400 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                                        Match Found
                                    </div>
                                ) : (
                                    <div className="h-6"></div>
                                )}
                             </div>

                        </div>
                    </div>
                    
                    {/* Floating Elements */}
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 -left-10 w-32 h-32 bg-amber-600/5 rounded-full blur-3xl"></div>
                </div>
            </div>
            
            {/* --- PRICING SECTION --- */}
            <PricingSection 
              lang={language} 
              onUpgrade={handleUpgrade} 
              isVip={!!user?.isVip}
            />
            
          </div>
        )}

        {/* --- OTHER PAGES --- */}
        {appState === 'how-it-works' && (
            <HowItWorks 
                onBack={() => transitionTo('landing')} 
                onStart={() => startNewAnalysis()} 
                lang={language}
                onUpgrade={handleUpgrade}
                isVip={!!user?.isVip}
            />
        )}

        {appState === 'category-select' && (
          <div className="max-w-7xl mx-auto w-full animate-fade-in-up px-4 py-8">
            <h2 className="text-center text-4xl mb-4 cinema-font text-white drop-shadow-lg">{getTranslation('category_title', language)}</h2>
            <p className="text-center text-zinc-500 mb-8 max-w-2xl mx-auto">{getTranslation('category_subtitle', language)}</p>
            
            {/* --- GENRE FILTERS --- */}
            <div className="mb-12 max-w-4xl mx-auto">
                <p className="text-center text-amber-600 text-xs uppercase tracking-[0.2em] mb-4 font-bold">
                    {getTranslation('genre_label', language)}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                    {/* "Any Genre" Button */}
                    <button
                        onClick={clearGenres}
                        className={`px-4 py-2 rounded text-xs uppercase tracking-wider border transition-all duration-300 ${
                            selectedGenres.length === 0 
                            ? 'bg-amber-700 border-amber-600 text-white font-bold shadow-[0_0_10px_rgba(180,83,9,0.3)]' 
                            : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
                        }`}
                    >
                        {getTranslation('genre_any', language)}
                    </button>

                    {/* Specific Genre Buttons */}
                    {genres.map((g) => (
                        <button
                            key={g.id}
                            onClick={() => toggleGenre(g.id)}
                            className={`px-4 py-2 rounded text-xs uppercase tracking-wider border transition-all duration-300 ${
                                selectedGenres.includes(g.id)
                                ? 'bg-zinc-800 border-amber-500 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.1)]'
                                : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
                            }`}
                        >
                            {getTranslation(g.key, language)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {getQuizCategories(language).map((category) => (
                <button
                  key={category.id}
                  onClick={() => startQuiz(category.id)}
                  className="group relative overflow-hidden rounded-xl bg-zinc-900/40 border border-zinc-800 p-8 text-left transition-all duration-300 hover:scale-[1.02] hover:bg-zinc-900/80 hover:border-red-900/50 hover:shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-sm"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <span className="text-6xl grayscale group-hover:grayscale-0 transition-all">{category.icon}</span>
                  </div>
                  
                  <div className="relative z-10 mt-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-800 to-black border border-zinc-700 flex items-center justify-center text-2xl mb-6 shadow-lg group-hover:border-red-700 transition-colors">
                        {category.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-3 cinema-font text-zinc-100 group-hover:text-red-500 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed border-t border-zinc-800 pt-4 group-hover:border-red-900/30 transition-colors">
                      {category.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {appState === 'quiz' && selectedCategory && (
          <Quiz 
            category={selectedCategory} 
            lang={language}
            onComplete={handleQuizComplete}
            onCancel={() => transitionTo('category-select')}
          />
        )}

        {appState === 'analyzing' && (
          <div className="text-center relative z-20">
            <div className="relative inline-block w-32 h-32 mb-8">
                <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-red-600 rounded-full animate-spin"></div>
                <div className="absolute inset-4 bg-zinc-900 rounded-full flex items-center justify-center text-4xl animate-pulse">
                    🎬
                </div>
            </div>
            <h2 className="text-3xl cinema-font mb-2 animate-pulse gold-text">{getTranslation('analyzing_title', language)}</h2>
            <p className="text-zinc-500 tracking-widest uppercase text-sm">{getTranslation('analyzing_subtitle', language)}</p>
          </div>
        )}

        {appState === 'result' && recommendationResult && (
          <MovieResult 
            result={recommendationResult} 
            lang={language}
            onReset={startNewAnalysis} 
            onAddToWatchlist={handleAddToWatchlist}
          />
        )}
      </main>

      {/* Footer is visible on all pages */}
      <Footer 
        onNavigate={handleNavigate} 
        lang={language} 
        isVip={!!user?.isVip}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
};

export default App;
