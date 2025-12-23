import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";

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
  const bestsellers = products.slice(0, 4);

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="mx-auto max-w-screen-xl px-4 pt-10">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          Daha az ürün,
          <br />
          daha doğru seçim.
        </h1>

        <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600">
          60 saniyelik mini anketle saç tipini seç. Uzman önerileriyle doğru bakımı bul.
        </p>

        <div className="mt-6 flex gap-3">
          <Link href="/anket" className="rounded-xl bg-[#7C3AED] px-6 py-3 text-sm font-semibold text-white">
            Anketi Başlat
          </Link>
          <Link href="/magaza" className="rounded-xl border px-6 py-3 text-sm font-semibold">
            Mağazayı Keşfet
          </Link>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="mx-auto max-w-screen-xl px-4 pt-12">
        <div className="grid gap-4 md:grid-cols-3">
          {collections.map((c) => (
            <Link key={c.title} href={c.href} className="rounded-3xl border p-4">
              <Image src={c.img} alt={c.title} width={300} height={200} className="rounded-xl" />
              <p className="mt-3 font-semibold">{c.title}</p>
              <p className="text-sm text-zinc-600">{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="mx-auto max-w-screen-xl px-4 py-12">
        <h2 className="text-lg font-semibold text-zinc-900">Bestsellers</h2>

        <div className="mt-6 flex gap-4 overflow-x-auto">
          {bestsellers.map((p: any) => (
            <Link
              key={p.slug}
              href={`/urun/${p.slug}`}
              className="min-w-[240px] rounded-3xl border p-4"
            >
              <Image
                src={p.image ?? "/demo/urun-1.jpg"}
                alt={p.title}
                width={240}
                height={240}
                className="rounded-xl"
              />
              <p className="mt-3 font-semibold">{p.title}</p>
              <p className="font-bold">{formatTRY(p.price)}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
