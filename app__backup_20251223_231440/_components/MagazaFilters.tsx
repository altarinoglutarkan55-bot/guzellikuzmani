"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Facet = { label: string; value: string };

const cats: Facet[] = [
  { label: "Tümü", value: "" },
  { label: "Saç", value: "sac" },
  { label: "Şampuan", value: "sampuan" },
  { label: "Maske", value: "maske" },
  { label: "Serum", value: "serum" },
  { label: "Tonik", value: "tonik" },
  { label: "Isı Koruyucu", value: "isi-koruyucu" },
  { label: "Şekillendirici", value: "sekillendirici" },
  { label: "Saç Derisi", value: "sac-derisi" },
  { label: "Cilt", value: "cilt" },
  { label: "Makyaj", value: "makyaj" },
  { label: "Erkek", value: "erkek" },
  { label: "Çocuk", value: "cocuk" },
];

const concerns: Facet[] = [
  { label: "Boyalı saç", value: "boyali" },
  { label: "Dökülme", value: "dokulme" },
  { label: "Kepek", value: "kepek" },
  { label: "Kuru saç", value: "kuru" },
  { label: "Yağlı saç", value: "yagli" },
  { label: "Yıpranma", value: "yipranma" },
];

function cn(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ");
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold tracking-wide text-zinc-500">{children}</p>;
}

export default function MagazaFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const q = sp.get("q") ?? "";
  const kat = sp.get("kat") ?? "";
  const sort = sp.get("sort") ?? "pop";
  const min = sp.get("min") ?? "";
  const max = sp.get("max") ?? "";
  const c = sp.getAll("c"); // concerns

  const [localMin, setLocalMin] = useState(min);
  const [localMax, setLocalMax] = useState(max);

  const concernSet = useMemo(() => new Set(c), [c]);

  const push = (patch: Record<string, string | string[] | null>) => {
    const next = new URLSearchParams(sp.toString());

    Object.entries(patch).forEach(([k, v]) => {
      next.delete(k);
      if (v === null) return;

      if (Array.isArray(v)) {
        v.forEach((x) => x && next.append(k, x));
      } else {
        if (v !== "") next.set(k, v);
      }
    });

    // pagination reset gelecekte eklenirse burada resetlenir
    startTransition(() => {
      router.push(`${pathname}?${next.toString()}`);
    });
  };

  const toggleConcern = (value: string) => {
    const next = new Set(concernSet);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    push({ c: Array.from(next) });
  };

  const clearAll = () => {
    setLocalMin("");
    setLocalMax("");
    startTransition(() => router.push(`${pathname}`));
  };

  return (
    <aside className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-zinc-900">Filtre</p>
        <button
          type="button"
          onClick={clearAll}
          className="text-xs font-semibold text-[#7C3AED] hover:underline"
          disabled={isPending}
        >
          Sıfırla
        </button>
      </div>

      {/* Search hint */}
      {q ? (
        <p className="mt-2 text-xs text-zinc-600">
          Arama: <span className="font-semibold text-zinc-900">{q}</span>
        </p>
      ) : null}

      {/* Category */}
      <div className="mt-5">
        <SectionTitle>KATEGORİ</SectionTitle>
        <div className="mt-2 flex flex-wrap gap-2">
          {cats.map((x) => {
            const active = kat === x.value || (!kat && !x.value);
            return (
              <button
                key={x.value || "all"}
                type="button"
                onClick={() => push({ kat: x.value, sort })}
                className={cn(
                  "rounded-full border px-3 py-2 text-xs font-semibold transition",
                  active
                    ? "border-[#7C3AED]/30 bg-[#7C3AED]/10 text-[#7C3AED]"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                )}
                disabled={isPending}
              >
                {x.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price */}
      <div className="mt-6">
        <SectionTitle>FİYAT</SectionTitle>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <input
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
            placeholder="Min"
            inputMode="numeric"
            className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7C3AED]/25"
          />
          <input
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
            placeholder="Max"
            inputMode="numeric"
            className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7C3AED]/25"
          />
        </div>
        <button
          type="button"
          onClick={() => push({ min: localMin, max: localMax })}
          className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-semibold text-zinc-900 hover:border-zinc-300"
          disabled={isPending}
        >
          Uygula
        </button>
      </div>

      {/* Concerns */}
      <div className="mt-6">
        <SectionTitle>İHTİYAÇ</SectionTitle>
        <div className="mt-2 space-y-2">
          {concerns.map((x) => {
            const checked = concernSet.has(x.value);
            return (
              <label key={x.value} className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleConcern(x.value)}
                  className="h-4 w-4 accent-[#7C3AED]"
                />
                <span className="text-zinc-800">{x.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Sort (mobile helper) */}
      <div className="mt-6 md:hidden">
        <SectionTitle>SIRALAMA</SectionTitle>
        <select
          value={sort}
          onChange={(e) => push({ sort: e.target.value })}
          className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 outline-none focus:ring-2 focus:ring-[#7C3AED]/25"
        >
          <option value="pop">Popüler</option>
          <option value="yeni">Yeni</option>
          <option value="fiyat-asc">Fiyat: Düşük</option>
          <option value="fiyat-desc">Fiyat: Yüksek</option>
        </select>
      </div>
    </aside>
  );
}
