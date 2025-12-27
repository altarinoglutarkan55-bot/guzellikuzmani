import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // PII yok: sadece event + sayfa + slug
    // Şimdilik console log (Vercel logs). Sonra DB/Analytics bağlarız.
    console.log("[events]", JSON.stringify(body));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
