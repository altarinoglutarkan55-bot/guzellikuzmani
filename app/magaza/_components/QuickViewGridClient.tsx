"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type Item = {
  slug: string;
  title: string;
  price: number;
  category: string;
  img: string;
  badge?: string;
};

function formatTRY(n: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(n);
}

function cn(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ");
}

export default function QuickViewGridClient({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const active = useMemo(
    () => items.find((x) => x.slug === activeSlug) ?? null,
    [items, activeSlug]
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
      {/* GRID */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <div
            key={p.slug}
            className="group relative rounded-3xl border border-zinc-200 bg-white p-3 shadow-sm transition hover:shadow-md"
          >
            <Link href={`/urun/${p.slug}`} className="block">
              <div className="relative rounded-2xl bg-zinc-50 ring-1 ring-zinc-200 py-4">
                {/* 🔽 GÖRSEL DAHA DA KÜÇÜLDÜ */}
                <div className="relative mx-auto aspect-square w-1/3">
                  <Image
                    src={p.img}
                    alt={p.title}
                    fill
                    className="object-contain"
                    sizes="120px"
                  />
                </div>

                {p.badge ? (
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-800 ring-1 ring-zinc-200">
                    {p.badge}
                  </span>
                ) : null}
              </div>

              <p className="mt-3 line-clamp-2 text-sm font-semibold text-zinc-900 group-hover:text-[#7C3AED]">
                {p.title}
              </p>
              <p className="mt-1 text-sm font-bold text-zinc-900">
                {formatTRY(p.price)}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {p.category.replaceAll("-", " ")}
              </p>
            </Link>

            <button
              type="button"
              onClick={() => openModal(p.slug)}
              className={cn(
                "absolute left-4 right-4 bottom-4 rounded-2xl bg-white/90 px-4 py-2 text-sm font-semibold text-zinc-900",
                "ring-1 ring-zinc-200 backdrop-blur transition",
                "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
              )}
            >
              Quick View
            </button>
          </div>
        ))}
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

            <div className="grid gap-6 p-5 md:grid-cols-2">
              <div className="relative rounded-3xl bg-zinc-50 ring-1 ring-zinc-200 py-6">
                {/* 🔽 MODAL GÖRSELİ DE KÜÇÜLDÜ */}
                <div className="relative mx-auto aspect-square w-1/3">
                  <Image
                    src={active.img}
                    alt={active.title}
                    fill
                    className="object-contain"
                    sizes="220px"
                    priority
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold tracking-wide text-zinc-500">
                    {active.category.replaceAll("-", " ").toUpperCase()}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">
                    {active.title}
                  </h3>
                  <p className="mt-2 text-lg font-bold text-zinc-900">
                    {formatTRY(active.price)}
                  </p>
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
                  Mini açıklama: Bu ürün kategorisine göre hızlı çözüm sunar.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
