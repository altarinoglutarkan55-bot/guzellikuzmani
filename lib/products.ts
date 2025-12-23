import productsData from "@/data/products.json";

export type ProductImage = { src: string; alt?: string };

export type Product = {
  slug: string;
  title?: string;
  name?: string;
  brand?: string;
  price: number;
  compareAtPrice?: number | null;
  images?: Array<ProductImage> | string[];
  category?: string;
  kat?: string;
  tags?: string[];
  id?: string | number;
  handle?: string;
  productSlug?: string;
};

function normalize(s: any) {
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

function normalizeImages(p: Product): ProductImage[] {
  const imgs: any = p.images ?? [];
  if (!Array.isArray(imgs) || imgs.length === 0) {
    return [{ src: "/demo/urun-1.jpg", alt: getTitle(p) }];
  }

  return imgs
    .map((it: any) => {
      if (!it) return null;
      if (typeof it === "string") return { src: it, alt: getTitle(p) };
      return { src: it.src ?? "/demo/urun-1.jpg", alt: it.alt ?? getTitle(p) };
    })
    .filter(Boolean) as ProductImage[];
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

let _cache: Product[] | null = null;

export function getAllProducts(): Product[] {
  if (_cache) return _cache;
  _cache = enrichProducts(productsData as any[]);
  return _cache;
}

export function getProduct(slug: string): (Product & { images: ProductImage[]; title: string }) | null {
  const s = normalize(decodeURIComponent(slug || ""));
  const all = getAllProducts();

  const found =
    all.find((p) => normalize(p.slug) === s) ||
    // ekstra güvenlik: bazı eski verilerde slug boş olabilir
    all.find((p) => slugify(getTitle(p)) === s);

  if (!found) return null;

  return {
    ...found,
    title: getTitle(found),
    images: normalizeImages(found),
  };
}
