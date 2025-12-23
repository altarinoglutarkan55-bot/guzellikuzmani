"use client";

import { useCart } from "@/app/providers";

export default function AddToCartMini({
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
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        add({ id, title, price, image }, 1);
        open();
      }}
      className="rounded-xl bg-[#DB2777] px-3 py-2 text-xs font-extrabold text-white hover:opacity-95"
      aria-label="Sepete ekle"
    >
      + Sepete
    </button>
  );
}
