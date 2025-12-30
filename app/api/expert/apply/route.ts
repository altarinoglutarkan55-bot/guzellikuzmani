import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { prisma } from "@/app/_lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ ok: false, error: "USER_NOT_FOUND" }, { status: 404 });
  }

  const form = await req.formData();

  const fullName = String(form.get("fullName") ?? "").trim();
  const phone = String(form.get("phone") ?? "").trim();
  const city = String(form.get("city") ?? "").trim();
  const noteRaw = form.get("note");
  const note = noteRaw ? String(noteRaw).trim() : null;

  if (!fullName || !phone || !city) {
    return NextResponse.json({ ok: false, error: "REQUIRED_FIELDS" }, { status: 400 });
  }

  const existing = await prisma.expertApplication.findUnique({
    where: { userId: user.id },
  });

  if (existing) {
    return NextResponse.json({ ok: false, error: "ALREADY_APPLIED" }, { status: 409 });
  }

  const created = await prisma.expertApplication.create({
    data: {
      userId: user.id,
      fullName,
      phone,
      city,
      note: note && note.length ? note : null,
    },
  });

  return NextResponse.json({ ok: true, application: created });
}
