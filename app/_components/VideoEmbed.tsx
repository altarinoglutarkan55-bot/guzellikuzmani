"use client";

import React from "react";

type Provider = "youtube" | "mp4";

type Props = {
  provider?: Provider;

  // yeni kullanım
  url?: string;

  // geriye uyumluluk (eski olası isimler)
  src?: string;
  videoUrl?: string;

  className?: string;
};

function normalizeUrl(p: Props) {
  return (p.url || p.src || p.videoUrl || "").trim();
}

function youtubeEmbedUrl(raw: string) {
  // raw zaten embed ise dokunma
  if (raw.includes("youtube.com/embed/")) return raw;

  // youtu.be/ID
  const m1 = raw.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
  if (m1?.[1]) return `https://www.youtube.com/embed/${m1[1]}`;

  // youtube.com/watch?v=ID
  const m2 = raw.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
  if (m2?.[1]) return `https://www.youtube.com/embed/${m2[1]}`;

  // fallback: direkt ver
  return raw;
}

export default function VideoEmbed(props: Props) {
  const provider = (props.provider || "youtube") as Provider;
  const url = normalizeUrl(props);
  if (!url) return null;

  if (provider === "mp4") {
    return (
      <video
        className={props.className || "w-full rounded-3xl border border-zinc-200 bg-black"}
        src={url}
        controls
        playsInline
      />
    );
  }

  const embed = youtubeEmbedUrl(url);

  return (
    <div className={props.className || "aspect-video w-full overflow-hidden rounded-3xl border border-zinc-200 bg-black"}>
      <iframe
        className="h-full w-full"
        src={embed}
        title="Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
