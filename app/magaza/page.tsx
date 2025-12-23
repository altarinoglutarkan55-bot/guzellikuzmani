import Link from "next/link";
import QuickViewGridClient from "./_components/QuickViewGridClient";

type SP = Record<string, string | string[] | undefined>;

type Product = {
  slug: string;
  title: string;
  price: number;
  category: string;
  tags: string[];
  img: string;
  badge?: string;
};

const PRODUCTS: Product[] = [
  { slug: "mor-parlaklik-sampuan", title: "Mor Parlaklık Şampuanı 500ml", price: 349.9, category: "sampuan", tags: ["boyali", "yipranma"], img: "/demo/urun-1.jpg", badge: "Çok Satan" },
  { slug: "renk-koruyucu-krem", title: "Renk Koruyucu Bakım Kremi", price: 279.9, category: "sac", tags: ["boyali", "kuru"], img: "/demo/urun-2.jpg", badge: "Yeni" },
  { slug: "keratin-maske", title: "Keratin Onarıcı Maske", price: 399.9, category: "maske", tags: ["yipranma", "kuru"], img: "/demo/urun-3.jpg", badge: "Popüler" },
  { slug: "isirgan-tonik", title: "Saç Derisi Tonik – Isırgan", price: 229.9, category: "tonik", tags: ["dokulme", "yagli"], img: "/demo/urun-4.jpg" },
  { slug: "isi-koruyucu-sprey", title: "Isı Koruyucu Sprey", price: 259.9, category: "isi-koruyucu", tags: ["yipranma"], img: "/demo/urun-3.jpg" },
  { slug: "arindirici-sampuan", title: "Arındırıcı Şampuan", price: 319.9, category: "sampuan", tags: ["yagli", "kepek"], img: "/demo/urun-4.jpg" },
  { slug: "nem-serumu", title: "Nem Serum – İpeksi Dokunuş", price: 289.9, category: "serum", tags: ["kuru"], img: "/demo/urun-2.jpg" },
  { slug: "sekillendirici-krem", title: "Şekillendirici Krem", price: 219.9, category: "sekillendirici", tags: ["kuru"], img: "/demo/urun-1.jpg" },
];

function getFirst(v?: string | string[]) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function MagazaPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;

  const kat = getFirst(sp.kat) ?? "";
  const concerns = sp.c ? (Array.isArray(sp.c) ? sp.c : [sp.c]) : [];

  const isFromSurvey = Boolean(kat || concerns.length);

  let items = PRODUCTS.filter((p) => {
    const katOk = kat ? p.category === kat || kat === "sac" : true;
    const cOk = concerns.length ? concerns.every((c) => p.tags.includes(String(c))) : true;
    return katOk && cOk;
  });

  return (
    <div className="bg-white">
      <section className="mx-auto max-w-screen-xl px-4 pt-10">

        {/* ✅ ANKETTEN GELEN ÖNERİ BANDI */}
        {isFromSurvey ? (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#7C3AED]/20 bg-[#7C3AED]/5 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-[#7C3AED] px-3 py-1 text-xs font-semibold text-white">
                Öneriler aktif
              </span>
              <p className="text-sm text-zinc-700">
                Anket cevaplarına göre filtrelenmiş ürünleri görüyorsun.
              </p>
            </div>

            <Link
              href="/magaza"
              className="text-sm font-semibold text-[#7C3AED] hover:underline"
            >
              Filtreleri temizle
            </Link>
          </div>
        ) : null}

        {/* BAŞLIK */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            {isFromSurvey ? "Sana Özel Öneriler" : "Mağaza"}
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            {items.length} ürün listeleniyor
          </p>
        </div>

        {/* GRID */}
        {items.length === 0 ? (
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-8">
            <p className="text-sm font-semibold text-zinc-900">Sonuç bulunamadı</p>
            <p className="mt-2 text-sm text-zinc-600">
              Filtreleri temizleyip tekrar deneyebilirsin.
            </p>
            <Link
              href="/magaza"
              className="mt-4 inline-flex rounded-xl bg-[#7C3AED] px-5 py-3 text-sm font-semibold text-white hover:opacity-95"
            >
              Tüm ürünleri gör
            </Link>
          </div>
        ) : (
          <QuickViewGridClient
            items={items.map(({ slug, title, price, category, img, badge }) => ({
              slug,
              title,
              price,
              category,
              img,
              badge,
            }))}
          />
        )}
      </section>

      <div className="h-12" />
    </div>
  );
}
