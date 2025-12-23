import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mağaza",
  description: "Saç bakım ürünleri, profesyonel kullanım önerileri ve uzman desteği.",
};

export default function MagazaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
