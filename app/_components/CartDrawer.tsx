"use client";

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

  // ✅ body scroll lock + ESC close
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;

    // scrollbar jump fix
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80]"
      role="dialog"
      aria-modal="true"
      aria-label="Sepet"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      {/* ✅ Daha koyu + blur overlay (karışma biter) */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* ✅ Panel tamamen opak + ayrışan border/shadow */}
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl border-l border-zinc-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
          <div>
            <div className="text-sm font-extrabold text-zinc-900">Sepetim</div>
            <div className="text-xs text-zinc-500">{count} ürün</div>
          </div>

          <button
            type="button"
            onClick={close}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-900 hover:border-zinc-300"
          >
            Kapat
          </button>
        </div>

        {/* Free shipping progress */}
        <div className="border-b border-zinc-200 px-5 py-4">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-700">
            <span>Ücretsiz kargo eşiği</span>
            <span>{formatTRY(progress.threshold)}</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
            <div className="h-full bg-[#7C3AED]" style={{ width: `${progress.pct}%` }} />
          </div>
          <p className="mt-2 text-xs text-zinc-600">
            {progress.left === 0 ? (
              <span className="font-semibold text-zinc-900">🎉 Ücretsiz kargo kazandın!</span>
            ) : (
              <>
                Ücretsiz kargo için <span className="font-semibold text-zinc-900">{formatTRY(progress.left)}</span>{" "}
                daha ekle.
              </>
            )}
          </p>
        </div>

        {/* Items */}
        <div className="h-[calc(100%-320px)] overflow-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 text-center">
              <div className="text-sm font-extrabold text-zinc-900">Sepetin boş</div>
              <p className="mt-1 text-sm text-zinc-600">Mağazaya gidip ürün ekleyebilirsin.</p>
              <Link
                href="/magaza"
                onClick={close}
                className="mt-4 inline-flex h-11 items-center justify-center rounded-2xl bg-zinc-900 px-4 text-sm font-extrabold text-white hover:opacity-95"
              >
                Mağazaya Git
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((it) => (
                <div key={it.id} className="flex gap-3 rounded-3xl border border-zinc-200 bg-white p-3 shadow-sm">
                  <div className="flex h-16 w-16 flex-none items-center justify-center overflow-hidden rounded-2xl bg-zinc-50 ring-1 ring-zinc-200">
                    <Image
                      src={it.image || "/demo/urun-1.jpg"}
                      alt={it.title}
                      width={64}
                      height={64}
                      className="object-contain"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-2 text-sm font-semibold text-zinc-900">{it.title}</div>
                    <div className="mt-1 text-sm font-extrabold text-zinc-900">{formatTRY(it.price)}</div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-2xl border border-zinc-200">
                        <button
                          type="button"
                          onClick={() => dec(it.id)}
                          className="h-9 w-10 rounded-l-2xl text-sm font-extrabold text-zinc-900 hover:bg-zinc-50"
                        >
                          −
                        </button>
                        <div className="grid h-9 w-10 place-items-center text-sm font-extrabold text-zinc-900">
                          {it.qty}
                        </div>
                        <button
                          type="button"
                          onClick={() => inc(it.id)}
                          className="h-9 w-10 rounded-r-2xl text-sm font-extrabold text-zinc-900 hover:bg-zinc-50"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => remove(it.id)}
                        className="text-xs font-semibold text-zinc-600 hover:text-[#DB2777]"
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
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 hover:border-zinc-300"
              >
                Sepeti Temizle
              </button>
            </div>
          )}
        </div>

        {/* Footer totals */}
        <div className="border-t border-zinc-200 px-5 py-4">
          {/* Coupon */}
          <div className="mb-3 rounded-3xl border border-zinc-200 bg-zinc-50 p-3">
            <div className="text-xs font-semibold text-zinc-700">Kupon Kodu</div>
            <div className="mt-2 flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="TOLGA10"
                className="h-10 flex-1 rounded-2xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-300"
              />
              <button
                type="button"
                onClick={() => setCoupon(code)}
                className="h-10 rounded-2xl bg-zinc-900 px-4 text-sm font-extrabold text-white hover:opacity-95"
              >
                Uygula
              </button>
            </div>
            <p className="mt-2 text-[11px] text-zinc-600">
              Demo kupon: <b>TOLGA10</b> (%10)
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-zinc-600">Ara toplam</span>
              <span className="font-extrabold text-zinc-900">{formatTRY(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-600">İndirim</span>
              <span className="font-extrabold text-[#DB2777]">- {formatTRY(discount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-600">Kargo</span>
              <span className="font-extrabold text-zinc-900">{formatTRY(shipping)}</span>
            </div>

            <div className="mt-2 flex items-center justify-between border-t border-zinc-200 pt-3">
              <span className="font-extrabold text-zinc-900">Toplam</span>
              <span className="text-lg font-extrabold text-zinc-900">{formatTRY(total)}</span>
            </div>
          </div>

          <div className="mt-4 grid gap-2">
            <Link
              href="/odeme"
              onClick={close}
              className="grid h-11 place-items-center rounded-2xl bg-[#7C3AED] px-4 text-sm font-extrabold text-white hover:opacity-95"
            >
              Ödemeye Geç
            </Link>
            <Link
              href="/magaza"
              onClick={close}
              className="grid h-11 place-items-center rounded-2xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 hover:border-zinc-300"
            >
              Alışverişe Devam Et
            </Link>
          </div>

          <p className="mt-3 text-[11px] text-zinc-500">
            * Demo sepet/ödeme. Entegrasyonlar (kargo, ödeme, sipariş) sonra bağlanacak.
          </p>
        </div>
      </aside>
    </div>
  );
}
