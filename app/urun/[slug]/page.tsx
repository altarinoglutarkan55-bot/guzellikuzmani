import Link from "next/link";
import { notFound } from "next/navigation";
import Gallery from "./_components/Gallery";

type Product = {
  slug: string;
  title: string;
  brand?: string;
  price: number;
  compareAtPrice?: number;
  short?: string;
  description?: string;
  images: { src: string; alt: string }[];
  bullets?: string[];
  ingredients?: string[];
  usage?: string[];
  tags?: string[];
};

const PRODUCTS: Product[] = [
  {
    slug: "mor-parlaklik-sampuan",
    title: "Mor Parlaklık Şampuanı 500ml",
    brand: "GüzellikUzmanı",
    price: 349.9,
    compareAtPrice: 449.9,
    short: "Boyalı saçlarda istenmeyen turunculuğu nötrlemeye yardımcı olur. Parlaklık ve yumuşaklık hissi verir.",
    description:
      "Mor pigment destekli formülüyle renk dengesini korumaya yardımcı olur. Düzenli kullanımda saçın daha canlı görünmesine katkı sağlar.",
    images: [
      { src: "/demo/urun-1.jpg", alt: "Mor Parlaklık Şampuanı" },
      { src: "/demo/urun-2.jpg", alt: "Şampuan detay" },
      { src: "/demo/urun-3.jpg", alt: "Şampuan kullanım" },
      { src: "/demo/urun-4.jpg", alt: "Şampuan doku" },
    ],
    bullets: ["Boyalı saçlar için", "Parlaklık hissi", "Günlük kullanıma uygun"],
    usage: ["Islak saça uygulayın.", "1-2 dakika bekletin.", "İyice durulayın."],
    tags: ["Çok Satan", "Boyalı Saç"],
  },
  {
    slug: "renk-koruyucu-krem",
    title: "Renk Koruyucu Bakım Kremi",
    brand: "GüzellikUzmanı",
    price: 279.9,
    short: "Renk solmasını azaltmaya yardımcı olur, taramayı kolaylaştırır.",
    description: "Saçı ağırlaştırmadan bakım hissi sağlar. Özellikle boyalı/işlem görmüş saçlar için uygundur.",
    images: [
      { src: "/demo/urun-2.jpg", alt: "Renk Koruyucu Krem" },
      { src: "/demo/urun-1.jpg", alt: "Krem detay" },
      { src: "/demo/urun-3.jpg", alt: "Krem kullanım" },
    ],
    bullets: ["Renk koruma", "Yumuşaklık", "Kolay tarama"],
    usage: ["Temiz, nemli saça uygulayın.", "Uçlara yoğunlaştırın.", "Durulayın veya az miktarda leave-in kullanın."],
    tags: ["Yeni"],
  },
  {
    slug: "keratin-maske",
    title: "Keratin Onarıcı Maske",
    brand: "GüzellikUzmanı",
    price: 399.9,
    short: "Yıpranmış saçlarda onarım ve pürüzsüzlük hissi.",
    description: "Haftalık bakım rutini için idealdir. Saçın elastikiyetine destek olur.",
    images: [
      { src: "/demo/urun-3.jpg", alt: "Keratin Maske" },
      { src: "/demo/urun-4.jpg", alt: "Maske detay" },
      { src: "/demo/urun-2.jpg", alt: "Maske kullanım" },
    ],
    bullets: ["Haftalık bakım", "Onarım hissi", "Pürüzsüz görünüm"],
    usage: ["Şampuan sonrası uygulayın.", "5-10 dk bekletin.", "Durulayın."],
    tags: ["Popüler"],
  },
  {
    slug: "isirgan-tonik",
    title: "Saç Derisi Tonik – Isırgan",
    brand: "GüzellikUzmanı",
    price: 229.9,
    short: "Saç derisini ferahlatmaya yardımcı bakım toniği.",
    description: "Günlük rutinde saç derisine destek olur. Durulama gerektirmez.",
    images: [
      { src: "/demo/urun-4.jpg", alt: "Isırgan Tonik" },
      { src: "/demo/urun-3.jpg", alt: "Tonik detay" },
    ],
    bullets: ["Durulanmaz", "Ferah his", "Günlük kullanım"],
    usage: ["Temiz saç derisine uygulayın.", "Parmak uçlarıyla masaj yapın.", "Durulamayın."],
    tags: ["Hızlı"],
  },
];

function formatTRY(n: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(n);
}

