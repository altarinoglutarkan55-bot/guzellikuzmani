import { notFound } from "next/navigation";
import products from "@/data/products.json";
import Gallery from "./_components/Gallery";

type Product = {
  slug: string;
  title: string;
  brand?: string;
  price: number;
  compareAtPrice?: number;
  shortDescription?: string;
  benefits?: string[];
  usage?: string;
  ingredientsNote?: string;
  images: { src: string; alt?: string }[];
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

export default function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = normalizeSlug(params.slug);

  const product = (products as Product[]).find(
    (p) => normalizeSlug(p.slug) === slug
  );

  if (!product) {
    notFound();
  }

  const images = product.images.map((img) => ({
    src: img.src,
    alt: img.alt ?? product.title,
  }));

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 md:grid-cols-2">
        {/* GALERİ */}
        <Gallery images={images} />

        {/* BİLGİ */}
        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>

          {product.brand && (
            <p className="mt-1 text-sm text-neutral-500">
              {product.brand}
            </p>
          )}

          <div className="mt-4 flex items-center gap-3">
            <p className="text-2xl font-semibold text-black">
              {product.price} ₺
            </p>

            {product.compareAtPrice ? (
              <p className="text-sm line-through text-neutral-400">
                {product.compareAtPrice} ₺
              </p>
            ) : null}
          </div>

          {product.shortDescription && (
            <p className="mt-4 text-neutral-700">
              {product.shortDescription}
            </p>
          )}

          {product.benefits?.length ? (
            <ul className="mt-6 list-disc space-y-2 pl-5 text-sm text-neutral-700">
              {product.benefits.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          ) : null}

          {product.usage && (
            <div className="mt-6">
              <h3 className="font-semibold">Kullanım</h3>
              <p className="mt-1 text-sm text-neutral-700">
                {product.usage}
              </p>
            </div>
          )}

          {product.ingredientsNote && (
            <div className="mt-4">
              <h3 className="font-semibold">İçerik</h3>
              <p className="mt-1 text-sm text-neutral-700">
                {product.ingredientsNote}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
