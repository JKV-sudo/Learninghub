import React from "react";
import { clsx } from "clsx";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  message?: string;
  glass?: boolean;
  glow?: boolean;
}

export default function LoadingSpinner({
  size = "md",
  className,
  message = "Lädt...",
  glass = false,
  glow = true,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center space-y-4",
        glass && "glass rounded-2xl p-8",
        className
      )}
    >
      {/* Multiple layered spinning elements for glassmorphic effect */}
      <div className="relative">
        {/* Outer glow ring */}
        <div
          className={clsx(
            "absolute inset-0 rounded-full animate-spin",
            glow && "shadow-glow",
            sizeClasses[size]
          )}
          style={{ animationDuration: "2s" }}
        >
          <div className="w-full h-full rounded-full border-2 border-transparent bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 bg-clip-border animate-pulse" />
        </div>

        {/* Main spinner */}
        <svg
          className={clsx("animate-spin relative z-10", sizeClasses[size])}
          fill="none"
          viewBox="0 0 24 24"
          style={{ animationDuration: "1.5s" }}
        >
          <circle
            className="opacity-20"
            cx="12"
            cy="12"
            r="10"
            stroke="url(#spinner-gradient)"
            strokeWidth="2"
          />
          <path
            className="opacity-80"
            fill="url(#spinner-gradient)"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />

          {/* Gradient definitions */}
          <defs>
            <linearGradient
              id="spinner-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
        </svg>

        {/* Inner pulse dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-glow" />
        </div>
      </div>

      {/* Floating dots animation */}
      <div className="flex space-x-1">
        <div
          className="w-2 h-2 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <div
          className="w-2 h-2 bg-gradient-to-r from-secondary-400 to-primary-400 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="w-2 h-2 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>

      {message && (
        <p className="text-sm font-medium text-white/80 animate-pulse text-center backdrop-blur-sm">
          {message}
        </p>
      )}
    </div>
  );
}
