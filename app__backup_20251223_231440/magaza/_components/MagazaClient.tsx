"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type Product = {
  slug: string;
  title: string;
  brand?: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
  category: string;
};

type Initial = {
  q: string;
  kat: string;
  sort: string;
  min: string;
  max: string;
  totalAll: number;
};

function formatTRY(n: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(n);
}

function cn(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ");
}

export default function MagazaClient({
  products,
  initial,
}: {
  products: Product[];
  initial: Initial;
}) {
  const [open, setOpen] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const active = useMemo(
    () => products.find((p) => p.slug === activeSlug) ?? null,
    [products, activeSlug]
  );

  const openModal = (slug: string) => {
    setActiveSlug(slug);
    setOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setOpen(false);
    document.body.style.overflow = "";
  };

  return (
    <>
      {/* ÜST BAR (istersen burayı sonra daha da sadeleştiririz) */}
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Mağaza</h1>
          <p className="mt-1 text-sm text-zinc-600">
            {products.length} ürün
            <span className="text-zinc-400"> • toplam {initial.totalAll}</span>
          </p>
        </div>
        <Link
          href="/anket"
          className="rounded-2xl bg-[#7C3AED] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
        >
          Uzman önerisi al
        </Link>
      </div>

      {/* GRID */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => {
          const hasCompare = typeof p.compareAtPrice === "number" && p.compareAtPrice > p.price;
          const pct = hasCompare ? Math.round(((p.compareAtPrice! - p.price) / p.compareAtPrice!) * 100) : 0;

          return (
            <div
              key={p.slug}
              className="relative rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                {/* ✅ GÖRSEL: XIAOMI gibi küçük (96x96) */}
                <div className="flex h-24 w-24 flex-none items-center justify-center overflow-hidden rounded-2xl bg-zinc-50 ring-1 ring-zinc-200">
                  <Image
                    src={p.image}
                    alt={p.title}
                    width={96}
                    height={96}
                    className="object-contain"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <Link href={`/urun/${p.slug}`} className="block">
                    <p className="line-clamp-2 text-sm font-semibold text-zinc-900 hover:text-[#7C3AED]">
                      {p.title}
                    </p>
                  </Link>

                  <p className="mt-1 text-xs text-zinc-500">{p.category.replaceAll("-", " ")}</p>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-zinc-900">{formatTRY(p.price)}</span>
                    {hasCompare ? (
                      <>
                        <span className="text-xs font-semibold text-zinc-500 line-through">
                          {formatTRY(p.compareAtPrice!)}
                        </span>
                        <span className="rounded-full bg-[#DB2777]/10 px-2 py-0.5 text-xs font-bold text-[#DB2777]">
                          %{pct} indirim
                        </span>
                      </>
                    ) : null}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Link
                      href={`/urun/${p.slug}`}
                      className="inline-flex flex-1 items-center justify-center rounded-2xl bg-zinc-900 px-3 py-2 text-xs font-semibold text-white hover:opacity-95"
                    >
                      İncele
                    </Link>
                    <button
                      type="button"
                      onClick={() => openModal(p.slug)}
                      className={cn(
                        "inline-flex flex-1 items-center justify-center rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900",
                        "hover:border-zinc-300"
                      )}
                    >
                      Quick View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {open && active ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="absolute inset-0 bg-black/45" />

          <div className="relative mx-4 w-full max-w-3xl rounded-3xl bg-white shadow-2xl ring-1 ring-zinc-200">
            <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
              <p className="text-sm font-semibold text-zinc-900">Quick View</p>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-900 hover:border-zinc-300"
              >
                Kapat
              </button>
            </div>

            <div className="grid gap-6 p-6 md:grid-cols-2">
              {/* ✅ Modal görseli de küçük ve temiz */}
              <div className="flex items-center justify-center rounded-3xl bg-zinc-50 ring-1 ring-zinc-200 py-10">
                <Image
                  src={active.image}
                  alt={active.title}
                  width={220}
                  height={220}
                  className="object-contain"
                  priority
                />
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold tracking-wide text-zinc-500">
                    {active.category.replaceAll("-", " ").toUpperCase()}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">{active.title}</h3>
                  <p className="mt-2 text-lg font-bold text-zinc-900">{formatTRY(active.price)}</p>
                </div>

                <div className="grid gap-2">
                  <Link
                    href={`/urun/${active.slug}`}
                    onClick={() => (document.body.style.overflow = "")}
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:opacity-95"
                  >
                    Ürün Sayfasına Git
                  </Link>

                  <Link
                    href="/anket"
                    onClick={() => (document.body.style.overflow = "")}
                    className="inline-flex w-full items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 hover:border-zinc-300"
                  >
                    Uzman önerisi al
                  </Link>
                </div>

                <p className="text-sm leading-6 text-zinc-600">
                  Mini açıklama: Detaylar ürün sayfasında. (Demo)
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
