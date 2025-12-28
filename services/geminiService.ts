
import { GoogleGenAI, Type } from "@google/genai";
import { Movie, Genre } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const movieSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      title: { type: Type.STRING },
      year: { type: Type.NUMBER },
      rating: { type: Type.NUMBER },
      description: { type: Type.STRING },
      genre: { type: Type.STRING },
      poster_url: { type: Type.STRING },
      backdrop_url: { type: Type.STRING },
      director: { type: Type.STRING },
      cast: { type: Type.ARRAY, items: { type: Type.STRING } },
      runtime: { type: Type.STRING },
    },
    required: ["id", "title", "year", "rating", "description", "genre", "poster_url", "backdrop_url", "director", "cast", "runtime"],
  },
};

export const fetchMovies = async (query: string, genre: Genre): Promise<Movie[]> => {
  const prompt = `Generate a list of 12 popular movies. 
    ${query ? `Search query: "${query}".` : ""}
    ${genre !== Genre.All ? `Filter by genre: "${genre}".` : "Include a diverse mix of genres."}
    Make sure the data is realistic. Use unsplash or picsum IDs for poster_url and backdrop_url if you don't have real ones.
    Return JSON format.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: movieSchema,
        temperature: 0.7,
      },
    });

    const movies = JSON.parse(response.text || "[]");
    return movies;
  } catch (error) {
    console.error("Error fetching movies from Gemini:", error);
    throw error;
  }
};

export const fetchMovieRecommendations = async (movieTitle: string): Promise<Movie[]> => {
  const prompt = `Based on the movie "${movieTitle}", recommend 6 similar movies in JSON format.`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: movieSchema,
      },
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    return [];
  }
};
