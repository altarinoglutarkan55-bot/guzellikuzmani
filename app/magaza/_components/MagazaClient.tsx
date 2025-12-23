"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type ProductUI = {
  slug: string;
  title: string;
  brand?: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
  category?: string;
};

const CATS = [
  { label: "Tümü", kat: "" },
  { label: "Saç", kat: "sac" },
  { label: "Şampuan", kat: "sampuan" },
  { label: "Maske", kat: "maske" },
  { label: "Serum", kat: "serum" },
  { label: "Tonik", kat: "tonik" },
  { label: "Isı Koruyucu", kat: "isi-koruyucu" },
  { label: "Şekillendirici", kat: "sekillendirici" },
  { label: "Saç Derisi", kat: "sac-derisi" },
  { label: "Cilt", kat: "cilt" },
  { label: "Makyaj", kat: "makyaj" },
  { label: "Erkek", kat: "erkek" },
  { label: "Çocuk", kat: "cocuk" },
];

function cn(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ");
}

function money(n: number) {
  try {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(n);
  } catch {
    return `${n} ₺`;
  }
}

function discountPercent(price: number, compare?: number | null) {
  if (!compare || compare <= price) return 0;
  return Math.round(((compare - price) / compare) * 100);
}

export default function MagazaClient({
  products,
  initial,
}: {
  products: ProductUI[];
  initial: { q: string; kat: string; sort: string; min: string; max: string; totalAll: number };
}) {
  const router = useRouter();
  const sp = useSearchParams();

  // URL ile senkron (header araması vs.)
  const q = sp?.get("q") ?? initial.q ?? "";
  const kat = sp?.get("kat") ?? initial.kat ?? "";
  const sort = sp?.get("sort") ?? initial.sort ?? "pop";
  const min = sp?.get("min") ?? initial.min ?? "";
  const max = sp?.get("max") ?? initial.max ?? "";

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [quick, setQuick] = useState<ProductUI | null>(null);

  const pushWith = (mutate: (qs: URLSearchParams) => void) => {
    const qs = new URLSearchParams(sp?.toString() ?? "");
    mutate(qs);
    const s = qs.toString();
    router.push(s ? `/magaza?${s}` : "/magaza");
  };

  const clearAll = () => {
    router.push("/magaza");
  };

  const resultsLabel = useMemo(() => {
    const activeFilters = [q, kat, min, max].some(Boolean);
    return activeFilters
      ? `${products.length} sonuç`
      : `${initial.totalAll} ürün`;
  }, [q, kat, min, max, products.length, initial.totalAll]);

  return (
    <section className="mx-auto max-w-screen-xl px-4 py-8">
      {/* ÜST BAR */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wide text-zinc-500">MAĞAZA</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-zinc-900">Ürünler</h1>
          <p className="mt-1 text-sm text-zinc-600">{resultsLabel}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Mobil Filtre */}
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:border-zinc-300 sm:hidden"
          >
            Filtrele
          </button>

          {/* Sıralama */}
          <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-3 py-2">
            <span className="text-xs font-semibold text-zinc-500">Sırala</span>
            <select
              value={sort}
              onChange={(e) =>
                pushWith((qs) => {
                  qs.set("sort", e.target.value);
                })
              }
              className="bg-transparent text-sm font-semibold text-zinc-900 focus:outline-none"
            >
              <option value="pop">Popüler</option>
              <option value="price-asc">Fiyat (Artan)</option>
              <option value="price-desc">Fiyat (Azalan)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
          >
            Temizle
          </button>
        </div>
      </div>

      {/* ANA GRID */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* SOL FİLTRE (DESKTOP) */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-3xl border border-zinc-200 bg-white p-5">
            <p className="text-sm font-extrabold text-zinc-900">Filtreler</p>

            {/* Kategori */}
            <div className="mt-5">
              <p className="text-xs font-semibold text-zinc-500">Kategori</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {CATS.map((c) => {
                  const active = (kat || "") === (c.kat || "");
                  return (
                    <button
                      key={c.label}
                      type="button"
                      onClick={() =>
                        pushWith((qs) => {
                          if (c.kat) qs.set("kat", c.kat);
                          else qs.delete("kat");
                        })
                      }
                      className={cn(
                        "rounded-full border px-3 py-2 text-xs font-semibold transition",
                        active
                          ? "border-[#7C3AED]/30 bg-[#7C3AED]/10 text-[#7C3AED]"
                          : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:text-[#7C3AED]"
                      )}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fiyat */}
            <div className="mt-6">
              <p className="text-xs font-semibold text-zinc-500">Fiyat Aralığı</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input
                  value={min}
                  onChange={(e) => pushWith((qs) => (e.target.value ? qs.set("min", e.target.value) : qs.delete("min")))}
                  placeholder="Min"
                  inputMode="numeric"
                  className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#7C3AED]/40 focus:outline-none"
                />
                <input
                  value={max}
                  onChange={(e) => pushWith((qs) => (e.target.value ? qs.set("max", e.target.value) : qs.delete("max")))}
                  placeholder="Max"
                  inputMode="numeric"
                  className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#7C3AED]/40 focus:outline-none"
                />
              </div>
              <p className="mt-2 text-xs text-zinc-500">₺ cinsinden.</p>
            </div>

            {/* Anket CTA */}
            <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-sm font-extrabold text-zinc-900">Kararsız mısın?</p>
              <p className="mt-1 text-xs text-zinc-600">
                60 saniyelik anketle sana uygun ürünleri bulalım.
              </p>
              <Link
                href="/anket"
                className="mt-3 inline-flex w-full items-center justify-center rounded-2xl bg-[#7C3AED] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
              >
                Ankete Git
              </Link>
            </div>
          </div>
        </aside>

        {/* ÜRÜN GRID */}
        <div>
          {products.length === 0 ? (
            <div className="rounded-3xl border border-zinc-200 bg-white p-8">
              <p className="text-sm font-extrabold text-zinc-900">Sonuç bulunamadı</p>
              <p className="mt-2 text-sm text-zinc-600">
                Filtreleri temizleyip tekrar dene.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-5 inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:opacity-95"
              >
                Tüm ürünler
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((p) => {
                const pct = discountPercent(p.price, p.compareAtPrice ?? null);
                return (
                  <div
                    key={p.slug}
                    className="group rounded-3xl border border-zinc-200 bg-white p-3 transition hover:border-zinc-300"
                  >
                    <button
                      type="button"
                      onClick={() => setQuick(p)}
                      className="relative block w-full overflow-hidden rounded-2xl bg-zinc-50"
                      aria-label="Hızlı incele"
                    >
                      <div className="relative aspect-[4/3] w-full">
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          className="object-cover transition group-hover:scale-[1.02]"
                        />
                      </div>

                      {pct > 0 ? (
                        <span className="absolute left-3 top-3 rounded-full bg-[#DB2777] px-3 py-1 text-xs font-extrabold text-white">
                          %{pct} indirim
                        </span>
                      ) : null}
                    </button>

                    <div className="mt-3">
                      <p className="text-xs font-semibold text-zinc-500">{p.brand || "Güzellik Uzmanı"}</p>
                      <p className="mt-1 line-clamp-2 text-sm font-extrabold tracking-tight text-zinc-900">
                        {p.title}
                      </p>

                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-sm font-extrabold text-zinc-900">{money(p.price)}</span>
                        {p.compareAtPrice && p.compareAtPrice > p.price ? (
                          <span className="text-xs font-semibold text-zinc-400 line-through">
                            {money(p.compareAtPrice)}
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-3 flex gap-2">
                        <Link
                          href={`/urun/${p.slug}`}
                          className="inline-flex flex-1 items-center justify-center rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                        >
                          Detay
                        </Link>
                        <button
                          type="button"
                          onClick={() => setQuick(p)}
                          className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:border-zinc-300"
                        >
                          Hızlı Bak
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* MOBİL FİLTRE DRAWER */}
      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/35"
            onClick={() => setMobileFiltersOpen(false)}
            aria-label="Kapat"
          />
          <div className="absolute right-0 top-0 h-full w-[86%] max-w-sm bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm font-extrabold text-zinc-900">Filtreler</p>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900"
              >
                Kapat
              </button>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold text-zinc-500">Kategori</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {CATS.map((c) => {
                  const active = (kat || "") === (c.kat || "");
                  return (
                    <button
                      key={c.label}
                      type="button"
                      onClick={() =>
                        pushWith((qs) => {
                          if (c.kat) qs.set("kat", c.kat);
                          else qs.delete("kat");
                        })
                      }
                      className={cn(
                        "rounded-full border px-3 py-2 text-xs font-semibold transition",
                        active
                          ? "border-[#7C3AED]/30 bg-[#7C3AED]/10 text-[#7C3AED]"
                          : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:text-[#7C3AED]"
                      )}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold text-zinc-500">Fiyat Aralığı</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input
                  value={min}
                  onChange={(e) => pushWith((qs) => (e.target.value ? qs.set("min", e.target.value) : qs.delete("min")))}
                  placeholder="Min"
                  inputMode="numeric"
                  className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#7C3AED]/40 focus:outline-none"
                />
                <input
                  value={max}
                  onChange={(e) => pushWith((qs) => (e.target.value ? qs.set("max", e.target.value) : qs.delete("max")))}
                  placeholder="Max"
                  inputMode="numeric"
                  className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#7C3AED]/40 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 grid gap-2">
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:opacity-95"
              >
                Tüm filtreleri temizle
              </button>
              <Link
                href="/anket"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-[#7C3AED] px-4 py-3 text-sm font-semibold text-white hover:opacity-95"
                onClick={() => setMobileFiltersOpen(false)}
              >
                Ankete Git
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {/* QUICK VIEW MODAL */}
      {quick ? (
        <div className="fixed inset-0 z-[70]">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setQuick(null)}
            aria-label="Kapat"
          />
          <div className="absolute left-1/2 top-1/2 w-[92%] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl">
            <div className="grid gap-0 md:grid-cols-2">
              <div className="relative aspect-[4/3] md:aspect-auto md:h-full">
                <Image src={quick.image} alt={quick.title} fill className="object-cover" />
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold text-zinc-500">{quick.brand || "Güzellik Uzmanı"}</p>
                <p className="mt-1 text-xl font-extrabold tracking-tight text-zinc-900">{quick.title}</p>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-lg font-extrabold text-zinc-900">{money(quick.price)}</span>
                  {quick.compareAtPrice && quick.compareAtPrice > quick.price ? (
                    <span className="text-sm font-semibold text-zinc-400 line-through">
                      {money(quick.compareAtPrice)}
                    </span>
                  ) : null}
                </div>

                <p className="mt-4 text-sm leading-6 text-zinc-600">
                  Bu bir “quick view” demo alanı. Buraya içerik (faydalar, kullanım, içerik) ekleyebiliriz.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <Link
                    href={`/urun/${quick.slug}`}
                    className="inline-flex flex-1 items-center justify-center rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:opacity-95"
                  >
                    Ürün detay
                  </Link>
                  <button
                    type="button"
                    onClick={() => setQuick(null)}
                    className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 hover:border-zinc-300"
                  >
                    Kapat
                  </button>
                </div>

                <div className="mt-3">
                  <Link href="/anket" className="text-sm font-semibold text-[#7C3AED] hover:underline">
                    Emin değil misin? Ankete git →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
