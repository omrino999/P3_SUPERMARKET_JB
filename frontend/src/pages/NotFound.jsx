import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center space-y-8 max-w-lg mx-auto px-4">
        {/* Fun illustration */}
        <div className="relative">
          <div className="text-[150px] md:text-[200px] font-black text-gray-100 dark:text-gray-800 select-none leading-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl md:text-8xl animate-bounce">🛒</div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-black text-gray-800 dark:text-gray-100">
            Oops! Page not found
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Looks like this item isn't in our store. The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link 
            to="/" 
            className="inline-flex items-center justify-center gap-2 bg-green-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-100 dark:shadow-none"
          >
            <Home size={20} />
            Back to Home
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold px-8 py-4 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-700"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>

        {/* Helpful links */}
        <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">Popular destinations:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/" className="text-sm font-medium text-green-600 dark:text-green-400 hover:underline">
              Shop Products
            </Link>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <Link to="/cart" className="text-sm font-medium text-green-600 dark:text-green-400 hover:underline">
              View Cart
            </Link>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <Link to="/profile" className="text-sm font-medium text-green-600 dark:text-green-400 hover:underline">
              Order History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
