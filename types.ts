
export interface Movie {
  id: string;
  title: string;
  year: number;
  rating: number;
  description: string;
  genre: string;
  poster_url: string;
  backdrop_url: string;
  director: string;
  cast: string[];
  runtime: string;
}

export enum Genre {
  All = 'All',
  Action = 'Action',
  Comedy = 'Comedy',
  Drama = 'Drama',
  SciFi = 'Sci-Fi',
  Horror = 'Horror',
  Romance = 'Romance',
  Animation = 'Animation'
}

export interface AppState {
  searchQuery: string;
  selectedGenre: Genre;
  favorites: string[]; // Array of movie IDs
}
