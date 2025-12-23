import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import rawProducts from "../../../data/products.json";

type RawProduct = {
  slug?: string;
  title?: string;
  name?: string;
  brand?: string;
  price?: number;
  compareAtPrice?: number | null;
  shortDescription?: string;
  description?: string;
  benefits?: string[];
  images?: Array<string | { src: string; alt?: string }>;
};

type Product = {
  slug: string;
  title: string;
  brand: string;
  price: number;
  compareAtPrice?: number | null;
  shortDescription: string;
  benefits: string[];
  images: { src: string; alt: string }[];
};

function normalizeSlug(s: string) {
  return s
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeProduct(p: RawProduct): Product {
  const title = p.title || p.name || "Ürün";

  const images =
    p.images?.map((img, i) => {
      if (typeof img === "string") {
        return {
          src: img,
          alt: `${title} ${i + 1}`,
        };
      }
      return {
        src: img.src,
        alt: img.alt || `${title} ${i + 1}`,
      };
    }) ?? [];

  return {
    slug: normalizeSlug(p.slug || title),
    title,
    brand: p.brand || "",
    price: Number(p.price || 0),
    compareAtPrice: p.compareAtPrice ?? null,
    shortDescription: p.shortDescription || "",
    benefits: Array.isArray(p.benefits) ? p.benefits : [],
    images,
  };
}

export default function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = normalizeSlug(params.slug);

  const products = (rawProducts as RawProduct[]).map(normalizeProduct);

  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link
        href="/magaza"
        className="mb-6 inline-block text-sm text-zinc-600 hover:underline"
      >
        ← Mağazaya dön
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        {/* GÖRSELLER – İKON BOYUT */}
        <div className="flex flex-wrap gap-3">
          {product.images.map((img, i) => (
            <div
              key={i}
              className="relative h-16 w-16 overflow-hidden rounded-lg border bg-zinc-50"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>

        {/* ÜRÜN BİLGİSİ */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-zinc-900">
            {product.title}
          </h1>

          {product.brand && (
            <p className="text-sm text-zinc-500">{product.brand}</p>
          )}

          <div className="flex items-center gap-3">
            <p className="text-xl font-bold text-zinc-900">
              {product.price} ₺
            </p>
            {product.compareAtPrice && (
              <p className="text-sm text-zinc-400 line-through">
                {product.compareAtPrice} ₺
              </p>
            )}
          </div>

          {product.shortDescription && (
            <p className="text-sm text-zinc-600">
              {product.shortDescription}
            </p>
          )}

          {product.benefits.length > 0 && (
            <ul className="list-disc pl-5 text-sm text-zinc-600">
              {product.benefits.map((b: string, i: number) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}

          <div className="flex gap-3 pt-4">
            <button className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white">
              Sepete Ekle
            </button>

            <Link
              href="/anket"
              className="rounded-xl border px-5 py-3 text-sm font-semibold"
            >
              Uzman Önerisi Al
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
