import { NextResponse } from "next/server";
import { prisma } from "@/app/_lib/prisma";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email ve şifre zorunlu" },
        { status: 400 }
      );
    }

    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      return NextResponse.json(
        { error: "Bu email zaten kayıtlı" },
        { status: 409 }
      );
    }

    // 🔥 EN ÖNEMLİ SATIR
    const passwordHash = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "USER",
        adminApproved: false,
      },
    });

    return NextResponse.json(
      { ok: true, userId: user.id },
      { status: 201 }
    );
  } catch (e) {
    console.error("REGISTER ERROR", e);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
