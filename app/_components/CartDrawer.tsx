"use client";

import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/app/providers";

function formatTRY(n: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(n);
}

export default function CartDrawer() {
  const {
    isOpen,
    close,
    items,
    count,
    subtotal,
    discount,
    shipping,
    total,
    inc,
    dec,
    remove,
    clear,
    coupon,
    setCoupon,
  } = useCart();

  const [code, setCode] = useState(coupon ?? "");

  // dışarıdan coupon değişirse input sync
  useEffect(() => {
    setCode(coupon ?? "");
  }, [coupon]);

  // body scroll lock + ESC
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;

    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollBarWidth > 0) document.body.style.paddingRight = `${scrollBarWidth}px`;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [isOpen, close]);

  const progress = useMemo(() => {
    const threshold = 1000; // TL
    const paid = Math.max(0, subtotal - discount);
    const left = Math.max(0, threshold - paid);
    const pct = Math.min(100, Math.round((paid / threshold) * 100));
    return { threshold, paid, left, pct };
  }, [subtotal, discount]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999]"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <aside className="absolute right-0 top-0 h-full w-full max-w-md border-l bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="text-sm font-extrabold text-zinc-900">Sepetim</div>
          <button
            type="button"
            onClick={close}
            className="rounded-full border px-3 py-1 text-sm font-semibold hover:bg-zinc-50"
          >
            Kapat
          </button>
        </div>

        {/* Free shipping */}
        <div className="border-b px-4 py-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-zinc-700">Ücretsiz kargo eşiği</span>
            <span className="font-semibold text-zinc-900">{formatTRY(progress.threshold)}</span>
          </div>

          <div className="mt-2 h-2 w-full rounded-full bg-zinc-200">
            <div className="h-2 rounded-full bg-zinc-900" style={{ width: `${progress.pct}%` }} />
          </div>

          {count > 0 ? (
            progress.left === 0 ? (
              <div className="mt-2 font-semibold text-zinc-900">🎉 Ücretsiz kargo kazandın!</div>
            ) : (
              <div className="mt-2 text-zinc-700">
                Ücretsiz kargo için <span className="font-semibold text-zinc-900">{formatTRY(progress.left)}</span>{" "}
                daha ekle.
              </div>
            )
          ) : (
            <div className="mt-2 text-zinc-700">Sepetin boş.</div>
          )}
        </div>

        {/* Items */}
        <div className="max-h-[52vh] overflow-auto px-4 py-3">
          {items.length === 0 ? (
            <div className="rounded-xl border bg-zinc-50 p-4 text-sm text-zinc-700">
              Sepetin boş.
              <div className="mt-3">
                <Link
                  href="/magaza"
                  onClick={close}
                  className="inline-flex rounded-full border bg-white px-4 py-2 text-sm font-semibold hover:bg-zinc-50"
                >
                  Mağazaya Git
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((it) => (
                <div key={it.id} className="flex gap-3 rounded-xl border p-3">
                  <div className="h-16 w-16 overflow-hidden rounded-lg bg-zinc-100">
                    {it.image ? (
                      <Image src={it.image} alt={it.title} width={64} height={64} className="h-16 w-16 object-cover" />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-zinc-900">{it.title}</div>
                    <div className="mt-1 text-sm text-zinc-700">{formatTRY(it.price)}</div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border">
                        <button
                          type="button"
                          onClick={() => dec(it.id)}
                          className="px-3 py-1 text-sm font-bold hover:bg-zinc-50"
                        >
                          -
                        </button>
                        <div className="px-3 py-1 text-sm font-semibold">{it.qty}</div>
                        <button
                          type="button"
                          onClick={() => inc(it.id)}
                          className="px-3 py-1 text-sm font-bold hover:bg-zinc-50"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => remove(it.id)}
                        className="text-sm font-semibold text-zinc-700 hover:text-zinc-900"
                      >
                        Kaldır
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={clear}
                className="w-full rounded-xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-zinc-50"
              >
                Sepeti Temizle
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t bg-white px-4 py-4">
          <div className="flex items-center gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Kupon (TOLGA10)"
              className="h-10 flex-1 rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
            />
            <button
              type="button"
              onClick={() => setCoupon(code)}
              className="h-10 rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              Uygula
            </button>
          </div>

          <div className="mt-3 space-y-1 text-sm">
            <div className="flex justify-between text-zinc-700">
              <span>Ara toplam</span>
              <span className="font-semibold text-zinc-900">{formatTRY(subtotal)}</span>
            </div>
            <div className="flex justify-between text-zinc-700">
              <span>İndirim</span>
              <span className="font-semibold text-zinc-900">- {formatTRY(discount)}</span>
            </div>
            <div className="flex justify-between text-zinc-700">
              <span>Kargo</span>
              <span className="font-semibold text-zinc-900">{formatTRY(shipping)}</span>
            </div>
            <div className="mt-2 flex justify-between text-base">
              <span className="font-extrabold text-zinc-900">Toplam</span>
              <span className="font-extrabold text-zinc-900">{formatTRY(total)}</span>
            </div>
          </div>

          <Link
            href="/odeme"
            onClick={close}
            className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-xl bg-zinc-900 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            Ödemeye Geç (demo)
          </Link>

          <div className="mt-2 text-xs text-zinc-500">
            * Demo sepet/ödeme. Entegrasyonlar (kargo, ödeme, sipariş) sonra bağlanacak.
          </div>
        </div>
      </aside>
    </div>,
    document.body
  );
}
