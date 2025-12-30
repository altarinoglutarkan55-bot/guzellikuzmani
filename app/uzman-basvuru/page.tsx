import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { redirect } from "next/navigation";

export default async function UzmanBasvuruPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-semibold">Uzman / Satıcı Başvurusu</h1>
      <p className="mt-2 text-sm text-gray-600">
        Bilgileri doldurun, başvurunuz admin onayına gönderilsin.
      </p>

      <form
        className="mt-6 space-y-4"
        action="/api/expert/apply"
        method="post"
      >
        <div>
          <label className="block text-sm font-medium">Ad Soyad</label>
          <input
            name="fullName"
            required
            className="mt-1 w-full rounded-lg border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Telefon</label>
          <input
            name="phone"
            required
            className="mt-1 w-full rounded-lg border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Şehir</label>
          <input
            name="city"
            required
            className="mt-1 w-full rounded-lg border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Not (opsiyonel)</label>
          <textarea
            name="note"
            className="mt-1 w-full rounded-lg border p-2"
          />
        </div>

        <button
          type="submit"
          className="rounded-xl bg-black px-4 py-2 text-white"
        >
          Başvuruyu Gönder
        </button>
      </form>
    </main>
  );
}
