import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import productsData from "@/data/products.json";

type ProductImage = {
  src: string;
  alt?: string;
};

type Product = {
  slug: string;
  title?: string;
  name?: string;
  brand?: string;
  price: number;
  compareAtPrice?: number | null;
  images?: ProductImage[] | string[];
  shortDescription?: string;
  description?: string;
  benefits?: string[];
  usage?: string;
  ingredientsNote?: string;
  tags?: string[];
};

function normalizeSlug(slug: string) {
  return slug
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
}

function getImages(p: Product): { src: string; alt: string }[] {
  if (!p.images || p.images.length === 0) {
    return [{ src: "/demo/urun-1.jpg", alt: p.title ?? "Ürün" }];
  }

  return (p.images as any[]).map((img, i) => {
    if (typeof img === "string") {
      return { src: img, alt: p.title ?? "Ürün" };
    }
    return {
      src: img.src,
      alt: img.alt ?? p.title ?? `Ürün görseli ${i + 1}`,
    };
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const normalized = normalizeSlug(slug);

  const product = (productsData as Product[]).find(
    (p) => normalizeSlug(p.slug) === normalized
  );

  if (!product) notFound();

  const images = getImages(product);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 md:grid-cols-2">
        {/* SOL: GALERİ */}
        <div className="relative">
          <div className="relative aspect-square w-full max-w-md mx-auto rounded-3xl bg-zinc-50 ring-1 ring-zinc-200">
            <Image
              src={images[0].src}
              alt={images[0].alt}
              fill
              className="object-contain p-6"
              priority
            />
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2 max-w-md mx-auto">
            {images.slice(1).map((img, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-xl bg-zinc-50 ring-1 ring-zinc-200"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-contain p-2"
                />
              </div>
            ))}
          </div>
        </div>

        {/* SAĞ: BİLGİ */}
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold text-zinc-500">
              {product.brand}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
              {product.title ?? product.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-zinc-900">
              ₺{product.price}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-zinc-400 line-through">
                ₺{product.compareAtPrice}
              </span>
            )}
          </div>

          {product.shortDescription && (
            <p className="text-zinc-600 leading-6">
              {product.shortDescription}
            </p>
          )}

          <div className="grid gap-3">
            <Link
              href="/anket"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:opacity-95"
            >
              Uzman önerisi al
            </Link>

            <Link
              href="/magaza"
              className="inline-flex w-full items-center justify-center rounded-2xl border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-900"
            >
              Mağazaya dön
            </Link>
          </div>

          {product.benefits && (
            <ul className="list-disc pl-5 text-sm text-zinc-600 space-y-1">
              {product.benefits.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
