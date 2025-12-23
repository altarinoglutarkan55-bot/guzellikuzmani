// app/magaza/page.tsx
import MagazaClient from "./_components/MagazaClient";
import { getAllProducts } from "../../lib/products";

type Product = {
  slug: string;
  title: string;
  brand?: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
  category: string;
  _tags?: string[];
};

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

function toNum(v: string) {
  const n = Number(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export const revalidate = 60;

export default async function MagazaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const q = String(Array.isArray(sp.q) ? sp.q[0] : sp.q ?? "");
  const kat = String(Array.isArray(sp.kat) ? sp.kat[0] : sp.kat ?? "");
  const sort = String(Array.isArray(sp.sort) ? sp.sort[0] : sp.sort ?? "pop");
  const min = String(Array.isArray(sp.min) ? sp.min[0] : sp.min ?? "");
  const max = String(Array.isArray(sp.max) ? sp.max[0] : sp.max ?? "");
  const cRaw = sp.c;
  const c = Array.isArray(cRaw) ? cRaw.map(String) : cRaw ? [String(cRaw)] : [];

  const all = getAllProducts();
  const totalAll = all.length;

  const mapped: Product[] = all
    .map((p: any) => ({
      slug: String(p?.slug ?? ""),
      title: String(p?.title ?? p?.name ?? "Ürün"),
      brand: p?.brand ? String(p.brand) : undefined,
      price: Number(p?.price ?? 0),
      compareAtPrice:
        p?.compareAtPrice === null || typeof p?.compareAtPrice === "undefined"
          ? null
          : Number(p.compareAtPrice),
      image: firstImage(p),
      category: String(p?.category ?? ""),
      _tags: Array.isArray(p?.tags) ? p.tags.map(String) : [],
    }))
    .filter((p: any) => Boolean(p.slug));

  const qLower = q.trim().toLowerCase();
  const minN = min ? toNum(min) : null;
  const maxN = max ? toNum(max) : null;

  let list = mapped.filter((p: any) => {
    if (kat && p.category !== kat) return false;

    if (qLower) {
      const inTitle = p.title.toLowerCase().includes(qLower);
      const inBrand = (p.brand ?? "").toLowerCase().includes(qLower);
      const inTags = (p._tags as string[]).some((t) => t.toLowerCase().includes(qLower));
      if (!inTitle && !inBrand && !inTags) return false;
    }

    if (minN !== null && p.price < minN) return false;
    if (maxN !== null && p.price > maxN) return false;

    if (c.length) {
      const tags = p._tags as string[];
      const hasAny = c.some((tag) => tags.includes(tag));
      if (!hasAny) return false;
    }

    return true;
  });

  const s = sort.toLowerCase();
  if (s === "priceasc" || s === "asc" || s === "ucuz") {
    list = [...list].sort((a: any, b: any) => a.price - b.price);
  } else if (s === "pricedesc" || s === "desc" || s === "pahali") {
    list = [...list].sort((a: any, b: any) => b.price - a.price);
  }

  const initial = { q, kat, sort, min, max, totalAll };

  return (
    <main className="mx-auto max-w-screen-xl px-4 py-6">
      <MagazaClient products={list as any} initial={initial as any} />
    </main>
  );
}
