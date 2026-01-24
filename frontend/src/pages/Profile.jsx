import React, { useState, useEffect } from 'react';
import { orderApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { History, Calendar, Tag, ChevronDown, ChevronUp, PackageCheck } from 'lucide-react';

const Profile = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await orderApi.getHistory();
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch order history', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleOrder = async (code) => {
    if (expandedOrder === code) {
      setExpandedOrder(null);
      return;
    }
    
    setExpandedOrder(code);
    
    if (!orderDetails[code]) {
      try {
        const res = await orderApi.getOrderDetails(code);
        setOrderDetails(prev => ({ ...prev, [code]: res.data }));
      } catch (err) {
        console.error('Failed to fetch order details', err);
      }
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500 dark:text-gray-400">Loading your history...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-green-600 p-3 rounded-2xl shadow-lg shadow-green-100 dark:shadow-none">
          <History size={32} className="text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-gray-800 dark:text-gray-100 tracking-tight">Purchase History</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Logged in as: <span className="text-green-600 dark:text-green-400 font-bold">{user?.email}</span></p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="text-6xl mb-4">🛍️</div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">No purchases yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Your shopping history will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.unique_code} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-all hover:border-green-100 dark:hover:border-green-900">
              <div 
                onClick={() => toggleOrder(order.unique_code)}
                className="p-6 cursor-pointer flex flex-wrap items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-xl">
                    <PackageCheck size={24} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-mono text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Order Code</p>
                    <p className="font-bold text-gray-800 dark:text-gray-100">{order.unique_code.substring(0, 8).toUpperCase()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center justify-end gap-1">
                      <Calendar size={12} /> Date
                    </p>
                    <p className="font-bold text-gray-700 dark:text-gray-300">{new Date(order.timestamp).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center justify-end gap-1">
                      <Tag size={12} /> Total Paid
                    </p>
                    <p className="text-xl font-black text-green-600 dark:text-green-400">${order.total_price.toFixed(2)}</p>
                  </div>
                  {expandedOrder === order.unique_code ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                </div>
              </div>

              {expandedOrder === order.unique_code && (
                <div className="px-6 pb-6 pt-2 bg-gray-50/50 dark:bg-gray-900/30 border-t border-gray-50 dark:border-gray-700 animate-in slide-in-from-top-2 duration-300">
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Item Details</h4>
                    {!orderDetails[order.unique_code] ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Fetching details...</p>
                    ) : (
                      <div className="space-y-4">
                        {orderDetails[order.unique_code].items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100/50 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                              <span className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 font-black text-xs w-6 h-6 flex items-center justify-center rounded">
                                {item.quantity}
                              </span>
                              <span className="font-bold text-gray-800 dark:text-gray-100">{item.product_name}</span>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-gray-900 dark:text-white">${(item.price_at_purchase * item.quantity).toFixed(2)}</p>
                              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">${item.price_at_purchase.toFixed(2)} each</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
