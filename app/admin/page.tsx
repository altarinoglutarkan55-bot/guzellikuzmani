// app/admin/page.tsx
import Link from "next/link";
import { getAllProducts, getProductName, getProductSlug } from "../../lib/products";

export const revalidate = 60;

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const key = Array.isArray(sp.key) ? sp.key[0] : sp.key;

  const expected = process.env.ADMIN_KEY;

  if (!expected || key !== expected) {
    return (
      <main className="mx-auto max-w-screen-md px-4 py-10">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">Erişim reddedildi</h1>
          <p className="mt-2 text-sm text-zinc-600">Bu sayfa admin anahtarı gerektirir.</p>

          <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 font-mono text-[12px] text-zinc-700">
            /admin?key=YOUR_ADMIN_KEY
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:border-zinc-300"
            >
              Ana sayfa
            </Link>
            <Link
              href="/magaza"
              className="rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
            >
              Mağaza
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const products = getAllProducts();

  return (
    <main className="mx-auto max-w-screen-xl px-4 py-8">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">Admin</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Toplam ürün: <span className="font-semibold text-zinc-900">{products.length}</span>
          </p>
        </div>

        <Link
          href="/magaza"
          className="rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
        >
          Mağaza
        </Link>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-2">
          {products.map((p: any) => {
            const name = getProductName(p);
            const slug = getProductSlug(p);
            const href = slug ? `/urun/${encodeURIComponent(slug)}` : "/magaza";

            return (
              <div
                key={String(p?.id ?? slug ?? name)}
                className="flex flex-col gap-1 rounded-2xl border border-zinc-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="text-sm font-semibold text-zinc-900">{name}</div>
                  <div className="font-mono text-[11px] text-zinc-500">{slug || "(slug yok)"}</div>
                </div>

                <Link
                  href={href}
                  className="mt-2 inline-flex w-fit rounded-2xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-900 hover:border-zinc-300 sm:mt-0"
                >
                  Ürüne git
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
