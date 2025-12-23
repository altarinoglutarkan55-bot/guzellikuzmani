"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/providers";

function formatTRY(n: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(n);
}

export default function CartDrawer() {
  const { isOpen, close, items, count, subtotal, inc, dec, remove, clear } = useCart();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-zinc-900">Sepet</p>
            <p className="text-xs text-zinc-500">{count} ürün</p>
          </div>

          <button
            type="button"
            onClick={close}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-900 hover:border-zinc-300"
          >
            Kapat
          </button>
        </div>

        <div className="h-[calc(100%-180px)] overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 text-center">
              <p className="text-sm font-semibold text-zinc-900">Sepetin boş</p>
              <p className="mt-1 text-sm text-zinc-600">Mağazadan ürün ekleyebilirsin.</p>
              <Link
                href="/magaza"
                onClick={close}
                className="mt-4 inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Mağazaya git
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((it) => (
                <div key={it.id} className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <div className="flex gap-3">
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
                      <p className="line-clamp-2 text-sm font-semibold text-zinc-900">{it.title}</p>
                      <p className="mt-1 text-sm font-extrabold text-zinc-900">{formatTRY(it.price)}</p>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-2 py-1">
                          <button
                            type="button"
                            onClick={() => dec(it.id)}
                            className="h-8 w-8 rounded-xl border border-zinc-200 bg-white text-sm font-extrabold text-zinc-900 hover:border-zinc-300"
                          >
                            –
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-zinc-900">{it.qty}</span>
                          <button
                            type="button"
                            onClick={() => inc(it.id)}
                            className="h-8 w-8 rounded-xl border border-zinc-200 bg-white text-sm font-extrabold text-zinc-900 hover:border-zinc-300"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => remove(it.id)}
                          className="text-xs font-semibold text-zinc-500 hover:text-zinc-900"
                        >
                          Kaldır
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-zinc-200 pt-3">
                    <span className="text-xs font-semibold text-zinc-500">Ara Toplam</span>
                    <span className="text-sm font-extrabold text-zinc-900">
                      {formatTRY(it.price * it.qty)}
                    </span>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={clear}
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:border-zinc-300"
              >
                Sepeti temizle
              </button>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-zinc-200 bg-white px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-zinc-700">Toplam</span>
            <span className="text-lg font-extrabold text-zinc-900">{formatTRY(subtotal)}</span>
          </div>

          <p className="mt-2 text-xs text-zinc-500">* Demo sepet. Ödeme entegrasyonu daha sonra.</p>

          <div className="mt-3 grid gap-2">
            <button
              type="button"
              onClick={() => alert("Ödeme (demo) — ödeme adımı daha sonra eklenecek.")}
              className="w-full rounded-2xl bg-[#DB2777] px-4 py-3 text-sm font-extrabold text-white hover:opacity-95 disabled:opacity-60"
              disabled={items.length === 0}
            >
              Ödemeye Geç
            </button>

            <Link
              href="/magaza"
              onClick={close}
              className="w-full rounded-2xl bg-zinc-900 px-4 py-3 text-center text-sm font-extrabold text-white hover:opacity-95"
            >
              Alışverişe devam et
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
