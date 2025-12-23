"use client";

import { useEffect, useMemo, useState } from "react";

type Product = {
  id?: string;
  slug: string;
  title: string;
  price: number;
  highlights?: string[];
  howto?: string[];
  storeUrl?: string;
};

type LoadState =
  | { status: "idle" | "loading" }
  | { status: "ready"; products: Product[] }
  | { status: "error"; message: string };

export default function AdminPage() {
  const [state, setState] = useState<LoadState>({ status: "idle" });
  const [q, setQ] = useState("");

  // basit ekleme formu
  const [form, setForm] = useState<Product>({
    slug: "",
    title: "",
    price: 0,
    highlights: [],
    howto: [],
    storeUrl: "",
  });

  async function load() {
    try {
      setState({ status: "loading" });
      const res = await fetch("/api/products", { cache: "no-store" });
      if (!res.ok) throw new Error(`API hata: ${res.status}`);
      const data = await res.json();

      // API farklı format dönerse de kırılmasın:
      const products: Product[] = Array.isArray(data) ? data : data?.products ?? [];
      setState({ status: "ready", products });
    } catch (e: any) {
      setState({
        status: "error",
        message: e?.message || "Admin verisi alınamadı.",
      });
    }
  }

  useEffect(() => {
    load();
  }, []);

  const products = useMemo(() => {
    if (state.status !== "ready") return [];
    const s = q.trim().toLowerCase();
    if (!s) return state.products;
    return state.products.filter((p) => {
      return (
        p.title?.toLowerCase().includes(s) ||
        p.slug?.toLowerCase().includes(s)
      );
    });
  }, [state, q]);

  async function add() {
    try {
      const payload = {
        slug: form.slug.trim(),
        title: form.title.trim(),
        price: Number(form.price || 0),
        highlights: (form.highlights ?? []).filter(Boolean),
        howto: (form.howto ?? []).filter(Boolean),
        storeUrl: form.storeUrl?.trim() || "",
      };

      if (!payload.slug || !payload.title) {
        alert("Slug ve Başlık zorunlu.");
        return;
      }

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `Ekleme hatası: ${res.status}`);

      // form reset
      setForm({ slug: "", title: "", price: 0, highlights: [], howto: [], storeUrl: "" });
      await load();
      alert("Ürün eklendi ✅");
    } catch (e: any) {
      alert(e?.message || "Ekleme başarısız.");
    }
  }

  async function remove(slug: string) {
    if (!confirm(`${slug} silinsin mi?`)) return;

    try {
      const res = await fetch(`/api/products?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `Silme hatası: ${res.status}`);

      await load();
      alert("Silindi ✅");
    } catch (e: any) {
      alert(e?.message || "Silme başarısız.");
    }
  }

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold">Admin</h1>
            <p className="mt-1 text-sm text-neutral-600">
              Ürünleri burada yönetebilirsin (demo).
            </p>
          </div>

          <button
            onClick={load}
            className="rounded-2xl border px-4 py-2 text-sm font-medium"
          >
            Yenile
          </button>
        </div>

        {/* Hata / Loading */}
        {state.status === "loading" && (
          <div className="mt-6 rounded-2xl border p-4 text-sm">Yükleniyor…</div>
        )}

        {state.status === "error" && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Admin yüklenemedi: <b>{state.message}</b>
            <div className="mt-2 text-xs text-red-600">
              Not: Bu sayfa artık client, yine hata görürsen sorun API tarafındadır.
            </div>
          </div>
        )}

        {/* Ekleme */}
        <section className="mt-8 rounded-3xl border p-6">
          <h2 className="text-xl font-semibold">Yeni Ürün Ekle</h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input
              className="rounded-2xl border px-4 py-3 text-sm"
              placeholder="Slug (örn: isi-koruyucu-sprey)"
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
            />
            <input
              className="rounded-2xl border px-4 py-3 text-sm"
              placeholder="Başlık (örn: Isı Koruyucu Sprey)"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            />
            <input
              className="rounded-2xl border px-4 py-3 text-sm"
              placeholder="Fiyat (örn: 249)"
              type="number"
              value={form.price}
              onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
            />
            <input
              className="rounded-2xl border px-4 py-3 text-sm"
              placeholder="Mağaza linki (opsiyonel)"
              value={form.storeUrl || ""}
              onChange={(e) => setForm((p) => ({ ...p, storeUrl: e.target.value }))}
            />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <textarea
              className="min-h-[110px] rounded-2xl border px-4 py-3 text-sm"
              placeholder={"Öne çıkanlar (her satır 1 madde)\n- Saçı ısıya karşı korur\n- Ağırlaştırmaz"}
              value={(form.highlights || []).join("\n")}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  highlights: e.target.value
                    .split("\n")
                    .map((x) => x.replace(/^\s*[-•]\s*/, "").trim())
                    .filter(Boolean),
                }))
              }
            />
            <textarea
              className="min-h-[110px] rounded-2xl border px-4 py-3 text-sm"
              placeholder={"Kullanım (her satır 1 adım)\n1) Nemli/kuru saça\n2) Fön/maşa öncesi\n3) Durulanmaz"}
              value={(form.howto || []).join("\n")}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  howto: e.target.value
                    .split("\n")
                    .map((x) => x.replace(/^\s*\d+\)\s*/, "").trim())
                    .filter(Boolean),
                }))
              }
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={add}
              className="rounded-2xl bg-black px-6 py-3 text-sm font-medium text-white"
            >
              Kaydet
            </button>

            <a
              href="/magaza"
              className="rounded-2xl border px-6 py-3 text-sm font-medium"
            >
              Mağaza →
            </a>
          </div>

          <p className="mt-3 text-xs text-neutral-500">
            Not: Vercel’de dosyaya yazma kalıcı olmaz (demo). Kalıcı için DB/KV gerekir.
          </p>
        </section>

        {/* Liste */}
        <section className="mt-6 rounded-3xl border p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Ürünler</h2>
            <input
              className="w-full rounded-2xl border px-4 py-2 text-sm sm:w-80"
              placeholder="Ara: başlık/slug"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          {state.status === "ready" && (
            <div className="mt-4 grid gap-3">
              {products.length === 0 ? (
                <div className="rounded-2xl border p-4 text-sm text-neutral-600">
                  Ürün yok.
                </div>
              ) : (
                products.map((p) => (
                  <div
                    key={p.slug}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4"
                  >
                    <div>
                      <div className="font-medium">{p.title}</div>
                      <div className="text-sm text-neutral-600">
                        /urun/{p.slug} • {p.price}₺
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={`/urun/${p.slug}`}
                        className="rounded-xl border px-3 py-2 text-xs font-medium"
                        target="_blank"
                      >
                        Gör
                      </a>
                      <button
                        onClick={() => remove(p.slug)}
                        className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
