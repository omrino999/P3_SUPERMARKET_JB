import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { cartApi } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const { user } = useAuth();

  const refreshCartCount = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      setCartCount(0);
      setCartTotal(0);
      return;
    }
    try {
      const res = await cartApi.getCart();
      const items = res.data || [];
      setCartItems(items);
      // Sum up all quantities for cart count
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
      // Calculate total price
      const total = items.reduce((sum, item) => sum + item.subtotal, 0);
      setCartTotal(total);
    } catch (err) {
      console.error('Failed to fetch cart', err);
      setCartItems([]);
      setCartCount(0);
      setCartTotal(0);
    }
  }, [user]);

  useEffect(() => {
    refreshCartCount();
  }, [refreshCartCount]);

  return (
    <CartContext.Provider value={{ cartItems, cartCount, cartTotal, refreshCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
