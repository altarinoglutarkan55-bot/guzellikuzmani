import Image from "next/image";
import Link from "next/link";

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

const bestsellers = [
  { slug: "mor-parlaklik-sampuan", title: "Mor Parlaklık Şampuanı 500ml", price: 349.9, img: "/demo/urun-1.jpg", tag: "Çok Satan" },
  { slug: "renk-koruyucu-krem", title: "Renk Koruyucu Bakım Kremi", price: 279.9, img: "/demo/urun-2.jpg", tag: "Yeni" },
  { slug: "keratin-maske", title: "Keratin Onarıcı Maske", price: 399.9, img: "/demo/urun-3.jpg", tag: "Popüler" },
  { slug: "isirgan-tonik", title: "Saç Derisi Tonik – Isırgan", price: 229.9, img: "/demo/urun-4.jpg", tag: "Hızlı" },
];

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="mx-auto max-w-screen-xl px-4 pt-10">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold tracking-wide text-zinc-500">
              UZMAN ÖNERİSİ • KİŞİSEL RUTİN
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
              Daha az ürün,
              <br />
              daha doğru seçim.
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600">
              60 saniyelik mini anketle saç tipini seç. Uzman önerileriyle doğru bakımı bul ve alışverişini tamamla.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/anket"
                className="rounded-xl bg-[#7C3AED] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95"
              >
                Anketi Başlat
              </Link>
              <Link
                href="/magaza"
                className="rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 hover:border-zinc-300"
              >
                Mağazayı Keşfet
              </Link>
            </div>

            <div className="mt-8 space-y-2 text-sm text-zinc-600">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#7C3AED]" />
                Saç tipine göre öneri
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#DB2777]" />
                Kolay iade & güvenli ödeme
              </div>
            </div>
          </div>

          {/* Big image */}
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50">
              <div className="relative aspect-[16/9]">
                <Image
                  src="/demo/urun-3.jpg"
                  alt="GüzellikUzmanı"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 720px, 100vw"
                  priority
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-white/75 via-transparent to-transparent" />

              {/* Minimal overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-2xl bg-white/80 p-4 ring-1 ring-zinc-200 backdrop-blur">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-zinc-900">Bugünün önerisi</p>
                  <p className="mt-1 truncate text-sm text-zinc-600">Onarım + nem dengesi rutini</p>
                </div>
                <Link
                  href="/magaza"
                  className="rounded-xl bg-[#DB2777] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                >
                  Keşfet
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTIONS (3 tile) */}
      <section className="mx-auto max-w-screen-xl px-4 pt-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Koleksiyonlar</h2>
            <p className="mt-1 text-sm text-zinc-600">En çok ihtiyaç duyulan kategoriler.</p>
          </div>
          <Link href="/magaza" className="text-sm font-semibold text-[#7C3AED] hover:underline">
            Tümünü gör
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {collections.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="group rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="relative overflow-hidden rounded-2xl bg-zinc-50 ring-1 ring-zinc-200">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={c.img}
                    alt={c.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 260px, 100vw"
                  />
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold text-zinc-900 group-hover:text-[#7C3AED]">
                {c.title}
              </p>
              <p className="mt-1 text-xs text-zinc-600">{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* BESTSELLERS (horizontal strip) */}
      <section className="mx-auto max-w-screen-xl px-4 py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Bestsellers</h2>
            <p className="mt-1 text-sm text-zinc-600">En çok tercih edilen ürünler.</p>
          </div>
          <Link href="/magaza?sort=cok-satan" className="text-sm font-semibold text-[#7C3AED] hover:underline">
            Hepsini gör
          </Link>
        </div>

        <div className="mt-6 flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {bestsellers.map((p) => (
            <Link
              key={p.slug}
              href={`/urun/${p.slug}`}
              className="group min-w-[240px] max-w-[240px] flex-none rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="relative overflow-hidden rounded-2xl bg-zinc-50 ring-1 ring-zinc-200">
                <div className="relative aspect-square">
                  <Image src={p.img} alt={p.title} fill className="object-cover" sizes="240px" />
                </div>
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-800 ring-1 ring-zinc-200">
                  {p.tag}
                </span>
              </div>

              <p className="mt-3 line-clamp-2 text-sm font-semibold text-zinc-900 group-hover:text-[#7C3AED]">
                {p.title}
              </p>
              <p className="mt-1 text-sm font-bold text-zinc-900">{formatTRY(p.price)}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* STORY (Allbirds gibi sade içerik blok) */}
      <section className="mx-auto max-w-screen-xl px-4 pb-12">
        <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <h3 className="text-2xl font-bold tracking-tight text-zinc-900">
                Uzman bakışıyla “az ama doğru” rutin
              </h3>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Saç tipine uygun ürün seçimiyle hem maliyeti düşürürsün hem de sonuç alırsın.
                Mini anketten sonra rutinin netleşir; mağazada sadece ihtiyacın olanları görürsün.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/anket"
                  className="rounded-xl bg-[#7C3AED] px-5 py-3 text-sm font-semibold text-white hover:opacity-95"
                >
                  Rutini oluştur
                </Link>
                <Link
                  href="/blog"
                  className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 hover:border-zinc-300"
                >
                  Blog’u oku
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/demo/urun-2.jpg"
                    alt="Uzman içerik"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 420px, 100vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-200">
        <div className="mx-auto max-w-screen-xl px-4 py-10 text-sm text-zinc-600">
          © {new Date().getFullYear()} GüzellikUzmanı
        </div>
      </footer>
    </div>
  );
}
