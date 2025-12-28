import { NextRequest, NextResponse } from "next/server";
import { blogPosts, BlogPost } from "@/data/blogPosts";

export async function GET() {
  return NextResponse.json(blogPosts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.slug || !body.title) {
    return NextResponse.json({ error: "slug ve title zorunludur" }, { status: 400 });
  }

  const exists = blogPosts.find((b) => b.slug === body.slug);
  if (exists) {
    return NextResponse.json({ error: "Bu slug zaten mevcut" }, { status: 409 });
  }

  const item: BlogPost = {
    slug: body.slug,
    title: body.title,
    excerpt: body.excerpt || "",
    dateISO: new Date().toISOString().slice(0, 10),
    tags: body.tags || [],
    content: body.content || [],
    video: body.video,
    productSlugs: body.productSlugs || [],
    author: body.author || "Güzellik Uzmanı",
  };

  blogPosts.unshift(item);

  return NextResponse.json(item, { status: 201 });
}
