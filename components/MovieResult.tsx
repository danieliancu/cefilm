import React, { useState, useEffect } from 'react';
import { RecommendationResponse, Language, MovieRecommendation } from '../types';
import { Button } from './Button';
import { getTranslation } from '../translations';
import { SEARCH_PLATFORMS } from '../constants';

interface MovieResultProps {
  result: RecommendationResponse;
  lang: Language;
  onReset: () => void;
  onAddToWatchlist: (movie: MovieRecommendation) => void;
}

export const MovieResult: React.FC<MovieResultProps> = ({ result, lang, onReset, onAddToWatchlist }) => {
  const { main, alternatives } = result;
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  
  // Logic to determine main movie URL - Use Original Title for better search results
  const mainSearchTitle = main.originalTitle || main.title;
  const mainSearchUrl = `https://www.imdb.com/find/?q=${encodeURIComponent(mainSearchTitle + ' ' + main.year)}`;
  
  // Basic validation for IMDb ID (tt followed by numbers)
  const isMainIdValid = main.imdbId && /^tt\d+$/.test(main.imdbId);
  const mainPrimaryUrl = isMainIdValid ? `https://www.imdb.com/title/${main.imdbId}/` : mainSearchUrl;
  
  // Fallback image
  const fallbackImage = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1000&auto=format&fit=crop";

  // Effect to fetch poster from Wikipedia for MAIN movie
  useEffect(() => {
    const fetchPoster = async () => {
        setPosterUrl(null); 
        try {
            const searchTerm = `${main.originalTitle} ${main.year} film`;
            const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&generator=search&gsrsearch=${encodeURIComponent(searchTerm)}&gsrlimit=1&pithumbsize=1000&origin=*`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            if (data.query && data.query.pages) {
                const pages = data.query.pages;
                const firstPageId = Object.keys(pages)[0];
                const thumbnailSource = pages[firstPageId]?.thumbnail?.source;
                if (thumbnailSource) setPosterUrl(thumbnailSource);
            }
        } catch (error) {
            console.error("Could not fetch poster", error);
        }
    };

    if (main) fetchPoster();
  }, [main]);

  const handleShare = async (movie: MovieRecommendation, isMain: boolean) => {
    const appUrl = window.location.origin;
    
    let shareTitle = "";
    let shareText = "";

    if (isMain) {
        shareTitle = `${getTranslation('share_main_intro', lang)}: ${movie.title}`;
        shareText = `🎬 ${getTranslation('share_main_intro', lang)}\n\n${movie.title} (${movie.year})\n\n"${movie.synopsis}"\n\n${getTranslation('share_found_on', lang)}: ${appUrl}`;
    } else {
        shareTitle = `${getTranslation('share_alt_intro', lang)}: ${movie.title}`;
        shareText = `🎬 ${getTranslation('share_alt_intro', lang)}: ${movie.title} (${movie.year})\n\n${getTranslation('share_found_on', lang)}: ${appUrl}`;
    }

    if (navigator.share) {
        try {
            await navigator.share({
                title: shareTitle,
                text: shareText,
                url: appUrl
            });
        } catch (err) {
            // User cancelled or share failed, fallback handled silently or via UI if needed
        }
    } else {
        navigator.clipboard.writeText(shareText);
        alert(getTranslation('share_copied', lang));
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-0 animate-fade-in-up pb-12">
      
      {/* --- MAIN RECOMMENDATION --- */}
      <div className="bg-zinc-900/90 border border-amber-900/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-lg overflow-hidden flex flex-col md:flex-row relative mb-12">
        
        {/* Poster Section */}
        <div className="md:w-1/3 bg-black relative min-h-[400px] md:min-h-0 overflow-hidden group">
            <img 
                src={posterUrl || fallbackImage}
                alt={main.title} 
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${posterUrl ? 'opacity-100' : 'opacity-50 group-hover:scale-105'}`}
            />
            
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-900/60 to-transparent md:bg-gradient-to-b md:from-zinc-950 md:via-transparent"></div>
            
            {/* Movie Details - Top Positioned */}
            <div className="absolute top-0 left-0 p-6 w-full z-20">
                <div className="text-amber-500 text-xs tracking-[0.2em] uppercase mb-2 border-b border-amber-500/30 pb-2 inline-block">
                    {getTranslation('result_ai_selection', lang)}
                </div>
                <h2 className="text-3xl text-white cinema-font font-bold leading-tight mb-1 drop-shadow-lg">{main.title}</h2>
                <div className="text-zinc-300 text-sm italic mb-4 font-light flex items-center gap-2 flex-wrap">
                  <span>{main.originalTitle}</span>
                  <span className="text-amber-600">•</span>
                  <span>{main.year}</span>
                </div>
                
                {/* Actions Row: IMDb, Watchlist, Share */}
                <div className="flex flex-wrap items-center gap-3 mb-3">
                    <a 
                        href={mainPrimaryUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#f5c518] text-black font-bold rounded hover:bg-[#e2b616] transition-colors text-sm shadow-lg"
                    >
                        <span>IMDb</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    </a>

                    <button 
                        onClick={() => onAddToWatchlist(main)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded transition-colors text-sm border border-zinc-600 shadow-lg group/watch"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-amber-500 group-hover/watch:text-amber-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <span>{getTranslation('btn_watchlist', lang)}</span>
                    </button>

                    <button 
                        onClick={() => handleShare(main, true)}
                        className="p-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-full transition-colors border border-zinc-700 ml-auto md:ml-0"
                        title="Share"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.287.696.287 1.093s-.107.77-.287 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                        </svg>
                    </button>
                </div>

                {/* Platform Links Row - Searching with ORIGINAL TITLE */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-zinc-600 mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 flex-shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    {SEARCH_PLATFORMS.map((platform) => (
                        <a 
                            key={platform.name}
                            href={`${platform.url}${encodeURIComponent(main.originalTitle || main.title)}`}
                            target="_blank" 
                            rel="noreferrer"
                            className="text-[10px] font-bold hover:text-white transition-colors uppercase leading-none"
                        >
                            {platform.name}
                        </a>
                    ))}
                </div>
            </div>
        </div>

        {/* Content Section */}
        <div className="md:w-2/3 p-8 md:p-10 flex flex-col justify-center relative bg-gradient-to-br from-zinc-900 to-zinc-950">
            <div className="mb-8 relative z-10 pt-4 md:pt-0">
                <div className="flex flex-wrap gap-2 mb-4 items-center">
                  <span className="px-3 py-1 bg-zinc-800 rounded text-xs text-zinc-300 uppercase tracking-wider border border-zinc-700">
                      {main.genre}
                  </span>
                  <span className="px-3 py-1 bg-zinc-800 rounded text-xs text-zinc-300 uppercase tracking-wider border border-zinc-700">
                      {getTranslation('result_director', lang)}: {main.director}
                  </span>
                </div>
                
                <h3 className="text-zinc-500 text-xs uppercase tracking-widest mb-2">{getTranslation('result_synopsis', lang)}</h3>
                <p className="text-lg text-zinc-200 font-light leading-relaxed mb-6 font-serif italic">
                    "{main.synopsis}"
                </p>
            </div>

            <div className="bg-gradient-to-r from-red-950/30 to-transparent border-l-2 border-red-700 pl-6 py-2 rounded-r-lg mb-8 relative">
                <h3 className="text-red-500 cinema-font text-lg mb-2 flex items-center gap-2">
                  <span>{getTranslation('result_verdict', lang)}</span>
                </h3>
                <p className="text-amber-100/90 leading-relaxed">
                    {main.reason}
                </p>
            </div>
        </div>
      </div>

      {/* --- ALTERNATIVE RECOMMENDATIONS --- */}
      <div className="border-t border-zinc-800 pt-8 relative">

        <h3 className="text-xl cinema-font text-zinc-400 mb-6 flex items-center justify-center gap-4 mt-8">
            <span className="w-8 h-[1px] bg-zinc-600 inline-block"></span>
            {getTranslation('result_alternatives', lang)}
            <span className="w-8 h-[1px] bg-zinc-600 inline-block"></span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {alternatives.map((movie, idx) => {
                // Use Original Title for search
                const altSearchTitle = movie.originalTitle || movie.title;
                const searchUrl = `https://www.imdb.com/find/?q=${encodeURIComponent(altSearchTitle + ' ' + movie.year)}`;
                const isIdValid = movie.imdbId && /^tt\d+$/.test(movie.imdbId);
                const primaryUrl = isIdValid ? `https://www.imdb.com/title/${movie.imdbId}/` : searchUrl;

                return (
                    <div key={idx} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded hover:bg-zinc-900 transition-colors group relative">
                        {/* Alt Action Buttons - Top Right (Watchlist + Share) */}
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                             <button 
                                onClick={() => onAddToWatchlist(movie)}
                                className="text-zinc-600 hover:text-amber-500 transition-colors p-1"
                                title={getTranslation('btn_watchlist', lang)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </button>
                            <button 
                                onClick={() => handleShare(movie, false)}
                                className="text-zinc-600 hover:text-amber-500 transition-colors p-1"
                                title="Share"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.287.696.287 1.093s-.107.77-.287 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                                </svg>
                            </button>
                        </div>

                        <h4 className="text-amber-100 font-bold text-lg mb-1 group-hover:text-amber-500 transition-colors line-clamp-2 min-h-[3.5rem] flex items-end pr-14">{movie.title}</h4>
                        <p className="text-zinc-500 text-sm mb-4">{movie.year} • {movie.director}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="text-xs border border-zinc-700 text-zinc-400 px-2 py-0.5 rounded">
                                {movie.genre}
                            </span>
                        </div>

                        <div className="flex flex-col gap-3 mt-4 border-t border-zinc-800/50 pt-4">
                            <div className="flex items-center gap-3">
                                <a 
                                    href={primaryUrl} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="text-[#f5c518] font-bold text-xs hover:underline flex items-center gap-1"
                                >
                                    IMDb →
                                </a>
                            </div>
                            
                            {/* Alternatives Platform Row - Searching with ORIGINAL TITLE */}
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-zinc-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 flex-shrink-0">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                                {SEARCH_PLATFORMS.map((platform) => (
                                    <a 
                                        key={platform.name}
                                        href={`${platform.url}${encodeURIComponent(movie.originalTitle || movie.title)}`}
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="text-[9px] font-bold hover:text-white transition-colors uppercase leading-none"
                                    >
                                        {platform.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      <div className="mt-12 mb-24 text-center">
            <Button onClick={onReset} variant="outline">
                ⟳ {getTranslation('btn_reset', lang)}
            </Button>
      </div>

    </div>
  );
};
