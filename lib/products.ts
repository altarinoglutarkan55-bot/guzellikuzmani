import products from "@/data/products.json";

export type Product = {
  slug: string;
  title: string;
  brand?: string;
  category?: string;
  price: number;
  compareAtPrice?: number | null;
  images?: { src: string; alt?: string }[];
  tags?: string[];
};

function normalize(s: string) {
  return s.toLowerCase().trim();
}

export function getAllProducts(): Product[] {
  return products as Product[];
}

export function getProductBySlug(slug: string): Product | undefined {
  return (products as Product[]).find((p) => p.slug === slug);
}

export function searchProducts({
  q,
  category,
}: {
  q?: string;
  category?: string;
}): Product[] {
  let list = products as Product[];

  if (q) {
    const qq = normalize(q);
    list = list.filter((p) =>
      normalize(
        `${p.title} ${p.brand ?? ""} ${(p.tags ?? []).join(" ")}`
      ).includes(qq)
    );
  }

  if (category) {
    const c = normalize(category);
    list = list.filter((p) => normalize(p.category ?? "") === c);
  }

  return list;
}
