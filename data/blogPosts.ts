export type BlogVideo =
  | { provider: "youtube"; url: string; title?: string; thumbnailUrl?: string }
  | { provider: "mp4"; url: string; title?: string; thumbnailUrl?: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  dateISO: string;
  coverImage?: string;
  tags: string[];
  video?: BlogVideo;
  content: string[];          // madde madde içerik
  productSlugs?: string[];    // ilgili ürünler
  author?: string;
  published?: boolean; // admin: taslak/yayın
};

export const blogPosts: BlogPost[] = [
  {
    slug: "mor-sampuan-nasil-kullanilir",
    published: true,
    title: "Mor Şampuan Nasıl Kullanılır? Profesyonel Rehber",
    excerpt: "Sarılık kontrolü, doğru bekleme süresi, hangi saç tipinde nasıl uygulanır? Kuaför mantığıyla net rehber.",
    dateISO: "2025-12-28",
    tags: ["Mor Şampuan", "Boyalı Saç", "Renk Koruma"],
    video: {
      provider: "youtube",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      title: "Mor Şampuan Uygulama (Demo)",
      thumbnailUrl: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
    },
    content: [
      "Islak saça uygulayın, önce köpürtün.",
      "İlk kullanımda 1-2 dk bekletin; sarılık çoksa 3-5 dk’ya çıkarın.",
      "Saç çok gözenekliyse maske ile dengeleyin.",
      "Haftada 1-2 kullanım çoğu kişi için yeterli."
    ],
    productSlugs: [
      "mor-sampuan-renk-koruyucu-300ml",
      "mor-parlaklik-sampuani-500ml",
      "keratin-onarici-maske"
    ],
    author: "Güzellik Uzmanı"
  },
  {
    slug: "keratin-sonrasi-bakim",
    published: true,
    title: "Keratin Sonrası Bakım: 7 Gün Kuralı + Ürün Seçimi",
    excerpt: "Keratin sonrası yapılan en yaygın 5 hata ve doğru ürün rutini.",
    dateISO: "2025-12-28",
    tags: ["Keratin", "Onarım", "Isı Koruma"],
    content: [
      "Sülfatsız şampuan ile başlayın.",
      "İlk hafta agresif arındırıcı kullanmayın.",
      "Isı kullanıyorsanız mutlaka ısı koruyucu ekleyin.",
      "Maske + leave-in ile kırılma riskini düşürün."
    ],
    productSlugs: [
      "keratin-onarici-maske",
      "renk-koruyucu-bakim-kremi"
    ],
    author: "Güzellik Uzmanı"
  }
];
