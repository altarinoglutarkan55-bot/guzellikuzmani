import Link from "next/link";

export default function ForumPage() {
  return (
    <section className="mx-auto max-w-screen-md px-4 py-12">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8">
        <p className="text-xs font-semibold tracking-wide text-zinc-500">TOPLULUK</p>

        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-900">
          Forum
        </h1>

        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Forum sayfası hazır. Buraya kategori/konu yapısını kuracağız.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 hover:border-zinc-300"
          >
            ← Ana sayfa
          </Link>

          <Link
            href="/magaza"
            className="inline-flex items-center justify-center rounded-2xl bg-[#7C3AED] px-5 py-3 text-sm font-semibold text-white hover:opacity-95"
          >
            Mağazaya git
          </Link>
        </div>
      </div>
    </section>
  );
}
