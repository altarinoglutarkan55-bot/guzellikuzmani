"use client";

import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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

  const [mounted, setMounted] = useState(false);
  const [code, setCode] = useState(coupon ?? "");

  useEffect(() => setMounted(true), []);

  // drawer açılınca input güncel kuponla senkron kalsın
  useEffect(() => {
    if (isOpen) setCode(coupon ?? "");
  }, [isOpen, coupon]);

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
    const threshold = 1000;
    const paid = Math.max(0, subtotal - discount);
    const left = Math.max(0, threshold - paid);
    const pct = Math.min(100, Math.round((paid / threshold) * 100));
    return { threshold, paid, left, pct };
  }, [subtotal, discount]);

  if (!mounted || !isOpen) return null;

  const activeCoupon = (coupon ?? "").trim();

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

      {/* ✅ flex-col: footer hiçbir zaman kaybolmaz */}
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l bg-white shadow-2xl">
        {/* Header */}
        <div className="shrink-0 border-b px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-extrabold text-zinc-900">Sepetim</div>
              <div className="text-xs text-zinc-500">{count} ürün</div>
            </div>
            <button
              onClick={close}
              className="rounded-lg border px-3 py-1 text-xs font-semibold hover:bg-zinc-50"
            >
              Kapat
            </button>
          </div>
        </div>

        {/* Free shipping */}
        <div className="shrink-0 border-b px-4 py-3">
          <div className="flex items-center justify-between text-xs text-zinc-600">
            <span>Ücretsiz kargo eşiği</span>
            <span className="font-semibold text-zinc-900">{formatTRY(progress.threshold)}</span>
          </div>

          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
            <div className="h-full bg-zinc-900" style={{ width: `${progress.pct}%` }} />
          </div>

          {count > 0 ? (
            progress.left === 0 ? (
              <div className="mt-2 text-xs font-semibold text-zinc-900">
                🎉 Ücretsiz kargo kazandın!
              </div>
            ) : (
              <div className="mt-2 text-xs text-zinc-600">
                Ücretsiz kargo için{" "}
                <span className="font-semibold text-zinc-900">{formatTRY(progress.left)}</span>{" "}
                daha ekle.
              </div>
            )
          ) : (
            <div className="mt-2 text-xs text-zinc-500">Sepetin boş.</div>
          )}
        </div>

        {/* ✅ Items: artık flex-1, footer’ı aşağı itmez */}
        <div className="min-h-0 flex-1 overflow-auto px-4 py-3">
          {items.length === 0 ? (
            <div className="rounded-xl border p-4 text-sm text-zinc-600">
              Sepetin boş.{" "}
              <Link className="font-semibold underline" href="/magaza" onClick={close}>
                Mağazaya Git
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((it) => (
                <div key={it.id} className="flex gap-3 rounded-xl border p-3">
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-zinc-100">
                    {it.image ? (
                      <Image src={it.image} alt={it.title} fill className="object-cover" />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-zinc-900">{it.title}</div>
                    <div className="mt-1 text-xs text-zinc-600">{formatTRY(it.price)}</div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 rounded-lg border px-2 py-1">
                        <button
                          className="px-2 text-sm font-bold"
                          onClick={() => dec(it.id)}
                          aria-label="Azalt"
                        >
                          -
                        </button>
                        <span className="min-w-6 text-center text-xs font-semibold">{it.qty}</span>
                        <button
                          className="px-2 text-sm font-bold"
                          onClick={() => inc(it.id)}
                          aria-label="Arttır"
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="text-xs font-semibold text-zinc-600 underline"
                        onClick={() => remove(it.id)}
                      >
                        Kaldır
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={clear}
                className="w-full rounded-xl border px-4 py-2 text-xs font-semibold hover:bg-zinc-50"
              >
                Sepeti Temizle
              </button>
            </div>
          )}
        </div>

        {/* Footer totals + coupon */}
        <div className="shrink-0 border-t px-4 py-4">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between text-zinc-700">
              <span>Ara toplam</span>
              <span className="font-semibold text-zinc-900">{formatTRY(subtotal)}</span>
            </div>

            <div className="flex items-center justify-between text-zinc-700">
              <span>İndirim</span>
              <span className="font-semibold text-zinc-900">- {formatTRY(discount)}</span>
            </div>

            <div className="flex items-center justify-between text-zinc-700">
              <span>Kargo</span>
              <span className="font-semibold text-zinc-900">{formatTRY(shipping)}</span>
            </div>

            <div className="flex items-center justify-between text-zinc-900">
              <span className="font-extrabold">Toplam</span>
              <span className="font-extrabold">{formatTRY(total)}</span>
            </div>
          </div>

          {/* ✅ Kupon her zaman görünür */}
          <div className="mt-4 flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Kupon (örn: TOLGA10)"
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
            />
            <button
              onClick={() => setCoupon(code)}
              className="shrink-0 rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-zinc-50"
            >
              Uygula
            </button>
          </div>

          {activeCoupon !== "" && (
            <div className="mt-2 text-xs text-zinc-600">
              Aktif kupon:{" "}
              <span className="font-semibold text-zinc-900">{activeCoupon.toUpperCase()}</span>
            </div>
          )}

          <Link
            href="/odeme"
            onClick={close}
            className={`mt-3 block w-full rounded-xl px-4 py-3 text-center text-sm font-extrabold ${
              count > 0
                ? "bg-zinc-900 text-white hover:bg-zinc-800"
                : "pointer-events-none bg-zinc-200 text-zinc-500"
            }`}
          >
            Ödeme (demo)
          </Link>

          <div className="mt-2 text-[11px] text-zinc-500">
            * Demo sepet/ödeme. Entegrasyonlar (kargo, ödeme, sipariş) sonra bağlanacak.
          </div>
        </div>
      </aside>
    </div>,
    document.body
  );
}
