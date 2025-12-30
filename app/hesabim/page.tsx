import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import Link from "next/link";

export default async function HesabimPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="text-xl font-semibold mb-4">
          Giriş yapmanız gerekiyor
        </h1>
        <Link
          href="/api/auth/signin"
          className="inline-block rounded-md bg-black px-4 py-2 text-white"
        >
          Giriş Yap
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold mb-4">Hesabım</h1>

      <div className="rounded-lg border p-4">
        <p>
          <strong>Email:</strong> {session.user.email}
        </p>
        {session.user.name && (
          <p>
            <strong>Ad:</strong> {session.user.name}
          </p>
        )}
      </div>
    </div>
  );
}
