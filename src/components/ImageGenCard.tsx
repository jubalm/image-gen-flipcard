import { BackgroundGradient } from "@/components/BackgroundGradient"
import React from "react"

export type Orientation = {
  value: string
  label: string
  icon: React.ReactNode
  cardClass: string
}

export type ImageGenCardProps = {
  input: string
  isLoading: boolean
  selectedOrientation: string
  image: string | null
  error: string | null
  flipped: boolean
  orientations: Orientation[]
  onInputChange: (value: string) => void
  onGenerate: (e: React.FormEvent) => void
  onFlip: () => void
  onOrientationChange: (value: string) => void
  onRemove?: () => void
}

export function ImageGenCard({
  input,
  isLoading,
  selectedOrientation,
  image,
  error,
  flipped,
  orientations,
  onInputChange,
  onGenerate,
  onFlip,
  onOrientationChange,
  onRemove,
}: ImageGenCardProps) {
  const orientationObj = orientations.find(o => o.value === selectedOrientation) || orientations[0]

  return (
    <div
      className={`relative ${orientationObj.cardClass} perspective cursor-pointer select-none transition-all duration-500`}
      onClick={onFlip}
    >
      <div
        className={`absolute inset-0 w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${flipped ? "rotate-y-180" : ""}`}
      >
        {/* Front: Form */}
        <div
          className="absolute inset-0 w-full h-full rounded shadow-lg flex flex-col justify-center items-center gap-6 [backface-visibility:hidden] bg-muted-background text-foreground"
        >
          <form
            onSubmit={onGenerate}
            className="w-full flex flex-col gap-4 px-8"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex w-full justify-between items-center mb-2">
              <label className="font-semibold">Describe your image</label>
              {onRemove && (
                <button
                  type="button"
                  className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded border border-red-200 bg-red-50 ml-2 transition-colors"
                  onClick={e => {
                    e.stopPropagation()
                    onRemove()
                  }}
                  aria-label="Remove card"
                >
                  Remove
                </button>
              )}
            </div>
            <input
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring disabled:opacity-50"
              value={input}
              onChange={e => onInputChange(e.target.value)}
              placeholder="Describe an image to generate..."
              disabled={isLoading}
            />
            <div className="flex gap-2">
              {orientations.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  className={`flex items-center justify-center border rounded px-3 py-2 text-lg transition-colors focus:outline-none focus:ring disabled:opacity-50 ${selectedOrientation === o.value ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`}
                  onClick={() => onOrientationChange(o.value)}
                  disabled={isLoading}
                  aria-label={o.label}
                >
                  <span>{o.icon}</span>
                </button>
              ))}
            </div>
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? "Generating..." : "Generate"}
            </button>
          </form>
        </div>
        {/* Back: Image */}
        <div className="absolute inset-0 w-full h-full rounded shadow-lg [backface-visibility:hidden] rotate-y-180 flex flex-col items-center justify-center overflow-hidden">
          <BackgroundGradient className="rounded" />
          {isLoading && (
            <div className="relative z-10 w-full h-full flex items-center justify-center text-white font-bold text-lg animate-pulse">Generating image...</div>
          )}
          {image && !isLoading && (
            <img
              src={image.startsWith('data:') ? image : `data:image/png;base64,${image}`}
              alt="Generated"
              className="relative z-10 rounded max-w-full max-h-full mx-auto shadow transition-opacity duration-700 opacity-100"
              style={{ transition: 'opacity 0.7s' }}
            />
          )}
          {error && (
            <div className="relative z-10 text-red-600 mt-4 bg-white bg-opacity-80 px-4 py-2 rounded">{error}</div>
          )}
        </div>
      </div>
    </div>
  )
}
