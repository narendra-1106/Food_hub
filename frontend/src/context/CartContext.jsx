import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);

  const addToCart = (item, restId) => {
    if (restaurantId && restaurantId !== restId) {
      alert("You can only add items from one restaurant at a time. Clear your cart to order from a different restaurant.");
      return;
    }
    setRestaurantId(restId);
    setCart((prev) => {
      const existing = prev.find(i => i.menuItemId === item._id);
      if (existing) {
        return prev.map(i => i.menuItemId === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { menuItemId: item._id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const clearCart = () => {
    setCart([]);
    setRestaurantId(null);
  };

  const total = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, restaurantId, addToCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
