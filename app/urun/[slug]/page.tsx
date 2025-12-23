import Image from "next/image";
import Link from "next/link";
import products from "@/data/products.json";

type ProductImage = { src: string; alt?: string };

type Product = {
  slug?: string;
  title?: string;
  name?: string;
  brand?: string;
  price?: number;
  compareAtPrice?: number | null;
  shortDescription?: string;
  benefits?: string[];
  usage?: string;
  images?: Array<string | ProductImage>;
};

type Img = { src: string; alt: string };

function normalizeSlug(input: unknown) {
  return String(input ?? "")
    .toLowerCase()
    .trim()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function slugifyTitle(p: Product) {
  const t = p.title ?? p.name ?? "";
  return normalizeSlug(t);
}

function getTitle(p: Product) {
  return String(p.title ?? p.name ?? "Ürün");
}

function getImages(p: Product): Img[] {
  const title = getTitle(p);
  const imgs = p.images;

  if (Array.isArray(imgs) && imgs.length > 0) {
    return imgs.map((img, i) => {
      if (typeof img === "string") {
        return { src: img, alt: `${title} ${i + 1}` };
      }
      return { src: img.src, alt: img.alt ?? `${title} ${i + 1}` };
    });
  }

  return [{ src: "/demo/urun-1.jpg", alt: title }];
}

export default async function ProductPage({
  params,
}: {
  // Next 16 uyumu için Promise yaptık (bazı projelerde params Promise geliyor)
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = (await (params as any)) as { slug: string };
  const reqSlug = normalizeSlug(resolvedParams.slug);

  const list = products as Product[];

  // 1) Önce gerçek slug alanından normalize eşleşme
  let product =
    list.find((p) => normalizeSlug(p.slug) === reqSlug) ??
    // 2) slug yok/uyuşmuyor ise title’dan üretilen slug ile eşleşme
    list.find((p) => slugifyTitle(p) === reqSlug) ??
    null;

  // Ürün yoksa: NOTFOUND yapma -> /404'e düşmesin, 500 tetiklemesin
  if (!product) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-2xl font-bold text-zinc-900">Ürün bulunamadı</h1>
        <p className="mt-2 text-zinc-600">
          Bu ürün linki hatalı olabilir ya da ürün henüz eklenmemiş olabilir.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/magaza"
            className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Mağazaya git
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-900"
          >
            Ana sayfa
          </Link>
        </div>
        <p className="mt-6 text-xs text-zinc-500">
          İstenen slug: <span className="font-mono">{resolvedParams.slug}</span>
        </p>
      </main>
    );
  }

  const title = getTitle(product);
  const brand = String(product.brand ?? "");
  const price = Number(product.price ?? 0);
  const compareAtPrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const shortDescription = String(product.shortDescription ?? "");
  const benefits: string[] = Array.isArray(product.benefits) ? product.benefits.map(String) : [];
  const images = getImages(product);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/magaza" className="mb-6 inline-block text-sm text-zinc-600 hover:underline">
        ← Mağazaya dön
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        {/* İKON BOYUT GÖRSELLER */}
        <div className="flex flex-wrap gap-3">
          {images.map((img, i) => (
            <div
              key={`${img.src}-${i}`}
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

        {/* BİLGİ */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-zinc-900">{title}</h1>

          {brand ? <p className="text-sm text-zinc-500">{brand}</p> : null}

          <div className="flex items-center gap-3">
            <span className="text-2xl font-semibold text-zinc-900">₺{price}</span>
            {compareAtPrice ? (
              <span className="text-sm text-zinc-400 line-through">₺{compareAtPrice}</span>
            ) : null}
          </div>

          {shortDescription ? <p className="text-sm leading-6 text-zinc-600">{shortDescription}</p> : null}

          {benefits.length > 0 ? (
            <ul className="list-disc pl-5 text-sm text-zinc-600">
              {benefits.map((b: string, i: number) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          ) : null}

          <div className="flex gap-3 pt-4">
            <button className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:opacity-95">
              Sepete Ekle
            </button>

            <Link href="/anket" className="rounded-xl border border-zinc-200 px-6 py-3 text-sm font-semibold">
              Uzman Önerisi Al
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
