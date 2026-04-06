/* eslint-disable react-refresh/only-export-components -- hook accoppiato al provider carrello */
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { getProductById } from '../data/shopProducts';

const STORAGE_KEY = 'museo_shop_cart_v1';

const CartContext = createContext(null);

function loadLines() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l) => l && typeof l.productId === 'string' && typeof l.qty === 'number' && l.qty > 0
    );
  } catch {
    return [];
  }
}

function saveLines(lines) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    /* ignore quota */
  }
}

export function CartProvider({ children }) {
  const [lines, setLines] = useState(loadLines);

  const setAndPersist = useCallback((updater) => {
    setLines((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveLines(next);
      return next;
    });
  }, []);

  const addItem = useCallback((productId, amount = 1) => {
    const n = Math.max(1, Math.floor(amount));
    setAndPersist((prev) => {
      const i = prev.findIndex((l) => l.productId === productId);
      if (i === -1) return [...prev, { productId, qty: n }];
      const copy = [...prev];
      copy[i] = { ...copy[i], qty: copy[i].qty + n };
      return copy;
    });
  }, [setAndPersist]);

  const setQty = useCallback((productId, qty) => {
    const q = Math.max(0, Math.floor(qty));
    setAndPersist((prev) => {
      if (q === 0) return prev.filter((l) => l.productId !== productId);
      const i = prev.findIndex((l) => l.productId === productId);
      if (i === -1) return [...prev, { productId, qty: q }];
      const copy = [...prev];
      copy[i] = { ...copy[i], qty: q };
      return copy;
    });
  }, [setAndPersist]);

  const removeItem = useCallback(
    (productId) => {
      setAndPersist((prev) => prev.filter((l) => l.productId !== productId));
    },
    [setAndPersist]
  );

  const clearCart = useCallback(() => {
    setAndPersist([]);
  }, [setAndPersist]);

  const itemCount = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);

  const total = useMemo(() => {
    let t = 0;
    for (const l of lines) {
      const p = getProductById(l.productId);
      if (p) t += p.price * l.qty;
    }
    return t;
  }, [lines]);

  const value = useMemo(
    () => ({
      lines,
      addItem,
      setQty,
      removeItem,
      clearCart,
      itemCount,
      total,
    }),
    [lines, addItem, setQty, removeItem, clearCart, itemCount, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
