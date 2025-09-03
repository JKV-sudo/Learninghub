import React from "react";
import { clsx } from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "danger" | "ghost" | "glass";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  glow?: boolean;
  animated?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  children,
  className,
  disabled,
  glow = false,
  animated = true,
  ...props
}: ButtonProps) {
  const baseClasses =
    "relative inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group";

  const variantClasses = {
    primary: [
      "bg-gradient-to-r from-primary-500 to-primary-600 text-white",
      "hover:from-primary-400 hover:to-primary-500 hover:shadow-glow",
      "focus:ring-primary-500/50",
      "shadow-glass transform hover:scale-105 hover:-translate-y-0.5",
    ].join(" "),
    secondary: [
      "bg-white/10 backdrop-blur-xl border border-white/20 text-white",
      "hover:bg-white/20 hover:border-white/30 hover:shadow-glass-lg",
      "focus:ring-white/50",
      "transform hover:scale-105 hover:-translate-y-0.5",
    ].join(" "),
    success: [
      "bg-gradient-to-r from-success-500 to-success-600 text-white",
      "hover:from-success-400 hover:to-success-500 hover:shadow-glow",
      "focus:ring-success-500/50",
      "shadow-glass transform hover:scale-105 hover:-translate-y-0.5",
    ].join(" "),
    danger: [
      "bg-gradient-to-r from-error-500 to-error-600 text-white",
      "hover:from-error-400 hover:to-error-500 hover:shadow-glow",
      "focus:ring-error-500/50",
      "shadow-glass transform hover:scale-105 hover:-translate-y-0.5",
    ].join(" "),
    ghost: [
      "text-white/90 hover:text-white",
      "hover:bg-white/10 hover:backdrop-blur-lg",
      "focus:ring-white/30",
    ].join(" "),
    glass: [
      "bg-white/15 backdrop-blur-xl border border-white/25 text-white",
      "hover:bg-white/25 hover:border-white/35 hover:shadow-glass-lg",
      "focus:ring-white/50",
      "transform hover:scale-105 hover:-translate-y-0.5",
    ].join(" "),
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm font-medium",
    lg: "px-8 py-4 text-base font-medium",
  };

  return (
    <button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        glow && "shadow-glow hover:shadow-glow-lg",
        animated && "animate-fade-in",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Glass shine effect */}
      <div className="absolute inset-0 bg-gradient-glass opacity-50 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Ripple effect background */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

      {/* Content */}
      <div className="relative z-10 flex items-center">
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {icon && !isLoading && <span className="mr-2">{icon}</span>}
        {children}
      </div>
    </button>
  );
}
