export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  cover?: string;
  tags: string[];
  author: string;
  minutes: number;
  dateISO: string; // YYYY-MM-DD
  video?: {
    provider: "youtube" | "vimeo";
    id: string; // youtube video id
  };
  productSlugs: string[]; // /urun/[slug] ile bağlanır
  content: Array<
    | { type: "p"; text: string }
    | { type: "h2"; text: string }
    | { type: "ul"; items: string[] }
    | { type: "quote"; text: string }
  >;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "mor-sampuan-rehberi",
    title: "Mor Şampuan Rehberi: Sararmayı Nasıl Dengeler?",
    excerpt:
      "Boyalı sarı/platinde sararmayı nötrlemek için mor şampuanı doğru kullanma taktikleri. Sıklık, süre, hatalar…",
    cover: "/demo/blog-mor.jpg",
    tags: ["video", "mor şampuan", "boyalı saç", "renk koruma"],
    author: "Uzman Editör",
    minutes: 6,
    dateISO: "2025-12-28",
    video: { provider: "youtube", id: "dQw4w9WgXcQ" },
    productSlugs: ["mor-sampuan-renk-koruyucu-300ml"],
    content: [
      { type: "p", text: "Mor şampuan, sarı ve platin tonlarda oluşan istenmeyen sararmayı nötrlemeye yardımcı olur. Ancak yanlış kullanım saçta kuruluk ve matlık yaratabilir." },
      { type: "h2", text: "Doğru kullanım" },
      { type: "ul", items: ["Haftada 1-2 kez yeterli.", "Saçta 1-3 dk beklet, uzatmak kurutabilir.", "Sonrasında mutlaka nemlendirici bakım uygula."] },
      { type: "quote", text: "Mor şampuanın etkisi süre değil, düzenli ve dengeli kullanım." },
      { type: "p", text: "Videoda uygulamayı adım adım gösteriyorum. Uygun mor şampuanı seçmek için ürün sayfasına göz atabilirsin." }
    ],
  },
  {
    slug: "keratin-sonrasi-bakim",
    title: "Keratin Sonrası Bakım: 7 Gün Kuralı ve Ürün Seçimi",
    excerpt:
      "Keratin işleminden sonra ilk hafta yapılan hatalar sonucu bozar. Doğru şampuan, maske ve ısı koruyucu rehberi.",
    cover: "/demo/blog-keratin.jpg",
    tags: ["video", "keratin", "bakım", "ısı koruyucu"],
    author: "Salon Uzmanı",
    minutes: 8,
    dateISO: "2025-12-27",
    video: { provider: "youtube", id: "dQw4w9WgXcQ" },
    productSlugs: ["keratin-bakim-seti-3lu"],
    content: [
      { type: "p", text: "Keratin sonrası doğru ürün kullanımı işlemin kalıcılığını ciddi şekilde etkiler. İlk hafta özellikle kritik." },
      { type: "h2", text: "İlk 7 gün checklist" },
      { type: "ul", items: ["Tuzsuz şampuan tercih et.", "Saçı çok sık toplama/iz yapma.", "Isı ile şekillendireceksen ısı koruyucu şart."] },
      { type: "p", text: "Aşağıdaki önerilen ürünlerle rutini kolayca kurabilirsin." }
    ],
  },
  {
    slug: "sac-dokulmesi-ve-deri-rutini",
    title: "Saç Dökülmesi ve Saç Derisi Rutini: Nereden Başlamalı?",
    excerpt:
      "Dökülme dönemlerinde saç derisi bariyerini korumak ve doğru serum/tonik seçimi için pratik rehber.",
    cover: "/demo/blog-deri.jpg",
    tags: ["makale", "saç dökülmesi", "saç derisi", "serum"],
    author: "Uzman Editör",
    minutes: 7,
    dateISO: "2025-12-26",
    productSlugs: ["sac-serumu-biotin-50ml"],
    content: [
      { type: "p", text: "Dökülmenin tek bir sebebi yoktur. Ancak saç derisi rutini çoğu zaman ihmal edilir." },
      { type: "h2", text: "Rutinin temeli" },
      { type: "ul", items: ["Nazik temizleme", "Düzenli tonik/serum", "Kırılma önleyici bakım (uçlar)"] },
      { type: "p", text: "Ürün önerilerini aşağıdan inceleyip direkt ürün sayfasına geçebilirsin." }
    ],
  },
];
