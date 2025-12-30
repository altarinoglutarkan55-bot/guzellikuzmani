import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { prisma } from "@/app/_lib/prisma";

export async function POST() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

  const updated = await prisma.user.update({
    where: { email },
    data: { adminApproved: true },
    select: { id: true, email: true, adminApproved: true, role: true },
  });

  return NextResponse.json({ ok: true, user: updated });
}
