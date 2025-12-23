// app/api/products/route.ts
import { addProduct, deleteProduct, getAllProducts, type Product } from "@/lib/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ ok: true, products: getAllProducts() });
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<Product>;

  if (!body.slug || !body.title || typeof body.price !== "number") {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "Eksik alan: slug, title, price zorunlu.",
      }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  const product: Product = {
    slug: String(body.slug),
    title: String(body.title),
    price: Number(body.price),
    bullets: Array.isArray(body.bullets) ? body.bullets.map(String) : [],
    howto: Array.isArray(body.howto) ? body.howto.map(String) : [],
    tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
  };

  const saved = addProduct(product);
  return Response.json({ ok: true, product: saved });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return new Response(JSON.stringify({ ok: false, error: "slug gerekli" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const ok = deleteProduct(slug);
  return Response.json({ ok });
}
