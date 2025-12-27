import Link from "next/link";
import productsJson from "@/data/products.json";
import TrackEventLink from "@/app/_components/TrackEventLink";

type Props = {
  slug: string;
};

type Product = {
  slug: string;
  title?: string;
  name?: string;
  price?: number;
  image?: string;
  images?: string[];
  badge?: string;
};

const products = productsJson as unknown as Product[];

function findProduct(slug: string) {
  const s = String(slug || "").toLowerCase().trim();
  return (products || []).find((p) => String(p.slug || "").toLowerCase() === s) || null;
}

export default function ProductMiniCard({ slug }: Props) {
  const p = findProduct(slug);
  const s = p?.slug || slug;

  if (!p) {
    return (
      <div className="rounded-[24px] border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="text-sm font-extrabold text-zinc-900">Ürün bulunamadı</div>
        <div className="mt-1 text-sm text-zinc-600">Slug: {slug}</div>
        <Link
          href="/magaza"
          className="mt-3 inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-extrabold text-zinc-900 hover:border-zinc-300"
        >
          Mağazaya git
        </Link>
      </div>
    );
  }

  const title = p.title || p.name || "Ürün";
  const price = p.price;
  const image = p.image || p.images?.[0] || "";

  return (
    <div className="rounded-[24px] border border-zinc-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/urun/${s}`} className="block">
        <div className="flex gap-3">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt={title} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-extrabold text-zinc-900">{title}</div>
            {typeof price === "number" ? (
              <div className="mt-1 text-sm font-extrabold text-[#7C3AED]">
                {price.toLocaleString("tr-TR")} ₺
              </div>
            ) : (
              <div className="mt-1 text-sm font-bold text-zinc-500">Fiyat bilgisi</div>
            )}
            {p.badge ? (
              <div className="mt-2 inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-700">
                {p.badge}
              </div>
            ) : null}
          </div>
        </div>
      </Link>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <TrackEventLink
          href={`/urun/${s}`}
          eventName="blog_product_click"
          payload={{ action: "view_product", productSlug: s }}
          className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-extrabold text-zinc-900 hover:border-zinc-300"
        >
          Ürüne git
        </TrackEventLink>

        <TrackEventLink
          href="/magaza"
          eventName="blog_product_click"
          payload={{ action: "view_shop", productSlug: s }}
          className="inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-extrabold text-white hover:opacity-95"
        >
          Mağazadan al
        </TrackEventLink>
      </div>
    </div>
  );
}
