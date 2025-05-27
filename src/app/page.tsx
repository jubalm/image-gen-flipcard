"use client"
import { useState, useEffect } from "react"
import { ImageGenCard, Orientation } from "@/components/ImageGenCard"
import { AddCardButton } from "@/components/AddCardButton"
import { DarkModeSwitcher } from "@/components/DarkModeSwitcher"

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
    cardClass:
      "aspect-square w-96 min-w-[16rem] min-h-[16rem] max-w-[24rem] max-h-[24rem] flex-none",
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

      <AddCardButton onClick={addCard} />
    </main>
  )
}
