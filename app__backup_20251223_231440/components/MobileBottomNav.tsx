export default function MobileBottomNav() {
  return (
    <div className="bottom-nav fixed bottom-0 left-0 right-0 z-50 border-t bg-white md:hidden">
      <div className="container-x grid grid-cols-4 py-2 text-xs">
        <a className="grid place-items-center gap-1 py-2" href="/">
          <span>🏠</span><span>Ana Sayfa</span>
        </a>
        <a className="grid place-items-center gap-1 py-2" href="/magaza">
          <span>🛍️</span><span>Mağaza</span>
        </a>
        <a className="grid place-items-center gap-1 py-2" href="/anket">
          <span>✨</span><span>Anket</span>
        </a>
        <a className="grid place-items-center gap-1 py-2" href="/admin">
          <span>⚙️</span><span>Admin</span>
        </a>
      </div>
    </div>
  );
}
