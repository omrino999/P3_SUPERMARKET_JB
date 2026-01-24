import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { cartApi, orderApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { CheckCircle, Package, ArrowLeft, CreditCard } from 'lucide-react';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);
  const navigate = useNavigate();
  const { refreshCartCount } = useCart();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await cartApi.getCart();
      if (res.data.length === 0 && !orderComplete) {
        navigate('/cart');
        return;
      }
      setCartItems(res.data);
    } catch (err) {
      console.error('Failed to fetch cart', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPurchase = async () => {
    try {
      setProcessing(true);
      const res = await orderApi.checkout();
      setOrderComplete(res.data);
      refreshCartCount();
    } catch (err) {
      alert(err.response?.data?.message || 'Checkout failed');
    } finally {
      setProcessing(false);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  if (loading) return <div className="text-center py-20 text-gray-500 dark:text-gray-400">Preparing checkout...</div>;

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center">
          <div className="bg-green-100 dark:bg-green-900/50 p-6 rounded-full">
            <CheckCircle size={80} className="text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-gray-800 dark:text-gray-100">Order Confirmed!</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Your groceries are being prepared for delivery.</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-50 dark:border-gray-700">
            <span className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider text-xs">Order Code</span>
            <span className="font-mono font-black text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded text-lg">
              {orderComplete.order_code.substring(0, 8).toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider text-xs">Total Paid</span>
            <span className="text-2xl font-black text-gray-800 dark:text-white">${orderComplete.total_price.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Link 
            to="/profile" 
            className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold px-8 py-4 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
          >
            View History
          </Link>
          <Link 
            to="/" 
            className="bg-green-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-100 dark:shadow-none"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <Link to="/cart" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 font-bold mb-8 transition-colors">
        <ArrowLeft size={20} />
        Back to Cart
      </Link>

      <h1 className="text-4xl font-black text-gray-800 dark:text-gray-100 mb-10">Review Your Order</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Order Details */}
        <div className="space-y-8">
          <section className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
            <h2 className="font-bold text-xl flex items-center gap-2 text-gray-800 dark:text-gray-100">
              <Package size={24} className="text-green-600 dark:text-green-400" />
              Delivery Details
            </h2>
            <div className="text-gray-600 dark:text-gray-400 space-y-1">
              <p className="font-bold text-gray-800 dark:text-gray-100">Standard Home Delivery</p>
              <p>Delivery in 45-60 minutes</p>
              <p className="text-sm">To your registered address</p>
            </div>
          </section>

          <section className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
            <h2 className="font-bold text-xl flex items-center gap-2 text-gray-800 dark:text-gray-100">
              <CreditCard size={24} className="text-green-600 dark:text-green-400" />
              Payment Method
            </h2>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white dark:bg-gray-600 rounded-lg flex items-center justify-center font-bold text-green-600 dark:text-green-400 shadow-sm">
                  $
                </div>
                <span className="font-bold text-gray-700 dark:text-gray-200">Payment on Delivery</span>
              </div>
              <span className="text-xs font-black text-green-600 dark:text-green-400 uppercase tracking-widest bg-white dark:bg-gray-600 px-2 py-1 rounded shadow-sm">
                Default
              </span>
            </div>
          </section>
        </div>

        {/* Price Breakdown */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl space-y-6 h-fit">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Final Summary</h2>
          
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <div className="max-h-40 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="truncate flex-1 pr-4">{item.quantity}x {item.product_name}</span>
                  <span className="font-medium">${item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="h-px bg-gray-100 dark:bg-gray-700 my-4"></div>
            
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="text-green-600 dark:text-green-400 font-bold uppercase text-sm">Free</span>
            </div>
            
            <div className="h-px bg-gray-100 dark:bg-gray-700 my-4"></div>
            
            <div className="flex justify-between text-2xl font-black text-gray-900 dark:text-white">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={handleConfirmPurchase}
            disabled={processing}
            className="w-full bg-green-600 text-white font-bold py-5 rounded-2xl hover:bg-green-700 transition-all shadow-lg shadow-green-100 dark:shadow-none disabled:opacity-50 text-lg"
          >
            {processing ? 'Processing Order...' : 'Confirm & Place Order'}
          </button>
          
          <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center uppercase tracking-widest font-bold">
            By clicking, you agree to our terms of service
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
