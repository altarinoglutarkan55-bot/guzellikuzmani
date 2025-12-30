"use client";

import { SessionProvider } from "next-auth/react";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: string;
  title: string;
  price: number;
  image?: string;
  qty: number;
};

type CartCtx = {
  isOpen: boolean;
  open: () => void;
  close: () => void;

  items: CartItem[];
  count: number;

  subtotal: number;
  discount: number;
  shipping: number;
  total: number;

  coupon: string;
  setCoupon: (code: string) => void;

  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);

export default function Providers({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState("");

  const api = useMemo<CartCtx>(() => {
    const count = items.reduce((a, x) => a + x.qty, 0);
    const subtotal = items.reduce((a, x) => a + x.price * x.qty, 0);

    const discount = coupon === "TOLGA10" ? Math.round(subtotal * 0.1) : 0;
    const shipping = subtotal - discount >= 1000 ? 0 : count > 0 ? 59 : 0;
    const total = Math.max(0, subtotal - discount + shipping);

    return {
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),

      items,
      count,

      subtotal,
      discount,
      shipping,
      total,

      coupon,
      setCoupon,

      add: (item, qty = 1) =>
        setItems((p) => {
          const ex = p.find((x) => x.id === item.id);
          return ex
            ? p.map((x) => (x.id === item.id ? { ...x, qty: x.qty + qty } : x))
            : [...p, { ...item, qty }];
        }),
      inc: (id) => setItems((p) => p.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x))),
      dec: (id) =>
        setItems((p) =>
          p.map((x) => (x.id === id ? { ...x, qty: Math.max(1, x.qty - 1) } : x))
        ),
      remove: (id) => setItems((p) => p.filter((x) => x.id !== id)),
      clear: () => setItems([]),
    };
  }, [items, coupon]);

  return (
    <SessionProvider>
      <Ctx.Provider value={api}>{children}</Ctx.Provider>
    </SessionProvider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within Providers");
  return ctx;
}
