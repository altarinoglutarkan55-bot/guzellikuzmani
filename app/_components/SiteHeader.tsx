"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

function cn(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ");
}

const nav = [
  { label: "Saç", href: "/magaza?kat=sac" },
  { label: "Cilt", href: "/magaza?kat=cilt" },
  { label: "Makyaj", href: "/magaza?kat=makyaj" },
  { label: "Erkek", href: "/magaza?kat=erkek" },
  { label: "Çocuk", href: "/magaza?kat=cocuk" },
  { label: "Yeni Gelenler", href: "/magaza?sort=yeni" },
  { label: "Çok Satanlar", href: "/magaza?sort=cok-satan" },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center">
      {/* Desktop logo */}
      <span className="hidden sm:block">
        <Image
          src="/logo.svg"
          alt="GüzellikUzmanı"
          width={220}
          height={44}
          priority
          className="h-11 w-auto"
        />
      </span>

      {/* Mobile mark */}
      <span className="sm:hidden">
        <Image
          src="/logo-mark.svg"
          alt="GU"
          width={44}
          height={44}
          priority
          className="h-11 w-11"
        />
      </span>
    </Link>
  );
}

export default function SiteHeader() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const trimmed = useMemo(() => q.trim(), [q]);

  const goSearch = () => {
    const query = trimmed ? `?q=${encodeURIComponent(trimmed)}` : "";
    router.push(`/magaza${query}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* promo bar */}
      <div className="border-b border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-screen-xl px-4 py-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="text-zinc-700">
              Ücretsiz danışmanlık:{" "}
              <span className="font-semibold text-zinc-900">0530 041 23 49</span>
            </div>
            <div className="flex items-center gap-3">
              <Link className="font-semibold text-zinc-700 hover:text-[#7C3AED]" href="/blog">
                Blog
              </Link>
              <Link className="font-semibold text-zinc-700 hover:text-[#7C3AED]" href="/forum">
                Forum
              </Link>
              <Link className="font-semibold text-zinc-700 hover:text-[#7C3AED]" href="/iletisim">
                İletişim
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* main bar */}
      <div className="border-b border-zinc-200 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto max-w-screen-xl px-4 py-3">
          <div className="flex items-center gap-3">
            <Logo />

            {/* search */}
            <div className="flex-1">
              <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-[#7C3AED]/25">
                <span className="text-zinc-400">⌕</span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") goSearch();
                  }}
                  placeholder="Ürün ara…"
                  className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
                />
                <button
                  type="button"
                  onClick={goSearch}
                  className={cn(
                    "rounded-xl px-4 py-2 text-sm font-semibold transition",
                    trimmed
                      ? "bg-[#7C3AED] text-white hover:opacity-95"
                      : "bg-zinc-100 text-zinc-500"
                  )}
                >
                  Ara
                </button>
              </div>
            </div>

            {/* right CTA */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/anket"
                className="rounded-xl bg-[#DB2777] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
              >
                Uzmanımıza Danışın
              </Link>
              <Link
                href="/magaza"
                className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:border-zinc-300"
              >
                Mağaza
              </Link>
            </div>
          </div>

          {/* nav pills */}
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="whitespace-nowrap rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:border-zinc-300 hover:text-[#7C3AED]"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