function discountPercent(price: number, compare?: number) {
  if (!compare || compare <= price) return 0;
  return Math.round(((compare - price) / compare) * 100);
}

function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const pct = discountPercent(product.price, product.compareAtPrice);

  return (
    <div className="bg-white">
      <section className="mx-auto max-w-screen-xl px-4 pt-8 pb-12">
        {/* breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          <Link href="/" className="hover:text-[#7C3AED]">Anasayfa</Link>
          <span>›</span>
          <Link href="/magaza" className="hover:text-[#7C3AED]">Mağaza</Link>
          <span>›</span>
          <span className="text-zinc-700">{product.title}</span>
        </div>

        <div className="mt-6 grid gap-10 lg:grid-cols-12">
          {/* gallery */}
          <div className="lg:col-span-7">
            <Gallery images={product.images} />
          </div>

          {/* buy box */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-4">
              {/* title */}
              <div>
                <p className="text-xs font-semibold tracking-wide text-zinc-500">
                  {product.brand ?? "GüzellikUzmanı"}
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
                  {product.title}
                </h1>

                {product.tags?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
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
              </div>

              {/* price */}
              <div className="rounded-3xl border border-zinc-200 bg-white p-4">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-zinc-900">
                        {formatTRY(product.price)}
                      </span>
                      {product.compareAtPrice ? (
                        <span className="text-sm font-semibold text-zinc-500 line-through">
                          {formatTRY(product.compareAtPrice)}
                        </span>
                      ) : null}
                    </div>
                    {pct ? (
                      <p className="mt-1 text-xs font-semibold text-[#DB2777]">
                        %{pct} indirim
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-zinc-500">Fiyatlar KDV dahildir.</p>
                    )}
                  </div>

                  <span className="rounded-full bg-[#7C3AED]/10 px-3 py-1 text-xs font-semibold text-[#7C3AED]">
                    Stokta
                  </span>
                </div>

                {/* CTAs */}
                <div className="mt-4 grid gap-2">
                  <button
                    type="button"
                    className="w-full rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:opacity-95"
                  >
                    Sepete Ekle
                  </button>
                  <Link
                    href="/anket"
                    className="inline-flex w-full items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 hover:border-zinc-300"
                  >
                    Uzman önerisi al
                  </Link>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-zinc-600">
                  <div className="rounded-2xl bg-zinc-50 p-3 ring-1 ring-zinc-200">Güvenli ödeme</div>
                  <div className="rounded-2xl bg-zinc-50 p-3 ring-1 ring-zinc-200">Kolay iade</div>
                  <div className="rounded-2xl bg-zinc-50 p-3 ring-1 ring-zinc-200">Hızlı destek</div>
                </div>
              </div>

              {/* short copy */}
              {product.short ? (
                <p className="text-sm leading-6 text-zinc-600">{product.short}</p>
              ) : null}

              {/* highlights */}
              {product.bullets?.length ? (
                <ul className="space-y-2 text-sm text-zinc-700">
                  {product.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#7C3AED]" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>

        {/* details blocks (Allbirds gibi sade sectionlar) */}
        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-zinc-900">Ürün açıklaması</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600">
                {product.description ?? "Bu ürün için açıklama yakında eklenecek."}
              </p>
            </div>

            <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-zinc-900">Kullanım</h3>
              {product.usage?.length ? (
                <ol className="mt-3 space-y-2 text-sm text-zinc-700">
                  {product.usage.map((u, i) => (
                    <li key={u} className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#7C3AED]/10 text-xs font-bold text-[#7C3AED]">
                        {i + 1}
                      </span>
                      <span>{u}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-3 text-sm text-zinc-600">Kullanım adımları yakında eklenecek.</p>
              )}
            </div>
          </div>

          {/* right small help box */}
          <div className="lg:col-span-4">
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
              <h3 className="text-sm font-semibold text-zinc-900">Kararsız mı kaldın?</h3>
              <p className="mt-2 text-sm text-zinc-600">
                Mini anketi tamamla, saç tipine göre doğru rutini anında önerelim.
              </p>
              <Link
                href="/anket"
                className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-[#7C3AED] px-4 py-3 text-sm font-semibold text-white hover:opacity-95"
              >
                Anketi başlat
              </Link>
              <p className="mt-3 text-xs text-zinc-500">
                Ücretsiz danışmanlık: <span className="font-semibold text-zinc-700">0530 041 23 49</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
