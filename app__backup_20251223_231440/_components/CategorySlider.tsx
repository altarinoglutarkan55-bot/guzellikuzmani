"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

type Category = {
  title: string;
  desc: string;
  href: string;
  img: string;
  accent: string;
};

function cn(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ");
}

export default function CategorySlider({ categories }: { categories: Category[] }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scrollByCard = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.min(420, Math.max(280, el.clientWidth * 0.7));
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between lg:flex">
        <button
          type="button"
          onClick={() => scrollByCard("left")}
          className="pointer-events-auto -ml-2 rounded-full border border-zinc-200 bg-white/90 p-3 shadow-sm hover:bg-white"
          aria-label="Sola kaydır"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => scrollByCard("right")}
          className="pointer-events-auto -mr-2 rounded-full border border-zinc-200 bg-white/90 p-3 shadow-sm hover:bg-white"
          aria-label="Sağa kaydır"
        >
          →
        </button>
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((c) => (
          <Link
            key={c.title}
            href={c.href}
            className={cn(
              "group min-w-[240px] max-w-[240px] flex-none rounded-3xl border border-zinc-200 bg-white p-3 shadow-sm transition hover:shadow-md",
              "focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
            )}
          >
            <div className={cn("relative overflow-hidden rounded-2xl bg-gradient-to-br", c.accent)}>
              <div className="relative aspect-[4/3]">
                <Image
                  src={c.img}
                  alt={c.title}
                  fill
                  className="object-cover"
                  sizes="240px"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent" />
            </div>

            <div className="mt-3">
              <p className="text-sm font-semibold text-zinc-900 group-hover:text-[#7C3AED]">
                {c.title}
              </p>
              <p className="mt-1 text-xs text-zinc-600">{c.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-2 text-xs text-zinc-500 lg:hidden">Kaydır →</p>
    </div>
  );
}
