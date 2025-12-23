export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import Gallery from "./_components/Gallery";
import { getProduct } from "@/lib/products";

function formatTRY(n: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(n);
}

function discountPercent(price: number, compareAt?: number | null) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  const pct = discountPercent(product.price, product.compareAtPrice ?? null);

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-zinc-500">
          <Link href="/" className="hover:text-zinc-800">Ana sayfa</Link>
          <span className="mx-2">/</span>
          <Link href="/magaza" className="hover:text-zinc-800">Mağaza</Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-800">{product.title}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Gallery */}
          <section className="rounded-3xl border border-zinc-200 bg-white p-4">
            <Gallery
  images={product.images.map((img) => ({
    src: img.src,
    alt: img.alt ?? product.title,
  }))}
/>

          </section>

          {/* Info */}
          <section className="space-y-5">
            <div>
              <p className="text-xs font-semibold tracking-wide text-zinc-500">
                {(product.category ?? "").replaceAll("-", " ").toUpperCase()}
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
                {product.title}
              </h1>

              {product.brand ? (
                <p className="mt-2 text-sm text-zinc-600">
                  Marka: <span className="font-semibold text-zinc-900">{product.brand}</span>
                </p>
              ) : null}
            </div>

            {/* Price */}
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
              <div className="flex items-end gap-3">
                <p className="text-2xl font-extrabold text-zinc-900">{formatTRY(product.price)}</p>

                {product.compareAtPrice && product.compareAtPrice > product.price ? (
                  <>
                    <p className="text-sm font-semibold text-zinc-500 line-through">
                      {formatTRY(product.compareAtPrice)}
                    </p>
                    <span className="rounded-full bg-[#DB2777]/10 px-2 py-1 text-xs font-bold text-[#DB2777]">
                      %{pct} indirim
                    </span>
                  </>
                ) : null}
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <Link
                  href="/anket"
                  className="inline-flex items-center justify-center rounded-2xl bg-[#7C3AED] px-4 py-3 text-sm font-semibold text-white hover:opacity-95"
                >
                  Uzman önerisi al
                </Link>

                <Link
                  href="/magaza"
                  className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 hover:border-zinc-300"
                >
                  Mağazaya dön
                </Link>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-zinc-600">
                <div className="rounded-2xl bg-white p-3 ring-1 ring-zinc-200">Güvenli ödeme</div>
                <div className="rounded-2xl bg-white p-3 ring-1 ring-zinc-200">Kolay iade</div>
                <div className="rounded-2xl bg-white p-3 ring-1 ring-zinc-200">Hızlı destek</div>
              </div>
            </div>

            {/* Tags */}
            {product.tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : null}

            {/* Description */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-5">
              <h2 className="text-sm font-semibold text-zinc-900">Ürün açıklaması</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                {(product as any).shortDescription ??
                  (product as any).short ??
                  "Bu ürün için açıklama eklenecek. (Demo)"}
              </p>

              {(product as any).benefits?.length ? (
                <>
                  <h3 className="mt-4 text-sm font-semibold text-zinc-900">Faydalar</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-600">
                    {(product as any).benefits.map((b: string) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </>
              ) : null}

              {(product as any).usage ? (
                <>
                  <h3 className="mt-4 text-sm font-semibold text-zinc-900">Kullanım</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{(product as any).usage}</p>
                </>
              ) : null}
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
              <p className="text-sm font-semibold text-zinc-900">Yardım</p>
              <p className="mt-1 text-sm text-zinc-600">
                İade/Değişim koşulları için{" "}
                <Link href="/yardim/iade" className="font-semibold text-[#7C3AED] hover:underline">
                  Detayları gör
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
