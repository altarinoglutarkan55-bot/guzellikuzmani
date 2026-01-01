"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCart } from "@/app/providers";

function PillLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={
        "inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50 active:scale-[0.99] transition " +
        className
      }
    >
      {children}
    </Link>
  );
}

function PillButton({
  onClick,
  children,
  className = "",
  ariaLabel,
}: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={
        "inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50 active:scale-[0.99] transition " +
        className
      }
    >
      {children}
    </button>
  );
}

export default function TopNav() {
  const { data: session } = useSession();
  const authed = !!session?.user;

  const { open, count } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        {/* Left */}
        <Link href="/" className="shrink-0 text-base font-extrabold text-zinc-900">
          Güzellik Uzmanı
        </Link>

        {/* Middle (desktop) */}
        <nav className="hidden items-center gap-2 md:flex">
          <PillButton onClick={open} ariaLabel="Sepet">
            Sepet{count > 0 ? ` (${count})` : ""}
          </PillButton>

          {/* Burayı /anket yaptım */}
          <PillLink href="/anket">Uzmanına Danış</PillLink>
          <PillLink href="/magaza">Mağaza</PillLink>
        </nav>

        {/* Right */}
        <nav className="flex items-center gap-2">
          <PillLink href="/blog" className="hidden sm:inline-flex">
            Blog
          </PillLink>
          <PillLink href="/forum" className="hidden sm:inline-flex">
            Forum
          </PillLink>

          {authed ? (
            <>
              <PillLink href="/profil">Profil</PillLink>
              <PillLink href="/api/auth/signout?callbackUrl=/">Çıkış</PillLink>
            </>
          ) : (
            <>
              <PillLink href="/api/auth/signin?callbackUrl=/profil">Giriş</PillLink>
              <PillLink href="/kayit" className="hidden sm:inline-flex">
                Kaydol
              </PillLink>
            </>
          )}
        </nav>
      </div>

      {/* Mobile row */}
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 pb-3 md:hidden">
        <PillButton onClick={open} ariaLabel="Sepet" className="flex-1">
          Sepet{count > 0 ? ` (${count})` : ""}
        </PillButton>

        <PillLink href="/anket" className="flex-1">
          Uzmanına Danış
        </PillLink>

        <PillLink href="/magaza" className="flex-1">
          Mağaza
        </PillLink>
      </div>
    </header>
  );
}
