import Link from "next/link";
import OdemeClient from "./OdemeClient";

export const metadata = {
  title: "Ödeme • guzellikuzmani",
};

export default function OdemePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <Link href="/magaza" className="text-sm font-semibold text-[#7C3AED] hover:opacity-80">
          ← Mağazaya dön
        </Link>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-zinc-900">Ödeme</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Demo ödeme sayfası. Burada adres ve ödeme altyapısı daha sonra bağlanacak.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Teslimat */}
        <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-extrabold text-zinc-900">Teslimat Bilgileri</h2>

          <div className="mt-4 grid gap-3">
            <input
              className="h-11 rounded-2xl border border-zinc-200 px-4 text-sm outline-none focus:border-zinc-300"
              placeholder="Ad Soyad"
            />
            <input
              className="h-11 rounded-2xl border border-zinc-200 px-4 text-sm outline-none focus:border-zinc-300"
              placeholder="Telefon"
            />
            <input
              className="h-11 rounded-2xl border border-zinc-200 px-4 text-sm outline-none focus:border-zinc-300"
              placeholder="E-posta"
            />
            <textarea
              className="min-h-[96px] rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-300"
              placeholder="Adres"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                className="h-11 rounded-2xl border border-zinc-200 px-4 text-sm outline-none focus:border-zinc-300"
                placeholder="İl"
              />
              <input
                className="h-11 rounded-2xl border border-zinc-200 px-4 text-sm outline-none focus:border-zinc-300"
                placeholder="İlçe"
              />
            </div>
          </div>
        </section>

        {/* Ödeme (client) */}
        <OdemeClient />
      </div>
    </main>
  );
}
