import React from 'react';
import { Language } from '../types';
import { getTranslation } from '../translations';
import { Button } from './Button';

interface PricingSectionProps {
  lang: Language;
  onUpgrade: () => void;
  isVip?: boolean;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ lang, onUpgrade, isVip = false }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-24 relative z-10">
      
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl cinema-font text-white mb-4 gold-text">
            {getTranslation('pricing_title', lang)}
        </h2>
        <p className="text-zinc-400 uppercase tracking-widest text-sm">
            {getTranslation('pricing_subtitle', lang)}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* FREE PLAN */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 flex flex-col h-full relative overflow-hidden group hover:border-zinc-600 transition-colors">
            <h3 className="text-xl text-zinc-300 cinema-font mb-2 uppercase tracking-wider">
                {getTranslation('plan_free_name', lang)}
            </h3>
            <div className="text-4xl text-white font-bold mb-6 cinema-font">
                {getTranslation('plan_free_price', lang)}
            </div>
            
            <ul className="space-y-4 mb-8 text-zinc-400 text-sm flex-grow list-disc pl-5">
                <li>{getTranslation('feat_tickets_limit', lang)}</li>
                <li>{getTranslation('feat_analysis_basic', lang)}</li>
            </ul>

            {!isVip && (
              <button 
                  className="w-full px-6 py-3 rounded uppercase tracking-widest font-bold border border-zinc-700 text-zinc-400 cursor-not-allowed mt-auto cinema-font"
                  disabled
              >
                  {getTranslation('plan_free_btn', lang)}
              </button>
            )}
        </div>

        {/* VIP PLAN */}
        <div className="bg-gradient-to-br from-red-950/40 to-black border border-amber-600/50 rounded-xl p-8 flex flex-col h-full relative overflow-hidden shadow-[0_0_50px_rgba(180,83,9,0.15)]">
            
            <h3 className="text-xl text-amber-500 cinema-font mb-2 uppercase tracking-wider font-bold">
                {getTranslation('plan_vip_name', lang)}
            </h3>
            <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl text-white font-bold cinema-font">{getTranslation('plan_vip_price', lang)}</span>
                <span className="text-zinc-400 text-sm">{getTranslation('plan_vip_period', lang)}</span>
            </div>
            
            <ul className="space-y-4 mb-8 text-zinc-300 text-sm flex-grow list-disc pl-5">
                <li className="font-bold text-white">
                    {getTranslation('feat_tickets_unlimited', lang)}
                </li>
                <li>{getTranslation('feat_analysis_deep', lang)}</li>
                <li>{getTranslation('feat_email', lang)}</li>
                <li>{getTranslation('feat_priority', lang)}</li>
                <li>{getTranslation('feat_rating', lang)}</li>
                <li>{getTranslation('feat_community', lang)}</li>
            </ul>

            {!isVip && (
              <Button 
                  onClick={onUpgrade} 
                  className="w-full shadow-[0_0_20px_rgba(220,38,38,0.4)] mt-auto"
              >
                  {getTranslation('plan_vip_btn', lang)}
              </Button>
            )}
            {isVip && (
              <div className="mt-auto text-center text-amber-400 font-bold uppercase tracking-wide">
                {lang === 'ro' ? 'VIP activ' : 'VIP active'}
              </div>
            )}

            {/* Shine Effect */}
            <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-shimmer pointer-events-none"></div>
        </div>

      </div>
    </div>
  );
};
