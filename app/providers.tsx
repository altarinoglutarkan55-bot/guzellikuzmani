"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { SessionProvider } from "next-auth/react";

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

const LS_KEY = "gz_cart_v1";
const LS_COUPON = "gz_coupon_v1";

function safeNumber(n: unknown) {
  const x = Number(n);
  return Number.isFinite(x) ? x : 0;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCouponState] = useState("");

  // ilk yüklemede oku
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {}

    try {
      const c = localStorage.getItem(LS_COUPON);
      if (c) setCouponState(String(c));
    } catch {}
  }, []);

  // kaydet
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_COUPON, String(coupon ?? ""));
    } catch {}
  }, [coupon]);

  const api = useMemo<CartCtx>(() => {
    const count = items.reduce((a, x) => a + safeNumber(x.qty), 0);
    const subtotal = items.reduce((a, x) => a + safeNumber(x.price) * safeNumber(x.qty), 0);

    // demo kupon
    const code = (coupon ?? "").trim().toUpperCase();
    const discount = code === "TOLGA10" ? Math.round(subtotal * 0.1) : 0;

    // demo kargo
    const paid = Math.max(0, subtotal - discount);
    const shipping = paid >= 1000 ? 0 : count > 0 ? 59 : 0;

    const total = Math.max(0, paid + shipping);

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
      setCoupon: (c) => setCouponState(String(c ?? "")),

      add: (item, qty = 1) => {
        const q = Math.max(1, safeNumber(qty));
        setItems((prev) => {
          const id = String(item.id);
          const ex = prev.find((x) => x.id === id);
          if (ex) return prev.map((x) => (x.id === id ? { ...x, qty: x.qty + q } : x));
          return [...prev, { ...item, id, qty: q }];
        });
      },

      inc: (id) => setItems((p) => p.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x))),
      dec: (id) =>
        setItems((p) => p.map((x) => (x.id === id ? { ...x, qty: Math.max(1, x.qty - 1) } : x))),
      remove: (id) => setItems((p) => p.filter((x) => x.id !== id)),
      clear: () => setItems([]),
    };
  }, [isOpen, items, coupon]);

  return (
    <SessionProvider>
      <Ctx.Provider value={api}>{children}</Ctx.Provider>
    </SessionProvider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within <Providers />");
  return ctx;
}
