"use client";

import React, { useState, useRef, useEffect } from "react";

export default function AgentChat() {
  const [messages, setMessages] = useState<{ role: "user" | "agent"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Create a placeholder for the agent's stream
      setMessages((prev) => [...prev, { role: "agent", content: "" }]);

      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                setMessages((prev) => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1].content += data.content;
                  return newMessages;
                });
              } else if (data.error) {
                console.error("Agent Error:", data.error);
              }
            } catch (err) {
              // Ignore incomplete JSON parses
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to connect to agent:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "600px", maxWidth: "800px", margin: "0 auto",
      backgroundColor: "rgba(17, 24, 39, 0.7)", backdropFilter: "blur(12px)", 
      borderRadius: "24px", border: "1px solid rgba(255, 255, 255, 0.1)",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", overflow: "hidden",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      {/* Header */}
      <div style={{
        padding: "20px 24px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        background: "linear-gradient(135deg, rgba(37,99,235,0.2) 0%, rgba(147,51,234,0.2) 100%)"
      }}>
        <h2 style={{ margin: 0, color: "#fff", fontSize: "1.25rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#10b981", boxShadow: "0 0 10px #10b981" }} />
          Retry Recovery Agent
        </h2>
        <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }}>
          AI-powered payment resolution assistant
        </p>
      </div>

      {/* Chat Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {messages.length === 0 ? (
          <div style={{ margin: "auto", textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
            <p>Send a message to start.</p>
            <p style={{ fontSize: "0.8rem" }}>Try: "Analyze failed payment case CASE-1001"</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "80%",
              padding: "12px 16px",
              borderRadius: "16px",
              borderBottomRightRadius: msg.role === "user" ? "4px" : "16px",
              borderBottomLeftRadius: msg.role === "agent" ? "4px" : "16px",
              backgroundColor: msg.role === "user" ? "#3b82f6" : "rgba(255, 255, 255, 0.05)",
              color: "#fff",
              border: msg.role === "agent" ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
              lineHeight: "1.5",
              whiteSpace: "pre-wrap",
              fontSize: "0.95rem"
            }}>
              {msg.content}
            </div>
          ))
        )}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div style={{ alignSelf: "flex-start", padding: "12px 16px", color: "rgba(255,255,255,0.6)" }}>
            <span style={{ animation: "pulse 1.5s infinite" }}>Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} style={{
        padding: "20px", borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        backgroundColor: "rgba(0,0,0,0.2)", display: "flex", gap: "12px"
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the agent to analyze a payment case..."
          style={{
            flex: 1, padding: "14px 20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)",
            backgroundColor: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "1rem", outline: "none",
            transition: "border-color 0.2s"
          }}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          style={{
            padding: "0 24px", borderRadius: "12px", border: "none",
            backgroundColor: isLoading || !input.trim() ? "rgba(59,130,246,0.5)" : "#3b82f6",
            color: "#fff", fontSize: "1rem", fontWeight: "600", cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
            transition: "background-color 0.2s", boxShadow: "0 4px 14px 0 rgba(59, 130, 246, 0.39)"
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
