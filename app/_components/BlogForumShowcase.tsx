import Link from "next/link";

export default function BlogForumShowcase() {
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-zinc-900">Blog & Forum</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Uzman içerikleri oku, sorunu paylaş, öneri al.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/blog"
            className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-extrabold text-zinc-900 hover:border-zinc-300"
          >
            Blog
          </Link>
          <Link
            href="/forum"
            className="rounded-2xl bg-[#7C3AED] px-4 py-2 text-sm font-extrabold text-white hover:opacity-95"
          >
            Forum
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Blog kartı */}
        <Link
          href="/blog"
          className="group relative overflow-hidden rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md"
        >
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#7C3AED]/10 blur-2xl" />
          <p className="text-xs font-bold text-zinc-500">Uzman Blog</p>
          <h3 className="mt-2 text-lg font-extrabold text-zinc-900">
            Saç, saç derisi ve rutin rehberleri
          </h3>
          <p className="mt-2 text-sm text-zinc-600">
            Mor şampuan nasıl kullanılır? Keratin sonrası bakım? Boyalı saçta doğru rutin…
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-extrabold text-white group-hover:opacity-95">
            Blog yazılarını gör →
          </div>
        </Link>

        {/* Forum kartı */}
        <Link
          href="/forum"
          className="group relative overflow-hidden rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md"
        >
          <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-[#DB2777]/10 blur-2xl" />
          <p className="text-xs font-bold text-zinc-500">Topluluk Forum</p>
          <h3 className="mt-2 text-lg font-extrabold text-zinc-900">
            Soru sor, deneyim paylaş, destek al
          </h3>
          <p className="mt-2 text-sm text-zinc-600">
            Dökülme, kepek, kırık, matlık… kullanıcı deneyimleri ve uzman yorumları (demo).
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#7C3AED] px-4 py-2 text-sm font-extrabold text-white group-hover:opacity-95">
            Forum’a git →
          </div>
        </Link>

        {/* Anket CTA kartı */}
        <Link
          href="/anket"
          className="group relative overflow-hidden rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md"
        >
          <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-zinc-900/10 blur-2xl" />
          <p className="text-xs font-bold text-zinc-500">2 Dakika</p>
          <h3 className="mt-2 text-lg font-extrabold text-zinc-900">
            Uzman önerisi al
          </h3>
          <p className="mt-2 text-sm text-zinc-600">
            Saç tipine ve hedeflerine göre öneri akışını başlat.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-extrabold text-zinc-900 group-hover:border-zinc-300">
            Anketi başlat →
          </div>
        </Link>
      </div>
    </section>
  );
}
