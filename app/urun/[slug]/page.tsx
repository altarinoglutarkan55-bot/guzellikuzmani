import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import products from "../../../data/products.json";

/* ---------------- TYPES ---------------- */
type ProductImage = {
  src: string;
  alt?: string;
};

type Product = {
  slug: string;
  title: string;
  brand?: string;
  price: number;
  compareAtPrice?: number;
  shortDescription?: string;
  images?: ProductImage[];
};

/* ---------------- PAGE ---------------- */
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = (products as Product[]).find(
    (p) => p.slug === slug
  );

  if (!product) {
    notFound();
  }

  const images =
    product.images && product.images.length > 0
      ? product.images.map((img, i) => ({
          src: img.src,
          alt: img.alt ?? `${product.title} ${i + 1}`,
        }))
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
        {/* ICON SIZE IMAGES */}
        <div className="flex flex-wrap gap-3">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative h-20 w-20 overflow-hidden rounded-lg border bg-zinc-50"
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

        {/* INFO */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{product.title}</h1>

          {product.brand && (
            <p className="text-sm text-zinc-500">{product.brand}</p>
          )}

          <div className="flex items-center gap-3">
            <p className="text-xl font-bold">{product.price} ₺</p>
            {product.compareAtPrice && (
              <p className="text-sm line-through text-zinc-400">
                {product.compareAtPrice} ₺
              </p>
            )}
          </div>

          {product.shortDescription && (
            <p className="text-sm text-zinc-600">
              {product.shortDescription}
            </p>
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
