import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import products from "../../../data/products.json";

type ProductImage = {
  src: string;
  alt?: string;
};

type Product = {
  slug: string;
  title: string;
  brand?: string;
  price: number;
  compareAtPrice?: number | null;
  shortDescription?: string;
  description?: string;
  images?: ProductImage[];
  benefits?: string[];
  usage?: string;
  category?: string;
};

function normalizeSlug(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-");
}

export default function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = normalizeSlug(params.slug);

  const product = (products as Product[]).find(
    (p) => normalizeSlug(p.slug) === slug
  );

  if (!product) notFound();

  const images =
    product.images?.map((img, i) => ({
      src: img.src,
      alt: img.alt ?? `${product.title} ${i + 1}`,
    })) ?? [];

  const benefits: string[] = product.benefits ?? [];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link
        href="/magaza"
        className="mb-6 inline-block text-sm text-zinc-600 hover:underline"
      >
        ← Mağazaya dön
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        {/* GÖRSELLER – İKON BOYUTU */}
        <div className="flex flex-wrap gap-3">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative h-24 w-24 overflow-hidden rounded-xl border bg-zinc-50"
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

        {/* BİLGİLER */}
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

          {benefits.length > 0 && (
            <ul className="list-disc pl-5 text-sm text-zinc-600">
              {benefits.map((b: string, i: number) => (
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
