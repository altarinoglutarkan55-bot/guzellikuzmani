"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Img = { src: string; alt: string };

function cn(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ");
}

export default function Gallery({ images }: { images: Img[] }) {
  const safe = useMemo(() => (images?.length ? images : [{ src: "/demo/urun-1.jpg", alt: "Ürün" }]), [images]);
  const [active, setActive] = useState(0);
  const img = safe[Math.min(active, safe.length - 1)];

  return (
    <div className="grid gap-3 lg:grid-cols-12">
      {/* thumbs */}
      <div className="order-2 flex gap-2 overflow-x-auto pb-1 lg:order-1 lg:col-span-2 lg:flex-col lg:overflow-visible">
        {safe.map((x, i) => {
          const is = i === active;
          return (
            <button
              key={x.src + i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative h-20 w-20 flex-none overflow-hidden rounded-2xl border bg-white",
                is ? "border-[#7C3AED] ring-2 ring-[#7C3AED]/15" : "border-zinc-200 hover:border-zinc-300"
              )}
              aria-label={`Görsel ${i + 1}`}
            >
              <Image src={x.src} alt={x.alt} fill className="object-cover" sizes="80px" />
            </button>
          );
        })}
      </div>

      {/* main */}
      <div className="order-1 lg:order-2 lg:col-span-10">
        <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50">
          <div className="relative aspect-square">
            <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(min-width:1024px) 720px, 100vw" priority />
          </div>
        </div>
      </div>
    </div>
  );
}
