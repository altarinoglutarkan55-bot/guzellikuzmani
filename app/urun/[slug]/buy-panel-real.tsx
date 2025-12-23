"use client";

import { useCart } from "@/app/providers";

export default function BuyPanelReal({
  id,
  title,
  price,
  image,
}: {
  id: string;
  title: string;
  price: number;
  image?: string;
}) {
  const { add, open } = useCart();

  return (
    <div className="mt-4 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-zinc-700">Fiyat</div>
        <div className="text-lg font-extrabold text-zinc-900">
          {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(price)}
        </div>
      </div>

      <div className="mt-3 grid gap-2">
        <button
          type="button"
          onClick={() => {
            add({ id, title, price, image }, 1);
            open();
          }}
          className="w-full rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-extrabold text-white hover:opacity-95"
        >
          Sepete Ekle
        </button>

        <button
          type="button"
          onClick={() => {
            add({ id, title, price, image }, 1);
            open();
            alert("Ödeme (demo) — sepet açıldı.");
          }}
          className="w-full rounded-2xl bg-[#DB2777] px-4 py-3 text-sm font-extrabold text-white hover:opacity-95"
        >
          Hemen Al
        </button>

        <a
          href="/anket"
          className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-center text-sm font-semibold text-zinc-900 hover:border-zinc-300"
        >
          Uzman Önerisi Al
        </a>
      </div>

      <div className="mt-3 text-xs text-zinc-500">
        * Demo sepet. Ödeme entegrasyonu daha sonra.
      </div>
    </div>
  );
}
