import Link from "next/link";
import Image from "next/image";
import products from "@/data/products.json";

type ProductImage = { src: string; alt?: string };
type Product = {
  slug?: string;
  title?: string;
  name?: string;
  brand?: string;
  price?: number;
  category?: string;
  images?: Array<string | ProductImage>;
  image?: string;
};

function normalizeSlug(input: unknown) {
  return String(input ?? "").toLowerCase().trim();
}

function getTitle(p: Product) {
  return String(p.title ?? p.name ?? "Ürün");
}

function firstImage(p: Product) {
  const imgs = p.images;
  if (Array.isArray(imgs) && imgs.length > 0) {
    const first = imgs[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object" && "src" in first) return String((first as any).src);
  }
  if (typeof p.image === "string" && p.image) return p.image;
  return "/demo/urun-1.jpg";
}

function formatTRY(n: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(n);
}

export default function SimilarProducts({
  currentSlug,
  title = "Benzer Ürünler",
  limit = 6,
}: {
  currentSlug: string;
  title?: string;
  limit?: number;
}) {
  const list = products as Product[];
  const cur = list.find((p) => normalizeSlug(p.slug) === normalizeSlug(currentSlug)) ?? null;

  // Aynı kategori öncelik, yoksa rastgele/ilk ürünler
  const curCat = cur?.category ? String(cur.category) : "";

  const items = list
    .filter((p) => Boolean(p.slug))
    .filter((p) => normalizeSlug(p.slug) !== normalizeSlug(currentSlug))
    .sort((a, b) => {
      const aSame = curCat && String(a.category ?? "") === curCat ? 0 : 1;
      const bSame = curCat && String(b.category ?? "") === curCat ? 0 : 1;
      return aSame - bSame;
    })
    .slice(0, limit);

  if (!items.length) return null;

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-lg font-extrabold tracking-tight text-zinc-900">{title}</h2>
        <Link href="/magaza" className="text-sm font-semibold text-[#7C3AED] hover:opacity-80">
          Tümünü gör
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => {
          const slug = String(p.slug);
          const t = getTitle(p);
          const price = Number(p.price ?? 0);

          return (
            <Link
              key={slug}
              href={`/urun/${slug}`}
              className="group rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 flex-none items-center justify-center overflow-hidden rounded-2xl bg-zinc-50 ring-1 ring-zinc-200">
                  <Image
                    src={firstImage(p)}
                    alt={t}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="line-clamp-2 text-sm font-semibold text-zinc-900 group-hover:text-[#7C3AED]">
                    {t}
                  </div>
                  <div className="mt-2 text-sm font-extrabold text-zinc-900">{formatTRY(price)}</div>
                  <div className="mt-1 text-xs text-zinc-500">
                    {(p.category ?? "").toString().replaceAll("-", " ")}
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
