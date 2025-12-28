
import React from 'react';
import { X, Star, Clock, Calendar, Heart, Play, User } from 'lucide-react';
import { Movie } from '../types';

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose, isFavorite, onToggleFavorite }) => {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div className="relative bg-slate-900 w-full max-w-5xl max-h-full rounded-2xl shadow-2xl overflow-y-auto animate-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col md:flex-row h-full">
          {/* Movie Image Area */}
          <div className="relative w-full md:w-2/5 aspect-[2/3] md:aspect-auto">
            <img 
              src={movie.poster_url} 
              alt={movie.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-slate-900"></div>
          </div>

          {/* Details Area */}
          <div className="w-full md:w-3/5 p-6 md:p-10">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm font-medium">
                {movie.genre}
              </span>
              <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full text-sm font-bold">
                <Star className="w-4 h-4 fill-current" />
                {movie.rating}/10
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h2>
            
            <div className="flex items-center gap-6 text-slate-400 text-sm mb-6">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {movie.year}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {movie.runtime}
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed mb-8 text-lg">
              {movie.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="text-slate-500 uppercase text-xs font-bold tracking-wider mb-2">Director</h4>
                <div className="flex items-center gap-2 text-slate-200">
                  <User className="w-4 h-4 text-indigo-400" />
                  {movie.director}
                </div>
              </div>
              <div>
                <h4 className="text-slate-500 uppercase text-xs font-bold tracking-wider mb-2">Cast</h4>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map(actor => (
                    <span key={actor} className="text-slate-200 text-sm bg-slate-800 px-2 py-1 rounded">
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-auto">
              <button className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20">
                <Play className="w-5 h-5 fill-current" />
                Watch Now
              </button>
              <button 
                onClick={() => onToggleFavorite(movie.id)}
                className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold transition-all border ${
                  isFavorite 
                    ? 'bg-rose-500 border-rose-500 text-white' 
                    : 'bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'On Watchlist' : 'Add to Watchlist'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
