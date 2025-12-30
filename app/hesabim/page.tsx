import { auth } from "@/app/_lib/auth";
import Link from "next/link";

export const revalidate = 0;

export default async function HesabimPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <main className="mx-auto max-w-screen-md px-4 py-10">
        <h1 className="text-2xl font-extrabold">Hesabım</h1>
        <p className="mt-2 text-zinc-600">Bu sayfayı görmek için giriş yapmalısın.</p>

        <Link
          className="mt-6 inline-flex rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-extrabold text-white"
          href="/api/auth/signin"
        >
          Giriş yap
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-screen-md px-4 py-10">
      <h1 className="text-2xl font-extrabold">Hesabım</h1>

      <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-5">
        <p className="text-sm text-zinc-600">Giriş yapan kullanıcı</p>
        <p className="mt-1 text-lg font-extrabold text-zinc-900">
          {session.user.name || "İsimsiz"}
        </p>
        <p className="mt-1 text-sm text-zinc-700">{session.user.email}</p>
      </div>

      <div className="mt-6 flex gap-2">
        <Link className="rounded-2xl border px-4 py-2 text-sm font-bold" href="/blog">
          Blog
        </Link>
        <Link className="rounded-2xl border px-4 py-2 text-sm font-bold" href="/forum">
          Forum
        </Link>
      </div>
    </main>
  );
}
