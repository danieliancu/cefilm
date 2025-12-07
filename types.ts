
export type Language = 'ro' | 'en';

export interface Answer {
  id: string;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  options: Answer[];
}

export interface QuizCategory {
  id: 'personality' | 'mood' | 'events' | 'social' | 'time-travel';
  title: string;
  description: string;
  icon: string;
  questions: Question[];
}

export interface MovieRecommendation {
  title: string;
  originalTitle: string;
  year: string;
  director: string;
  genre: string;
  synopsis?: string; // Optional for alternatives
  reason?: string;   // Optional for alternatives
  imdbId: string;
}

export interface RecommendationResponse {
  main: MovieRecommendation;
  alternatives: MovieRecommendation[];
}

export type AppState = 'landing' | 'how-it-works' | 'category-select' | 'quiz' | 'analyzing' | 'result';

export interface WatchlistItem {
  id: string;
  title: string;
  originalTitle?: string | null;
  imdbId?: string | null;
  year?: string | null;
  notes?: string | null;
  synopsis?: string | null;
  reason?: string | null;
  director?: string | null;
  createdAt: string;
}

export interface MovieHistoryItem {
  id: string;
  title: string;
  description?: string | null;
  foundAt: string;
}

export interface VipHistoryItem {
  id: string;
  createdAt: string;
  quizName: string;
  preferences: string[];
  answers: { question: string; answer: string }[];
  result: MovieRecommendation;
  alternatives: MovieRecommendation[];
}

export interface RatingItem {
  id: string;
  movieTitle: string;
  imdbId?: string | null;
  score: number;
  review?: string | null;
  createdAt: string;
}

export interface DiscussionItem {
  id: string;
  topic: string;
  body: string;
  createdAt: string;
}

export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
  isVip: boolean;
  vipSince?: string | null;
  freeTickets: number;
  lastTicketReset?: string | null;
  watchlist?: WatchlistItem[];
  movieHistory?: VipHistoryItem[];
  ratings?: RatingItem[];
  discussions?: DiscussionItem[];
}
