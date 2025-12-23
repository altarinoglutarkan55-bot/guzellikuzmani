export default function SiteHeader() {
  return (
    <header className="border-b bg-white">
      {/* Top strip */}
      <div className="container-x flex items-center justify-between py-2 text-xs text-neutral-500">
        <div className="flex items-center gap-3">
          <span className="badge">Yeni</span>
          <span>Ücretsiz danışmanlık: 0530 041 23 49</span>
        </div>
        <div className="hidden items-center gap-4 md:flex">
          <a className="hover:text-violet-700" href="/blog">Blog</a>
          <a className="hover:text-violet-700" href="/forum">Forum</a>
          <a className="hover:text-violet-700" href="/satici-basvuru">Satıcı Başvurusu</a>
        </div>
      </div>

      {/* Main header */}
      <div className="container-x flex items-center gap-3 py-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-2xl text-white font-extrabold"
               style={{ background: "linear-gradient(135deg, rgb(124 58 237), rgb(219 39 119))" }}>
            G
          </div>
          <div className="leading-tight">
            <div className="font-extrabold tracking-tight">Güzellik Uzmanı</div>
            <div className="text-xs text-neutral-500">Saç & Bakım</div>
          </div>
        </a>

        {/* Search */}
        <div className="ml-auto hidden w-full max-w-xl md:block">
          <div className="searchbox flex items-center gap-2 rounded-2xl border bg-white px-4 py-3">
            <span className="text-neutral-400">🔎</span>
            <input
              className="w-full bg-transparent text-sm outline-none"
              placeholder="Şampuan, serum, ısı koruyucu... (demo)"
            />
            <a href="/magaza" className="btn-primary">Ara</a>
          </div>
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2 md:ml-3">
          <a href="/anket" className="btn-ghost hidden md:inline-flex">Uzmanımıza Danışın</a>
          <a href="/magaza" className="btn-primary hidden md:inline-flex">Mağaza</a>
          <a href="/admin" className="btn-ghost">Admin</a>
        </div>
      </div>

      {/* Category bar (Trendyol hissi) */}
      <div className="border-t bg-white">
        <div className="container-x">
          <nav className="no-scrollbar flex items-center gap-2 overflow-x-auto py-3 text-sm">
            {[
              ["Saç", "/magaza"],
              ["Şampuan", "/magaza"],
              ["Bakım Maskesi", "/magaza"],
              ["Serum & Tonik", "/magaza"],
              ["Isı Koruyucu", "/magaza"],
              ["Şekillendirme", "/magaza"],
              ["Saç Derisi", "/magaza"],
              ["Çocuk", "/magaza"],
            ].map(([t, href]) => (
              <a
                key={t}
                href={href}
                className="whitespace-nowrap rounded-full border px-4 py-2 text-neutral-700 hover:border-violet-300 hover:text-violet-700"
              >
                {t}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile search */}
      <div className="container-x pb-4 md:hidden">
        <div className="searchbox flex items-center gap-2 rounded-2xl border bg-white px-4 py-3">
          <span className="text-neutral-400">🔎</span>
          <input
            className="w-full bg-transparent text-sm outline-none"
            placeholder="Ürün ara (demo)"
          />
          <a href="/magaza" className="btn-primary">Ara</a>
        </div>
      </div>
    </header>
  );
}
