"use client";

import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className="px-2 py-1 bg-neutral-bg border border-border text-[10px] font-medium uppercase tracking-widest hover:bg-border transition-colors text-text-primary"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
