export type ForumReply = {
  author: string;
  dateISO: string;
  text: string;
};

export type ForumThread = {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  author: string;
  dateISO: string;
  replies: ForumReply[];
  productSlugs: string[]; // ilgili ürünlere yönlendirme
};

export const forumThreads: ForumThread[] = [
  {
    slug: "mor-sampuan-kurutuyor-mu",
    title: "Mor şampuan saçımı kurutuyor, neyi yanlış yapıyorum?",
    excerpt: "Haftada 3 kez kullanıyorum, saç uçlarım saman gibi oldu. Süre ve rutin nasıl olmalı?",
    tags: ["mor şampuan", "boyalı saç", "kuruluk"],
    author: "SalonKullanıcısı",
    dateISO: "2025-12-28",
    productSlugs: ["mor-sampuan-renk-koruyucu-300ml"],
    replies: [
      { author: "Uzman", dateISO: "2025-12-28", text: "Mor şampuanı haftada 1-2 ile sınırla. 1-3 dk yeterli. Sonrasında nem maskesi şart." },
      { author: "KuaförMert", dateISO: "2025-12-28", text: "Ben de aynı hatayı yapmıştım. Süreyi kısaltıp bakım ekleyince toparladı." },
    ],
  },
  {
    slug: "keratin-sonrasi-sampuan-secimi",
    title: "Keratin sonrası şampuan seçimi: tuzsuz şart mı?",
    excerpt: "İşlem yeni, hangi şampuanla yıkamalıyım? Isı koruyucu şart mı?",
    tags: ["keratin", "şampuan", "ısı koruyucu"],
    author: "DeneyenUser",
    dateISO: "2025-12-27",
    productSlugs: ["keratin-bakim-seti-3lu"],
    replies: [
      { author: "Uzman", dateISO: "2025-12-27", text: "Tuzsuz önerilir. İlk hafta kritik. Isı ile şekil veriyorsan ısı koruyucu şart." },
    ],
  },
  {
    slug: "sac-derisi-kasinti",
    title: "Saç derisi kaşıntı ve pullanma: ürün mü sebep oldu?",
    excerpt: "Yeni bir şampuan denedim, kaşıntı başladı. Deri rutini nasıl kurulur?",
    tags: ["saç derisi", "kaşıntı", "kepek"],
    author: "TolgaForum",
    dateISO: "2025-12-26",
    productSlugs: ["sac-serumu-biotin-50ml"],
    replies: [
      { author: "Uzman", dateISO: "2025-12-26", text: "Tahriş edici içerik olabilir. Nazik temizleme + serum/tonik ile bariyeri toparla." },
    ],
  },
];
