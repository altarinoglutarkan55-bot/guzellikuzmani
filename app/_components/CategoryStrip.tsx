import Link from "next/link";
import { categories } from "@/data/categories";

export default function CategoryStrip() {
  return (
    <div className="mt-8 border-y border-zinc-200 bg-white">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="flex gap-5 overflow-x-auto py-4 scrollbar-hide">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="flex min-w-[84px] flex-col items-center gap-2 rounded-xl px-2 py-2 hover:bg-zinc-50"
            >
              <div className="grid h-12 w-12 place-items-center rounded-full bg-zinc-100 text-xl">
                {cat.icon}
              </div>
              <span className="text-xs font-bold text-zinc-800 text-center">
                {cat.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
