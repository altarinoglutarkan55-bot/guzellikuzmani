// app/urun/[slug]/page.tsx
import Link from "next/link";
import products from "@/data/products.json";
import Gallery from "./_components/Gallery";
import ProductTabs from "./ProductTabs";
import BuyPanelReal from "./buy-panel-real";

type ProductImage = { src: string; alt?: string };
type Product = {
  slug?: string;
  title?: string;
  name?: string;
  brand?: string;
  price?: number;
  compareAtPrice?: number | null;
  shortDescription?: string;
  usage?: string;
  benefits?: string[];
  images?: Array<string | ProductImage>;
};

type Img = { src: string; alt: string };

function normalizeSlug(input: unknown) {
  return String(input ?? "").toLowerCase().trim();
}

function getTitle(p: Product) {
  return String(p.title ?? p.name ?? "ÃœrÃ¼n");
}

function getImages(p: Product): Img[] {
  const title = getTitle(p);
  const imgs = p.images;

  if (Array.isArray(imgs) && imgs.length > 0) {
    return imgs.map((img, i) => {
      if (typeof img === "string") return { src: img, alt: `${title} ${i + 1}` };
      return { src: img.src, alt: img.alt ?? `${title} ${i + 1}` };
    });
  }
  return [{ src: "/demo/urun-1.jpg", alt: title }];
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = (await (params as any)) as { slug: string };
  const reqSlug = normalizeSlug(decodeURIComponent(resolvedParams.slug));

  const list = products as Product[];

  const product = list.find((p) => normalizeSlug(p.slug) === reqSlug) ?? null;

  if (!product) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-2xl font-bold text-zinc-900">ÃœrÃ¼n bulunamadÄ±</h1>
        <p className="mt-2 text-zinc-600">Bu Ã¼rÃ¼n linki hatalÄ± olabilir ya da Ã¼rÃ¼n henÃ¼z eklenmemiÅŸ olabilir.</p>
        <div className="mt-6 flex gap-3">
          <Link href="/magaza" className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white">
            MaÄŸazaya git
          </Link>
          <Link href="/" className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-900">
            Ana sayfa
          </Link>
        </div>
        <p className="mt-6 text-xs text-zinc-500">
          Ä°stenen slug: <span className="font-mono">{resolvedParams.slug}</span>
        </p>
      </main>
    );
  }

  const title = getTitle(product);
  const brand = String(product.brand ?? "");
  const price = Number(product.price ?? 0);
  const compareAtPrice =
    typeof product.compareAtPrice === "number" ? Number(product.compareAtPrice) : null;

  const images = getImages(product);
  const description = product.shortDescription || product.usage || "";
  const details =
    (product.benefits ?? []).slice(0, 6).map((b, i) => ({ key: `Fayda ${i + 1}`, value: String(b) })) ?? [];

  return (
    <main className="mx-auto max-w-screen-xl px-4 py-8">
      <Link href="/magaza" className="mb-6 inline-block text-sm text-zinc-600 hover:underline">
        â† MaÄŸazaya dÃ¶n
      </Link>

      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Gallery images={images} />
        </div>

        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <p className="text-xs font-semibold tracking-wide text-zinc-500">
              {brand ? brand.toUpperCase() : "GÃœZELLÄ°K UZMANI"}
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">{title}</h1>

            <div className="mt-3 flex items-end gap-3">
              <div className="text-2xl font-extrabold text-zinc-900">â‚º{price}</div>
              {compareAtPrice ? (
                <div className="text-sm font-semibold text-zinc-400 line-through">â‚º{compareAtPrice}</div>
              ) : null}
              {compareAtPrice && compareAtPrice > price ? (
                <span className="badge">%{Math.round(((compareAtPrice - price) / compareAtPrice) * 100)} indirim</span>
              ) : null}
            </div>

            <p className="mt-4 text-sm leading-6 text-zinc-600">
              {product.shortDescription || "Uzman Ã¶nerisiyle doÄŸru rutini kur. HÄ±zlÄ± sonuÃ§, temiz iÃ§erik (demo)."}
            </p>

            <BuyPanelReal
              id={String(product.slug ?? reqSlug)}
              title={title}
              price={price}
              image={images?.[0]?.src}
            />

            <div className="mt-6">
              <ProductTabs description={description} details={details} />
            </div>

            <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
              âœ… AynÄ± gÃ¼n kargo (demo) â€¢ âœ… Kolay iade (demo) â€¢ âœ… GÃ¼venli Ã¶deme (demo)
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

