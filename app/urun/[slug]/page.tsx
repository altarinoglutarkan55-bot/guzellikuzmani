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
  category?: string;
  images?: Array<string | ProductImage>;
  image?: string;
};

type Img = { src: string; alt: string };

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

function getImages(p: Product): Img[] {
  const title = getTitle(p);
  const imgs = p.images;

  if (Array.isArray(imgs) && imgs.length > 0) {
    return imgs.map((img, i) => {
      if (typeof img === "string") return { src: img, alt: `${title} ${i + 1}` };
      return { src: img.src, alt: img.alt ?? `${title} ${i + 1}` };
    });
  }

  return [{ src: firstImage(p), alt: title }];
}

function formatTRY(n: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(n);
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const reqSlug = normalizeSlug(decodeURIComponent(params.slug));

  const list = products as Product[];
  const product = list.find((p) => normalizeSlug(p.slug) === reqSlug) ?? null;

  if (!product) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-2xl font-bold text-zinc-900">Ürün bulunamadı</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Aradığınız ürün kaldırılmış olabilir veya bağlantı hatalı olabilir.
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

  const hasCompare = typeof compareAtPrice === "number" && compareAtPrice > price;
  const pct = hasCompare ? Math.round(((compareAtPrice! - price) / compareAtPrice!) * 100) : 0;

  return (
    <main className="mx-auto max-w-screen-xl px-4 py-6">
      {/* breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-zinc-600">
        <Link href="/" className="hover:text-zinc-900">Ana Sayfa</Link>
        <span className="text-zinc-400">/</span>
        <Link href="/magaza" className="hover:text-zinc-900">Mağaza</Link>
        <span className="text-zinc-400">/</span>
        <span className="line-clamp-1 text-zinc-900">{title}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Gallery images={images as any} />
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs font-semibold text-zinc-500">
                  {brand ? brand.toUpperCase() : "GÜZELLİK UZMANI"}
                </div>
                <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-zinc-900">{title}</h1>
                <p className="mt-2 text-sm text-zinc-600">
                  {product.shortDescription || "Uzman önerisiyle doğru rutini kur. Hızlı sonuç, temiz içerik (demo)."}
                </p>
              </div>

              {hasCompare ? (
                <span className="mt-1 shrink-0 rounded-full bg-[#DB2777]/10 px-3 py-1 text-xs font-extrabold text-[#DB2777]">
                  %{pct} indirim
                </span>
              ) : null}
            </div>

            {/* fiyat */}
            <div className="mt-4 flex items-end justify-between">
              <div className="text-2xl font-extrabold text-zinc-900">{formatTRY(price)}</div>
              {hasCompare ? (
                <div className="text-sm font-semibold text-zinc-500 line-through">
                  {formatTRY(compareAtPrice!)}
                </div>
              ) : null}
            </div>

            {/* satın alma paneli */}
            <BuyPanelReal
              id={String(product.slug ?? reqSlug)}
              title={title}
              price={price}
              image={firstImage(product)}
            />

            {/* güven barı alanı (sen eklemiştin, korunuyor) */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-zinc-600">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2">
                <div className="font-bold text-zinc-900">Hızlı Kargo</div>
                <div className="mt-0.5">1-3 gün (demo)</div>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2">
                <div className="font-bold text-zinc-900">Güvenli Ödeme</div>
                <div className="mt-0.5">SSL + 3D (demo)</div>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2">
                <div className="font-bold text-zinc-900">İade</div>
                <div className="mt-0.5">14 gün (demo)</div>
              </div>
            </div>
          </div>

          {/* tabs */}
          <div className="mt-6">
            <ProductTabs description={description} details={details} />
          </div>
        </div>
      </div>

      {/* benzer ürünler */}
      <div className="mt-10">
        <SimilarProducts currentSlug={String(product.slug ?? reqSlug)} />
      </div>
    </main>
  );
}
