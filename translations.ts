
import { Language } from './types';

interface TranslationData {
  [key: string]: {
    ro: string;
    en: string;
  };
}

export const translations: TranslationData = {
  // Navigation
  nav_pick_movie: { ro: 'Alege un film', en: 'Pick a movie' },
  nav_how_it_works: { ro: 'Cum funcționează', en: 'How it works' },
  nav_home: { ro: 'Acasă', en: 'Home' },
  
  // Header / Tickets
  tickets_remaining: { ro: 'Bilete', en: 'Tickets' },
  tickets_left_label: { ro: 'Tichete gratuite rămase', en: 'Free tickets left' },
  tickets_vip_label: { ro: 'CONT VIP', en: 'VIP ACCOUNT' },
  tickets_tooltip: { ro: 'Analize disponibile azi', en: 'Analyses available today' },
  
  // Landing
  landing_now_showing: { ro: 'Your Movie Adviser', en: 'Your Movie Adviser' },
  landing_title: { ro: 'Nu știi la ce film să te uiți?', en: 'Don\'t know what movie\nto watch?' },
  landing_subtitle: { ro: 'Un quiz psihologic rapid care elimină indecizia. Spune-ne cum te simți sau în ce situație ești, iar noi îți spunem exact ce film trebuie să vezi acum.', en: 'A quick psychological quiz that kills indecision. Tell us how you feel or your current situation, and we\'ll tell you exactly what movie to watch right now.' },
  btn_pick_movie: { ro: 'Găsește-mi un film', en: 'Find me a movie' },
  btn_how_it_works: { ro: 'Cum funcționează', en: 'How it works' },
  
  // Hero Card Process
  hero_step_1: { ro: 'Profilul Tău', en: 'Your Profile' },
  hero_step_2: { ro: 'Analiză Emoțională', en: 'Emotional Analysis' },
  hero_step_3: { ro: 'Filmul Perfect', en: 'Perfect Match' },
  hero_status: { ro: 'Sistem Pregătit', en: 'System Ready' },

  // How It Works
  hiw_title: { ro: 'Simplu. Rapid. Personal.', en: 'Simple. Fast. Personal.' },
  hiw_step1_title: { ro: '01. Completezi un Quiz scurt', en: '01. Take a short Quiz' },
  hiw_step1_desc: { ro: 'Nu trebuie să cauți prin mii de titluri. Doar selectează un subiect (Stare, Personalitate, etc.) și răspunde la 3 întrebări despre tine.', en: 'No need to browse thousands of titles. Just select a topic (Mood, Personality, etc.) and answer 3 questions about yourself.' },
  hiw_step2_title: { ro: '02. Analizăm rezultatul', en: '02. We Analyze' },
  hiw_step2_desc: { ro: 'Adviser-ul AI nu caută doar "comedii" sau "drame". El înțelege emoția ta și caută filmul care se potrivește psihologic cu momentul tău.', en: 'The AI Adviser doesn\'t just look for "comedies" or "dramas". It understands your emotion and finds the movie that psychologically fits your moment.' },
  hiw_step3_title: { ro: '03. Afli ce film ți se potrivește', en: '03. Get the Movie' },
  hiw_step3_desc: { ro: 'Primești filmul ideal și explicăm motivul pentru care ți se potrivește și 3 alternative similare.', en: 'We tell you clearly: "Watch this!". You get the ideal movie, the reason why it fits you, and 3 similar alternatives.' },
  hiw_note_title: { ro: 'De ce CEFILM??', en: 'Why CEFILM??' },
  hiw_note_desc: { ro: 'Algoritmii Netflix vor să te țină în aplicație. Noi vrem să te uiți la un film bun. Eliminăm orele pierdute dând scroll și îți oferim calitate, nu cantitate.', en: 'Netflix algorithms want to keep you in the app. We want you to watch a good movie. We eliminate the hours wasted scrolling and offer you quality, not quantity.' },
  hiw_back: { ro: 'Înapoi la meniu', en: 'Back to menu' },
  hiw_start: { ro: 'Începe Quiz-ul', en: 'Start Quiz' },

  // Category Select
  category_title: { ro: 'De unde începem?', en: 'Where do we start?' },
  category_subtitle: { ro: 'Alege categoria care descrie cel mai bine situația ta actuală.', en: 'Choose the category that best describes your current situation.' },
  
  // Genre Filters
  genre_label: { ro: 'Preferi un anumit gen? (Opțional)', en: 'Any preferences? (Optional)' },
  genre_any: { ro: 'Mă uit la orice', en: 'I watch anything' },
  genre_drama: { ro: 'Dramă', en: 'Drama' },
  genre_comedy: { ro: 'Comedie', en: 'Comedy' },
  genre_thriller: { ro: 'Thriller', en: 'Thriller' },
  genre_horror: { ro: 'Horror', en: 'Horror' },
  genre_scifi: { ro: 'Sci-Fi', en: 'Sci-Fi' },
  genre_romance: { ro: 'Romance', en: 'Romance' },
  genre_action: { ro: 'Acțiune', en: 'Action' },
  genre_adventure: { ro: 'Aventură', en: 'Adventure' },
  genre_fantasy: { ro: 'Fantastic', en: 'Fantasy' },
  genre_mystery: { ro: 'Mister', en: 'Mystery' },
  genre_animation: { ro: 'Animație', en: 'Animation' },
  genre_documentary: { ro: 'Documentar', en: 'Documentary' },

  // Quiz
  quiz_scene: { ro: 'Întrebarea', en: 'Question' },
  quiz_custom_label: { ro: 'Sau scrie propriul tău răspuns', en: 'Or write your own answer' },
  quiz_custom_placeholder: { ro: 'Ex: Mă simt...', en: 'Ex: I feel...' },
  quiz_cancel: { ro: 'Anulează', en: 'Cancel' },
  quiz_next: { ro: 'Următoarea', en: 'Next' },
  quiz_finish: { ro: 'Găsește Filmul', en: 'Find Movie' },

  // Analyzing
  analyzing_title: { ro: 'Căutăm filmul potrivit...', en: 'Finding the right movie...' },
  analyzing_subtitle: { ro: 'Analizăm răspunsurile tale', en: 'Analyzing your answers' },
  error_message: { ro: 'Ne pare rău, a apărut o eroare. Te rugăm să încerci din nou.', en: 'Sorry, an error occurred. Please try again.' },

  // Result
  result_ai_selection: { ro: 'Recomandarea Noastră', en: 'Our Recommendation' },
  result_synopsis: { ro: 'Despre film', en: 'About the movie' },
  result_director: { ro: 'Regie', en: 'Director' },
  result_verdict: { ro: 'De ce să te uiți', en: 'Why watch it' },
  result_alternatives: { ro: 'Titluri alternative', en: 'Alternative Titles' },
  result_search_fallback: { ro: 'Link invalid? Caută manual', en: 'Link broken? Search manually' },
  btn_reset: { ro: 'Începe o nouă analiză', en: 'Start new analysis' },
  btn_watchlist: { ro: 'Watchlist', en: 'Watchlist' },
  
  // Share
  share_main_intro: { ro: 'Recomandare CEFILM?', en: 'CEFILM? Recommendation' },
  share_alt_intro: { ro: 'Ce film îmi place', en: 'Movie I like' },
  share_found_on: { ro: 'Găsit pe CEFILM? - Your Movie Adviser', en: 'Found on CEFILM? - Your Movie Adviser' },
  share_copied: { ro: 'Link copiat în clipboard!', en: 'Link copied to clipboard!' },

  // Footer
  footer_powered: { ro: 'Powered by AI', en: 'Powered by AI' },
  footer_rights: { ro: 'CEFILM? Studio', en: 'CEFILM? Studio' },
  footer_quote: { ro: '"Filmul este viața la care s-au scos părțile plictisitoare." – Alfred Hitchcock', en: '"Drama is life with the dull bits cut out." – Alfred Hitchcock' },
  footer_buy_tickets: { ro: 'Încearcă VIP', en: 'Become VIP' },

  // Pricing Section
  pricing_title: { ro: 'Casa de Bilete', en: 'Box Office' },
  pricing_subtitle: { ro: 'Alege-ți experiența', en: 'Choose your experience' },
  
  plan_free_name: { ro: 'Intrare Generală', en: 'General Admission' },
  plan_free_price: { ro: 'Gratuit', en: 'Free' },
  plan_free_btn: { ro: 'Plan Actual', en: 'Current Plan' },
  
  plan_vip_name: { ro: 'Director\'s Pass', en: 'Director\'s Pass' },
  plan_vip_price: { ro: '25 lei', en: '25 lei' },
  plan_vip_period: { ro: '/ lună', en: '/ month' },
  plan_vip_btn: { ro: 'Devino VIP', en: 'Become VIP' },
  plan_vip_badge: { ro: 'Cel mai popular', en: 'Best Value' },

  feat_tickets_limit: { ro: '5 bilete gratuite', en: '5 free tickets' },
  feat_tickets_unlimited: { ro: 'Bilete Nelimitate', en: 'Unlimited Tickets' },
  feat_analysis_basic: { ro: 'Analiză Standard', en: 'Standard Analysis' },
  feat_analysis_deep: { ro: 'Analiză Comportamentală Profundă', en: 'Deep Behavioral Analysis' },
  feat_email: { ro: 'Program săptămânal de filme pe email', en: 'Weekly curated movie schedule via email' },
  feat_priority: { ro: 'Acces prioritar la funcții noi', en: 'Priority access to new features' },
  feat_rating: { ro: 'Notează filmele văzute', en: 'Rate watched movies' },
  feat_community: { ro: 'Discuții exclusive cu comunitatea', en: 'Exclusive community discussions' },
  feat_support: { ro: 'Susține arta cinematografică', en: 'Support the cinematic art' },

  // Auth
  auth_signin_title: { ro: 'Autentificare', en: 'Sign In' },
  auth_signup_title: { ro: 'Înregistrare', en: 'Sign Up' },
  auth_email: { ro: 'Email', en: 'Email' },
  auth_password: { ro: 'Parolă', en: 'Password' },
  auth_confirm_password: { ro: 'Confirmă Parola', en: 'Confirm Password' },
  auth_submit_signin: { ro: 'Intră în cont', en: 'Sign In' },
  auth_submit_signup: { ro: 'Creează cont', en: 'Create Account' },
  auth_no_account: { ro: 'Nu ai cont?', en: 'No account?' },
  auth_has_account: { ro: 'Ai deja cont?', en: 'Already have an account?' },
  auth_link_signup: { ro: 'Înregistrează-te', en: 'Sign Up' },
  auth_link_signin: { ro: 'Intră în cont', en: 'Sign In' },

  // Subscription Modal (Updated)
  sub_title: { ro: 'Casa de Bilete e închisă', en: 'Box Office Closed' },
  sub_desc: { ro: 'Ai epuizat cele 5 bilete gratuite. Poți deveni membru VIP și ai acces nelimitat la bilete.', en: 'You’ve used all 5 free tickets. Become a VIP member for unlimited tickets.' },
  sub_btn_upgrade: { ro: 'Încearcă abonamentul nelimitat', en: 'Get Unlimited Pass' },
  sub_btn_demo: { ro: '[Demo] Resetează Bilete', en: '[Demo] Reset Tickets' }
};

export const getTranslation = (key: string, lang: Language): string => {
  return translations[key]?.[lang] || key;
};
