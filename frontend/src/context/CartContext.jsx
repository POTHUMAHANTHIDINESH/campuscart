import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "campuscart_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Keep localStorage in sync whenever the cart changes, so a refresh
  // (or closing/reopening the tab) doesn't wipe it out.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage can fail in private browsing / storage-full edge cases;
      // the cart just won't persist in that case, which is an acceptable fallback.
    }
  }, [items]);

  function addToCart(product) {
    setItems((prev) => {
      if (prev.some((i) => i._id === product._id)) return prev;
      return [...prev, product];
    });
  }

  function removeFromCart(productId) {
    setItems((prev) => prev.filter((i) => i._id !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  const total = useMemo(() => items.reduce((sum, i) => sum + i.price, 0), [items]);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
