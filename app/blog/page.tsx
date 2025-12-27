import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/data/blogPosts";

export const revalidate = 60;

type SearchParams = Promise<{ q?: string; tag?: string }>;

function uniqueTags() {
  const set = new Set<string>();
  for (const p of blogPosts) for (const t of p.tags) set.add(t);
  return Array.from(set).slice(0, 24);
}

function ytThumb(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const sp = (await searchParams) ?? {};
  const q = String(sp.q ?? "").trim().toLowerCase();
  const tag = String(sp.tag ?? "").trim().toLowerCase();

  const tags = uniqueTags();

  const list = blogPosts
    .slice()
    .sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1))
    .filter((p) => (tag ? p.tags.some((t) => t.toLowerCase() === tag) : true))
    .filter((p) =>
      q
        ? (p.title + " " + p.excerpt + " " + p.tags.join(" "))
            .toLowerCase()
            .includes(q)
        : true
    );

  const featuredVideos = blogPosts.filter((p) => !!p.video).slice(0, 4);

  return (
    <main className="mx-auto max-w-screen-xl px-4 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-extrabold text-zinc-900 hover:border-zinc-300"
        >
          ← Ana Sayfa
        </Link>

        <Link
          href="/magaza"
          className="inline-flex items-center rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-extrabold text-white hover:opacity-95"
        >
          Mağazaya git
        </Link>
      </div>

      <section className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm md:p-10">
        <p className="inline-flex items-center rounded-full bg-[#7C3AED]/10 px-3 py-1 text-xs font-bold text-[#7C3AED]">
          Profesyonel içerikler • Video • Ürün yönlendirme
        </p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 md:text-4xl">
          Blog
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Kuaför ve profesyoneller için: teknik anlatımlar, ürün tanıtımları ve uygulama videoları.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <form className="md:col-span-2" action="/blog">
            <div className="flex gap-2">
              <input
                name="q"
                defaultValue={q}
                placeholder="Ara: mor şampuan, keratin, saç dökülmesi..."
                className="h-11 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300"
              />
              {tag ? <input type="hidden" name="tag" value={tag} /> : null}
              <button
                type="submit"
                className="h-11 rounded-2xl bg-zinc-900 px-5 text-sm font-extrabold text-white hover:opacity-95"
              >
                Ara
              </button>
            </div>
          </form>

          <Link
            href="/anket"
            className="grid h-11 place-items-center rounded-2xl bg-[#DB2777] px-4 text-sm font-extrabold text-white hover:opacity-95"
          >
            Uzman önerisi al
          </Link>
        </div>
      </section>

      {/* Etiketler */}
      <section className="mt-6">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/blog"
            className={
              "rounded-full border px-3 py-1 text-xs font-bold " +
              (tag
                ? "border-zinc-200 bg-white text-zinc-700"
                : "border-zinc-900 bg-zinc-900 text-white")
            }
          >
            Tümü
          </Link>

          {tags.map((t) => {
            const active = t.toLowerCase() === tag;
            const href =
              `/blog?tag=${encodeURIComponent(t)}` +
              (q ? `&q=${encodeURIComponent(q)}` : "");

            return (
              <Link
                key={t}
                href={href}
                className={
                  "rounded-full border px-3 py-1 text-xs font-bold " +
                  (active
                    ? "border-[#7C3AED] bg-[#7C3AED]/10 text-[#7C3AED]"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300")
                }
              >
                {t}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Video vitrin */}
      {featuredVideos.length > 0 ? (
        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-zinc-900">Öne Çıkan Videolar</h2>
              <p className="mt-1 text-sm text-zinc-600">Uygulama anlatımları ve ürün tanıtımları.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredVideos.map((p) => {
              const v = p.video;
              const thumb = v?.provider === "youtube" && v?.id ? ytThumb(v.id) : "/demo/blog-video.jpg";

              return (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm hover:shadow-md"
                >
                  <div className="relative aspect-video bg-zinc-100">
                    <Image
                      src={thumb}
                      alt={p.title}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs font-extrabold text-white">
                      ▶ Video
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-500">{p.minutes} dk</span>
                      <span className="text-xs font-bold text-[#7C3AED] group-hover:opacity-80">İzle →</span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm font-extrabold text-zinc-900 group-hover:text-[#7C3AED]">
                      {p.title}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm text-zinc-600">{p.excerpt}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* Yazılar */}
      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-zinc-900">Yazılar</h2>
            <p className="mt-1 text-sm text-zinc-600">{list.length} içerik bulundu</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {p.tags.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-zinc-100 px-2 py-1 text-[11px] font-bold text-zinc-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <span className="text-xs font-bold text-zinc-500">{p.minutes} dk</span>
              </div>

              <h3 className="mt-3 line-clamp-2 text-lg font-extrabold text-zinc-900 group-hover:text-[#7C3AED]">
                {p.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm text-zinc-600">{p.excerpt}</p>

              <div className="mt-4 flex items-center justify-between text-xs font-bold text-zinc-500">
                <span>{p.author}</span>
                <span>Oku →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="h-8" />
    </main>
  );
}
