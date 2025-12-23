"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type CartItem = {
  id: string;
  title: string;
  price: number;
  image?: string;
  qty: number;
};

type AddItem = {
  id: string;
  title: string;
  price: number;
  image?: string;
};

type CartCtx = {
  items: CartItem[];
  count: number;
  subtotal: number;

  isOpen: boolean;
  open: () => void;
  close: () => void;

  add: (item: AddItem, qty?: number) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartCtx | null>(null);

const STORAGE_KEY = "guzellikuzmani_cart_v1";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load from storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const count = useMemo(() => items.reduce((a, x) => a + (x.qty ?? 0), 0), [items]);
  const subtotal = useMemo(() => items.reduce((a, x) => a + (x.price ?? 0) * (x.qty ?? 0), 0), [items]);

  const value: CartCtx = {
    items,
    count,
    subtotal,

    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),

    add: (item, qty = 1) => {
      setItems((prev) => {
        const q = Math.max(1, Number(qty) || 1);
        const idx = prev.findIndex((x) => x.id === item.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: next[idx].qty + q };
          return next;
        }
        return [...prev, { ...item, qty: q }];
      });
    },

    inc: (id) =>
      setItems((p) => p.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x))),

    dec: (id) =>
      setItems((p) => p.map((x) => (x.id === id ? { ...x, qty: Math.max(1, x.qty - 1) } : x))),

    remove: (id) => setItems((p) => p.filter((x) => x.id !== id)),
    clear: () => setItems([]),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <Providers />");
  return ctx;
}
