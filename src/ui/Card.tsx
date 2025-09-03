import React from "react";
import { clsx } from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  glass?: "light" | "medium" | "strong" | "dark";
  glow?: boolean;
  animated?: boolean;
}

export default function Card({
  children,
  className,
  padding = "md",
  hover = true,
  glass = "medium",
  glow = false,
  animated = true,
}: CardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-6",
    lg: "p-8",
  };

  const glassStyles = {
    light: "bg-white/10 backdrop-blur-xl border-white/20",
    medium: "bg-white/15 backdrop-blur-xl border-white/25",
    strong: "bg-white/25 backdrop-blur-2xl border-white/30",
    dark: "bg-black/15 backdrop-blur-xl border-white/10",
  };

  return (
    <div
      className={clsx(
        "relative rounded-2xl border transition-all duration-500 ease-out overflow-hidden",
        "shadow-glass",
        glassStyles[glass],
        hover && [
          "hover:bg-white/20 hover:border-white/35 hover:shadow-glass-lg hover:-translate-y-1",
          glow && "hover:shadow-glow",
        ],
        glow && "shadow-glow",
        animated && "animate-fade-in",
        paddingClasses[padding],
        className
      )}
    >
      {/* Glass shine effect */}
      <div className="absolute inset-0 bg-gradient-glass opacity-50 pointer-events-none" />

      {/* Inner glow */}
      <div className="absolute inset-0 rounded-2xl shadow-inner-glow pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Optional animated shine effect */}
      {hover && (
        <div
          className="absolute inset-0 bg-glass-shine opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            backgroundSize: "200% 100%",
            animation: hover ? "shimmer 2s infinite" : "none",
          }}
        />
      )}
    </div>
  );
}
