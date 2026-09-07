"use client";

import { useState, useRef, useEffect } from "react";
import { FiCopy, FiFileText, FiExternalLink, FiChevronDown, FiMessageSquare, FiCommand } from "react-icons/fi";

const OpenAILogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M22.28 11.83a8.88 8.88 0 0 0-.58-3.9 8.94 8.94 0 0 0-7.3-5.26 8.87 8.87 0 0 0-6.13 1.83 8.94 8.94 0 0 0-6 6.8 8.88 8.88 0 0 0 .58 3.9 8.94 8.94 0 0 0 7.3 5.26 8.87 8.87 0 0 0 6.13-1.83 8.94 8.94 0 0 0 6-6.8Zm-15.1 4.5a6.45 6.45 0 0 1-1.32-6.52L9 12.5v5.82a1.2 1.2 0 0 0 1.2 1.2h3.4l-4.14 2.4a6.42 6.42 0 0 1-2.28-5.59ZM16.8 7.7a6.45 6.45 0 0 1 1.32 6.52L15 11.5V5.68a1.2 1.2 0 0 0-1.2-1.2h-3.4l4.14-2.4A6.42 6.42 0 0 1 16.8 7.7ZM8.32 18.2 10.4 17h5.18l-3.14 5.43a6.45 6.45 0 0 1-6.83.6 6.42 6.42 0 0 1-2.61-4.83Zm9.36-12.4L15.6 7H10.42l3.14-5.43a6.45 6.45 0 0 1 6.83-.6 6.42 6.42 0 0 1 2.61 4.83ZM4.8 14.7l4.14-2.4 2.6 4.5-4.15 2.4a6.45 6.45 0 0 1-4.73-1.1A6.42 6.42 0 0 1 4.8 14.7Zm14.4-5.4-4.14 2.4-2.6-4.5 4.15-2.4a6.45 6.45 0 0 1 4.73 1.1A6.42 6.42 0 0 1 19.2 9.3Z"/>
  </svg>
);

const AnthropicLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M12.63 2H9.87L2 22h3.1l1.83-4.73h10.14L18.9 22h3.1L12.63 2zM8.07 14.65l3.93-10.2 3.93 10.2H8.07z"/>
  </svg>
);

const PerplexityLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M16.5 3H7.5A4.5 4.5 0 0 0 3 7.5v9A4.5 4.5 0 0 0 7.5 21h9a4.5 4.5 0 0 0 4.5-4.5v-9A4.5 4.5 0 0 0 16.5 3Zm-9 2h9a2.5 2.5 0 0 1 2.5 2.5v1.25H5V7.5A2.5 2.5 0 0 1 7.5 5ZM5 16.5v-5.75h4.25V19H7.5A2.5 2.5 0 0 1 5 16.5Zm14 0a2.5 2.5 0 0 1-2.5 2.5h-5.25v-8.25H19v5.75Z"/>
  </svg>
);

export function AgentMenu({ content }: { content: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setIsOpen(false);
  };

  return (
    <div className="relative z-40" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#333] text-sm text-[#ddd] px-3 py-1.5 rounded-md font-sans transition-colors shadow-sm"
      >
        <FiCopy size={14} />
        {copied ? "Copied!" : "Copy page"}
        <FiChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-[#1a1a1a] border border-[#333] rounded-md shadow-2xl overflow-hidden font-sans text-left z-50">
          <div className="flex flex-col py-1">
            <button 
              onClick={handleCopy}
              className="flex items-start gap-3 w-full px-4 py-3 hover:bg-[#2a2a2a] transition-colors text-left"
            >
              <div className="mt-0.5 text-text-secondary"><FiCopy size={16} /></div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#eee]">Copy page</span>
                <span className="text-xs text-text-muted">Copy page as Markdown for LLMs</span>
              </div>
            </button>
            
            <a 
              href="/agents.md"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 w-full px-4 py-3 hover:bg-[#2a2a2a] transition-colors"
            >
              <div className="mt-0.5 text-text-secondary"><FiFileText size={16} /></div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#eee] flex items-center gap-1">View as Markdown <FiExternalLink size={12} /></span>
                <span className="text-xs text-text-muted">View this page as plain text</span>
              </div>
            </a>

            <div className="h-px bg-[#333] my-1 mx-4"></div>

            <a 
              href="https://chatgpt.com/?prompt=Read+from+https%3A%2F%2Fretry-buildathon.vercel.app%2Fagents.md+so+I+can+ask+questions+about+it."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 w-full px-4 py-3 hover:bg-[#2a2a2a] transition-colors"
            >
              <div className="mt-0.5 text-text-secondary"><OpenAILogo /></div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#eee] flex items-center gap-1">Open in ChatGPT <FiExternalLink size={12} /></span>
                <span className="text-xs text-text-muted">Ask questions about this page</span>
              </div>
            </a>

            <a 
              href="https://claude.ai/new?q=Read+from+https%3A%2F%2Fretry-buildathon.vercel.app%2Fagents.md+so+I+can+ask+questions+about+it."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 w-full px-4 py-3 hover:bg-[#2a2a2a] transition-colors"
            >
              <div className="mt-0.5 text-text-secondary"><AnthropicLogo /></div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#eee] flex items-center gap-1">Open in Claude <FiExternalLink size={12} /></span>
                <span className="text-xs text-text-muted">Ask questions about this page</span>
              </div>
            </a>

            <a 
              href="https://www.perplexity.ai/?q=Read+from+https%3A%2F%2Fretry-buildathon.vercel.app%2Fagents.md+so+I+can+ask+questions+about+it."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 w-full px-4 py-3 hover:bg-[#2a2a2a] transition-colors"
            >
              <div className="mt-0.5 text-text-secondary"><PerplexityLogo /></div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#eee] flex items-center gap-1">Open in Perplexity <FiExternalLink size={12} /></span>
                <span className="text-xs text-text-muted">Ask questions about this page</span>
              </div>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
