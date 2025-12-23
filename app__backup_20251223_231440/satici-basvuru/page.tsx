export default function SaticiBasvuruPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-semibold">Satıcı Başvurusu</h1>
        <p className="mt-2 text-neutral-600">
          Satıcı başvuru formunu buraya koyacağız (ad/telefon/marka/ürün tipi vb.).
        </p>

        <section className="mt-8 rounded-3xl border p-6">
          <p className="text-sm text-neutral-700">
            Şimdilik demo: Bizimle iletişime geç:
          </p>
          <a
            className="mt-4 inline-block rounded-2xl bg-black px-6 py-3 text-sm font-medium text-white"
            href="tel:05300412349"
          >
            Ara: 0530 041 23 49
          </a>
        </section>

        <a className="mt-8 inline-block rounded-2xl border px-5 py-3" href="/">
          ← Ana sayfa
        </a>
      </div>
    </main>
  );
}
