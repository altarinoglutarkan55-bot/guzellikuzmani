"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import CartDrawer from "@/app/_components/CartDrawer";

export default function TopNav() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-extrabold text-lg">
          Güzellik Uzmanı
        </Link>

        <nav className="flex items-center gap-2">
          {/* ✅ SEPET */}
          <CartDrawer />

          <Link href="/uzman-basvuru" className="rounded-full border px-4 py-2 text-sm">
            Uzmanına Danış
          </Link>

          <Link href="/magaza" className="rounded-full border px-4 py-2 text-sm">
            Mağaza
          </Link>

          <Link href="/blog" className="rounded-full border px-4 py-2 text-sm">
            Blog
          </Link>

          <Link href="/forum" className="rounded-full border px-4 py-2 text-sm">
            Forum
          </Link>

          {session?.user ? (
            <Link href="/api/auth/signout" className="rounded-full border px-4 py-2 text-sm">
              Çıkış
            </Link>
          ) : (
            <Link
              href="/api/auth/signin?callbackUrl=/profil"
              className="rounded-full border px-4 py-2 text-sm"
            >
              Giriş
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
