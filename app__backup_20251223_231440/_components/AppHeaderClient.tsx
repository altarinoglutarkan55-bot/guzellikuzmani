"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useCart } from "@/app/providers";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function AppHeaderClient() {
  const pathname = usePathname();
  const { open, count } = useCart();

  const isAnket = useMemo(() => pathname?.startsWith("/anket"), [pathname]);
  const isMagaza = useMemo(() => pathname?.startsWith("/magaza"), [pathname]);

  return (
    <div className="flex items-center gap-2">
      {/* Sepet */}
      <button
        type="button"
        onClick={open}
        className="relative inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:border-zinc-300"
        aria-label="Sepet"
      >
        Sepet
        {count > 0 ? (
          <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#DB2777] px-1 text-[11px] font-extrabold text-white">
            {count}
          </span>
        ) : null}
      </button>

      {/* Uzmanına Danış */}
      <Link
        href="/anket"
        className={cx(
          "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition",
          isAnket ? "bg-[#7C3AED] text-white" : "border border-zinc-200 bg-white text-zinc-900 hover:border-zinc-300"
        )}
      >
        Uzmanına Danış
      </Link>

      {/* Mağaza */}
      <Link
        href="/magaza"
        className={cx(
          "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition",
          isMagaza ? "bg-zinc-900 text-white" : "border border-zinc-200 bg-white text-zinc-900 hover:border-zinc-300"
        )}
      >
        Mağaza
      </Link>
    </div>
  );
}
