import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uzmanımıza Danışın",
  description: "Saç tipinizi öğrenelim, size özel ürün ve bakım önerisi sunalım.",
};

export default function AnketLayout({ children }: { children: React.ReactNode }) {
  return children;
}
