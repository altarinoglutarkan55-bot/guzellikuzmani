// app/urun/[slug]/page.tsx
import Link from "next/link";
import products from "@/data/products.json";
import Gallery from "./_components/Gallery";
import ProductTabs from "./ProductTabs";
import BuyPanelReal from "./buy-panel-real";
import SimilarProducts from "./_components/SimilarProducts";

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
  image?: string;
  category?: string;
};

type Img = { src: string; alt: string };

function normalizeSlug(input: unknown) {
  return String(input ?? "").toLowerCase().trim();
}

function getTitle(p: Product) {
  return String(p.title ?? p.name ?? "Ürün");
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

  if (typeof p.image === "string" && p.image) {
    return [{ src: p.image, alt: title }];
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
        <h1 className="text-2xl font-bold text-zinc-900">Ürün bulunamadı</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Bu ürün kaldırılmış olabilir veya bağlantı yanlış olabilir.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/magaza"
            className="rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
          >
            Mağazaya dön
          </Link>
          <Link
            href="/"
            className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:border-zinc-300"
          >
            Ana sayfa
          </Link>
        </div>
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

  const category = String(product.category ?? "");
  const similar = list
    .filter((p) => normalizeSlug(p.slug) !== reqSlug)
    .filter((p) => (category ? String(p.category ?? "") === category : true))
    .slice(0, 6);

  const hasCompare = typeof compareAtPrice === "number" && compareAtPrice > price;
  const pct = hasCompare ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0;

  return (
    <main className="mx-auto max-w-screen-xl px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
        <Link href="/" className="hover:text-zinc-900">Ana sayfa</Link>
        <span>›</span>
        <Link href="/magaza" className="hover:text-zinc-900">Mağaza</Link>
        {category ? (
          <>
            <span>›</span>
            <Link href={`/magaza?kat=${encodeURIComponent(category)}`} className="hover:text-zinc-900">
              {category.replaceAll("-", " ")}
            </Link>
          </>
        ) : null}
        <span>›</span>
        <span className="text-zinc-900">{title}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left: Gallery */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
            <Gallery images={images as any} />
          </div>
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            {brand ? (
              <p className="text-xs font-semibold tracking-wide text-zinc-500">{brand.toUpperCase()}</p>
            ) : null}

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-900">{title}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xl font-extrabold text-zinc-900">
                {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(price)}
              </span>
              {hasCompare ? (
                <>
                  <span className="text-sm font-semibold text-zinc-500 line-through">
                    {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(compareAtPrice!)}
                  </span>
                  <span className="rounded-full bg-[#DB2777]/10 px-2 py-1 text-xs font-extrabold text-[#DB2777]">
                    %{pct} indirim
                  </span>
                </>
              ) : null}
            </div>

            <p className="mt-4 text-sm leading-6 text-zinc-600">
              {product.shortDescription || "Uzman önerisiyle doğru rutini kur. Hızlı sonuç, temiz içerik (demo)."}
            </p>

            {/* Güven Barı */}
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-zinc-50 p-3 ring-1 ring-zinc-200">
                <p className="text-xs font-semibold text-zinc-500">🚚 Kargo</p>
                <p className="mt-1 text-sm font-bold text-zinc-900">Hızlı teslimat</p>
              </div>
              <div className="rounded-2xl bg-zinc-50 p-3 ring-1 ring-zinc-200">
                <p className="text-xs font-semibold text-zinc-500">🔄 İade</p>
                <p className="mt-1 text-sm font-bold text-zinc-900">14 gün iade</p>
              </div>
              <div className="rounded-2xl bg-zinc-50 p-3 ring-1 ring-zinc-200">
                <p className="text-xs font-semibold text-zinc-500">🔒 Ödeme</p>
                <p className="mt-1 text-sm font-bold text-zinc-900">Güvenli ödeme</p>
              </div>
            </div>

            <BuyPanelReal
              id={String(product.slug ?? reqSlug)}
              title={title}
              price={price}
              image={images?.[0]?.src}
            />
          </div>

          <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <ProductTabs description={description} details={details} />
          </div>
        </div>
      </div>

      {/* Benzer ürünler */}
      <SimilarProducts title="Benzer ürünler" items={similar as any} />
    </main>
  );
}
