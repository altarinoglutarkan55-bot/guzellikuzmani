import "./globals.css";
import AppHeader from "./_components/AppHeader";

export const metadata = {
  title: "Güzellik Uzmanı",
  description: "Saç & bakım için uzman önerileri ve alışveriş.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-white text-zinc-900 overflow-x-hidden">
        <AppHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
