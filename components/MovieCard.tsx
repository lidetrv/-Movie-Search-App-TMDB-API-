
import React from 'react';
import { Star, Heart, Play } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, isFavorite, onToggleFavorite }) => {
  return (
    <div 
      className="group relative bg-slate-800 rounded-xl overflow-hidden cursor-pointer transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10"
      onClick={() => onClick(movie)}
    >
      <div className="aspect-[2/3] overflow-hidden bg-slate-900">
        <img
          src={movie.poster_url}
          alt={movie.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
           <div className="flex justify-center mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                <Play className="w-6 h-6 fill-current" />
              </div>
           </div>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => onToggleFavorite(e, movie.id)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isFavorite 
              ? 'bg-rose-500 text-white' 
              : 'bg-black/20 text-white hover:bg-rose-500/40'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Rating badge */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-yellow-400 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" />
          {movie.rating}
        </div>
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-slate-100 truncate group-hover:text-indigo-400 transition-colors">
          {movie.title}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          {movie.year} • {movie.genre}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
