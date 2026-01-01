"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function GirisPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const callbackUrl = "/profil";

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-extrabold text-zinc-900">Giriş Yap</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Hesabına giriş yap veya Google ile devam et.
      </p>

      <button
        onClick={() => signIn("google", { callbackUrl })}
        className="mt-5 w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold hover:bg-zinc-50"
      >
        Google ile devam et
      </button>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-zinc-200" />
        <div className="text-xs text-zinc-500">veya</div>
        <div className="h-px flex-1 bg-zinc-200" />
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await signIn("credentials", {
            email,
            password,
            callbackUrl,
          });
        }}
        className="space-y-3"
      >
        <input
          className="w-full rounded-xl border px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
          placeholder="E-posta"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          className="w-full rounded-xl border px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
          placeholder="Şifre"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-extrabold text-white hover:bg-zinc-800"
        >
          Giriş Yap
        </button>
      </form>

      <p className="mt-4 text-sm text-zinc-600">
        Hesabın yok mu?{" "}
        <Link className="font-semibold underline" href="/kayit">
          Kaydol
        </Link>
      </p>
    </main>
  );
}
