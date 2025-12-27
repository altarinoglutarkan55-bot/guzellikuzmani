import Link from "next/link";
import { notFound } from "next/navigation";
import { forumThreads } from "@/data/forumThreads";
import ProductMiniCard from "@/app/_components/ProductMiniCard";

export const revalidate = 60;

type Params = Promise<{ slug: string }>;

function getThread(slug: string) {
  const s = String(slug ?? "").toLowerCase().trim();
  return forumThreads.find((t) => t.slug.toLowerCase() === s);
}

export default async function ForumDetailPage({ params }: { params: Params }) {
  const p = (await params) ?? { slug: "" };
  const thread = getThread(p.slug);
  if (!thread) return notFound();

  return (
    <main className="mx-auto max-w-screen-xl px-4 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/forum"
          className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-extrabold text-zinc-900 hover:border-zinc-300"
        >
          ← Forum
        </Link>

        <div className="flex gap-2">
          <Link
            href="/magaza"
            className="inline-flex items-center rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-extrabold text-white hover:opacity-95"
          >
            Mağaza
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
        <div className="flex flex-wrap items-center gap-2">
          {thread.tags.map((t) => (
            <Link
              key={t}
              href={"/forum?tag=" + encodeURIComponent(t)}
              className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-700 hover:opacity-80"
            >
              {t}
            </Link>
          ))}
          <span className="ml-auto text-xs font-bold text-zinc-500">{thread.dateISO}</span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 md:text-4xl">
          {thread.title}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">{thread.excerpt}</p>

        <h2 className="mt-8 text-lg font-extrabold text-zinc-900">Cevaplar</h2>
        <div className="mt-3 space-y-3">
          {thread.replies.map((r, idx) => (
            <div key={idx} className="rounded-3xl border border-zinc-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-extrabold text-zinc-900">{r.author}</p>
                <p className="text-xs font-bold text-zinc-500">{r.dateISO}</p>
              </div>
              <p className="mt-2 text-sm text-zinc-700">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {thread.productSlugs?.length ? (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-extrabold text-zinc-900">İlgili Ürünler</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {thread.productSlugs.map((s) => (
              <ProductMiniCard key={s} slug={s} />
            ))}
          </div>
        </section>
      ) : null}

      <div className="h-8" />
    </main>
  );
}
