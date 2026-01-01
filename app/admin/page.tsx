import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { prisma } from "@/app/_lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

type AppStatus = "PENDING" | "APPROVED" | "REJECTED";

// ✅ users.map içindeki "u any" hatasını bitiren tip
type UserRow = {
  id: string;
  name: string | null;
  email: string | null;
  role: "USER" | "ADMIN";
  adminApproved: boolean;
  createdAt: Date;
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) redirect("/api/auth/signin");

  const me = await prisma.user.findUnique({
    where: { email },
    select: { id: true, adminApproved: true, role: true, email: true },
  });

  if (!me || me.adminApproved !== true || me.role !== "ADMIN") {
    redirect("/profil");
  }

  async function setApproved(formData: FormData) {
    "use server";

    const userId = String(formData.get("userId") ?? "");
    const adminApproved = String(formData.get("adminApproved") ?? "");
    if (!userId) return;

    await prisma.user.update({
      where: { id: userId },
      data: { adminApproved: adminApproved === "true" },
    });

    revalidatePath("/admin");
  }

  async function setRole(formData: FormData) {
    "use server";

    const userId = String(formData.get("userId") ?? "");
    const role = String(formData.get("role") ?? "");
    if (!userId) return;
    if (role !== "USER" && role !== "ADMIN") return;

    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    revalidatePath("/admin");
  }

  async function setApplicationStatus(formData: FormData) {
    "use server";

    const applicationId = String(formData.get("applicationId") ?? "");
    const status = String(formData.get("status") ?? "") as AppStatus;

    if (!applicationId) return;
    if (status !== "PENDING" && status !== "APPROVED" && status !== "REJECTED") return;

    await prisma.expertApplication.update({
      where: { id: applicationId },
      data: { status },
    });

    revalidatePath("/admin");
  }

  // ✅ users artık tipli
  const users = (await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 25,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      adminApproved: true,
      createdAt: true,
    },
  })) as UserRow[];

  const applications = await prisma.expertApplication.findMany({
    orderBy: { createdAt: "desc" },
    take: 25,
    include: {
      user: { select: { email: true, name: true } },
    },
  });

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-semibold">Admin Paneli</h1>
      <p className="mt-2 text-sm text-gray-500">
        Giriş yapan: <b>{me.email}</b> — Rol: <b>{me.role}</b> — Onay: <b>{String(me.adminApproved)}</b>
      </p>

      {/* USERS */}
      <div className="mt-6 rounded-xl border p-4">
        <h2 className="text-lg font-medium">Son 25 Kullanıcı</h2>

        <div className="mt-4 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2 pr-3">Ad</th>
                <th className="py-2 pr-3">E-posta</th>
                <th className="py-2 pr-3">Rol</th>
                <th className="py-2 pr-3">Onay</th>
                <th className="py-2 pr-3">Kayıt</th>
                <th className="py-2 pr-3">İşlem</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b last:border-0">
                  <td className="py-2 pr-3">{u.name ?? "-"}</td>
                  <td className="py-2 pr-3">{u.email ?? "-"}</td>
                  <td className="py-2 pr-3">{u.role}</td>
                  <td className="py-2 pr-3">{u.adminApproved ? "✅ Onaylı" : "⏳ Onaysız"}</td>
                  <td className="py-2 pr-3">{new Date(u.createdAt).toLocaleString("tr-TR")}</td>

                  <td className="py-2 pr-3">
                    <div className="flex flex-wrap gap-2">
                      {u.id !== me.id && (
                        <form action={setApproved}>
                          <input type="hidden" name="userId" value={u.id} />
                          <input type="hidden" name="adminApproved" value={u.adminApproved ? "false" : "true"} />
                          <button className="rounded-lg border px-3 py-1 text-xs hover:bg-gray-50" type="submit">
                            {u.adminApproved ? "Onayı Geri Al" : "Onayla"}
                          </button>
                        </form>
                      )}

                      {u.id !== me.id && (
                        <form action={setRole}>
                          <input type="hidden" name="userId" value={u.id} />
                          <input type="hidden" name="role" value={u.role === "ADMIN" ? "USER" : "ADMIN"} />
                          <button className="rounded-lg border px-3 py-1 text-xs hover:bg-gray-50" type="submit">
                            {u.role === "ADMIN" ? "USER Yap" : "ADMIN Yap"}
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* APPLICATIONS */}
      <div className="mt-8 rounded-xl border p-4">
        <h2 className="text-lg font-medium">Son 25 Uzman Başvurusu</h2>

        <div className="mt-4 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2 pr-3">Kullanıcı</th>
                <th className="py-2 pr-3">Telefon</th>
                <th className="py-2 pr-3">Şehir</th>
                <th className="py-2 pr-3">Durum</th>
                <th className="py-2 pr-3">Tarih</th>
                <th className="py-2 pr-3">İşlem</th>
              </tr>
            </thead>

            <tbody>
              {applications.map((a) => (
                <tr key={a.id} className="border-b last:border-0">
                  <td className="py-2 pr-3">
                    <div className="font-medium">{a.fullName}</div>
                    <div className="text-xs text-gray-500">{a.user?.email ?? "-"}</div>
                  </td>
                  <td className="py-2 pr-3">{a.phone}</td>
                  <td className="py-2 pr-3">{a.city}</td>
                  <td className="py-2 pr-3">
                    {a.status === "APPROVED"
                      ? "✅ APPROVED"
                      : a.status === "REJECTED"
                        ? "❌ REJECTED"
                        : "⏳ PENDING"}
                  </td>
                  <td className="py-2 pr-3">{new Date(a.createdAt).toLocaleString("tr-TR")}</td>

                  <td className="py-2 pr-3">
                    <div className="flex flex-wrap gap-2">
                      <form action={setApplicationStatus}>
                        <input type="hidden" name="applicationId" value={a.id} />
                        <input type="hidden" name="status" value="APPROVED" />
                        <button className="rounded-lg border px-3 py-1 text-xs hover:bg-gray-50" type="submit">
                          Onayla
                        </button>
                      </form>

                      <form action={setApplicationStatus}>
                        <input type="hidden" name="applicationId" value={a.id} />
                        <input type="hidden" name="status" value="REJECTED" />
                        <button className="rounded-lg border px-3 py-1 text-xs hover:bg-gray-50" type="submit">
                          Reddet
                        </button>
                      </form>

                      <form action={setApplicationStatus}>
                        <input type="hidden" name="applicationId" value={a.id} />
                        <input type="hidden" name="status" value="PENDING" />
                        <button className="rounded-lg border px-3 py-1 text-xs hover:bg-gray-50" type="submit">
                          Beklemede
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}

              {applications.length === 0 && (
                <tr>
                  <td className="py-3 text-sm text-gray-600" colSpan={6}>
                    Başvuru yok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
