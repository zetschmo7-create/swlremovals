import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  overlay?: "dark" | "green" | "gradient" | "none";
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
};

export function CinematicImage({
  src,
  alt,
  overlay = "gradient",
  className = "",
  imageClassName = "",
  priority,
  fill = true,
  width,
  height,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: Props) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill={fill && !width}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className={`object-cover transition-transform duration-700 group-hover:scale-105 ${imageClassName}`}
      />
      {overlay === "dark" && (
        <div className="absolute inset-0 bg-black/50" aria-hidden />
      )}
      {overlay === "green" && (
        <div
          className="absolute inset-0 bg-gradient-to-t from-green-950/80 via-green-900/40 to-green-900/20"
          aria-hidden
        />
      )}
      {overlay === "gradient" && (
        <div
          className="absolute inset-0 bg-gradient-to-t from-green-950/85 via-green-950/40 to-transparent"
          aria-hidden
        />
      )}
    </div>
  );
}
