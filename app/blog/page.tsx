import Link from "next/link";
import { blogPosts } from "@/data/blogPosts";

export const revalidate = 60;

function isPublished(p: any) {
  // published yoksa true kabul ediyoruz (geriye uyum)
  return p?.published !== false;
}

export default function BlogPage() {
  const published = (blogPosts || []).filter(isPublished);

  // tag cloud
  const tags = Array.from(
    new Set(published.flatMap((p: any) => (p.tags || []) as string[]))
  ).slice(0, 18);

  return (
    <main className="mx-auto max-w-screen-xl px-4 py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 md:text-4xl">
            Blog
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Profesyoneller için bakım rehberleri, uygulama adımları ve ürün tanıtım videoları.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/"
            className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-extrabold text-zinc-900 hover:border-zinc-300"
          >
            ← Ana sayfa
          </Link>
          <Link
            href="/magaza"
            className="rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-extrabold text-white hover:opacity-95"
          >
            Mağaza
          </Link>
          <Link
            href="/anket"
            className="rounded-2xl bg-[#7C3AED] px-4 py-2 text-sm font-extrabold text-white hover:opacity-95"
          >
            Uzman önerisi
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* LIST */}
        <div className="space-y-4 lg:col-span-2">
          {published.length === 0 ? (
            <div className="rounded-[28px] border border-zinc-200 bg-white p-6 text-sm font-bold text-zinc-700">
              Henüz yayınlanmış içerik yok. Admin’den içerik ekleyebilirsin.
            </div>
          ) : (
            published.map((p: any) => (
              <article
                key={p.slug}
                className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md md:p-8"
              >
                <div className="flex flex-wrap items-center gap-2">
                  {(p.tags || []).slice(0, 5).map((t: string) => (
                    <span
                      key={t}
                      className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-700"
                    >
                      {t}
                    </span>
                  ))}
                  <span className="ml-auto text-xs font-bold text-zinc-500">
                    {p.dateISO || ""}
                  </span>
                </div>

                <Link href={`/blog/${p.slug}`} className="group block">
                  <h2 className="mt-3 text-xl font-extrabold text-zinc-900 group-hover:opacity-90 md:text-2xl">
                    {p.title}
                  </h2>
                  <p className="mt-2 text-sm text-zinc-600">{p.excerpt || ""}</p>
                </Link>

                {/* Video küçük bilgi */}
                {p.video?.url ? (
                  <div className="mt-4 rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
                    <p className="text-xs font-bold text-zinc-500">Tanıtım Videosu</p>
                    <p className="mt-1 text-sm font-extrabold text-zinc-900">
                      {p.video?.title || "Videoyu izle"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link
                        href={`/blog/${p.slug}`}
                        className="rounded-2xl bg-[#DB2777] px-4 py-2 text-sm font-extrabold text-white hover:opacity-95"
                      >
                        Yazıyı aç
                      </Link>
                      <Link
                        href={p.video.url}
                        target="_blank"
                        className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-extrabold text-zinc-900 hover:border-zinc-300"
                      >
                        Videoyu aç ↗
                      </Link>
                    </div>
                  </div>
                ) : null}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-zinc-500">
                    {p.author || "Güzellik Uzmanı"}
                  </span>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="inline-flex items-center rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-extrabold text-zinc-900 hover:border-zinc-300"
                  >
                    Devamını oku →
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-4">
          <section className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-extrabold text-zinc-900">Hızlı geçiş</h3>
            <div className="mt-3 grid gap-2">
              <Link
                href="/magaza"
                className="rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-extrabold text-white hover:opacity-95"
              >
                Mağaza (ürünlere git)
              </Link>
              <Link
                href="/anket"
                className="rounded-2xl bg-[#7C3AED] px-4 py-2 text-sm font-extrabold text-white hover:opacity-95"
              >
                Uzman önerisi al (2 dk)
              </Link>
              <Link
                href="/forum"
                className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-extrabold text-zinc-900 hover:border-zinc-300"
              >
                Forum (soru sor)
              </Link>
            </div>
          </section>

          <section className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-extrabold text-zinc-900">Popüler etiketler</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.length === 0 ? (
                <span className="text-sm text-zinc-600">Etiket yok</span>
              ) : (
                tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-700"
                  >
                    {t}
                  </span>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-extrabold text-zinc-900">Amaç</h3>
            <p className="mt-2 text-sm text-zinc-600">
              Blog içeriği, profesyonel kullanıcıların uygulama adımlarını izleyip,
              doğru ürüne hızlı geçebilmesi için kurgulandı.
            </p>
          </section>
        </aside>
      </div>

      <div className="h-10" />
    </main>
  );
}
