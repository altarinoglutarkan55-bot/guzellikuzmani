"use client";

import { useEffect, useMemo, useState } from "react";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  dateISO: string;
  tags: string[];
  content: string[];
  cover?: string;
  video?: { provider: "youtube" | "mp4"; url: string; thumb?: string };
  productSlugs?: string[];
  published: boolean;
};

function toSlug(s: string) {
  return String(s || "")
    .toLowerCase()
    .trim()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminBlogPage() {
  const [token, setToken] = useState("");
  const [items, setItems] = useState<BlogPost[]>([]);
  const [q, setQ] = useState("");
  const [active, setActive] = useState<BlogPost | null>(null);
  const [status, setStatus] = useState<string>("");

  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return items;
    return items.filter(
      (x) =>
        x.title.toLowerCase().includes(s) ||
        x.slug.toLowerCase().includes(s) ||
        (x.tags || []).join(" ").toLowerCase().includes(s)
    );
  }, [items, q]);

  async function load() {
    setStatus("Yükleniyor…");
    const r = await fetch("/api/admin/blog", { cache: "no-store" });
    const j = await r.json();
    setItems(j.items || []);
    setStatus("");
  }

  useEffect(() => {
    load();
  }, []);

  function startNew() {
    setActive({
      id: "",
      slug: "",
      title: "",
      excerpt: "",
      author: "Güzellik Uzmanı",
      dateISO: new Date().toISOString().slice(0, 10),
      tags: [],
      content: [""],
      cover: "",
      video: { provider: "youtube", url: "", thumb: "" },
      productSlugs: [],
      published: false,
    });
  }

  async function save() {
    if (!active) return;

    setStatus("Kaydediliyor…");
    const isNew = !active.id;

    const payload = {
      ...active,
      tags: (active.tags || []).filter(Boolean),
      content: (active.content || []).filter((p) => String(p).trim().length > 0),
      productSlugs: (active.productSlugs || []).filter(Boolean),
    };

    const r = await fetch("/api/admin/blog", {
      method: isNew ? "POST" : "PUT",
      headers: {
        "content-type": "application/json",
        "x-admin-token": token,
      },
      body: JSON.stringify(payload),
    });

    const j = await r.json();
    if (!j.ok) {
      setStatus(`Hata: ${j.error || "UNKNOWN"}`);
      return;
    }

    setStatus("OK");
    setActive(null);
    await load();
  }

  async function del(id: string) {
    if (!confirm("Silinsin mi?")) return;
    setStatus("Siliniyor…");

    const r = await fetch(`/api/admin/blog?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { "x-admin-token": token },
    });
    const j = await r.json();
    if (!j.ok) {
      setStatus(`Hata: ${j.error || "UNKNOWN"}`);
      return;
    }
    setStatus("OK");
    await load();
  }

  return (
    <main className="mx-auto max-w-screen-xl px-4 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900">Admin • Blog</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Demo yönetim paneli (token ile yaz/sil).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ADMIN_TOKEN (x-admin-token)"
            className="w-[260px] rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-bold text-zinc-900 outline-none focus:border-zinc-300"
          />
          <button
            onClick={startNew}
            className="rounded-2xl bg-[#7C3AED] px-4 py-2 text-sm font-extrabold text-white hover:opacity-95"
          >
            + Yeni Yazı
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ara (başlık / slug / tag)…"
          className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-bold text-zinc-900 outline-none focus:border-zinc-300"
        />
        {status ? <span className="text-sm font-bold text-zinc-600">{status}</span> : null}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {filtered.map((x) => (
          <div
            key={x.id}
            className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-zinc-500">{x.dateISO}</div>
                <div className="mt-1 text-lg font-extrabold text-zinc-900">{x.title}</div>
                <div className="mt-1 text-sm font-bold text-zinc-600">/{x.slug}</div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActive(x)}
                  className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm font-extrabold text-zinc-900 hover:border-zinc-300"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => del(x.id)}
                  className="rounded-2xl bg-zinc-900 px-3 py-2 text-sm font-extrabold text-white hover:opacity-95"
                >
                  Sil
                </button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {(x.tags || []).map((t) => (
                <span key={t} className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-700">
                  {t}
                </span>
              ))}
              <span className="ml-auto rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-700">
                {x.published ? "Yayında" : "Taslak"}
              </span>
            </div>

            <p className="mt-3 text-sm text-zinc-700">{x.excerpt}</p>
          </div>
        ))}
      </div>

      {active ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-3 md:items-center">
          <div className="w-full max-w-3xl rounded-[28px] border border-zinc-200 bg-white p-5 shadow-xl">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="text-lg font-extrabold text-zinc-900">
                {active.id ? "Yazı Düzenle" : "Yeni Yazı"}
              </div>
              <button
                onClick={() => setActive(null)}
                className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm font-extrabold text-zinc-900 hover:border-zinc-300"
              >
                Kapat
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-sm font-bold text-zinc-700">
                Başlık
                <input
                  value={active.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setActive((p) => (p ? { ...p, title, slug: p.slug || toSlug(title) } : p));
                  }}
                  className="mt-1 w-full rounded-2xl border border-zinc-200 px-4 py-2 text-sm font-bold text-zinc-900"
                />
              </label>

              <label className="text-sm font-bold text-zinc-700">
                Slug
                <input
                  value={active.slug}
                  onChange={(e) => setActive((p) => (p ? { ...p, slug: toSlug(e.target.value) } : p))}
                  className="mt-1 w-full rounded-2xl border border-zinc-200 px-4 py-2 text-sm font-bold text-zinc-900"
                />
              </label>

              <label className="text-sm font-bold text-zinc-700">
                Tarih (YYYY-MM-DD)
                <input
                  value={active.dateISO}
                  onChange={(e) => setActive((p) => (p ? { ...p, dateISO: e.target.value } : p))}
                  className="mt-1 w-full rounded-2xl border border-zinc-200 px-4 py-2 text-sm font-bold text-zinc-900"
                />
              </label>

              <label className="text-sm font-bold text-zinc-700">
                Yazar
                <input
                  value={active.author}
                  onChange={(e) => setActive((p) => (p ? { ...p, author: e.target.value } : p))}
                  className="mt-1 w-full rounded-2xl border border-zinc-200 px-4 py-2 text-sm font-bold text-zinc-900"
                />
              </label>

              <label className="text-sm font-bold text-zinc-700 md:col-span-2">
                Özet
                <textarea
                  value={active.excerpt}
                  onChange={(e) => setActive((p) => (p ? { ...p, excerpt: e.target.value } : p))}
                  rows={2}
                  className="mt-1 w-full rounded-2xl border border-zinc-200 px-4 py-2 text-sm text-zinc-900"
                />
              </label>

              <label className="text-sm font-bold text-zinc-700 md:col-span-2">
                Tagler (virgülle)
                <input
                  value={(active.tags || []).join(", ")}
                  onChange={(e) =>
                    setActive((p) =>
                      p ? { ...p, tags: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) } : p
                    )
                  }
                  className="mt-1 w-full rounded-2xl border border-zinc-200 px-4 py-2 text-sm font-bold text-zinc-900"
                />
              </label>

              <label className="text-sm font-bold text-zinc-700">
                Video Provider
                <select
                  value={active.video?.provider || "youtube"}
                  onChange={(e) =>
                    setActive((p) =>
                      p ? { ...p, video: { ...(p.video || { url: "" }), provider: e.target.value as any } } : p
                    )
                  }
                  className="mt-1 w-full rounded-2xl border border-zinc-200 px-4 py-2 text-sm font-bold text-zinc-900"
                >
                  <option value="youtube">YouTube</option>
                  <option value="mp4">MP4</option>
                </select>
              </label>

              <label className="text-sm font-bold text-zinc-700">
                Video URL
                <input
                  value={active.video?.url || ""}
                  onChange={(e) =>
                    setActive((p) =>
                      p ? { ...p, video: { ...(p.video || { provider: "youtube" }), url: e.target.value } } : p
                    )
                  }
                  className="mt-1 w-full rounded-2xl border border-zinc-200 px-4 py-2 text-sm font-bold text-zinc-900"
                />
              </label>

              <label className="text-sm font-bold text-zinc-700 md:col-span-2">
                Ürün Slugları (virgülle)
                <input
                  value={(active.productSlugs || []).join(", ")}
                  onChange={(e) =>
                    setActive((p) =>
                      p
                        ? {
                            ...p,
                            productSlugs: e.target.value.split(",").map((x) => x.trim()).filter(Boolean),
                          }
                        : p
                    )
                  }
                  className="mt-1 w-full rounded-2xl border border-zinc-200 px-4 py-2 text-sm font-bold text-zinc-900"
                />
              </label>

              <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 md:col-span-2">
                <input
                  type="checkbox"
                  checked={!!active.published}
                  onChange={(e) => setActive((p) => (p ? { ...p, published: e.target.checked } : p))}
                />
                Yayınla (published)
              </label>

              <label className="text-sm font-bold text-zinc-700 md:col-span-2">
                İçerik (her satır paragraf)
                <textarea
                  value={(active.content || []).join("\n\n")}
                  onChange={(e) =>
                    setActive((p) => (p ? { ...p, content: e.target.value.split(/\n\s*\n/g) } : p))
                  }
                  rows={8}
                  className="mt-1 w-full rounded-2xl border border-zinc-200 px-4 py-2 text-sm text-zinc-900"
                />
              </label>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setActive(null)}
                className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-extrabold text-zinc-900 hover:border-zinc-300"
              >
                İptal
              </button>
              <button
                onClick={save}
                className="rounded-2xl bg-[#7C3AED] px-4 py-2 text-sm font-extrabold text-white hover:opacity-95"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
