
import { GoogleGenAI, Type } from "@google/genai";
import { RecommendationResponse, Language } from "../types";

export const getMovieRecommendation = async (
  categoryTitle: string,
  qaPairs: { question: string; answer: string }[],
  lang: Language,
  selectedGenres: string[]
): Promise<RecommendationResponse> => {
  
  // Initialize AI client inside the function to avoid top-level process access errors
  // Safe access to process.env.API_KEY
  const apiKey =
    typeof process !== "undefined" && process.env
      ? process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || ""
      : "";
  const ai = new GoogleGenAI({ apiKey: apiKey });
  
  const promptContext = qaPairs.map(qa => `Q: ${qa.question} A: ${qa.answer}`).join("\n");
  
  const languageInstruction = lang === 'en' 
    ? "Respond strictly in English." 
    : "Respond strictly in Romanian.";

  let genreInstruction = "";
  if (selectedGenres.length > 0) {
    genreInstruction = `
    CONSTRAINT: The user has explicitly requested movies from the following genres: ${selectedGenres.join(", ")}.
    Please try to find the best psychological match WITHIN these genres. 
    Only deviate if the psychological profile strongly contradicts the genre (e.g., user is devastated/crying but asked for a Comedy - in this case, a dark comedy or dramedy might be appropriate).
    `;
  } else {
    genreInstruction = "No specific genre constraints. Choose the best genre to fit the psychological profile.";
  }

  const prompt = `
    You are an elite "Cinema Adviser" and expert psychologist.
    Analyze the user's psychological profile based on the quiz answers below and recommend the perfect movie (Main Choice) plus 3 solid alternatives.

    USER CONTEXT (Quiz: ${categoryTitle}):
    ${promptContext}

    GENRE PREFERENCES:
    ${genreInstruction}

    YOUR TASK:
    1. Identify the deep emotional state.
    2. Choose the Main movie that resonates maximally.
    3. Choose 3 Alternative movies that offer slightly different but compatible perspectives.
    
    LANGUAGE:
    ${languageInstruction}

    RULES:
    - Output strict JSON.
    - No spoilers.
    - Movies generally available on streaming or VOD.
  `;

  // Define the schema for a single movie object to reuse
  const movieProperties = {
    title: { type: Type.STRING, description: "Movie title" },
    originalTitle: { type: Type.STRING, description: "Original title" },
    year: { type: Type.STRING, description: "Release year" },
    director: { type: Type.STRING, description: "Director" },
    genre: { type: Type.STRING, description: "Genre" },
    imdbId: { type: Type.STRING, description: "IMDb ID (ex: tt0111161)" }
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 1024 }, 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            main: {
              type: Type.OBJECT,
              properties: {
                ...movieProperties,
                synopsis: { type: Type.STRING, description: "Atmospheric summary" },
                reason: { type: Type.STRING, description: "Detailed psychological explanation" }
              },
              required: ["title", "originalTitle", "year", "director", "genre", "synopsis", "reason", "imdbId"]
            },
            alternatives: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: movieProperties, 
                required: ["title", "originalTitle", "year", "director", "genre", "imdbId"]
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as RecommendationResponse;
    } else {
      throw new Error("Invalid response from AI.");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback safe
    return {
      main: {
        title: "Cinema Paradiso",
        originalTitle: "Nuovo Cinema Paradiso",
        year: "1988",
        director: "Giuseppe Tornatore",
        genre: "Drama",
        synopsis: lang === 'en' ? "A filmmaker recalls his childhood when he fell in love with the pictures at the cinema of his home village." : "Un regizor de film își amintește copilăria sa, când s-a îndrăgostit de imaginile din cinematograful satului său.",
        reason: lang === 'en' ? "We encountered a slight signal interference, but this movie is the universal answer for any beauty lover." : "Am întâmpinat o mică interferență în semnal, dar acest film este răspunsul universal pentru orice iubitor de frumos.",
        imdbId: "tt0095765"
      },
      alternatives: [
        { title: "Amélie", originalTitle: "Le Fabuleux Destin d'Amélie Poulain", year: "2001", director: "Jean-Pierre Jeunet", genre: "Romance Comedy", imdbId: "tt0211915" },
        { title: "The Grand Budapest Hotel", originalTitle: "The Grand Budapest Hotel", year: "2014", director: "Wes Anderson", genre: "Comedy", imdbId: "tt2278388" },
        { title: "Eternal Sunshine of the Spotless Mind", originalTitle: "Eternal Sunshine of the Spotless Mind", year: "2004", director: "Michel Gondry", genre: "Sci-Fi Drama", imdbId: "tt0338013" }
      ]
    };
  }
};
