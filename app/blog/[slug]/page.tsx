import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/data/blogPosts";
import VideoEmbed from "@/app/_components/VideoEmbed";
import ProductMiniCard from "@/app/_components/ProductMiniCard";

export const revalidate = 60;

type Params = Promise<{ slug: string }>;

function getPost(slug: string) {
  const s = String(slug ?? "").toLowerCase().trim();
  const p: any = (blogPosts as any[]).find((x: any) => String(x.slug || "").toLowerCase() === s);
  if (!p || p.published === false) return null;
  return p;
}

export default async function BlogDetailPage({ params }: { params: Params }) {
  const p = (await params) ?? { slug: "" };
  const post: any = getPost(p.slug);
  if (!post) return notFound();

  return (
    <main className="mx-auto max-w-screen-xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Link href="/blog" className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-extrabold text-zinc-900 hover:border-zinc-300">← Blog</Link>
        <div className="flex gap-2">
          <Link href="/magaza" className="rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-extrabold text-white hover:opacity-95">Mağaza</Link>
          <Link href="/anket" className="rounded-2xl bg-[#DB2777] px-4 py-2 text-sm font-extrabold text-white hover:opacity-95">Uzman önerisi</Link>
        </div>
      </div>

      <section className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm md:p-10">
        <div className="flex flex-wrap items-center gap-2">
          {(post.tags || []).map((t: string) => (
            <span key={t} className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-700">{t}</span>
          ))}
          <span className="ml-auto text-xs font-bold text-zinc-500">{post.dateISO}</span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 md:text-4xl">{post.title}</h1>
        <p className="mt-2 text-sm text-zinc-600">{post.excerpt}</p>

        {post.video?.url ? (
          <div className="mt-6">
            <VideoEmbed provider={post.video.provider || "youtube"} url={post.video.url} />
          </div>
        ) : null}

        {Array.isArray(post.content) ? (
          <div className="mt-6 space-y-2">
            {post.content.map((x: string, i: number) => (
              <p key={i} className="text-sm text-zinc-700">{x}</p>
            ))}
          </div>
        ) : null}
      </section>

      {post.productSlugs?.length ? (
        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-zinc-900">Videodaki / Konudaki Ürünler</h2>
              <p className="mt-1 text-sm text-zinc-600">Direkt ürüne git ve mağazada incele.</p>
            </div>
            <Link href="/magaza" className="text-sm font-bold text-[#7C3AED] hover:opacity-80">Mağazaya git →</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {post.productSlugs.map((s: string) => (
              <ProductMiniCard key={s} slug={s} />
            ))}
          </div>
        </section>
      ) : null}

      <div className="h-8" />
    </main>
  );
}