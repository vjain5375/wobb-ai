interface AvatarProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-10 h-10",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
};

export function Avatar({ src, alt, size = "md", className = "" }: AvatarProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={[
        "rounded-full object-cover border-2 border-[var(--border)] bg-[var(--surface-elevated)] shrink-0",
        sizeClasses[size],
        className,
      ].join(" ")}
    />
  );
}
