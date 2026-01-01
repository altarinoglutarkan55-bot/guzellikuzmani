"use client";

export default function GoogleButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold hover:bg-zinc-50"
    >
      Google ile devam et
    </button>
  );
}