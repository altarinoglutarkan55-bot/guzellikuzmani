"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type Choice = {
  id: string;
  title: string;
  desc?: string;
  emoji?: string;
};

type Question = {
  id: string;
  title: string;
  subtitle?: string;
  type: "single" | "multi";
  choices: Choice[];
};

type Answers = Record<string, string | string[]>;

type DemoProduct = {
  slug: string;
  title: string;
  price: number;
  category: string; // magaza kat
  tags: string[];   // magaza c=
  img: string;
  badge?: string;
};

function cn(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ");
}

function pct(step: number, total: number) {
  if (total <= 0) return 0;
  const capped = Math.min(step + 1, total);
  return Math.round((capped / total) * 100);
}

function toArray(v: string | string[] | undefined) {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

function formatTRY(n: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(n);
}

/** Demo ürünler (anket sonuç bandı için) */
const DEMO_PRODUCTS: DemoProduct[] = [
  { slug: "mor-parlaklik-sampuan", title: "Mor Parlaklık Şampuanı 500ml", price: 349.9, category: "sampuan", tags: ["boyali", "yipranma"], img: "/demo/urun-1.jpg", badge: "Çok Satan" },
  { slug: "renk-koruyucu-krem", title: "Renk Koruyucu Bakım Kremi", price: 279.9, category: "sac", tags: ["boyali", "kuru"], img: "/demo/urun-2.jpg", badge: "Yeni" },
  { slug: "keratin-maske", title: "Keratin Onarıcı Maske", price: 399.9, category: "maske", tags: ["yipranma", "kuru"], img: "/demo/urun-3.jpg", badge: "Popüler" },
  { slug: "isirgan-tonik", title: "Saç Derisi Tonik – Isırgan", price: 229.9, category: "tonik", tags: ["dokulme", "yagli"], img: "/demo/urun-4.jpg" },
  { slug: "arindirici-sampuan", title: "Arındırıcı Şampuan", price: 319.9, category: "sampuan", tags: ["yagli", "kepek"], img: "/demo/urun-4.jpg" },
  { slug: "nem-serumu", title: "Nem Serum – İpeksi Dokunuş", price: 289.9, category: "serum", tags: ["kuru"], img: "/demo/urun-2.jpg" },
];

const QUESTIONS: Question[] = [
  {
    id: "hair_color",
    title: "Saçın boyalı mı?",
    subtitle: "Bu bilgi renk koruma / onarım rutini için önemli.",
    type: "single",
    choices: [
      { id: "boyalı", title: "Boyalı", desc: "Renk koruma odaklı", emoji: "🎨" },
      { id: "boyasız", title: "Boyasız", desc: "Denge & bakım", emoji: "🌿" },
    ],
  },
  {
    id: "process",
    title: "Saçında işlem var mı?",
    subtitle: "Röfle, balyaj, ombre, perma vb.",
    type: "multi",
    choices: [
      { id: "rofle", title: "Röfle", emoji: "✨" },
      { id: "balyaj", title: "Balyaj", emoji: "🌟" },
      { id: "ombre", title: "Ombre", emoji: "🌈" },
      { id: "perma", title: "Perma", emoji: "🌀" },
      { id: "keratin", title: "Keratin / Brezilya fön", emoji: "💎" },
      { id: "yok", title: "Yok", emoji: "✅" },
    ],
  },
  {
    id: "scalp",
    title: "Saç derin nasıl?",
    subtitle: "Dengeyi doğru kurarsak her şey kolaylaşır.",
    type: "single",
    choices: [
      { id: "normal", title: "Normal", desc: "Dengeli", emoji: "🙂" },
      { id: "yagli", title: "Yağlı", desc: "Arındırma / denge", emoji: "💧" },
      { id: "kuru", title: "Kuru", desc: "Nem / yatıştırma", emoji: "🌵" },
      { id: "kepek", title: "Kepek", desc: "Arındırma + bakım", emoji: "🧼" },
    ],
  },
  {
    id: "loss",
    title: "Saç dökülmesi yaşıyor musun?",
    subtitle: "Dökülme rutini ayrı tasarlanır.",
    type: "single",
    choices: [
      { id: "evet", title: "Evet", desc: "Tonik + bakım", emoji: "🧴" },
      { id: "hayir", title: "Hayır", desc: "Standart rutin", emoji: "👌" },
    ],
  },
  {
    id: "ends",
    title: "Uçlarda kırılma / yıpranma var mı?",
    subtitle: "Maske & onarım ürünleri için belirleyici.",
    type: "single",
    choices: [
      { id: "var", title: "Var", desc: "Onarım odaklı", emoji: "🛠️" },
      { id: "yok", title: "Yok", desc: "Koruma odaklı", emoji: "🧡" },
    ],
  },
  {
    id: "preference",
    title: "Tercihin hangisi?",
    subtitle: "Rutinin hedefini belirler.",
    type: "single",
    choices: [
      { id: "uzat", title: "Uzatmak istiyorum", desc: "Kök & uç dengesi", emoji: "📏" },
      { id: "kisa", title: "Kısaltmak istiyorum", desc: "Bakım kolaylığı", emoji: "✂️" },
    ],
  },
  {
    id: "natural",
    title: "İçerikte önceliğin ne?",
    subtitle: "Doğal/organik hassasiyeti olanlar için filtreleriz.",
    type: "single",
    choices: [
      { id: "dogal", title: "Doğal/organik öncelikli", desc: "Daha temiz içerik", emoji: "🌿" },
      { id: "farketmez", title: "Fark etmez", desc: "Sonuç odaklı", emoji: "🎯" },
    ],
  },
];

function computeTags(answers: Answers) {
  const tags = new Set<string>();

  const hairColor = answers.hair_color as string | undefined;
  if (hairColor === "boyalı") tags.add("boyali");

  const scalp = answers.scalp as string | undefined;
  if (scalp === "yagli") tags.add("yagli");
  if (scalp === "kuru") tags.add("kuru");
  if (scalp === "kepek") tags.add("kepek");

  const loss = answers.loss as string | undefined;
  if (loss === "evet") tags.add("dokulme");

  const ends = answers.ends as string | undefined;
  if (ends === "var") tags.add("yipranma");

  return Array.from(tags);
}

function computeCategoryHint(answers: Answers) {
  const loss = answers.loss as string | undefined;
  const scalp = answers.scalp as string | undefined;
  const ends = answers.ends as string | undefined;

  if (loss === "evet") return { kat: "tonik", label: "Tonik" };
  if (scalp === "kepek" || scalp === "yagli") return { kat: "sampuan", label: "Şampuan" };
  if (ends === "var") return { kat: "maske", label: "Maske" };
  return { kat: "sac", label: "Saç Bakım" };
}

function scoreProduct(p: DemoProduct, tags: string[], kat: string) {
  let s = 0;
  if (p.category === kat) s += 3;
  for (const t of tags) if (p.tags.includes(t)) s += 2;
  return s;
}

export default function SurveyWizard() {
  const total = QUESTIONS.length;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const isResult = step >= total;
  const isLastQuestion = step === total - 1;

  const q: Question | null = !isResult ? QUESTIONS[step] ?? null : null;

  const progress = pct(step, total);

  const selectedSingle = q ? ((answers[q.id] as string | undefined) ?? "") : "";
  const selectedMulti = q ? toArray(answers[q.id] as any) : [];

  const canNext = useMemo(() => {
    if (!q) return false;
    const a = answers[q.id];
    if (!a) return false;
    if (q.type === "single") return typeof a === "string" && a.length > 0;
    return Array.isArray(a) && a.length > 0;
  }, [answers, q]);

  const tags = useMemo(() => computeTags(answers), [answers]);
  const catHint = useMemo(() => computeCategoryHint(answers), [answers]);

  const magazaUrl = useMemo(() => {
    const sp = new URLSearchParams();
    if (catHint.kat) sp.set("kat", catHint.kat);
    tags.forEach((t) => sp.append("c", t));
    sp.set("sort", "pop");
    return `/magaza?${sp.toString()}`;
  }, [tags, catHint.kat]);

  const recommended = useMemo(() => {
    const kat = catHint.kat;
    const scored = DEMO_PRODUCTS
      .map((p) => ({ p, s: scoreProduct(p, tags, kat) }))
      .sort((a, b) => b.s - a.s)
      .map((x) => x.p);

    // en az 3 göster
    return scored.slice(0, 3);
  }, [tags, catHint.kat]);

  const next = () => {
    if (!q) return;
    if (!canNext) return;
    if (isLastQuestion) setStep(total);
    else setStep((s) => Math.min(s + 1, total));
  };

  const back = () => {
    if (isResult) {
      setStep(total - 1);
      return;
    }
    if (step === 0) return;
    setStep((s) => Math.max(s - 1, 0));
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
  };

  const toggleMulti = (choiceId: string) => {
    if (!q) return;

    const current = toArray(answers[q.id] as any);

    if (choiceId === "yok") {
      setAnswers((a) => ({ ...a, [q.id]: ["yok"] }));
      return;
    }

    const base = current.filter((x) => x !== "yok");
    const exists = base.includes(choiceId);
    const nextArr = exists ? base.filter((x) => x !== choiceId) : [...base, choiceId];

    setAnswers((a) => ({ ...a, [q.id]: nextArr }));
  };

  const setSingle = (choiceId: string) => {
    if (!q) return;
    setAnswers((a) => ({ ...a, [q.id]: choiceId }));
  };

  return (
    <div className="relative">
      <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold tracking-wide text-zinc-500">
            {isResult ? "SONUÇ" : `SORU ${step + 1} / ${total}`}
          </p>
          {!isResult ? (
            <button type="button" onClick={restart} className="text-xs font-semibold text-[#7C3AED] hover:underline">
              Sıfırla
            </button>
          ) : null}
        </div>

        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
          <div className="h-full rounded-full bg-[#7C3AED]" style={{ width: `${isResult ? 100 : progress}%` }} />
        </div>

        {!isResult && q ? (
          <div className="mt-5">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900">{q.title}</h2>
            {q.subtitle ? <p className="mt-2 text-sm text-zinc-600">{q.subtitle}</p> : null}

            <div className="mt-5 grid gap-3">
              {q.choices.map((c) => {
                const active = q.type === "single" ? selectedSingle === c.id : selectedMulti.includes(c.id);

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => (q.type === "single" ? setSingle(c.id) : toggleMulti(c.id))}
                    className={cn(
                      "w-full rounded-3xl border p-4 text-left transition",
                      "bg-white hover:border-zinc-300",
                      active ? "border-[#7C3AED]/30 bg-[#7C3AED]/5 ring-2 ring-[#7C3AED]/10" : "border-zinc-200"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn("flex h-10 w-10 flex-none items-center justify-center rounded-2xl", active ? "bg-[#7C3AED]/10" : "bg-zinc-50 ring-1 ring-zinc-200")}>
                        <span className="text-lg">{c.emoji ?? "•"}</span>
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-zinc-900">{c.title}</p>
                        {c.desc ? <p className="mt-1 text-xs text-zinc-600">{c.desc}</p> : null}
                      </div>

                      <div className="ml-auto">
                        <span className={cn("inline-flex h-5 w-5 items-center justify-center rounded-full border", active ? "border-[#7C3AED] bg-[#7C3AED]/10" : "border-zinc-300 bg-white")}>
                          {active ? <span className="text-xs font-bold text-[#7C3AED]">✓</span> : null}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-5">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900">Senin için önerimiz</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Seçimlerine göre mağazada doğru ürünleri filtreledik. Aşağıda hızlı öneriler de var.
            </p>

            <div className="mt-5 grid gap-3">
              <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs font-semibold tracking-wide text-zinc-500">ÖNCE</p>
                <p className="mt-1 text-sm font-semibold text-zinc-900">{catHint.label} odaklı başla</p>
                <p className="mt-1 text-xs text-zinc-600">Bu seçim, rutinin temelini hızlı kurar.</p>
              </div>

              <div className="rounded-3xl border border-zinc-200 bg-white p-4">
                <p className="text-xs font-semibold tracking-wide text-zinc-500">FİLTRELER</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(tags.length ? tags : ["popüler"]).map((t) => (
                    <span key={t} className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-700">
                      {t.replaceAll("-", " ")}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended band */}
              <div className="rounded-3xl border border-zinc-200 bg-white p-4">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-zinc-500">RECOMMENDED</p>
                    <p className="mt-1 text-sm font-semibold text-zinc-900">Senin için seçtik</p>
                  </div>
                  <Link href={magazaUrl} className="text-xs font-semibold text-[#7C3AED] hover:underline">
                    Tümünü gör
                  </Link>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {recommended.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/urun/${p.slug}`}
                      className="group rounded-3xl border border-zinc-200 bg-white p-3 hover:border-zinc-300"
                    >
                      <div className="relative overflow-hidden rounded-2xl bg-zinc-50 ring-1 ring-zinc-200">
                        <div className="relative aspect-square">
                          <Image src={p.img} alt={p.title} fill className="object-cover" sizes="(min-width: 640px) 200px, 33vw" />
                        </div>
                        {p.badge ? (
                          <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold text-zinc-800 ring-1 ring-zinc-200">
                            {p.badge}
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-3 line-clamp-2 text-sm font-semibold text-zinc-900 group-hover:text-[#7C3AED]">
                        {p.title}
                      </p>
                      <p className="mt-1 text-sm font-bold text-zinc-900">{formatTRY(p.price)}</p>
                      <p className="mt-1 text-xs text-zinc-500">{p.category.replaceAll("-", " ")}</p>
                    </Link>
                  ))}
                </div>
              </div>

              <Link href={magazaUrl} className="inline-flex w-full items-center justify-center rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:opacity-95">
                Mağazada önerileri gör
              </Link>

              <button type="button" onClick={restart} className="text-center text-sm font-semibold text-[#7C3AED] hover:underline">
                Anketi yeniden yap
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sticky bottom bar */}
      {!isResult ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-screen-md items-center gap-3 px-4 py-3">
            <button
              type="button"
              onClick={back}
              disabled={step === 0}
              className={cn(
                "rounded-2xl border px-4 py-3 text-sm font-semibold",
                step === 0 ? "border-zinc-200 bg-zinc-100 text-zinc-400" : "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-300"
              )}
            >
              Geri
            </button>

            <button
              type="button"
              onClick={next}
              disabled={!canNext}
              className={cn("ml-auto w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white", canNext ? "bg-[#7C3AED] hover:opacity-95" : "bg-zinc-300")}
            >
              {isLastQuestion ? "Sonucu gör" : "Devam"}
            </button>
          </div>
        </div>
      ) : (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-screen-md items-center gap-3 px-4 py-3">
            <button
              type="button"
              onClick={back}
              className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 hover:border-zinc-300"
            >
              Geri
            </button>
            <Link
              href={magazaUrl}
              className="ml-auto inline-flex w-full items-center justify-center rounded-2xl bg-[#7C3AED] px-4 py-3 text-sm font-semibold text-white hover:opacity-95"
            >
              Mağazaya git
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
