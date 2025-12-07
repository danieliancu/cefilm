import React from 'react';
import { Language } from '../types';
import { getTranslation } from '../translations';

interface FooterProps {
  onNavigate: (view: 'landing' | 'how-it-works') => void;
  lang: Language;
  onUpgrade: () => void;
  isVip?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, lang, onUpgrade, isVip = false }) => {
  return (
    <footer className="relative z-10 border-t border-zinc-900 bg-black/80 backdrop-blur-md pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="cinema-font text-xl text-amber-500 mb-1">CEFILM?</h3>
            <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em]">
              Your Movie Adviser
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <button 
              onClick={() => onNavigate('landing')} 
              className="text-zinc-400 hover:text-white uppercase text-xs tracking-[0.2em] transition-colors"
            >
              {getTranslation('nav_home', lang)}
            </button>
            <button 
              onClick={() => onNavigate('how-it-works')} 
              className="text-zinc-400 hover:text-white uppercase text-xs tracking-[0.2em] transition-colors"
            >
              {getTranslation('nav_how_it_works', lang)}
            </button>
            
            {/* Become VIP Link */}
            <button 
                onClick={onUpgrade}
                className="flex items-center gap-2 text-amber-700 hover:text-amber-500 uppercase text-xs tracking-[0.1em] transition-colors font-bold mt-2"
            >
                <span>{isVip ? '⭐ VIP' : `⭐ ${getTranslation('footer_buy_tickets', lang)}`}</span>
            </button>
          </div>

          {/* Social / Credits */}
          <div className="text-center md:text-right flex flex-col items-center md:items-end justify-center text-zinc-600 text-sm">
            <span>{getTranslation('footer_powered', lang)}</span>
            <span>&copy; {new Date().getFullYear()} {getTranslation('footer_rights', lang)}</span>
          </div>
        </div>
        
        <div className="text-center pt-8 border-t border-zinc-900">
            <p className="text-zinc-700 text-xs font-serif italic">
                {getTranslation('footer_quote', lang)}
            </p>
        </div>
      </div>
    </footer>
  );
};
