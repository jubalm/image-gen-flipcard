import React from "react";

export function BackgroundGradient({ className = "" }: { className?: string }) {
  return (
    <div
      id="card-background"
      className={`absolute inset-0 z-10 animate-[gradient-move_8s_linear_infinite] bg-[conic-gradient(at_top_left,_#ec4899,_#6366f1,_#fde047)] ${className}`}
    />
  );
}
