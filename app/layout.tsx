import type { Metadata } from "next";
import "./globals.css";

import Providers from "@/app/providers";
import TopNav from "@/app/_components/TopNav";
import CartDrawer from "@/app/_components/CartDrawer";

export const metadata: Metadata = {
  title: "Güzellik Uzmanı",
  description: "Saç ve saç derisi odaklı ürün önerileri, mağaza ve uzman desteği.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <Providers>
          <TopNav />
          {children}
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
