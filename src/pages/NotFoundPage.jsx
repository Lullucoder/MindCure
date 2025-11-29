/**
 * 404 Not Found Page
 * Displayed when user navigates to a non-existent route
 */

import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4">
      <div className="text-center max-w-md">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary-200 select-none">404</div>
          <div className="relative -mt-8">
            <div className="w-24 h-24 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
              <Search className="h-12 w-12 text-primary-500" />
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            <Home className="h-5 w-5" />
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Helpful Links</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/" className="text-primary-600 hover:underline">Home</Link>
            <Link to="/resources" className="text-primary-600 hover:underline">Resources</Link>
            <Link to="/chat" className="text-primary-600 hover:underline">AI Chat</Link>
            <Link to="/crisis" className="text-primary-600 hover:underline">Crisis Help</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
