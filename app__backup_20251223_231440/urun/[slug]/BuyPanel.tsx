"use client";

import { useMemo, useState } from "react";

type Variants = { name: string; options: string[] }[];

function cn(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ");
}

export default function BuyPanel({
  inStock,
  variants,
}: {
  inStock: boolean;
  variants?: Variants;
}) {
  const initial = useMemo(() => {
    const obj: Record<string, string> = {};
    (variants ?? []).forEach((v) => {
      if (v.options?.length) obj[v.name] = v.options[0];
    });
    return obj;
  }, [variants]);

  const [selected, setSelected] = useState<Record<string, string>>(initial);

  return (
    <div className="mt-5 space-y-5">
      {!!variants?.length && (
        <div className="space-y-4">
          {variants.map((v) => (
            <div key={v.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-900">{v.name}</p>
                <span className="text-xs text-zinc-500">
                  {selected[v.name] ?? ""}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {v.options.map((opt) => {
                  const isActive = selected[v.name] === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() =>
                        setSelected((prev) => ({ ...prev, [v.name]: opt }))
                      }
                      className={cn(
                        "rounded-full px-3 py-2 text-sm transition ring-1",
                        isActive
                          ? "bg-[#7C3AED] text-white ring-[#7C3AED]"
                          : "bg-white text-zinc-800 ring-zinc-200 hover:ring-zinc-300"
                      )}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <button
          disabled={!inStock}
          onClick={() => alert("Sepete eklendi (demo)")}
          className="w-full rounded-xl bg-[#7C3AED] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Sepete Ekle
        </button>

        <button
          disabled={!inStock}
          onClick={() => alert("Hemen al (demo)")}
          className="w-full rounded-xl bg-[#DB2777] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Hemen Al
        </button>

        <button
          onClick={() => alert("Favorilere eklendi (demo)")}
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 hover:border-zinc-300"
        >
          Favorilere Ekle
        </button>

        <p className="text-center text-xs text-zinc-500">
          Seçimler:{" "}
          {Object.entries(selected)
            .map(([k, v]) => `${k}: ${v}`)
            .join(" • ")}
        </p>
      </div>
    </div>
  );
}
