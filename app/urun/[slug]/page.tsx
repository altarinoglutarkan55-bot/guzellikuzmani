import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import productsJson from "../../../data/products.json";

type RawProd = {
  slug?: string;
  title?: string;
  brand?: string;
  price?: number;
  compareAtPrice?: number;
  shortDescription?: string;
  description?: string;
  usage?: string;
  benefits?: string[];
  images?: Array<string | { src?: string; alt?: string }>;
};

type Product = {
  slug: string;
  title: string;
  brand: string;
  price: number;
  compareAtPrice: number | null;
  shortDescription: string;
  usage: string;
  benefits: string[];
  images: { src: string; alt: string }[];
};

function normalizeSlug(input: unknown) {
  const s = String(input ?? "").toLowerCase().trim();
  return s
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeProduct(raw: RawProd): Product {
  const title = String(raw.title ?? "Ürün Adı");

  const images: { src: string; alt: string }[] =
    Array.isArray(raw.images) && raw.images.length > 0
      ? raw.images.map((img, idx) => {
          if (typeof img === "string") {
            return { src: img, alt: `${title} ${idx + 1}` };
          }
          return {
            src: String(img.src ?? ""),
            alt: String(img.alt ?? title),
          };
        })
      : [{ src: "/demo/urun-1.jpg", alt: title }];

  return {
    slug: normalizeSlug(raw.slug ?? title),
    title,
    brand: String(raw.brand ?? ""),
    price: Number(raw.price ?? 0),
    compareAtPrice: raw.compareAtPrice ?? null,
    shortDescription: String(raw.shortDescription ?? ""),
    usage: String(raw.usage ?? ""),
    benefits: Array.isArray(raw.benefits)
      ? raw.benefits.map((b) => String(b))
      : [],
    images,
  };
}

export default function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const allProducts = (productsJson as RawProd[]).map(normalizeProduct);
  const slug = normalizeSlug(params.slug);

  const product = allProducts.find((p) => p.slug === slug);
  if (!product) notFound();

  const { title, brand, price, compareAtPrice, shortDescription, usage, benefits, images } = product;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link
        href="/magaza"
        className="mb-6 inline-block text-sm text-zinc-600 hover:underline"
      >
        ← Mağazaya dön
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Ürün Görselleri (ikon boyutu) */}
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

        {/* Ürün Bilgi */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-zinc-900">{title}</h1>

          {brand && <p className="text-sm text-zinc-500">{brand}</p>}

          <div className="flex items-center gap-3">
            <p className="text-xl font-bold text-zinc-900">{price} ₺</p>
            {compareAtPrice ? (
              <p className="text-sm line-through text-zinc-400">
                {compareAtPrice} ₺
              </p>
            ) : null}
          </div>

          {shortDescription && (
            <p className="text-sm text-zinc-600">{shortDescription}</p>
          )}

          {usage && (
            <p className="text-sm text-zinc-600">
              <strong>Kullanım:</strong> {usage}
            </p>
          )}

          {benefits.length > 0 && (
            <ul className="list-disc pl-5 text-sm text-zinc-600">
              {benefits.map((b, idx) => (
                <li key={idx}>{b}</li>
              ))}
            </ul>
          )}

          <div className="flex gap-3 pt-4">
            <button className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white">
              Sepete Ekle
            </button>

            <Link
              href="/anket"
              className="rounded-xl border px-5 py-3 text-sm font-semibold text-zinc-900"
            >
              Uzman Önerisi Al
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
