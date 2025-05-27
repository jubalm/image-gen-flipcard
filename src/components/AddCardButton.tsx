import React from "react";

export function AddCardButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="fixed bottom-8 right-8 z-40 flex items-center justify-center w-16 h-16 rounded-full shadow-lg bg-[var(--color-primary)] text-[var(--color-foreground)] text-3xl hover:scale-105 active:scale-95 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/30"
      style={{ boxShadow: '0 4px 24px 0 rgba(80, 0, 120, 0.15)' }}
      onClick={onClick}
      aria-label="Add Card"
      type="button"
    >
      <span className="sr-only">Add Card</span>
      +
    </button>
  );
}
