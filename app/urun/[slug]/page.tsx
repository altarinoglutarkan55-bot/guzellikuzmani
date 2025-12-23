export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import products from "../../../data/products.json";

type Img = { src: string; alt: string };

type Product = {
  slug: string;
  title: string;
  brand?: string;
  price: number;
  compareAtPrice?: number;
  shortDescription?: string;
  images: Img[];
  benefits?: string[];
  usage?: string;
};

function normalizeSlug(s: string) {
  return s
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
}

function getProduct(slug: string): Product | null {
  const found = (products as any[]).find(
    (p) => normalizeSlug(p.slug) === normalizeSlug(slug)
  );
  if (!found) return null;

  return {
    slug: found.slug,
    title: found.title,
    brand: found.brand,
    price: found.price,
    compareAtPrice: found.compareAtPrice,
    shortDescription: found.shortDescription,
    images: (found.images ?? []).map((i: any) => ({
      src: typeof i === "string" ? i : i.src,
      alt: i.alt ?? found.title,
    })),
    benefits: found.benefits ?? [],
    usage: found.usage ?? "",
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  const images = product.images.length
    ? product.images
    : [{ src: "/demo/urun-1.jpg", alt: product.title }];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link
        href="/magaza"
        className="mb-6 inline-block text-sm text-zinc-600 hover:underline"
      >
        ← Mağazaya dön
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        {/* === GALERİ – İKON BOYUTU === */}
        <div className="flex flex-col items-center gap-3">
          {/* ANA GÖRSEL */}
          <div className="relative h-48 w-48 rounded-2xl bg-zinc-50 ring-1 ring-zinc-200">
            <Image
              src={images[0].src}
              alt={images[0].alt}
              fill
              className="object-contain p-4"
              priority
            />
          </div>

          {/* ALT İKONLAR */}
          <div className="flex gap-2">
            {images.slice(1).map((img, i) => (
              <div
                key={i}
                className="relative h-16 w-16 rounded-xl bg-zinc-50 ring-1 ring-zinc-200"
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

        {/* === ÜRÜN BİLGİ === */}
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase text-zinc-500">
              {product.brand}
            </p>
            <h1 className="mt-2 text-2xl font-bold text-zinc-900">
              {product.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-zinc-900">
              ₺{product.price}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-zinc-500 line-through">
                ₺{product.compareAtPrice}
              </span>
            )}
          </div>

          {product.shortDescription && (
            <p className="text-sm text-zinc-600">
              {product.shortDescription}
            </p>
          )}

          {product.benefits && product.benefits.length > 0 && (
            <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-600">
              {product.benefits.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}

          {product.usage && (
            <p className="text-sm text-zinc-600">
              <strong>Kullanım:</strong> {product.usage}
            </p>
          )}

          <div className="grid gap-2 pt-4">
            <button className="w-full rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white">
              Sepete Ekle
            </button>
            <Link
              href="/anket"
              className="w-full rounded-2xl border border-zinc-300 px-4 py-3 text-center text-sm font-semibold text-zinc-900"
            >
              Uzman önerisi al
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
