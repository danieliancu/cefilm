
import { QuizCategory, Language } from './types';

export const SEARCH_PLATFORMS = [
  { name: 'NETFLIX', url: 'https://www.netflix.com/search?q=' },
  { name: 'PRIME VIDEO', url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=' },
  { name: 'DISNEY+', url: 'https://www.disneyplus.com/search?q=' },
  { name: 'SKYSHOWTIME', url: 'https://www.skyshowtime.com/search?q=' },
  { name: 'HBO MAX', url: 'https://www.max.com/search?q=' }
];

export const getQuizCategories = (lang: Language): QuizCategory[] => {
  const isEn = lang === 'en';

  return [
    {
      id: 'personality',
      title: isEn ? "Your Profile" : "Profilul Tău",
      description: isEn 
        ? "Who are you really? A character analysis to find the movie that mirrors your soul." 
        : "Cine ești cu adevărat? O analiză a caracterului tău pentru a găsi filmul care îți oglindește sufletul.",
      icon: "🎭",
      questions: [
        {
          id: 1,
          text: isEn ? "If your life were a movie genre, what would it be?" : "Dacă viața ta ar fi un gen de film, care ar fi acela?",
          options: [
            { id: 'a', text: isEn ? "A slow, intense drama" : "O dramă serioasă, cu multă emoție" },
            { id: 'b', text: isEn ? "A comedy where everything goes wrong" : "O comedie în care totul merge pe dos" },
            { id: 'c', text: isEn ? "A mystery where nothing is certain" : "Un film de mister unde nimic nu e sigur" },
            { id: 'd', text: isEn ? "A fantasy adventure" : "O aventură într-o lume complet nouă" }
          ]
        },
        {
          id: 2,
          text: isEn ? "What is your biggest flaw?" : "Care crezi că e cel mai mare defect al tău?",
          options: [
            { id: 'a', text: isEn ? "I overthink everything" : "Gândesc prea mult la orice (Overthinking)" },
            { id: 'b', text: isEn ? "I act before I think" : "Acționez înainte să gândesc" },
            { id: 'c', text: isEn ? "I find it hard to trust people" : "Mi-e greu să am încredere în oameni" },
            { id: 'd', text: isEn ? "I daydream too much" : "Visez cu ochii deschiși și uit de realitate" }
          ]
        },
        {
          id: 3,
          text: isEn ? "What do you value most in a friend?" : "Ce contează cel mai mult la un prieten?",
          options: [
            { id: 'a', text: isEn ? "To always be there" : "Să fie acolo orice ar fi" },
            { id: 'b', text: isEn ? "To make me laugh" : "Să mă facă să râd" },
            { id: 'c', text: isEn ? "Deep conversations" : "Să putem vorbi despre orice" },
            { id: 'd', text: isEn ? "Adventurous spirit" : "Să fie gata de distracție oricând" }
          ]
        }
      ]
    },
    {
      id: 'mood',
      title: isEn ? "Mood" : "Starea de Spirit",
      description: isEn 
        ? "How do you feel right now? We'll find a movie to heal, amplify, or transport you." 
        : "Cum te simți chiar acum? Vom găsi un film care să te vindece, să te amplifice sau să te transporte.",
      icon: "🌧️",
      questions: [
        {
          id: 1,
          text: isEn ? "What is your energy level right now?" : "Câtă energie ai în momentul ăsta?",
          options: [
            { id: 'a', text: isEn ? "Zero, I just want to lay down" : "Zero, vreau doar să stau întins" },
            { id: 'b', text: isEn ? "Melancholic and thoughtful" : "Melancolic și pus pe gânduri" },
            { id: 'c', text: isEn ? "Restless, I need something moving" : "Agitat, am nevoie de acțiune" },
            { id: 'd', text: isEn ? "Great, I feel happy" : "Super, sunt bine dispus" }
          ]
        },
        {
          id: 2,
          text: isEn ? "What do you need right now?" : "De ce ai nevoie acum?",
          options: [
            { id: 'a', text: isEn ? "A good cry" : "Să plâng și să mă descarc" },
            { id: 'b', text: isEn ? "A good laugh" : "Să râd cu lacrimi" },
            { id: 'c', text: isEn ? "To be shocked" : "Să văd ceva ce mă dă pe spate" },
            { id: 'd', text: isEn ? "To escape reality" : "Să uit de lumea reală" }
          ]
        },
        {
          id: 3,
          text: isEn ? "What's the weather like 'inside you'?" : "Cum e vremea 'în sufletul tău' acum?",
          options: [
            { id: 'a', text: isEn ? "Stormy" : "O furtună gata să înceapă" },
            { id: 'b', text: isEn ? "Foggy" : "Ceață, nu văd nimic clar" },
            { id: 'c', text: isEn ? "Sunny" : "Soare și cer senin" },
            { id: 'd', text: isEn ? "Light rain" : "O ploaie liniștită" }
          ]
        }
      ]
    },
    {
      id: 'events',
      title: isEn ? "What have you been doing?" : "Ce ai mai făcut?",
      description: isEn 
        ? "What have you been through lately? Movies can offer new perspectives on real life." 
        : "Prin ce ai trecut în ultima vreme? Filmele pot oferi perspective noi asupra situațiilor din viața reală.",
      icon: "📅",
      questions: [
        {
          id: 1,
          text: isEn ? "How was your week so far?" : "Cum a fost săptămâna ta până acum?",
          options: [
            { id: 'a', text: isEn ? "I achieved something big" : "Am reușit ceva important" },
            { id: 'b', text: isEn ? "Had a fight or a breakup" : "M-am certat cu cineva sau m-am despărțit" },
            { id: 'c', text: isEn ? "Traveled or tried something new" : "Am fost plecat sau am încercat ceva nou" },
            { id: 'd', text: isEn ? "Boring, same old routine" : "Plictisitoare, nimic special" }
          ]
        },
        {
          id: 2,
          text: isEn ? "What are you missing most right now?" : "Ce simți că îți lipsește acum?",
          options: [
            { id: 'a', text: isEn ? "Love" : "Iubirea / Cineva aproape" },
            { id: 'b', text: isEn ? "Direction in life" : "O direcție clară în viață" },
            { id: 'c', text: isEn ? "Peace and quiet" : "Liniștea, timp pentru mine" },
            { id: 'd', text: isEn ? "Excitement" : "Puțină adrenalină" }
          ]
        },
        {
          id: 3,
          text: isEn ? "Headline of your current life?" : "Dacă azi ar fi o știre, cum ar suna?",
          options: [
            { id: 'a', text: isEn ? "'Chaos everywhere'" : "'Haos total, nu știu cum am scăpat'" },
            { id: 'b', text: isEn ? "'Calm before the storm'" : "'Liniște înainte de furtună'" },
            { id: 'c', text: isEn ? "'I did it!'" : "'Am reușit, deși nu credeam!'" },
            { id: 'd', text: isEn ? "'Groundhog Day'" : "'Aceeași zi, din nou și din nou'" }
          ]
        }
      ]
    },
    {
      id: 'social',
      title: isEn ? "Who are you with?" : "Cu cine ești?",
      description: isEn 
        ? "Who are you watching with? Group dynamics (or lack thereof) dictate the perfect choice." 
        : "Cu cine privești filmul? Dinamica grupului (sau lipsa lui) dictează alegerea perfectă.",
      icon: "👥",
      questions: [
        {
          id: 1,
          text: isEn ? "Who is with you?" : "Cine se uită cu tine?",
          options: [
            { id: 'a', text: isEn ? "Nobody, just me" : "Nimeni, e timpul meu" },
            { id: 'b', text: isEn ? "My partner" : "Iubitul / Iubita" },
            { id: 'c', text: isEn ? "Friends" : "Gașca de prieteni" },
            { id: 'd', text: isEn ? "Family" : "Familia (părinți, copii)" }
          ]
        },
        {
          id: 2,
          text: isEn ? "What's the vibe?" : "Care e atmosfera?",
          options: [
            { id: 'a', text: isEn ? "Quiet and chill" : "Liniște și pace" },
            { id: 'b', text: isEn ? "We want to talk about it" : "Vrem să comentăm la film" },
            { id: 'c', text: isEn ? "Bored, wake us up" : "Ne plictisim, vrem ceva tare" },
            { id: 'd', text: isEn ? "Tense, we need to relax" : "Tensionată, vrem să ne calmăm" }
          ]
        },
        {
          id: 3,
          text: isEn ? "Attention span?" : "Câtă răbdare aveți?",
          options: [
            { id: 'a', text: isEn ? "100%, focused" : "100%, telefonul e pe silent" },
            { id: 'b', text: isEn ? "Background noise" : "Vrem ceva pe fundal, mai mult vorbim" },
            { id: 'c', text: isEn ? "Low, we get tired easily" : "Puțină, adormim repede" },
            { id: 'd', text: isEn ? "Just visuals" : "Vrem doar să se vadă bine, povestea nu contează" }
          ]
        }
      ]
    },
    {
      id: 'time-travel',
      title: isEn ? "Time Traveler" : "Călător în Timp",
      description: isEn 
        ? "Which era do you want to escape to? Nostalgia of the past or hope for the future." 
        : "În ce epocă vrei să evadezi? Nostalgia trecutului sau speranța viitorului.",
      icon: "⏳",
      questions: [
        {
          id: 1,
          text: isEn ? "Where to teleport?" : "Unde ai vrea să fii teleportat acum?",
          options: [
            { id: 'a', text: isEn ? "High-tech future" : "Într-un viitor plin de tehnologie" },
            { id: 'b', text: isEn ? "The 80s-90s" : "În anii '80-'90, muzică și stil vechi" },
            { id: 'c', text: isEn ? "Old times (Medieval/Victorian)" : "Pe vremuri (castele, rochii, săbii)" },
            { id: 'd', text: isEn ? "Here and now" : "Rămân în prezent, îmi place realitatea" }
          ]
        },
        {
          id: 2,
          text: isEn ? "Visual style?" : "Ce stil să aibă filmul?",
          options: [
            { id: 'a', text: isEn ? "Black and white" : "Alb-negru, elegant" },
            { id: 'b', text: isEn ? "Colorful and modern" : "Colorat și modern" },
            { id: 'c', text: isEn ? "Raw and realistic" : "Realist, ca un documentar" },
            { id: 'd', text: isEn ? "Animation / CGI" : "Animație sau efecte speciale tari" }
          ]
        },
        {
          id: 3,
          text: isEn ? "Pace?" : "Ce ritm să aibă?",
          options: [
            { id: 'a', text: isEn ? "Slow burn" : "Lent, să am timp să intru în poveste" },
            { id: 'b', text: isEn ? "Fast paced" : "Rapid, să mă țină în priză" },
            { id: 'c', text: isEn ? "Mind bending" : "Complicat, să îmi pună mintea la treabă" },
            { id: 'd', text: isEn ? "Simple and good" : "Clasic, o poveste simplă și frumoasă" }
          ]
        }
      ]
    }
  ];
};
