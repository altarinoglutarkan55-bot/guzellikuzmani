import Link from "next/link";
import { blogPosts } from "@/data/blogPosts";
import VideoEmbed from "@/app/_components/VideoEmbed";
import ProductMiniCard from "@/app/_components/ProductMiniCard";
import TrackEventLink from "@/app/_components/TrackEventLink";

export const revalidate = 60;

export default function BlogPage() {
  const published = blogPosts.filter((x) => x.published);

  return (
    <main className="mx-auto max-w-screen-xl px-4 py-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 md:text-4xl">
            Blog • Profesyonel İçerikler
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600">
            Kuaför ve profesyoneller için rutinler, eğitim videoları ve ürün kullanım rehberleri.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/magaza"
            className="rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-extrabold text-white hover:opacity-95"
          >
            Mağazaya git
          </Link>
          <Link
            href="/anket"
            className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-extrabold text-zinc-900 hover:border-zinc-300"
          >
            Uzman önerisi
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {published.map((p) => (
            <article key={p.slug} className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm md:p-8">
              <div className="flex flex-wrap items-center gap-2">
                {(p.tags || []).map((t) => (
                  <span key={t} className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-700">
                    {t}
                  </span>
                ))}
                <span className="ml-auto text-xs font-bold text-zinc-500">{p.dateISO}</span>
              </div>

              <h2 className="mt-4 text-2xl font-extrabold text-zinc-900">{p.title}</h2>
              <p className="mt-2 text-sm text-zinc-600">{p.excerpt}</p>

              {p.video?.url ? (
                <div className="mt-5">
                  <VideoEmbed provider={p.video.provider} url={p.video.url} title={p.title} />
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs font-bold text-zinc-500">
                      Video: {p.video.provider === "youtube" ? "YouTube" : "MP4"}
                    </div>

                    <TrackEventLink
                      href={p.video.url}
                      eventName="blog_video_click"
                      payload={{ postSlug: p.slug, provider: p.video.provider }}
                      className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-extrabold text-zinc-900 hover:border-zinc-300"
                    >
                      Videoyu yeni sekmede aç →
                    </TrackEventLink>
                  </div>
                </div>
              ) : null}

              <div className="mt-6 space-y-3">
                {(p.content || []).map((para, i) => (
                  <p key={i} className="text-sm leading-6 text-zinc-800">
                    {para}
                  </p>
                ))}
              </div>

              {p.productSlugs?.length ? (
                <div className="mt-7 rounded-[24px] border border-zinc-200 bg-zinc-50 p-4">
                  <div className="mb-3 flex items-end justify-between">
                    <div>
                      <div className="text-sm font-extrabold text-zinc-900">Bu içerikte önerilen ürünler</div>
                      <div className="mt-1 text-xs font-bold text-zinc-500">
                        Direkt sepete ekle veya ürün detayına git.
                      </div>
                    </div>
                    <Link href="/magaza" className="text-sm font-bold text-[#7C3AED] hover:opacity-80">
                      Tüm ürünler →
                    </Link>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {p.productSlugs.map((s) => (
                      <ProductMiniCard key={s} slug={s} />
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-2">
                <TrackEventLink
                  href="/magaza"
                  eventName="blog_cta_shop"
                  payload={{ postSlug: p.slug }}
                  className="rounded-2xl bg-[#7C3AED] px-4 py-2 text-sm font-extrabold text-white hover:opacity-95"
                >
                  Ürünlere geç
                </TrackEventLink>
                <TrackEventLink
                  href="/anket"
                  eventName="blog_cta_expert"
                  payload={{ postSlug: p.slug }}
                  className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-extrabold text-zinc-900 hover:border-zinc-300"
                >
                  Uzman önerisi al
                </TrackEventLink>
              </div>
            </article>
          ))}
        </div>

        <aside className="lg:sticky lg:top-24 h-fit space-y-4">
          <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="text-lg font-extrabold text-zinc-900">Profesyonel içerik akışı</div>
            <p className="mt-2 text-sm text-zinc-600">
              Yakında: kategori bazlı videolar (boyalı saç, keratin, perma), marka eğitimleri ve kuaför
              ipuçları.
            </p>

            <div className="mt-4 grid gap-2">
              <Link
                href="/magaza"
                className="rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-extrabold text-white hover:opacity-95 text-center"
              >
                Mağaza
              </Link>
              <Link
                href="/forum"
                className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-extrabold text-zinc-900 hover:border-zinc-300 text-center"
              >
                Forum
              </Link>
              <Link
                href="/anket"
                className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-extrabold text-zinc-900 hover:border-zinc-300 text-center"
              >
                Uzman önerisi
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-extrabold text-zinc-900">Not</div>
            <p className="mt-2 text-sm text-zinc-600">
              Admin panel demo olduğu için şu an veri “memory”de tutulur. Bir sonraki adımda DB (Supabase/Neon),
              auth ve gerçek içerik yönetimi ekleyeceğiz.
            </p>
          </div>
        </aside>
      </div>

      <div className="h-8" />
    </main>
  );
}

