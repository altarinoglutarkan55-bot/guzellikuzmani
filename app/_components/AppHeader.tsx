import { Suspense } from "react";
import AppHeaderClient from "./AppHeaderClient";

function FallbackHeader() {
  // useSearchParams çalışmadığında (build / 404) sade bir header göster
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/85 backdrop-blur">
      <div className="mx-auto max-w-screen-xl px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[#7C3AED]/10 text-[#7C3AED] font-extrabold">
              G
            </span>
            <div className="leading-tight">
              <div className="text-sm font-extrabold tracking-tight text-zinc-900">
                Güzellik Uzmanı
              </div>
              <div className="text-[11px] font-semibold text-zinc-500">Saç & Bakım</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/anket"
              className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900"
            >
              Uzmanına Danış
            </a>
            <a
              href="/magaza"
              className="inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Mağaza
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function AppHeader() {
  return (
    <Suspense fallback={<FallbackHeader />}>
      <AppHeaderClient />
    </Suspense>
  );
}
