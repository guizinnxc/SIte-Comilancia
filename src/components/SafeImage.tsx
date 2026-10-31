import { useState } from "react";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fit?: "cover" | "contain";
  objectPosition?: string;
  loading?: "lazy" | "eager";
  sizes?: string;
}

/*
 * Imagem com fallback. Se o arquivo ainda não existir em public/images,
 * exibe um quadro neutro no lugar, sem quebrar o layout.
 */
export function SafeImage({
  src,
  alt,
  className = "",
  fit = "cover",
  objectPosition,
  loading = "lazy",
  sizes = "100vw",
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const fitClass = fit === "cover" ? "object-cover" : "object-contain";
  const surface = fit === "cover" ? "bg-graphite" : "bg-transparent";

  return (
    <div className={`relative overflow-hidden ${surface} ${className}`}>
      {failed ? (
        <Placeholder label={alt} />
      ) : (
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          sizes={sizes}
          onError={() => setFailed(true)}
          style={objectPosition ? { objectPosition } : undefined}
          className={`absolute inset-0 h-full w-full ${fitClass}`}
        />
      )}
    </div>
  );
}

function Placeholder({ label }: { label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-graphite via-ink to-ink"
    >
      <div className="absolute inset-4 border border-gold/20" />
      <span className="font-script text-8xl text-gold/60 md:text-9xl">C</span>
    </div>
  );
}
