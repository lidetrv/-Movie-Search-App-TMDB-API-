
import React from 'react';

export const MovieCardSkeleton: React.FC = () => {
  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-[2/3] bg-slate-700"></div>
      <div className="p-4 space-y-2">
        <div className="h-4 bg-slate-700 rounded w-3/4"></div>
        <div className="h-3 bg-slate-700 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export const MovieGridSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4 md:p-8">
      {Array.from({ length: 12 }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
};
