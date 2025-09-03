import React from "react";
import { clsx } from "clsx";

interface BadgeProps {
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "gray"
    | "glass";
  size?: "sm" | "md";
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  animated?: boolean;
}

export default function Badge({
  variant = "glass",
  size = "md",
  children,
  className,
  glow = false,
  animated = true,
}: BadgeProps) {
  const baseClasses =
    "inline-flex items-center font-medium rounded-full transition-all duration-300 relative overflow-hidden";

  const variantClasses = {
    primary: [
      "bg-gradient-to-r from-primary-500/20 to-primary-600/20 text-primary-200",
      "border border-primary-400/30 backdrop-blur-xl",
      "hover:from-primary-400/30 hover:to-primary-500/30",
    ].join(" "),
    secondary: [
      "bg-gradient-to-r from-secondary-500/20 to-secondary-600/20 text-secondary-200",
      "border border-secondary-400/30 backdrop-blur-xl",
      "hover:from-secondary-400/30 hover:to-secondary-500/30",
    ].join(" "),
    success: [
      "bg-gradient-to-r from-success-500/20 to-success-600/20 text-success-200",
      "border border-success-400/30 backdrop-blur-xl",
      "hover:from-success-400/30 hover:to-success-500/30",
    ].join(" "),
    warning: [
      "bg-gradient-to-r from-warning-500/20 to-warning-600/20 text-warning-200",
      "border border-warning-400/30 backdrop-blur-xl",
      "hover:from-warning-400/30 hover:to-warning-500/30",
    ].join(" "),
    error: [
      "bg-gradient-to-r from-error-500/20 to-error-600/20 text-error-200",
      "border border-error-400/30 backdrop-blur-xl",
      "hover:from-error-400/30 hover:to-error-500/30",
    ].join(" "),
    gray: [
      "bg-white/10 text-white/80 border border-white/20 backdrop-blur-xl",
      "hover:bg-white/20 hover:text-white",
    ].join(" "),
    glass: [
      "bg-white/15 text-white border border-white/25 backdrop-blur-xl",
      "hover:bg-white/25 hover:border-white/35",
    ].join(" "),
  };

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-xs",
  };

  return (
    <span
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        glow && "shadow-glow",
        animated && "animate-fade-in",
        "hover:scale-105 hover:shadow-glass",
        className
      )}
    >
      {/* Glass shine effect */}
      <div className="absolute inset-0 bg-gradient-glass opacity-30 pointer-events-none rounded-full" />

      {/* Content */}
      <span className="relative z-10 font-medium">{children}</span>
    </span>
  );
}
