"use client";

import { signIn } from "next-auth/react";

export default function GoogleButton({ label = "Google ile devam et" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() =>
        signIn("google", {
          callbackUrl: "/profil",
        })
      }
      className="w-full rounded-xl border px-4 py-3 text-sm font-semibold hover:bg-zinc-50"
    >
      {label}
    </button>
  );
}