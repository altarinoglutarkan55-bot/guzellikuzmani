// app/urun/[slug]/buy-panel-real.tsx
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
  const { add } = useCart();

  return (
    <div className="mt-6 grid gap-2">
      <button
        onClick={() => add({ id, title, price, image })}
        className="btn-primary w-full py-3"
      >
        Sepete Ekle
      </button>

      <button
        onClick={() => {
          add({ id, title, price, image });
          alert("Ödeme (demo) — sepet açıldı.");
        }}
        className="w-full rounded-xl bg-[#DB2777] px-4 py-3 text-sm font-extrabold text-white hover:opacity-95"
      >
        Hemen Al
      </button>

      <a
        href="/anket"
        className="btn-ghost w-full py-3 text-center"
      >
        Uzman Önerisi Al
      </a>
    </div>
  );
}
