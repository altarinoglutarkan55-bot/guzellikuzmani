import Link from "next/link";
import { forumThreads } from "@/data/forumThreads";

export const revalidate = 60;

type SearchParams = Promise<{ q?: string; tag?: string }>;

function uniqueTags() {
  const set = new Set<string>();
  for (const t of forumThreads) for (const tag of t.tags) set.add(tag);
  return Array.from(set).slice(0, 24);
}

export default async function ForumPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const sp = (await searchParams) ?? {};
  const q = String(sp.q ?? "").trim().toLowerCase();
  const tag = String(sp.tag ?? "").trim().toLowerCase();

  const tags = uniqueTags();

  const list = forumThreads
    .slice()
    .sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1))
    .filter((t) => (tag ? t.tags.some((x) => x.toLowerCase() === tag) : true))
    .filter((t) =>
      q
        ? (t.title + " " + t.excerpt + " " + t.tags.join(" "))
            .toLowerCase()
            .includes(q)
        : true
    );

  return (
    <main className="mx-auto max-w-screen-xl px-4 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-extrabold text-zinc-900 hover:border-zinc-300"
        >
          ← Ana Sayfa
        </Link>

        <div className="flex gap-2">
          <Link
            href="/blog"
            className="inline-flex items-center rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-extrabold text-zinc-900 hover:border-zinc-300"
          >
            Blog
          </Link>
          <Link
            href="/anket"
            className="inline-flex items-center rounded-2xl bg-[#DB2777] px-4 py-2 text-sm font-extrabold text-white hover:opacity-95"
          >
            Uzman önerisi
          </Link>
        </div>
      </div>

      <section className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm md:p-10">
        <p className="inline-flex items-center rounded-full bg-zinc-900/10 px-3 py-1 text-xs font-bold text-zinc-900">
          Topluluk • Soru-Cevap • Deneyim paylaşımı
        </p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 md:text-4xl">
          Forum
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Kuaförler ve profesyoneller için: soru sor, deneyim paylaş, çözüm bul.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <form className="md:col-span-2" action="/forum">
            <div className="flex gap-2">
              <input
                name="q"
                defaultValue={q}
                placeholder="Ara: keratin, mor şampuan, saç derisi..."
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
            className="grid h-11 place-items-center rounded-2xl bg-[#7C3AED] px-4 text-sm font-extrabold text-white hover:opacity-95"
          >
            Soru sor (demo)
          </Link>
        </div>
      </section>

      {/* Etiketler */}
      <section className="mt-6">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/forum"
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
              `/forum?tag=${encodeURIComponent(t)}` +
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

      {/* Konular */}
      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-zinc-900">Konular</h2>
            <p className="mt-1 text-sm text-zinc-600">{list.length} konu bulundu</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {list.map((t) => (
            <Link
              key={t.slug}
              href={`/forum/${t.slug}`}
              className="group rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-2">
                  {t.tags.slice(0, 3).map((x) => (
                    <span key={x} className="rounded-full bg-zinc-100 px-2 py-1 text-[11px] font-bold text-zinc-700">
                      {x}
                    </span>
                  ))}
                </div>
                <span className="text-xs font-bold text-zinc-500">{t.replies.length} cevap</span>
              </div>

              <h3 className="mt-3 line-clamp-2 text-lg font-extrabold text-zinc-900 group-hover:text-[#7C3AED]">
                {t.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-zinc-600">{t.excerpt}</p>

              <div className="mt-4 flex items-center justify-between text-xs font-bold text-zinc-500">
                <span>{t.author}</span>
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
