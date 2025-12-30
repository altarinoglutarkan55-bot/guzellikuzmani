import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { prisma } from "@/app/_lib/prisma";

export async function POST(req: Request) {
  // 1) Giriş kontrolü
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

  // 2) Admin onayı olan kullanıcı mı? (şimdilik role kontrolü B adımında)
  const me = await prisma.user.findUnique({
    where: { email },
    select: { adminApproved: true },
  });

  if (!me || me.adminApproved !== true) {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }

  // 3) Body doğrulama
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "BAD_JSON" }, { status: 400 });
  }

  const { userId, adminApproved } = body as { userId?: string; adminApproved?: boolean };

  if (!userId || typeof userId !== "string") {
    return NextResponse.json({ ok: false, error: "USER_ID_REQUIRED" }, { status: 400 });
  }
  if (typeof adminApproved !== "boolean") {
    return NextResponse.json({ ok: false, error: "ADMIN_APPROVED_REQUIRED" }, { status: 400 });
  }

  // 4) Güncelle
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { adminApproved },
    select: { id: true, email: true, adminApproved: true, role: true, name: true },
  });

  return NextResponse.json({ ok: true, user: updated });
}
