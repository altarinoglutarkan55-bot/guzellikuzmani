import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import Link from "next/link";

export default async function ProfilPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="text-xl font-semibold mb-4">
          Profilini görüntülemek için giriş yapmalısın
        </h1>
        <Link
          href="/api/auth/signin"
          className="inline-block rounded-md bg-black px-4 py-2 text-white"
        >
          Giriş Yap
        </Link>
      </main>
    );
  }

  // ✅ USER BURADA TANIMLI (artık hata yok)
  const user = session.user as {
    email?: string;
    name?: string;
    adminApproved?: boolean;
  };

  return (
    <main className="mx-auto max-w-3xl p-6">
      {user.adminApproved !== true && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
          <div className="font-semibold">
            Hesabın admin onayı bekliyor ⏳
          </div>
          <div className="mt-1 text-gray-700">
            Onaylandıktan sonra uzman özellikleri açılacak.
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">Profil</h1>

      <div className="rounded-lg border p-4 space-y-2">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        {user.name && (
          <p>
            <strong>Ad:</strong> {user.name}
          </p>
        )}
      </div>
    </main>
  );
}
