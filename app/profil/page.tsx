import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { prisma } from "@/app/_lib/prisma";

export default async function ProfilPage() {
  const session = await getServerSession(authOptions);

  // Middleware zaten koruyor ama yine de null gelirse güvenli çıkış:
  const email = session?.user?.email;
  if (!email) {
    return (
    <main className="mx-auto max-w-3xl p-6">
      {user && user.adminApproved !== true && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
          <div className="font-semibold">Hesabın admin onayı bekliyor ⏳</div>
          <div className="mt-1 text-gray-700">
            Onay gelene kadar admin/uzman alanları kapalı olacak. Onaylandığında otomatik açılacak.
          </div>
        </div>
      )}
        <h1 className="text-2xl font-semibold">Profil</h1>
        <p className="mt-4">Session bulunamadı.</p>
      </main>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      name: true,
      email: true,
      role: true,
      adminApproved: true,
      createdAt: true,
    },
  });

  return (
    <main className="mx-auto max-w-3xl p-6">
      {user && user.adminApproved !== true && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
          <div className="font-semibold">Hesabın admin onayı bekliyor ⏳</div>
          <div className="mt-1 text-gray-700">
            Onay gelene kadar admin/uzman alanları kapalı olacak. Onaylandığında otomatik açılacak.
          </div>
        </div>
      )}
      <h1 className="text-2xl font-semibold">Profil</h1>
      <p className="mt-2 text-sm text-gray-500">
        Bu sayfa middleware ile korunuyor. Aşağıdaki bilgiler DB’den okunuyor.
      </p>

      <div className="mt-6 rounded-xl border p-4">
        <h2 className="text-lg font-medium">Kullanıcı Bilgileri (DB)</h2>

        {!user ? (
          <p className="mt-3 text-sm text-red-600">DB’de kullanıcı bulunamadı.</p>
        ) : (
          <div className="mt-4 grid gap-3 text-sm">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-gray-500">Ad</span>
              <span className="font-medium">{user.name ?? "-"}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-gray-500">E-posta</span>
              <span className="font-medium">{user.email}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-gray-500">Rol</span>
              <span className="font-medium">{user.role}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-gray-500">Admin Onayı</span>
              <span className="font-medium">
                {user.adminApproved ? "Onaylı ✅" : "Onaysız ⏳"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Kayıt Tarihi</span>
              <span className="font-medium">
                {new Date(user.createdAt).toLocaleString("tr-TR")}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-xl border p-4">
        <h2 className="text-lg font-medium">Session (debug)</h2>
        <pre className="mt-3 overflow-auto rounded-lg bg-black p-4 text-xs text-white">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </main>
  );
}

