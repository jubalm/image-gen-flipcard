"use client"
import { useState, useEffect } from "react"
import { ImageGenCard, Orientation } from "@/components/ImageGenCard"

const ORIENTATIONS: Orientation[] = [
  {
    value: "1024x1024",
    label: "Square",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="4"
          y="4"
          width="16"
          height="16"
          rx="3"
          fill="currentColor"
          fillOpacity="0.15"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    ),
    cardClass: "aspect-square w-96",
  },
  {
    value: "1024x1792",
    label: "Portrait",
    icon: (
      <svg
        width="18"
        height="28"
        viewBox="0 0 18 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="2"
          y="2"
          width="14"
          height="24"
          rx="3"
          fill="currentColor"
          fillOpacity="0.15"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    ),
    cardClass: "aspect-[100/175] w-72",
  },
  {
    value: "1792x1024",
    label: "Landscape",
    icon: (
      <svg
        width="32"
        height="16"
        viewBox="0 0 32 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="2"
          y="2"
          width="28"
          height="12"
          rx="3"
          fill="currentColor"
          fillOpacity="0.15"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    ),
    cardClass: "aspect-[175/100] h-72",
  },
]

type CardState = {
  input: string
  isLoading: boolean
  selectedOrientation: string
  image: string | null
  error: string | null
  flipped: boolean
}

function DarkModeSwitcher() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDark])

  useEffect(() => {
    // On mount, check system preference
    if (typeof window === "undefined") return
    setIsDark(
      document.documentElement.classList.contains("dark") ||
      window.matchMedia("(prefers-color-scheme: dark)").matches
    )
  }, [])

  return (
    <button
      className="fixed top-4 right-4 z-50 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full p-2 shadow transition-colors"
      onClick={(e) => {
        e.stopPropagation()
        setIsDark((d) => !d)
      }}
      aria-label="Toggle dark mode"
      type="button"
    >
      {isDark ? (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
          <path
            d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  )
}

export default function ImageGenPage() {
  const [cards, setCards] = useState<CardState[]>([
    {
      input: "A beautiful sunset over the mountains",
      isLoading: false,
      selectedOrientation: ORIENTATIONS[0].value,
      image: null,
      error: null,
      flipped: false,
    },
  ])

  const addCard = () => {
    setCards((cards) => [
      ...cards,
      {
        input: "",
        isLoading: false,
        selectedOrientation: ORIENTATIONS[0].value,
        image: null,
        error: null,
        flipped: false,
      },
    ])
  }

  const updateCard = (idx: number, updates: Partial<CardState>) => {
    setCards((cards) =>
      cards.map((c, i) => (i === idx ? { ...c, ...updates } : c))
    )
  }

  const handleGenerate = async (idx: number, e: React.FormEvent) => {
    e.preventDefault()
    updateCard(idx, { error: null, image: null })
    const card = cards[idx]
    if (!card.input.trim()) return
    updateCard(idx, { isLoading: true, flipped: true })
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: card.input,
          size: card.selectedOrientation,
        }),
      })
      const data = await res.json()
      if (res.ok && data.imageUrl) {
        setTimeout(() => updateCard(idx, { image: data.imageUrl }), 400)
      } else {
        updateCard(idx, { error: data.error || "Failed to generate image." })
      }
    } catch (err: any) {
      updateCard(idx, { error: err.message || "Network error." })
    } finally {
      updateCard(idx, { isLoading: false })
    }
  }

  const removeCard = (idx: number) => {
    setCards((cards) => cards.filter((_, i) => i !== idx))
  }

  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen p-4 transition-colors duration-300"
      style={{
        background: "var(--color-background)",
        color: "var(--color-foreground)",
      }}
    >
      <DarkModeSwitcher />

      <div
        className="mt-6 text-xs text-center max-w-md mb-4"
        style={{ color: "var(--color-foreground)", opacity: 0.7 }}
      >
        Click a card to flip and see your image, or flip back to try again. Choose
        orientation before generating.
      </div>
      <div className="flex flex-wrap gap-8 justify-center">
        {cards.map((card, idx) => (
          <ImageGenCard
            key={idx}
            input={card.input}
            isLoading={card.isLoading}
            selectedOrientation={card.selectedOrientation}
            image={card.image}
            error={card.error}
            flipped={card.flipped}
            orientations={ORIENTATIONS}
            onInputChange={(val) => updateCard(idx, { input: val })}
            onGenerate={(e) => handleGenerate(idx, e)}
            onFlip={() =>
              updateCard(idx, { flipped: !card.flipped, error: null })
            }
            onOrientationChange={(val) =>
              updateCard(idx, { selectedOrientation: val, error: null })
            }
            onRemove={() => removeCard(idx)}
          />
        ))}
      </div>
      <button
        className="mt-8 px-4 py-2 rounded"
        style={{
          background: "var(--color-primary)",
          color: "var(--color-foreground)",
        }}
        onClick={addCard}
      >
        + Add Card
      </button>
    </main>
  )
}
