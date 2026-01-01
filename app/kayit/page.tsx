"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function KayitPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || null,
          email: email.trim(),
          password,
        }),
      });

      const data = (await res.json().catch(() => null)) as any;

      if (!res.ok) {
        setError(data?.error || "Kayıt başarısız. Lütfen tekrar dene.");
        return;
      }

      setOk("Kayıt başarılı! Giriş yapılıyor...");

      // Otomatik giriş (Credentials)
      const login = await signIn("credentials", {
        redirect: true,
        callbackUrl: "/profil",
        email: email.trim(),
        password,
      });

      // signIn redirect true olduğu için çoğu zaman buraya düşmez.
      if (login?.error) {
        setOk(null);
        setError("Kayıt oldu ama giriş yapılamadı. Lütfen giriş yap.");
      }
    } catch {
      setError("Bir şeyler ters gitti. Tekrar dene.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-extrabold text-zinc-900">Kaydol</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Zaten hesabın var mı?{" "}
        <Link className="font-semibold underline" href="/api/auth/signin?callbackUrl=/profil">
          Giriş yap
        </Link>
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-3 rounded-2xl border bg-white p-4">
        <div>
          <label className="mb-1 block text-xs font-semibold text-zinc-700">Ad Soyad</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
            placeholder="Tolga Yiğit"
            autoComplete="name"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-zinc-700">E-posta</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
            placeholder="ornek@mail.com"
            type="email"
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-zinc-700">Şifre</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
            placeholder="••••••••"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
          />
          <p className="mt-1 text-[11px] text-zinc-500">En az 6 karakter.</p>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {ok ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            {ok}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-xl px-4 py-3 text-sm font-extrabold ${
            loading ? "bg-zinc-200 text-zinc-500" : "bg-zinc-900 text-white hover:bg-zinc-800"
          }`}
        >
          {loading ? "Kaydediliyor..." : "Kaydol"}
        </button>
      </form>
    </main>
  );
}
