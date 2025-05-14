"use client";
import { useState, useRef } from "react";
import { BackgroundGradient } from "@/components/BackgroundGradient";

const ORIENTATIONS = [
  {
    value: "1024x1024",
    label: "Square",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="16" height="16" rx="3" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    cardClass: "aspect-square w-96",
  },
  {
    value: "1024x1792",
    label: "Portrait",
    icon: (
      <svg width="18" height="28" viewBox="0 0 18 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="14" height="24" rx="3" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    cardClass: "aspect-[100/175] w-72",
  },
  {
    value: "1792x1024",
    label: "Landscape",
    icon: (
      <svg width="32" height="16" viewBox="0 0 32 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="28" height="12" rx="3" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    cardClass: "aspect-[175/100] h-72",
  },
];

export default function ImageGenPage() {
  const [input, setInput] = useState("A beautiful sunset over the mountains");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrientation, setSelectedOrientation] = useState<string>(ORIENTATIONS[0].value);
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const orientationObj = ORIENTATIONS.find(o => o.value === selectedOrientation) || ORIENTATIONS[0];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setImage(null);
    if (!input.trim()) return;
    setIsLoading(true);
    setFlipped(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input, size: selectedOrientation }),
      });
      const data = await res.json();
      if (res.ok && data.imageUrl) {
        setTimeout(() => setImage(data.imageUrl), 400); // allow transition
      } else {
        setError(data.error || "Failed to generate image.");
      }
    } catch (err: any) {
      setError(err.message || "Network error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlip = () => {
    setFlipped((f) => !f);
    setError(null);
    // Do not clear image on flip
  };

  const handleOrientationChange = (value: string) => {
    setSelectedOrientation(value);
    setError(null);
    // Do not clear image when changing orientation
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div
        ref={cardRef}
        className={`relative ${orientationObj.cardClass} perspective cursor-pointer select-none transition-all duration-500`}
        onClick={handleFlip}
      >
        <div
          className={`absolute inset-0 w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${flipped ? "rotate-y-180" : ""}`}
        >
          {/* Front: Form */}
          <div className="absolute inset-0 w-full h-full bg-white rounded shadow-lg flex flex-col justify-center items-center gap-6 [backface-visibility:hidden]">
            <form
              onSubmit={handleGenerate}
              className="w-full flex flex-col gap-4 px-8"
              onClick={e => e.stopPropagation()}
            >
              <label className="font-semibold">Describe your image</label>
              <input
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring disabled:opacity-50"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Describe an image to generate..."
                disabled={isLoading}
              />
              <div className="flex gap-2">
                {ORIENTATIONS.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    className={`flex items-center justify-center border rounded px-3 py-2 text-lg transition-colors focus:outline-none focus:ring disabled:opacity-50 ${selectedOrientation === o.value ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`}
                    onClick={() => handleOrientationChange(o.value)}
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
      <div className="mt-6 text-xs text-gray-400 text-center max-w-md">
        Click the card to flip and see your image, or flip back to try again. Choose orientation before generating.
      </div>
    </main>
  );
}
