import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
      <div className="relative aspect-w-1 aspect-h-1 w-full bg-gray-800 animate-pulse"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-800 rounded w-1/3 animate-pulse mb-2"></div>
        <div className="h-6 bg-gray-800 rounded w-full animate-pulse mb-3"></div>
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-800 rounded w-1/4 animate-pulse"></div>
          <div className="h-6 bg-gray-800 rounded w-1/3 animate-pulse"></div>
        </div>
        <div className="h-3 bg-gray-800 rounded w-1/2 animate-pulse mt-2"></div>
      </div>
    </div>
  );
};
