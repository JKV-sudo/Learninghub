import React, { useState, useRef, useEffect } from "react";
import { clsx } from "clsx";
import type { Item, Option } from "../types";

interface SwipeCardProps {
  item: Item;
  index: number;
  totalItems: number;
  onSwipe: (direction: "left" | "right", selectedOption?: Option) => void;
  isTop: boolean;
  zIndex: number;
}

export default function SwipeCard({
  item,
  index,
  totalItems,
  onSwipe,
  isTop,
  zIndex,
}: SwipeCardProps) {
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Calculate rotation and opacity based on drag offset
  const rotation = Math.min(Math.max(dragOffset.x / 10, -15), 15);
  const opacity = Math.max(1 - Math.abs(dragOffset.x) / 200, 0.7);
  const scale = 1 - Math.abs(dragOffset.x) / 1000;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isTop) return;
    setDragStart({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isTop) return;
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX, y: touch.clientY });
    setIsDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStart || !isDragging || !isTop) return;
      const newOffset = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      };
      setDragOffset(newOffset);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!dragStart || !isDragging || !isTop) return;
      const touch = e.touches[0];
      const newOffset = {
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      };
      setDragOffset(newOffset);
      e.preventDefault();
    };

    const handleEnd = () => {
      if (!isDragging || !isTop) return;

      const threshold = 100;
      if (Math.abs(dragOffset.x) > threshold) {
        const direction = dragOffset.x > 0 ? "right" : "left";
        onSwipe(direction, selectedOption || undefined);
      }

      setDragStart(null);
      setDragOffset({ x: 0, y: 0 });
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchend", handleEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [dragStart, dragOffset, isDragging, isTop, onSwipe, selectedOption]);

  const handleOptionSelect = (option: Option) => {
    if (!isTop) return;
    setSelectedOption(option);
  };

  const handleSwipeButton = (direction: "left" | "right") => {
    if (!isTop) return;
    onSwipe(direction, selectedOption || undefined);
  };

  // Calculate stack positioning
  const stackOffset = Math.min(index * 8, 16);
  const stackScale = Math.max(1 - index * 0.03, 0.94);

  return (
    <div
      ref={cardRef}
      className={clsx(
        "absolute inset-0 w-full max-w-md mx-auto transition-all duration-300 ease-out",
        isTop ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
      )}
      style={{
        transform: isTop
          ? `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg) scale(${scale})`
          : `translateY(${stackOffset}px) scale(${stackScale})`,
        opacity: isTop ? opacity : 1 - index * 0.1,
        zIndex: zIndex,
        transformOrigin: "center center",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div
        className={clsx(
          "bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden h-96",
          !isTop && "shadow-lg"
        )}
      >
        {/* Card Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium opacity-90">
              Frage {index + 1} von {totalItems}
            </span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
              {item.type}
            </span>
          </div>
          <h2 className="text-lg font-semibold leading-tight">{item.text}</h2>
        </div>

        {/* Options */}
        <div className="p-6 flex-1 overflow-y-auto">
          {item.options && item.options.length > 0 ? (
            <div className="space-y-3">
              {item.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option)}
                  className={clsx(
                    "w-full p-4 text-left rounded-2xl border-2 transition-all duration-200",
                    selectedOption?.id === option.id
                      ? "border-blue-500 bg-blue-50 text-blue-900 shadow-md"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"
                  )}
                  disabled={!isTop}
                >
                  <span className="text-sm font-medium">{option.text}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-gray-500">
              <div className="text-center">
                <span className="text-2xl mb-2 block">📝</span>
                <p className="text-sm">Freie Texteingabe</p>
              </div>
            </div>
          )}
        </div>

        {/* Swipe Actions */}
        {isTop && (
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <button
                onClick={() => handleSwipeButton("left")}
                className="flex items-center space-x-2 px-6 py-3 bg-red-500 text-white rounded-2xl font-medium shadow-lg hover:bg-red-600 transition-all duration-200 hover:scale-105"
              >
                <span>❌</span>
                <span>Falsch</span>
              </button>

              <div className="text-center text-xs text-gray-500">
                <div>Wische oder klicke</div>
                <div className="flex items-center space-x-1 mt-1">
                  <span>👈</span>
                  <span>Falsch</span>
                  <span>•</span>
                  <span>Richtig</span>
                  <span>👉</span>
                </div>
              </div>

              <button
                onClick={() => handleSwipeButton("right")}
                className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-2xl font-medium shadow-lg hover:bg-green-600 transition-all duration-200 hover:scale-105"
              >
                <span>✅</span>
                <span>Richtig</span>
              </button>
            </div>
          </div>
        )}

        {/* Drag indicators */}
        {isTop && isDragging && (
          <>
            <div
              className={clsx(
                "absolute top-16 left-8 text-6xl font-bold transition-opacity",
                dragOffset.x < -50 ? "opacity-100" : "opacity-0"
              )}
              style={{ color: "#ef4444" }}
            >
              ❌
            </div>
            <div
              className={clsx(
                "absolute top-16 right-8 text-6xl font-bold transition-opacity",
                dragOffset.x > 50 ? "opacity-100" : "opacity-0"
              )}
              style={{ color: "#22c55e" }}
            >
              ✅
            </div>
          </>
        )}
      </div>
    </div>
  );
}
