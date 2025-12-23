import SurveyWizard from "./_components/SurveyWizard";

export default function AnketPage() {
  return (
    <div className="bg-white">
      <section className="mx-auto max-w-screen-md px-4 pt-10 pb-16">
        <p className="text-xs font-semibold tracking-wide text-zinc-500">UZMAN ANKETİ</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
          Saçını tanı, doğru ürünü bul.
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          60 saniyede biter. Sonunda sana uygun rutini ve mağazada doğru ürünleri göstereceğiz.
        </p>

        <div className="mt-8">
          <SurveyWizard />
        </div>

        <p className="mt-10 text-xs text-zinc-500">
          Not: Bu anket öneri amaçlıdır. İstersen uzman desteğiyle birlikte netleştiririz.
        </p>
      </section>
    </div>
  );
}
