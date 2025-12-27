import Link from "next/link";
import Image from "next/image";
import products from "@/data/products.json";

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

export default function ProductMiniCard({ slug }: { slug: string }) {
  const s = normalizeSlug(slug);
  const p = (products as Product[]).find((x) => normalizeSlug(x.slug) === s);
  if (!p) return null;

  const title = getTitle(p);
  const img = firstImage(p);
  const price = Number(p.price ?? 0);

  return (
    <Link
      href={`/urun/${s}`}
      className="group flex items-center gap-3 rounded-3xl border border-zinc-200 bg-white p-3 shadow-sm hover:shadow-md"
    >
      <div className="flex h-14 w-14 flex-none items-center justify-center overflow-hidden rounded-2xl bg-zinc-50 ring-1 ring-zinc-200">
        <Image src={img} alt={title} width={56} height={56} className="object-contain" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm font-extrabold text-zinc-900 group-hover:text-[#7C3AED]">
          {title}
        </p>
        <p className="mt-1 text-sm font-extrabold text-zinc-900">{formatTRY(price)}</p>
      </div>
      <span className="text-xs font-bold text-zinc-500">Ürüne git →</span>
    </Link>
  );
}
