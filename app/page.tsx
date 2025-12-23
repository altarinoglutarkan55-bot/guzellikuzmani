import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import AddToCartHome from "@/app/_components/AddToCartHome";

function formatTRY(n: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(n);
}

const collections = [
  {
    title: "Saç Bakımı",
    desc: "Şampuan, maske, serum",
    href: "/magaza?kat=sac",
    img: "/demo/urun-1.jpg",
  },
  {
    title: "Saç Derisi",
    desc: "Tonik, arındırma, denge",
    href: "/magaza?kat=sac-derisi",
    img: "/demo/urun-4.jpg",
  },
  {
    title: "Cilt",
    desc: "Temizleme, nem, SPF",
    href: "/magaza?kat=cilt",
    img: "/demo/urun-2.jpg",
  },
];

export default function HomePage() {
  const products = getAllProducts();

  // Basit bestseller seçimi: compareAtPrice olanları öne al, yoksa ilk 4
  const sorted = [...products].sort((a: any, b: any) => {
    const aHas = typeof a?.compareAtPrice === "number" && a.compareAtPrice > a.price;
    const bHas = typeof b?.compareAtPrice === "number" && b.compareAtPrice > b.price;
    return Number(bHas) - Number(aHas);
  });

  const bestsellers = sorted.slice(0, 6);

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="mx-auto max-w-screen-xl px-4 pt-10">
        <div className="rounded-3xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-8">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            Daha az ürün,
            <br />
            daha doğru seçim.
          </h1>

          <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600">
            60 saniyelik mini anketle saç tipini seç. Uzman önerileriyle doğru bakımı bul.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/anket" className="rounded-xl bg-[#7C3AED] px-6 py-3 text-sm font-semibold text-white">
              Anketi Başlat
            </Link>
            <Link href="/magaza" className="rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 hover:border-zinc-300">
              Mağazayı Keşfet
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-4 ring-1 ring-zinc-200">
              <p className="text-xs font-semibold text-zinc-500">🚚 Kargo</p>
              <p className="mt-1 text-sm font-bold text-zinc-900">Hızlı teslimat (demo)</p>
            </div>
            <div className="rounded-2xl bg-white p-4 ring-1 ring-zinc-200">
              <p className="text-xs font-semibold text-zinc-500">🔄 İade</p>
              <p className="mt-1 text-sm font-bold text-zinc-900">14 gün iade (demo)</p>
            </div>
            <div className="rounded-2xl bg-white p-4 ring-1 ring-zinc-200">
              <p className="text-xs font-semibold text-zinc-500">🔒 Ödeme</p>
              <p className="mt-1 text-sm font-bold text-zinc-900">Güvenli ödeme (demo)</p>
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="mx-auto max-w-screen-xl px-4 pt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">Kategoriler</h2>
          <Link href="/magaza" className="text-sm font-semibold text-[#7C3AED] hover:opacity-90">
            Tümünü gör
          </Link>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {collections.map((c) => (
            <Link key={c.title} href={c.href} className="group rounded-3xl border border-zinc-200 bg-white p-4 hover:shadow-sm">
              <Image src={c.img} alt={c.title} width={520} height={320} className="h-40 w-full rounded-2xl object-cover" />
              <p className="mt-3 font-semibold text-zinc-900 group-hover:text-[#7C3AED]">{c.title}</p>
              <p className="text-sm text-zinc-600">{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="mx-auto max-w-screen-xl px-4 py-12">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">Çok Satanlar</h2>
          <Link href="/magaza" className="text-sm font-semibold text-[#7C3AED] hover:opacity-90">
            Mağazaya git
          </Link>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bestsellers.map((p: any) => {
            const img = p?.image ?? (Array.isArray(p?.images) && p.images.length ? (typeof p.images[0] === "string" ? p.images[0] : p.images[0]?.src) : null) ?? "/demo/urun-1.jpg";
            const hasCompare = typeof p?.compareAtPrice === "number" && p.compareAtPrice > p.price;
            const pct = hasCompare ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100) : 0;

            return (
              <Link
                key={p.slug}
                href={`/urun/${p.slug}`}
                className="relative rounded-3xl border border-zinc-200 bg-white p-4 hover:shadow-sm"
              >
                {hasCompare ? (
                  <div className="absolute left-4 top-4 rounded-full bg-[#DB2777] px-2 py-1 text-xs font-extrabold text-white">
                    %{pct} indirim
                  </div>
                ) : null}

                <div className="flex items-start gap-4">
                  <div className="flex h-24 w-24 flex-none items-center justify-center overflow-hidden rounded-2xl bg-zinc-50 ring-1 ring-zinc-200">
                    <Image src={img} alt={p.title} width={96} height={96} className="object-contain" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold text-zinc-900 hover:text-[#7C3AED]">{p.title}</p>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-extrabold text-zinc-900">{formatTRY(Number(p.price ?? 0))}</span>
                      {hasCompare ? (
                        <span className="text-xs font-semibold text-zinc-500 line-through">
                          {formatTRY(Number(p.compareAtPrice))}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-3 flex gap-2">
                      <span className="inline-flex flex-1 items-center justify-center rounded-2xl bg-zinc-900 px-3 py-2 text-xs font-semibold text-white">
                        İncele
                      </span>

                      <AddToCartHome
                        id={String(p.slug)}
                        title={String(p.title ?? "Ürün")}
                        price={Number(p.price ?? 0)}
                        image={typeof img === "string" ? img : undefined}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
