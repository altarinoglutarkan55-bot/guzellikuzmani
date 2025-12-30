"use client";

import { createPortal } from "react-dom";
import { useEffect } from "react";
import { useCart } from "@/app/providers";

export default function CartDrawer() {
  const { isOpen, open, close, items, total } = useCart();

  // body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* 🔘 SEPET BUTONU (HER YERDE ÇALIŞIR) */}
      <button
        onClick={open}
        className="rounded-full border px-4 py-2 text-sm font-semibold"
      >
        Sepet {items.length > 0 && `(${items.length})`}
      </button>

      {/* 🧺 DRAWER */}
      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999]"
            onClick={close}
            aria-modal="true"
            role="dialog"
          >
            {/* overlay */}
            <div className="absolute inset-0 bg-black/60" />

            {/* panel */}
            <aside
              className="absolute right-0 top-0 h-full w-full max-w-md bg-white p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Sepetim</h2>
                <button onClick={close}>Kapat</button>
              </div>

              {items.length === 0 ? (
                <p>Sepet boş</p>
              ) : (
                <>
                  <ul className="space-y-2">
                    {items.map((i) => (
                      <li key={i.id} className="flex justify-between">
                        <span>{i.title}</span>
                        <span>{i.qty}×</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 font-bold">
                    Toplam: ₺{total}
                  </div>

                  <button className="mt-4 w-full rounded bg-purple-600 py-2 text-white">
                    Ödemeye Geç
                  </button>
                </>
              )}
            </aside>
          </div>,
          document.body
        )}
    </>
  );
}
