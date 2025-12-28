
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import MovieCard from './components/MovieCard';
import MovieModal from './components/MovieModal';
import { MovieGridSkeleton } from './components/Skeleton';
import { Movie, Genre } from './types';
import { fetchMovies } from './services/geminiService';
import { useDebounce } from './hooks/useDebounce';
import { Film, AlertCircle, SearchX } from 'lucide-react';

const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<Genre>(Genre.All);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const debouncedSearch = useDebounce(searchQuery, 600);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Load favorites from local storage
  useEffect(() => {
    const saved = localStorage.getItem('watchlist');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  // Save favorites to local storage
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(favorites));
  }, [favorites]);

  const loadMovies = useCallback(async (isLoadMore = false) => {
    if (!isLoadMore) {
      setLoading(true);
      setError(null);
    }
    
    try {
      const data = await fetchMovies(debouncedSearch, selectedGenre);
      if (isLoadMore) {
        setMovies(prev => [...prev, ...data]);
      } else {
        setMovies(data);
      }
      setHasMore(data.length > 0);
    } catch (err) {
      setError('The cinematic universe is currently offline. Please try again in a few moments.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedGenre]);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading && !showFavorites) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, showFavorites]);

  const toggleFavorite = (e: React.MouseEvent | string, id?: string) => {
    // Overload handler
    const targetId = typeof e === 'string' ? e : id;
    if (typeof e !== 'string') e.stopPropagation();
    
    if (!targetId) return;

    setFavorites(prev => 
      prev.includes(targetId) 
        ? prev.filter(fid => fid !== targetId) 
        : [...prev, targetId]
    );
  };

  const filteredMovies = showFavorites 
    ? movies.filter(m => favorites.includes(m.id))
    : movies;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-indigo-500/30">
      <Header 
        onSearch={setSearchQuery} 
        onGenreChange={(g) => {
          setSelectedGenre(g);
          setShowFavorites(false);
        }}
        selectedGenre={selectedGenre}
        onShowFavorites={() => setShowFavorites(!showFavorites)}
        showFavorites={showFavorites}
      />

      <main className="max-w-7xl mx-auto py-8">
        {loading && !movies.length ? (
          <MovieGridSkeleton />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
            <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10 text-rose-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Lights, Camera, Errors!</h2>
            <p className="text-slate-400 max-w-md">{error}</p>
            <button 
              onClick={() => loadMovies()}
              className="mt-6 px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
            >
              Try to Re-run Scene
            </button>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
            <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 text-indigo-400">
              <SearchX className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Matches Found</h2>
            <p className="text-slate-400 max-w-md">
              {showFavorites 
                ? "Your watchlist is empty. Start adding some masterpieces!" 
                : `We couldn't find any results for "${searchQuery}". Try a different term?`}
            </p>
          </div>
        ) : (
          <>
            <div className="px-4 md:px-8 mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Film className="w-5 h-5 text-indigo-500" />
                {showFavorites ? 'Your Cinematic Watchlist' : searchQuery ? `Search Results for "${searchQuery}"` : `${selectedGenre} Masterpieces`}
              </h2>
              <span className="text-sm text-slate-500">
                {filteredMovies.length} movies found
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 px-4 md:px-8">
              {filteredMovies.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  onClick={setSelectedMovie}
                  isFavorite={favorites.includes(movie.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>

            {/* Load More Trigger */}
            {!showFavorites && (
              <div ref={loaderRef} className="py-12 flex justify-center">
                {hasMore && loading && (
                  <div className="flex items-center gap-2 text-indigo-400">
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-0.3s]"></div>
                  </div>
                )}
                {!hasMore && movies.length > 0 && (
                  <p className="text-slate-500 text-sm">You've reached the edge of the galaxy.</p>
                )}
              </div>
            )}
          </>
        )}
      </main>

      <MovieModal 
        movie={selectedMovie} 
        onClose={() => setSelectedMovie(null)} 
        isFavorite={selectedMovie ? favorites.includes(selectedMovie.id) : false}
        onToggleFavorite={(id) => toggleFavorite(id)}
      />

      <footer className="border-t border-slate-800 py-10 text-center text-slate-500 text-sm">
        <p>© 2024 CineMagic AI. Powered by Google Gemini. Crafted for Film Enthusiasts.</p>
      </footer>
    </div>
  );
};

export default App;
