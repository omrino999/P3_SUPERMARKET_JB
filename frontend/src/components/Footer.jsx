import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 mt-auto transition-colors">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛒</span>
            <span className="font-bold text-gray-800 dark:text-gray-100">Omri's Market</span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
              Home
            </Link>
            <Link to="/cart" className="text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
              Cart
            </Link>
            <Link to="/profile" className="text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
              My Orders
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-400 dark:text-gray-500 text-center md:text-right">
            <p>© {currentYear} Omri's Market. All rights reserved.</p>
            <p className="text-xs mt-1">A Full-Stack CRUD Project made by Omri Shitrit for John Bryce Academy</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
