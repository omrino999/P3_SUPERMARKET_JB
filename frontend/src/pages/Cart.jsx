import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { refreshCartCount } = useCart();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await cartApi.getCart();
      setCartItems(res.data);
    } catch (err) {
      console.error('Failed to fetch cart', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    
    try {
      await cartApi.updateQuantity(itemId, newQty);
      setCartItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, quantity: newQty, subtotal: item.price * newQty } : item
      ));
      refreshCartCount(); // Update navbar count
    } catch (err) {
      console.error('Failed to update quantity', err);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await cartApi.removeItem(itemId);
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      refreshCartCount();
    } catch (err) {
      console.error('Failed to remove item', err);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  if (loading) return <div className="text-center py-20 text-gray-500 dark:text-gray-400">Loading your cart...</div>;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 space-y-6">
        <div className="text-8xl">🛒</div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Your cart is empty</h2>
        <p className="text-gray-500 dark:text-gray-400">Looks like you haven't added anything to your cart yet.</p>
        <Link 
          to="/" 
          className="inline-block bg-green-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-100 dark:shadow-none"
        >
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-black text-gray-800 dark:text-gray-100 mb-10 flex items-center gap-3">
        <ShoppingBag size={36} className="text-green-600 dark:text-green-400" />
        Your Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-4 md:gap-6 hover:shadow-lg transition-all">
              <div className="w-24 h-24 bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden flex-shrink-0">
                <img 
                  src={item.image_url || 'https://placehold.co/400x400?text=Product'} 
                  alt={item.product_name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-grow min-w-0">
                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 truncate">{item.product_name}</h3>
                <p className="text-green-600 dark:text-green-400 font-bold">${item.price.toFixed(2)}</p>
                
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity, -1)}
                      className="p-1 hover:bg-white dark:hover:bg-gray-600 rounded-md transition-colors text-gray-500 dark:text-gray-400"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-bold text-gray-700 dark:text-gray-200">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity, 1)}
                      className="p-1 hover:bg-white dark:hover:bg-gray-600 rounded-md transition-colors text-gray-500 dark:text-gray-400"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">Subtotal</p>
                <p className="text-xl font-black text-gray-800 dark:text-white">${item.subtotal.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl sticky top-24 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Order Summary</h2>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Items ({cartItems.length})</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 dark:text-green-400 font-bold uppercase text-sm">Free</span>
              </div>
              <div className="h-px bg-gray-100 dark:bg-gray-700 my-4"></div>
              <div className="flex justify-between text-xl font-black text-gray-900 dark:text-white">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-100 dark:shadow-none flex items-center justify-center gap-2 group"
            >
              Checkout Now
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center uppercase tracking-widest font-bold">
              Secure Checkout & Fast Delivery
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
