
import React from 'react';
import { Button } from './Button';
import { Language } from '../types';
import { getTranslation } from '../translations';
import { PricingSection } from './PricingSection';

interface HowItWorksProps {
  onBack: () => void;
  onStart: () => void;
  lang: Language;
  onUpgrade: () => void;
  isVip?: boolean;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onBack, onStart, lang, onUpgrade, isVip = false }) => {
  const steps = [
    {
      num: "01",
      title: getTranslation('hiw_step1_title', lang),
      desc: getTranslation('hiw_step1_desc', lang),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      )
    },
    {
      num: "02",
      title: getTranslation('hiw_step2_title', lang),
      desc: getTranslation('hiw_step2_desc', lang),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      )
    },
    {
      num: "03",
      title: getTranslation('hiw_step3_title', lang),
      desc: getTranslation('hiw_step3_desc', lang),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0h-1.5m1.5 0l-1.5-1.5m-9.75 0l-1.5 1.5m0-1.5l1.5 1.5" />
        </svg>
      )
    }
  ];

  return (
    <div className="max-w-6xl mx-auto w-full py-12 animate-fade-in-up px-6 relative z-10">
        
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl cinema-font text-white mb-4">{getTranslation('hiw_title', lang)}</h2>
        <div className="w-24 h-1 bg-red-800 mx-auto rounded-full"></div>
      </div>

      <div className="grid md:grid-cols-3 gap-12 mb-16 relative">
        {/* Connecting Line (Desktop) */}
        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-amber-900/50 to-transparent -z-10"></div>

        {steps.map((step) => (
          <div key={step.num} className="relative group">
            <div className="w-24 h-24 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:border-amber-600 transition-colors z-20 relative text-amber-500">
               {step.icon}
               <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-900 rounded-full flex items-center justify-center text-xs font-bold border border-black text-white">
                 {step.num}
               </div>
            </div>
            
            <div className="text-center bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-white/5 hover:bg-zinc-900/40 transition-all">
                <h3 className="text-xl font-bold cinema-font text-amber-100 mb-3">{step.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed font-light">
                    {step.desc}
                </p>
            </div>
          </div>
        ))}
      </div>



      {/* Pricing block (same specificații ca homepage, fără titlul "Casa de Bilete") */}
      <PricingSection lang={lang} onUpgrade={onUpgrade} isVip={isVip} showTitle={false} />


      <div className="bg-zinc-900/80 border-l-4 border-amber-600 p-8 rounded-r-lg max-w-3xl mx-auto mb-16 shadow-2xl">
         <h4 className="text-lg font-bold text-amber-500 mb-2 uppercase tracking-widest">{getTranslation('hiw_note_title', lang)}</h4>
         <p className="text-zinc-300 italic font-serif text-lg">
            {getTranslation('hiw_note_desc', lang)}
         </p>
      </div>


      <div className="flex flex-col md:flex-row justify-center gap-6">
        <button 
            onClick={onBack}
            className="px-8 py-3 rounded uppercase tracking-widest font-bold border border-zinc-700 hover:border-white text-zinc-400 hover:text-white transition-all cinema-font"
        >
            {getTranslation('hiw_back', lang)}
        </button>
        <Button onClick={onStart} className="shadow-[0_0_20px_rgba(180,83,9,0.4)]">
            {getTranslation('hiw_start', lang)}
        </Button>
      </div>

    </div>
  );
};
