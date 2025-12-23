// app/layout.tsx
import "./globals.css";
import AppHeader from "./_components/AppHeader";
import Providers from "./providers";
import CartDrawer from "./_components/CartDrawer";
import SiteFooter from "./components/SiteFooter";
import MobileBottomNav from "./components/MobileBottomNav";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-white text-zinc-900 overflow-x-hidden">
        <Providers>
          <AppHeader />
          <CartDrawer />
          <main className="pb-16 md:pb-0">{children}</main>
          <SiteFooter />
          <MobileBottomNav />
        </Providers>
      </body>
    </html>
  );
}
