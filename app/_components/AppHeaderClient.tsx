"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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

export default function AppHeaderClient() {
  const pathname = usePathname();
  const sp = useSearchParams();
  const router = useRouter();

  const isMagaza = pathname?.startsWith("/magaza");

  const qParam = useMemo(() => (sp?.get("q") ?? "").toString(), [sp]);
  const [q, setQ] = useState(qParam);

  useEffect(() => setQ(qParam), [qParam]);

  const activeKat = (sp?.get("kat") ?? "").toString();

  const pushMagazaWith = (mutate: (qs: URLSearchParams) => void) => {
    const qs = new URLSearchParams(isMagaza ? (sp?.toString() ?? "") : "");
    mutate(qs);
    const s = qs.toString();
    router.push(s ? `/magaza?${s}` : "/magaza");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = q.trim();
    pushMagazaWith((qs) => {
      if (trimmed) qs.set("q", trimmed);
      else qs.delete("q");
      if (!qs.get("sort")) qs.set("sort", "pop");
    });
  };

  const clearSearch = () => {
    setQ("");
    pushMagazaWith((qs) => qs.delete("q"));
  };

  const goCategory = (kat: string) => {
    pushMagazaWith((qs) => {
      if (kat) qs.set("kat", kat);
      else qs.delete("kat");
      if (!qs.get("sort")) qs.set("sort", "pop");
    });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/85 backdrop-blur">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="flex flex-wrap items-center justify-between gap-3 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[#7C3AED]/10 text-[#7C3AED] font-extrabold">
              G
            </span>
            <div className="leading-tight">
              <div className="text-sm font-extrabold tracking-tight text-zinc-900">
                Güzellik Uzmanı
              </div>
              <div className="text-[11px] font-semibold text-zinc-500">
                Saç & Bakım
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/anket"
              className={cn(
                "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition",
                pathname?.startsWith("/anket")
                  ? "bg-[#7C3AED] text-white"
                  : "border border-zinc-200 bg-white text-zinc-900 hover:border-zinc-300"
              )}
            >
              Uzmanına Danış
            </Link>

            <Link
              href="/magaza"
              className={cn(
                "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition",
                isMagaza
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-200 bg-white text-zinc-900 hover:border-zinc-300"
              )}
            >
              Mağaza
            </Link>
          </div>
        </div>

        <div className="pb-3">
          <form onSubmit={submit} className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ürün ara (mor şampuan, keratin maske...)"
              className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 pr-28 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm focus:border-[#7C3AED]/40 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-[#7C3AED] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
            >
              Ara
            </button>
          </form>

          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-zinc-500">
              {isMagaza ? "Mağazada arama yapıyorsun" : "Arama mağazaya yönlendirir"}
            </p>
            {qParam ? (
              <button
                type="button"
                onClick={clearSearch}
                className="text-xs font-semibold text-[#DB2777] hover:underline"
              >
                Aramayı temizle
              </button>
            ) : null}
          </div>
        </div>

        <nav className="pb-3">
          <div className="no-scrollbar -mx-2 flex h-11 items-center gap-2 overflow-x-auto px-2">
            {CATS.map((c) => {
              const active = (activeKat || "") === (c.kat || "");
              return (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => goCategory(c.kat)}
                  className={cn(
                    "flex-none rounded-full border px-4 py-2 text-sm font-semibold transition",
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
        </nav>
      </div>
    </header>
  );
}
