
import React from 'react';
import { Search, Film, Heart } from 'lucide-react';
import { Genre } from '../types';
import { GENRES, APP_NAME } from '../constants';

interface HeaderProps {
  onSearch: (query: string) => void;
  onGenreChange: (genre: Genre) => void;
  selectedGenre: Genre;
  onShowFavorites: () => void;
  showFavorites: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  onSearch, 
  onGenreChange, 
  selectedGenre,
  onShowFavorites,
  showFavorites
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.location.reload()}>
            <div className="p-2 bg-indigo-600 rounded-lg group-hover:scale-110 transition-transform">
              <Film className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              {APP_NAME}
            </h1>
          </div>

          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search movies by title, actors, or plots..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-100 placeholder:text-slate-500"
            />
          </div>

          <button 
            onClick={onShowFavorites}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
              showFavorites 
                ? 'bg-rose-500 border-rose-500 text-white' 
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${showFavorites ? 'fill-current' : ''}`} />
            <span className="font-medium">Watchlist</span>
          </button>
        </div>

        {/* Genre Filter Scrollable */}
        <div className="flex items-center gap-2 overflow-x-auto mt-6 pb-2 no-scrollbar">
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => onGenreChange(genre)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedGenre === genre
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
