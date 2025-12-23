import MagazaClient from "./_components/MagazaClient";
import productsData from "../../data/products.json";

type SP = Record<string, string | string[] | undefined>;

type Product = {
  slug: string;
  title?: string;
  name?: string;
  brand?: string;
  price: number;
  compareAtPrice?: number | null;
  images?: Array<{ src: string; alt?: string }> | string[];
  category?: string;
  kat?: string;
  tags?: string[];
  id?: string | number;
  handle?: string;
  productSlug?: string;
};

function toStr(v: string | string[] | undefined) {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

function normalize(s: string) {
  return (s ?? "").toString().toLowerCase().trim();
}

function slugify(input: string) {
  const s = normalize(input)
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return s || "urun";
}

function getTitle(p: Product) {
  return p.title ?? p.name ?? "Ürün";
}

function getCategoryKey(p: Product) {
  return normalize(p.category ?? p.kat ?? "");
}

function getTagsText(p: Product) {
  return normalize((p.tags ?? []).join(" "));
}

function getBrand(p: Product) {
  return p.brand ?? "";
}

function imgSrc(p: Product) {
  const imgs = p.images ?? [];
  if (Array.isArray(imgs)) {
    const first = imgs[0] as any;
    if (!first) return "/demo/urun-1.jpg";
    if (typeof first === "string") return first;
    return first.src ?? "/demo/urun-1.jpg";
  }
  return "/demo/urun-1.jpg";
}

function enrichProducts(raw: any[]): Product[] {
  return (raw ?? []).map((p) => {
    const title = (p.title ?? p.name ?? "").toString();
    const slug =
      (p.slug ?? p.productSlug ?? p.handle ?? p.id ?? "").toString().trim() ||
      slugify(title);

    return {
      slug,
      title: p.title ?? p.name,
      name: p.name,
      brand: p.brand,
      price: Number(p.price ?? 0),
      compareAtPrice: p.compareAtPrice ?? p.compare_at_price ?? null,
      images: p.images,
      category: p.category,
      kat: p.kat,
      tags: Array.isArray(p.tags) ? p.tags : [],
      id: p.id,
      handle: p.handle,
      productSlug: p.productSlug,
    };
  });
}

function sortProducts(list: Product[], sort: string) {
  const s = sort || "pop";
  const copy = [...list];

  if (s === "price-asc") copy.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  if (s === "price-desc") copy.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));

  return copy;
}

export default async function MagazaPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;

  const q = toStr(sp.q);
  const kat = toStr(sp.kat);
  const sort = toStr(sp.sort) || "pop";
  const min = Number(toStr(sp.min) || "0") || 0;
  const max = Number(toStr(sp.max) || "0") || 0;

  const all = enrichProducts(productsData as any[]); // ARTIK slug üretildiği için eleme yok

  const qn = normalize(q);
  const katn = normalize(kat);

  let filtered = all;

  if (qn) {
    filtered = filtered.filter((p) => {
      const hay = normalize(`${getTitle(p)} ${getBrand(p)} ${getTagsText(p)}`);
      return hay.includes(qn);
    });
  }

  if (katn) {
    filtered = filtered.filter((p) => getCategoryKey(p) === katn);
  }

  if (min > 0) filtered = filtered.filter((p) => (p.price ?? 0) >= min);
  if (max > 0) filtered = filtered.filter((p) => (p.price ?? 0) <= max);

  filtered = sortProducts(filtered, sort);

  return (
    <MagazaClient
      products={filtered.map((p) => ({
        ...p,
        title: getTitle(p),
        brand: getBrand(p),
        image: imgSrc(p),
        category: getCategoryKey(p),
      }))}
      initial={{
        q,
        kat,
        sort,
        min: min ? String(min) : "",
        max: max ? String(max) : "",
        totalAll: all.length,
      }}
    />
  );
}
