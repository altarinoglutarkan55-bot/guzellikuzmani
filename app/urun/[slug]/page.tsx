import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import products from "../../../data/products.json";

type ProductImage = { src: string; alt?: string };
type Product = {
  slug: string;
  title: string;
  brand?: string;
  price: number;
  compareAtPrice?: number;
  shortDescription?: string;
  images?: ProductImage[];
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = (products as Product[]).find((p) => p.slug === slug);
  if (!product) notFound();

  const images =
    product.images && product.images.length > 0
      ? product.images.map((img, i) => ({
          src: img.src,
          alt: img.alt ?? `${product.title} ${i + 1}`,
        }))
      : [{ src: "/demo/urun-1.jpg", alt: product.title }];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/magaza" className="mb-6 inline-block text-sm text-zinc-600 hover:underline">
        ← Mağazaya dön
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        {/* ICON SIZE IMAGE STRIP (görünür garantili) */}
        <div className="flex flex-wrap gap-3">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative h-24 w-24 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="96px"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {/* INFO */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-zinc-900">{product.title}</h1>

          {product.brand ? <p className="text-sm text-zinc-500">{product.brand}</p> : null}

          <div className="flex items-center gap-3">
            <p className="text-xl font-bold text-zinc-900">{product.price} ₺</p>
            {product.compareAtPrice ? (
              <p className="text-sm line-through text-zinc-400">{product.compareAtPrice} ₺</p>
            ) : null}
          </div>

          {product.shortDescription ? (
            <p className="text-sm leading-6 text-zinc-600">{product.shortDescription}</p>
          ) : null}

          <div className="flex gap-3 pt-4">
            <button className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:opacity-95">
              Sepete Ekle
            </button>

            <Link
              href="/anket"
              className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 hover:border-zinc-300"
            >
              Uzman Önerisi Al
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
