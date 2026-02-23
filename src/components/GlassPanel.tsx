"use client";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: "gold" | "matrix" | "none";
  padding?: boolean;
}

export function GlassPanel({
  children,
  className = "",
  glow = "gold",
  padding = true,
  ...props
}: GlassPanelProps) {
  const glowClass =
    glow === "gold" ? "gold-glow-hover" : glow === "matrix" ? "hover:shadow-[0_0_30px_rgba(0,255,65,0.12)]" : "";
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl transition-all duration-300 ease-out ${glowClass} ${padding ? "p-4" : ""} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
