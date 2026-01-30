import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, LayoutGrid, Sun, Moon, Plus, Minus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { cartApi } from '../services/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems, cartCount, cartTotal, refreshCartCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [updating, setUpdating] = useState({});

  const handleUpdateQuantity = async (itemId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    
    setUpdating(prev => ({ ...prev, [itemId]: true }));
    try {
      await cartApi.updateQuantity(itemId, newQty);
      refreshCartCount();
    } catch (err) {
      console.error('Failed to update quantity', err);
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemoveItem = async (itemId) => {
    setUpdating(prev => ({ ...prev, [itemId]: true }));
    try {
      await cartApi.removeItem(itemId);
      refreshCartCount();
    } catch (err) {
      console.error('Failed to remove item', err);
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md fixed top-0 left-0 right-0 z-50 transition-colors">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-green-600 dark:text-green-400">
          <div className="p-1 bg-green-100 dark:bg-green-900 rounded">🛒</div>
          <span>Omri's Market</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-4 md:gap-6">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-all"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors hidden sm:block">
            Home
          </Link>
          
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>

          {user ? (
            <>
              {user.is_admin && (
                <Link to="/admin" className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-2 sm:px-3 py-1.5 rounded-lg font-bold hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors text-xs sm:text-sm">
                  <span className="hidden sm:inline">Admin Panel</span>
                  <span className="sm:hidden">Admin</span>
                </Link>
              )}
              <Link to="/profile" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors flex items-center gap-1">
                <User size={20} />
                <span className="hidden sm:inline">Account</span>
              </Link>
              <button 
                onClick={logout}
                className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors flex items-center gap-1"
              >
                <LogOut size={20} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors">
                Login
              </Link>
              <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors hidden sm:block">
                Join
              </Link>
            </>
          )}

          {/* Cart Icon with Hover Preview */}
          <div 
            className="relative"
            onMouseEnter={() => setShowCartPreview(true)}
            onMouseLeave={() => setShowCartPreview(false)}
          >
            <Link to="/cart" className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors block">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Cart Hover Preview - pt-2 creates visual gap while maintaining hover area */}
            {showCartPreview && (
              <div className="absolute right-0 top-full pt-2 z-50">
                <div className="w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100">Your Cart ({cartCount})</h3>
                </div>
                
                {cartItems.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                    <ShoppingCart size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div className="max-h-64 overflow-y-auto">
                      {cartItems.slice(0, 5).map((item) => (
                        <div key={item.id} className={`p-3 border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-opacity ${updating[item.id] ? 'opacity-50' : ''}`}>
                          <div className="flex items-center gap-3">
                            <img 
                              src={item.image_url || 'https://placehold.co/60x60?text=Item'} 
                              alt={item.product_name}
                              className="w-12 h-12 rounded-lg object-cover bg-gray-100 dark:bg-gray-700 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{item.product_name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">${item.price.toFixed(2)} each</p>
                            </div>
                            <span className="text-sm font-bold text-green-600 dark:text-green-400">${item.subtotal.toFixed(2)}</span>
                          </div>
                          {/* Interactive Controls */}
                          <div className="flex items-center justify-between mt-2 pl-15">
                            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
                              <button 
                                onClick={(e) => { e.preventDefault(); handleUpdateQuantity(item.id, item.quantity, -1); }}
                                disabled={updating[item.id] || item.quantity <= 1}
                                className="p-1 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <Minus size={14} className="text-gray-600 dark:text-gray-300" />
                              </button>
                              <span className="w-6 text-center text-sm font-bold text-gray-700 dark:text-gray-200">{item.quantity}</span>
                              <button 
                                onClick={(e) => { e.preventDefault(); handleUpdateQuantity(item.id, item.quantity, 1); }}
                                disabled={updating[item.id]}
                                className="p-1 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-30"
                              >
                                <Plus size={14} className="text-gray-600 dark:text-gray-300" />
                              </button>
                            </div>
                            <button 
                              onClick={(e) => { e.preventDefault(); handleRemoveItem(item.id); }}
                              disabled={updating[item.id]}
                              className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-30"
                              title="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {cartItems.length > 5 && (
                        <p className="text-center text-xs text-gray-500 dark:text-gray-400 py-2">
                          +{cartItems.length - 5} more items
                        </p>
                      )}
                    </div>
                    <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Total:</span>
                        <span className="text-lg font-black text-gray-900 dark:text-white">${cartTotal.toFixed(2)}</span>
                      </div>
                      <Link 
                        to="/cart" 
                        className="block w-full bg-green-600 text-white text-center py-2.5 rounded-xl font-bold hover:bg-green-700 transition-colors"
                      >
                        View Cart
                      </Link>
                    </div>
                  </>
                )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
