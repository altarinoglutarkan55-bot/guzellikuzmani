import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import products from "@/data/products.json";

type Img = {
  src: string;
  alt: string;
};

type Product = {
  slug: string;
  title: string;
  brand?: string;
  price: number;
  compareAtPrice?: number;
  shortDescription?: string;
  benefits?: string[];
  usage?: string;
  images: Img[];
};

function normalizeSlug(s: string) {
  return s.toLowerCase().trim();
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = normalizeSlug(params.slug);

  const product = (products as any[]).find(
    (p) => normalizeSlug(p.slug) === slug
  ) as Product | undefined;

  if (!product) notFound();

  const images: Img[] =
    product.images?.map((img) => ({
      src: img.src,
      alt: img.alt || product.title,
    })) ?? [];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid gap-8 md:grid-cols-2">
        {/* 🔹 ICON BOYUTUNDA GÖRSELLER */}
        <div className="flex gap-3">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative h-24 w-24 overflow-hidden rounded-xl border bg-white"
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

        {/* 🔹 ÜRÜN BİLGİLERİ */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-zinc-900">
            {product.title}
          </h1>

          {product.brand && (
            <p className="text-sm text-zinc-500">{product.brand}</p>
          )}

          <div className="flex items-center gap-3">
            <span className="text-2xl font-semibold">
              ₺{product.price}
            </span>

            {product.compareAtPrice && product.compareAtPrice > 0 && (
              <span className="text-sm line-through text-zinc-400">
                ₺{product.compareAtPrice}
              </span>
            )}
          </div>

          {product.shortDescription && (
            <p className="text-zinc-600">
              {product.shortDescription}
            </p>
          )}

          {product.benefits && product.benefits.length > 0 && (
            <ul className="list-disc pl-5 text-sm text-zinc-600">
              {product.benefits.map((b: string, i: number) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}

          <div className="flex gap-3 pt-4">
            <button className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white">
              Sepete Ekle
            </button>

            <Link
              href="/anket"
              className="rounded-xl border px-6 py-3 text-sm font-semibold"
            >
              Uzman Önerisi Al
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
