import Link from "next/link";
import { blogPosts } from "@/data/blogPosts";

export const revalidate = 60;

type SearchParams = Promise<{
  q?: string;
  tag?: string;
}>;

function uniqueTags() {
  const set = new Set<string>();
  for (const p of blogPosts) for (const t of p.tags) set.add(t);
  return Array.from(set).slice(0, 24);
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
        <Link href="/" className="rounded-2xl border px-4 py-2 text-sm font-extrabold">
          ← Ana Sayfa
        </Link>
        <Link href="/magaza" className="rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-extrabold text-white">
          Mağazaya git
        </Link>
      </div>

      <section className="rounded-[28px] border bg-white p-6 shadow-sm md:p-10">
        <p className="inline-flex rounded-full bg-[#7C3AED]/10 px-3 py-1 text-xs font-bold text-[#7C3AED]">
          Profesyonel içerikler • Video • Ürün yönlendirme
        </p>
        <h1 className="mt-4 text-3xl font-extrabold">Blog</h1>

        <form className="mt-6 flex gap-2" action="/blog">
          <input
            name="q"
            defaultValue={q}
            placeholder="Ara: mor şampuan, keratin..."
            className="h-11 w-full rounded-2xl border px-4 text-sm"
          />
          {tag ? <input type="hidden" name="tag" value={tag} /> : null}
          <button className="h-11 rounded-2xl bg-zinc-900 px-5 text-sm font-extrabold text-white">
            Ara
          </button>
        </form>
      </section>

      {featuredVideos.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-extrabold">Öne Çıkan Videolar</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredVideos.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="rounded-3xl border p-4 shadow-sm">
                <span className="text-xs font-bold text-[#7C3AED]">Video</span>
                <p className="mt-2 font-extrabold">{p.title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-extrabold">Yazılar</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="rounded-3xl border p-5 shadow-sm">
              <h3 className="font-extrabold">{p.title}</h3>
              <p className="mt-2 text-sm text-zinc-600">{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
