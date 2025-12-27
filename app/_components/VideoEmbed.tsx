type Props = { provider: "youtube" | "vimeo"; id: string; title: string };

export default function VideoEmbed({ provider, id, title }: Props) {
  const src =
    provider === "youtube"
      ? `https://www.youtube-nocookie.com/embed/${id}`
      : `https://player.vimeo.com/video/${id}`;

  return (
    <div className="overflow-hidden rounded-[28px] border border-zinc-200 bg-black shadow-sm">
      <div className="relative aspect-video">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={src}
          title={title}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}
