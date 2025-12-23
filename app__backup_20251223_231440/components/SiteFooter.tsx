export default function SiteFooter() {
  return (
    <footer className="mt-14 border-t bg-white">
      <div className="container-x grid gap-8 py-10 md:grid-cols-4">
        <div>
          <div className="font-extrabold">Güzellik Uzmanı</div>
          <p className="mt-2 text-sm text-neutral-600">
            Saç ve saç derisi odağında ürün önerileri, mağaza ve uzman desteği.
          </p>
          <div className="mt-3 text-xs text-neutral-500">© {new Date().getFullYear()}</div>
        </div>

        <div>
          <div className="font-semibold">Kurumsal</div>
          <div className="mt-3 grid gap-2 text-sm">
            <a className="hover:text-violet-700" href="/blog">Blog</a>
            <a className="hover:text-violet-700" href="/forum">Forum</a>
            <a className="hover:text-violet-700" href="/satici-basvuru">Satıcı Başvurusu</a>
          </div>
        </div>

        <div>
          <div className="font-semibold">Yardım</div>
          <div className="mt-3 grid gap-2 text-sm text-neutral-700">
            <span>Canlı Destek (demo)</span>
            <span>İade & Değişim (demo)</span>
            <span>Kargo (demo)</span>
          </div>
        </div>

        <div>
          <div className="font-semibold">İletişim</div>
          <div className="mt-3 grid gap-2 text-sm">
            <a className="text-violet-700" href="tel:05300412349">0530 041 23 49</a>
            <a className="btn-primary inline-flex w-fit" href="/anket">Uzmanımıza Danışın</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
