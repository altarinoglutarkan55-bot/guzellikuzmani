import Link from "next/link";
import Image from "next/image";
import products from "@/data/products.json";


import BlogForumShowcase from "./_components/BlogForumShowcase";
type ProductImage = { src: string; alt?: string };
type Product = {
  slug?: string;
  title?: string;
  name?: string;
  brand?: string;
  price?: number;
  compareAtPrice?: number | null;
  category?: string;
  images?: Array<string | ProductImage>;
  image?: string;
};

function normalizeSlug(input: unknown) {
  return String(input ?? "").toLowerCase().trim();
}

function getTitle(p: Product) {
  return String(p.title ?? p.name ?? "Ürün");
}

function firstImage(p: any) {
  const imgs = p?.images;
  if (Array.isArray(imgs) && imgs.length > 0) {
    const first = imgs[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object" && first.src) return String(first.src);
  }
  if (typeof p?.image === "string") return p.image;
  return "/demo/urun-1.jpg";
}

function formatTRY(n: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(n);
}

export const revalidate = 60;

export default function HomePage() {
  const list = (products as Product[])
    .map((p) => ({
      slug: normalizeSlug(p.slug),
      title: getTitle(p),
      brand: p.brand ? String(p.brand) : "",
      price: Number(p.price ?? 0),
      compareAtPrice:
        typeof p.compareAtPrice === "number" ? Number(p.compareAtPrice) : null,
      category: String(p.category ?? ""),
      image: firstImage(p),
    }))
    .filter((p) => Boolean(p.slug));

  const categories = Array.from(
    new Set(list.map((p) => p.category).filter(Boolean))
  ).slice(0, 8);

  const bestsellers = list.slice(0, 8);

  return (
    <main className="mx-auto max-w-screen-xl px-4 py-6">
      {/* ÜST KAMPANYA BANDI */}
      <div className="mb-4 rounded-3xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p>
            🎁 <span className="font-semibold">Yeni yıl kampanyası (demo)</span>:
            750₺ üzeri kargo ücretsiz • Sepette ekstra fırsatlar
          </p>
          <Link
            href="/magaza"
            className="rounded-2xl bg-zinc-900 px-4 py-2 text-xs font-extrabold text-white hover:opacity-95"
          >
            Mağazaya git
          </Link>
        </div>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm">
        <div className="grid gap-6 p-6 md:grid-cols-2 md:p-10">
          <div>
            <p className="inline-flex items-center rounded-full bg-[#7C3AED]/10 px-3 py-1 text-xs font-bold text-[#7C3AED]">
              Uzman önerisi + hızlı alışveriş
            </p>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 md:text-4xl">
              Saç & cilt rutinin için doğru ürünleri bul.
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-600">
              guzellikuzmani ile ürünleri keşfet, hızlıca sepete ekle, istersen
              anketle uzman önerisi al. (Şu an demo altyapı)
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/magaza"
                className="rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-extrabold text-white hover:opacity-95"
              >
                Alışverişe başla
              </Link>
              <Link
                href="/anket"
                className="rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-extrabold text-zinc-900 hover:border-zinc-300"
              >
                Uzman önerisi al
              </Link>
              <Link
                href="/odeme"
                className="rounded-2xl bg-[#DB2777] px-5 py-3 text-sm font-extrabold text-white hover:opacity-95"
              >
                Ödeme (demo)
              </Link>
            </div>

            {/* TRUST */}
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                <p className="text-xs font-semibold text-zinc-500">Kargo</p>
                <p className="text-sm font-extrabold text-zinc-900">Hızlı teslimat</p>
              </div>
              <div className="rounded-3xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                <p className="text-xs font-semibold text-zinc-500">İade</p>
                <p className="text-sm font-extrabold text-zinc-900">Kolay iade</p>
              </div>
              <div className="rounded-3xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                <p className="text-xs font-semibold text-zinc-500">Destek</p>
                <p className="text-sm font-extrabold text-zinc-900">Canlı destek</p>
              </div>
            </div>
          </div>

          {/* Görsel alan */}
          <div className="relative">
            <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-[#7C3AED]/10 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-[#DB2777]/10 blur-2xl" />

            <div className="relative rounded-[28px] border border-zinc-200 bg-zinc-50 p-6">
              <p className="text-xs font-bold text-zinc-500">Öne çıkan</p>
              <p className="mt-2 text-lg font-extrabold text-zinc-900">
                Mor Şampuan • Keratin • Saç Bakım Setleri
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {bestsellers.slice(0, 4).map((p) => (
                  <Link
                    key={p.slug}
                    href={`/urun/${p.slug}`}
                    className="group rounded-3xl border border-zinc-200 bg-white p-3 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-zinc-50 ring-1 ring-zinc-200">
                        <Image
                          src={p.image}
                          alt={p.title}
                          width={56}
                          height={56}
                          className="object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-xs font-bold text-zinc-900 group-hover:text-[#7C3AED]">
                          {p.title}
                        </p>
                        <p className="mt-1 text-xs font-extrabold text-zinc-900">
                          {formatTRY(p.price)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-5">
                <Link
                  href="/magaza"
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-extrabold text-white hover:opacity-95"
                >
                  Tüm ürünleri gör
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KATEGORİLER */}
      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-zinc-900">Kategoriler</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Ürünleri kategoriye göre keşfet.
            </p>
          </div>
          <Link
            href="/magaza"
            className="text-sm font-bold text-[#7C3AED] hover:opacity-80"
          >
            Hepsini gör →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((kat) => (
            <Link
              key={kat}
              href={`/magaza?kat=${encodeURIComponent(kat)}`}
              className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md"
            >
              <p className="text-xs font-bold text-zinc-500">Kategori</p>
              <p className="mt-2 text-base font-extrabold text-zinc-900">
                {kat.replaceAll("-", " ")}
              </p>
              <p className="mt-2 text-sm text-zinc-600">
                Ürünleri görüntüle →
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ÇOK SATANLAR */}
      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-zinc-900">Çok Satanlar</h2>
            <p className="mt-1 text-sm text-zinc-600">
              En çok incelenen ürünler (demo sıralama).
            </p>
          </div>
          <Link
            href="/magaza"
            className="text-sm font-bold text-[#7C3AED] hover:opacity-80"
          >
            Mağazaya git →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {bestsellers.map((p) => {
            const hasCompare =
              typeof p.compareAtPrice === "number" && p.compareAtPrice > p.price;
            const pct = hasCompare
              ? Math.round(((p.compareAtPrice! - p.price) / p.compareAtPrice!) * 100)
              : 0;

            return (
              <Link
                key={p.slug}
                href={`/urun/${p.slug}`}
                className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-20 w-20 flex-none items-center justify-center overflow-hidden rounded-2xl bg-zinc-50 ring-1 ring-zinc-200">
                    <Image
                      src={p.image}
                      alt={p.title}
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-extrabold text-zinc-900">
                      {p.title}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {p.category.replaceAll("-", " ")}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-extrabold text-zinc-900">
                        {formatTRY(p.price)}
                      </span>
                      {hasCompare ? (
                        <>
                          <span className="text-xs font-bold text-zinc-500 line-through">
                            {formatTRY(p.compareAtPrice!)}
                          </span>
                          <span className="rounded-full bg-[#DB2777]/10 px-2 py-0.5 text-xs font-extrabold text-[#DB2777]">
                            %{pct} indirim
                          </span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

            <BlogForumShowcase />

      {/* ALT CTA */}
      <section className="mt-10 rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm md:p-10">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h3 className="text-xl font-extrabold text-zinc-900">
              Kararsız mısın? 2 dakikada öneri al.
            </h3>
            <p className="mt-1 text-sm text-zinc-600">
              Anketi doldur, saç/saç derisi ihtiyacına göre öneri sunalım.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/anket"
              className="rounded-2xl bg-[#7C3AED] px-5 py-3 text-sm font-extrabold text-white hover:opacity-95"
            >
              Anketi başlat
            </Link>
            <Link
              href="/magaza"
              className="rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-extrabold text-zinc-900 hover:border-zinc-300"
            >
              Mağazaya git
            </Link>
          </div>
        </div>
      </section>

      <div className="h-6" />
    </main>
  );
}

