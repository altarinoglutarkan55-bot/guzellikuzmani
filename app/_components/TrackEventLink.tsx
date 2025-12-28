"use client";

import Link from "next/link";
import React from "react";

type Props = {
  href: string;
  className?: string;
  children: React.ReactNode;

  // Yeni kullanım (blog/product click tracking)
  eventName?: string;
  payload?: Record<string, any>;

  // Eski/alternatif kullanım (varsa)
  event?: Record<string, any>;
};

function sendEvent(body: any) {
  try {
    const json = JSON.stringify(body);

    // sendBeacon varsa en sağlam (sayfa değişirken bile gönderir)
    if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
      const ok = (navigator as any).sendBeacon(
        "/api/events",
        new Blob([json], { type: "application/json" })
      );
      if (ok) return;
    }

    // fallback
    fetch("/api/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: json,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // sessiz geç
  }
}

export default function TrackEventLink({
  href,
  className,
  children,
  eventName,
  payload,
  event,
}: Props) {
  const onClick = React.useCallback(() => {
    // 1) event objesi verilmişse onu gönder
    if (event && typeof event === "object") {
      sendEvent(event);
      return;
    }

    // 2) eventName + payload verilmişse normalize edip gönder
    if (eventName) {
      sendEvent({ name: eventName, ...(payload || {}) });
    }
  }, [eventName, payload, event]);

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
