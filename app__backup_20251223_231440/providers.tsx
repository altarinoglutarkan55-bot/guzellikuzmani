// app/providers.tsx
"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "@/lib/cart";
import { readCart, writeCart } from "@/lib/cart";

type CartCtx = {
  items: CartItem[];
  count: number;
  total: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used within Providers");
  return v;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setItems(readCart());
  }, []);

  useEffect(() => {
    writeCart(items);
  }, [items]);

  const count = useMemo(() => items.reduce((a, b) => a + (b.qty || 0), 0), [items]);
  const total = useMemo(() => items.reduce((a, b) => a + (b.price || 0) * (b.qty || 0), 0), [items]);

  const api: CartCtx = {
    items,
    count,
    total,
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),

    add: (item, qty = 1) => {
      const id = item.id;
      setItems((prev) => {
        const idx = prev.findIndex((x) => x.id === id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
          return copy;
        }
        return [...prev, { ...item, qty }];
      });
      setIsOpen(true);
    },

    inc: (id) => setItems((p) => p.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x))),
    dec: (id) => setItems((p) => p.map((x) => (x.id === id ? { ...x, qty: Math.max(1, x.qty - 1) } : x))),
    remove: (id) => setItems((p) => p.filter((x) => x.id !== id)),
    clear: () => setItems([]),
  };

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
