// lib/products.ts
export type Product = {
  slug: string;
  title: string;
  price: number;
  bullets: string[];
  howto: string[];
  tags?: string[];
};

// Demo "DB" (memory). Vercel'de yeniden deploy olunca sıfırlanır.
let PRODUCTS: Product[] = [
  {
    slug: "isi-koruyucu-sprey",
    title: "Isı Koruyucu Sprey",
    price: 249,
    bullets: [
      "Saçı ısıya karşı korur",
      "Fön ve maşa öncesi kullanıma uygundur",
      "Saçı ağırlaştırmaz",
    ],
    howto: [
      "Nemli veya kuru saça uygulanır",
      "Fön veya maşa öncesi eşit şekilde sıkılır",
      "Durulanmaz",
    ],
    tags: ["ısı", "fön", "maşa"],
  },
  {
    slug: "keratin-bakim-seti",
    title: "Keratin Bakım Seti",
    price: 499,
    bullets: [
      "Yıpranmış saç görünümünü toparlamaya yardımcı",
      "Elektriklenmeyi azaltmaya yardımcı",
      "Daha yumuşak tarama hissi",
    ],
    howto: [
      "Şampuanla yıka ve durula",
      "Maskeyi 5–10 dk beklet, durula",
      "Serumu nemli saç uçlarına uygula (durulanmaz)",
    ],
    tags: ["keratin", "onarım"],
  },
];

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function addProduct(product: Product): Product {
  // slug aynıysa güncelle
  const idx = PRODUCTS.findIndex((p) => p.slug === product.slug);
  if (idx >= 0) {
    PRODUCTS[idx] = product;
    return PRODUCTS[idx];
  }
  PRODUCTS = [product, ...PRODUCTS];
  return product;
}

export function deleteProduct(slug: string): boolean {
  const before = PRODUCTS.length;
  PRODUCTS = PRODUCTS.filter((p) => p.slug !== slug);
  return PRODUCTS.length !== before;
}
