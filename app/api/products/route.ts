import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/products
export async function GET() {
  const products = getAllProducts();
  return NextResponse.json({ ok: true, items: products });
}

// (Demo mod) POST/DELETE şimdilik kapalı.
// İleride admin paneli ile DB'ye geçince açarız.
export async function POST() {
  return NextResponse.json(
    { ok: false, message: "Demo mod: ürün ekleme kapalı." },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { ok: false, message: "Demo mod: ürün silme kapalı." },
    { status: 405 }
  );
}
