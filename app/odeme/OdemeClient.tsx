"use client";

export default function OdemeClient() {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-extrabold text-zinc-900">Ödeme</h2>

      <div className="mt-4 grid gap-3">
        <input
          className="h-11 rounded-2xl border border-zinc-200 px-4 text-sm outline-none focus:border-zinc-300"
          placeholder="Kart üzerindeki isim"
        />
        <input
          className="h-11 rounded-2xl border border-zinc-200 px-4 text-sm outline-none focus:border-zinc-300"
          placeholder="Kart numarası (Demo)"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            className="h-11 rounded-2xl border border-zinc-200 px-4 text-sm outline-none focus:border-zinc-300"
            placeholder="SKT (AA/YY)"
          />
          <input
            className="h-11 rounded-2xl border border-zinc-200 px-4 text-sm outline-none focus:border-zinc-300"
            placeholder="CVV"
          />
        </div>

        <button
          type="button"
          onClick={() => alert("Demo ödeme: sipariş alındı (gerçek entegrasyon sonra).")}
          className="mt-2 h-11 rounded-2xl bg-[#7C3AED] px-4 text-sm font-extrabold text-white hover:opacity-95"
        >
          Siparişi Tamamla (Demo)
        </button>

        <p className="text-xs text-zinc-500">
          * Bu sayfa demo. İyzico / Stripe / PayTR gibi ödeme entegrasyonu daha sonra.
        </p>
      </div>
    </section>
  );
}
