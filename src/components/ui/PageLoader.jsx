/**
 * Page Loader Component
 * Full-page loading spinner for lazy-loaded routes
 */

import { Heart } from 'lucide-react';

const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="text-center">
        <div className="relative inline-flex">
          <div className="w-16 h-16 rounded-full border-4 border-primary-100 animate-pulse" />
          <Heart 
            className="absolute inset-0 m-auto h-8 w-8 text-primary-500 animate-pulse" 
            fill="currentColor"
          />
        </div>
        <p className="mt-4 text-gray-600 font-medium animate-pulse">Loading...</p>
      </div>
    </div>
  );
};

export default PageLoader;
