"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/providers";
import { formatTRY } from "@/lib/cart";

export default function CartDrawer() {
  const { isOpen, close, items, total, count, inc, dec, remove, clear } = useCart();

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
            <div className="text-sm font-extrabold text-zinc-900">Sepet</div>
            <div className="text-xs text-zinc-500">{count} ürün</div>
          </div>
          <button
            onClick={close}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold hover:border-zinc-300"
          >
            Kapat
          </button>
        </div>

        <div className="h-[calc(100%-180px)] overflow-auto p-5">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
              Sepetin boş. Mağazadan ürün ekleyebilirsin.
              <div className="mt-3">
                <Link
                  href="/magaza"
                  onClick={close}
                  className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white"
                >
                  Mağazaya git
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((it) => (
                <div key={it.id} className="rounded-2xl border border-zinc-200 bg-white p-3">
                  <div className="flex gap-3">
                    <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-zinc-50 ring-1 ring-zinc-200">
                      <Image
                        src={it.image || "/demo/urun-1.jpg"}
                        alt={it.title}
                        fill
                        className="object-contain"
                        sizes="64px"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="line-clamp-2 text-sm font-semibold text-zinc-900">{it.title}</div>
                      <div className="mt-1 text-sm font-bold text-zinc-900">{formatTRY(it.price)}</div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-xl border border-zinc-200">
                          <button onClick={() => dec(it.id)} className="px-3 py-1 text-sm font-bold">
                            –
                          </button>
                          <span className="px-3 py-1 text-sm font-semibold">{it.qty}</span>
                          <button onClick={() => inc(it.id)} className="px-3 py-1 text-sm font-bold">
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => remove(it.id)}
                          className="text-xs font-semibold text-[#DB2777] hover:underline"
                        >
                          Kaldır
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={clear}
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold hover:border-zinc-300"
              >
                Sepeti temizle
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-zinc-200 p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-600">Toplam</span>
            <span className="font-extrabold text-zinc-900">{formatTRY(total)}</span>
          </div>

          <button
            disabled={items.length === 0}
            className="mt-3 w-full rounded-xl bg-[#DB2777] px-4 py-3 text-sm font-extrabold text-white disabled:opacity-50"
            onClick={() => alert("Ödeme (demo)")}
          >
            Ödemeye geç
          </button>
        </div>
      </aside>
    </div>
  );
}
