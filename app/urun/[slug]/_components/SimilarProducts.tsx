import Image from "next/image";
import Link from "next/link";

type Product = {
  slug?: string;
  title?: string;
  name?: string;
  brand?: string;
  price?: number;
  compareAtPrice?: number | null;
  image?: string;
  images?: Array<string | { src: string; alt?: string }>;
  category?: string;
};

function formatTRY(n: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(n);
}

function getTitle(p: Product) {
  return String(p.title ?? p.name ?? "Ürün");
}

function firstImage(p: Product) {
  if (typeof p.image === "string" && p.image) return p.image;

  const imgs = p.images;
  if (Array.isArray(imgs) && imgs.length > 0) {
    const first = imgs[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object" && (first as any).src) return String((first as any).src);
  }
  return "/demo/urun-1.jpg";
}

export default function SimilarProducts({
  title,
  items,
}: {
  title: string;
  items: Product[];
}) {
  if (!items?.length) return null;

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-extrabold tracking-tight text-zinc-900">{title}</h2>
        <Link href="/magaza" className="text-sm font-semibold text-[#7C3AED] hover:opacity-90">
          Mağazaya git
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => {
          const hasCompare = typeof p.compareAtPrice === "number" && Number(p.compareAtPrice) > Number(p.price ?? 0);
          const price = Number(p.price ?? 0);
          const compare = Number(p.compareAtPrice ?? 0);
          const pct = hasCompare ? Math.round(((compare - price) / compare) * 100) : 0;

          return (
            <Link
              key={String(p.slug)}
              href={`/urun/${p.slug}`}
              className="relative rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm hover:shadow-md"
            >
              {hasCompare ? (
                <div className="absolute left-4 top-4 rounded-full bg-[#DB2777] px-2 py-1 text-xs font-extrabold text-white">
                  %{pct} indirim
                </div>
              ) : null}

              <div className="flex items-start gap-4">
                <div className="flex h-24 w-24 flex-none items-center justify-center overflow-hidden rounded-2xl bg-zinc-50 ring-1 ring-zinc-200">
                  <Image
                    src={firstImage(p)}
                    alt={getTitle(p)}
                    width={96}
                    height={96}
                    className="object-contain"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-semibold text-zinc-900 hover:text-[#7C3AED]">
                    {getTitle(p)}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-extrabold text-zinc-900">{formatTRY(price)}</span>
                    {hasCompare ? (
                      <span className="text-xs font-semibold text-zinc-500 line-through">{formatTRY(compare)}</span>
                    ) : null}
                  </div>

                  <div className="mt-3 inline-flex w-full items-center justify-center rounded-2xl bg-zinc-900 px-3 py-2 text-xs font-semibold text-white">
                    İncele
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
