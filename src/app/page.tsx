"use client";
import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "system", content: "Welcome! Describe an image you want to generate." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages((msgs) => [...msgs, userMessage]);
    setInput("");
    setIsLoading(true);
    // Placeholder for image generation API call
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        { role: "assistant", content: "[Image will appear here for: " + userMessage.content + "]" }
      ]);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <main className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`max-w-xl mx-auto p-3 rounded-lg shadow ${msg.role === "user" ? "bg-blue-100 text-right" : "bg-white text-left"}`}>
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div className="max-w-xl mx-auto p-3 rounded-lg bg-gray-200 animate-pulse">Generating image...</div>
        )}
      </div>
      <form onSubmit={handleSend} className="flex p-4 bg-white border-t gap-2">
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
