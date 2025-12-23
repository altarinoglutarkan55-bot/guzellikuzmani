"use client";

import { useState } from "react";

function cn(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ");
}

export default function ProductTabs({
  description,
  details,
}: {
  description?: string;
  details?: { key: string; value: string }[];
}) {
  const [tab, setTab] = useState<"aciklama" | "ozellik" | "yorum">("aciklama");

  const tabs: Array<{ id: typeof tab; label: string }> = [
    { id: "aciklama", label: "Açıklama" },
    { id: "ozellik", label: "Özellikler" },
    { id: "yorum", label: "Yorumlar" },
  ];

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold ring-1 transition",
                active
                  ? "bg-[#7C3AED] text-white ring-[#7C3AED]"
                  : "bg-white text-zinc-700 ring-zinc-200 hover:ring-zinc-300"
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        {tab === "aciklama" && (
          <p className="whitespace-pre-line text-sm leading-6 text-zinc-700">
            {description ?? "Açıklama yakında."}
          </p>
        )}

        {tab === "ozellik" && (
          <>
            {!!details?.length ? (
              <div className="overflow-hidden rounded-xl ring-1 ring-zinc-200">
                <dl className="divide-y divide-zinc-200">
                  {details.map((d) => (
                    <div
                      key={d.key}
                      className="grid grid-cols-3 gap-4 bg-white px-4 py-3 text-sm"
                    >
                      <dt className="col-span-1 font-medium text-zinc-600">
                        {d.key}
                      </dt>
                      <dd className="col-span-2 text-zinc-900">{d.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : (
              <p className="text-sm text-zinc-600">Özellikler yakında.</p>
            )}
          </>
        )}

        {tab === "yorum" && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl bg-zinc-50 p-4 ring-1 ring-zinc-200"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-zinc-900">
                    Kullanıcı {i}
                  </p>
                  <p className="text-xs text-zinc-500">2 gün önce</p>
                </div>
                <p className="mt-2 text-sm text-zinc-700">
                  Ürün beklediğimden iyi çıktı. Kokusu çok hoş, saçım daha
                  yumuşak.
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
