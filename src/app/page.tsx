"use client";
import { useState, useEffect } from "react";

const SIZES = [
  {
    value: "1024x1024",
    label: "Square",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="16" height="16" rx="3" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    value: "1024x1792",
    label: "Portrait",
    icon: (
      <svg width="18" height="28" viewBox="0 0 18 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="14" height="24" rx="3" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    value: "1792x1024",
    label: "Landscape",
    icon: (
      <svg width="32" height="16" viewBox="0 0 32 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="28" height="12" rx="3" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
];

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
  type?: "image" | "error";
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", content: "Welcome! Describe an image you want to generate." }
  ]);
  const [input, setInput] = useState("A beautiful sunset over the mountains");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>(SIZES[0].value);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage: Message = { role: "user", content: input };
    setMessages((msgs) => [...msgs, userMessage]);
    setInput("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input, size: selectedSize }),
      });
      const data = await res.json();
      if (res.ok && data.imageUrl) {
        setMessages((msgs) => [
          ...msgs,
          { role: "assistant", content: data.imageUrl, type: "image" },
        ]);
      } else {
        setMessages((msgs) => [
          ...msgs,
          { role: "assistant", content: data.error || "Failed to generate image.", type: "error" },
        ]);
      }
    } catch (err: any) {
      setMessages((msgs) => [
        ...msgs,
        { role: "assistant", content: err.message || "Network error.", type: "error" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`max-w-xl mx-auto p-3 rounded-lg shadow ${msg.role === "user" ? "bg-blue-100 text-right" : msg.type === "error" ? "bg-red-100 text-left" : "bg-white text-left"}`}>
            {msg.type === "image" ? (
              <div className="flex flex-col items-center">
                {isLoading && msg === messages.find(m => m.type === "image" && m === msg) ? (
                  <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded mb-2 animate-pulse">Regenerating...</div>
                ) : (
                  <img src={msg.content.startsWith('data:') ? msg.content : `data:image/png;base64,${msg.content}`} alt="Generated" className="rounded max-w-full mx-auto mb-2" />
                )}
                <button
                  className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300 transition-colors"
                  onClick={async () => {
                    // Clear the image while loading
                    setMessages((msgs) => msgs.map((m, idx) => idx === i ? { ...m, content: "", type: "image" } : m));
                    setIsLoading(true);
                    try {
                      const res = await fetch("/api/generate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ prompt: messages[i-1]?.content || input, size: selectedSize }),
                      });
                      const data = await res.json();
                      if (res.ok && data.imageUrl) {
                        setMessages((msgs) => msgs.map((m, idx) => idx === i ? { ...m, content: data.imageUrl, type: "image" } : m));
                      } else {
                        setMessages((msgs) => [
                          ...msgs,
                          { role: "assistant", content: data.error || "Failed to generate image.", type: "error" },
                        ]);
                      }
                    } catch (err: any) {
                      setMessages((msgs) => [
                        ...msgs,
                        { role: "assistant", content: err.message || "Network error.", type: "error" },
                      ]);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  disabled={isLoading}
                >
                  Regenerate
                </button>
              </div>
            ) : (
              msg.content
            )}
          </div>
        ))}
        {isLoading && (
          <div className="max-w-xl mx-auto p-3 rounded-lg bg-gray-200 animate-pulse">Generating image...</div>
        )}
      </div>
      <form onSubmit={handleSend} className="flex flex-col sm:flex-row p-4 bg-white border-t gap-2">
        <div className="flex gap-2 mb-2 sm:mb-0">
          {SIZES.map((size) => (
            <button
              key={size.value}
              type="button"
              className={`flex items-center justify-center border rounded px-3 py-2 text-lg transition-colors focus:outline-none focus:ring ${selectedSize === size.value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`}
              onClick={() => setSelectedSize(size.value)}
              disabled={isLoading}
              aria-label={size.label}
            >
              <span>{size.icon}</span>
            </button>
          ))}
        </div>
        <input
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Describe an image to generate..."
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={isLoading || !input.trim()}
        >
          Send
        </button>
      </form>
    </main>
  );
}
