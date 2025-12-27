"use client";

import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  href: string;
  event: Record<string, any>;
  className?: string;
  children: ReactNode;
};

export default function TrackEventLink({ href, event, className, children }: Props) {
  const onClick = () => {
    try {
      const payload = JSON.stringify({
        ts: Date.now(),
        ...event,
      });

      // sendBeacon varsa en iyisi
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/events", blob);
        return;
      }

      // fallback
      fetch("/api/events", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    } catch {}
  };

  return (
    <Link href={href} onClick={onClick} className={className}>
      {children}
    </Link>
  );
}
