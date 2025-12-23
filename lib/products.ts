// lib/products.ts
import productsData from "../data/products.json";

export type AnyProduct = Record<string, any>;

export function getAllProducts(): AnyProduct[] {
  // products.json: Array mi, {products:[...]} mi, {items:[...]} mi?
  if (Array.isArray(productsData)) return productsData as AnyProduct[];

  const any = productsData as any;

  if (any && Array.isArray(any.products)) return any.products as AnyProduct[];
  if (any && Array.isArray(any.items)) return any.items as AnyProduct[];
  if (any && Array.isArray(any.data)) return any.data as AnyProduct[];

  return [];
}

export function safeDecode(v: string) {
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}

export function normalizeSlug(v: any) {
  return safeDecode(String(v ?? ""))
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");
}

export function getProductSlug(p: AnyProduct) {
  const direct =
    p?.slug ??
    p?.handle ??
    p?.urlSlug ??
    p?.productSlug ??
    p?.seo?.slug ??
    p?.seoSlug;

  if (direct) return normalizeSlug(direct);

  const maybeUrl = p?.url || p?.permalink || p?.href || p?.link || "";
  if (typeof maybeUrl === "string" && maybeUrl) {
    const clean = maybeUrl.split("?")[0].split("#")[0];
    const parts = clean.split("/").filter(Boolean);
    if (parts.length) return normalizeSlug(parts[parts.length - 1]);
  }

  return normalizeSlug(p?.id ?? p?.sku ?? "");
}

export function getProductName(p: AnyProduct) {
  return p?.name || p?.title || "Ürün";
}
