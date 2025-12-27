import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/categories";

export default function CategoryGrid() {
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-xl font-extrabold text-zinc-900">Kategoriler</h2>
        <Link
          href="/magaza"
          className="text-sm font-bold text-[#7C3AED]"
        >
          Hepsini gör →
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm hover:shadow-md"
          >
            <div className="aspect-square bg-zinc-50">
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover transition group-hover:scale-105"
              />
            </div>

            <div className="absolute inset-x-0 bottom-0 bg-white/95 px-3 py-2 backdrop-blur">
              <p className="text-sm font-extrabold text-zinc-900">
                {cat.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
