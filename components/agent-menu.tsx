"use client";

import { useState, useRef, useEffect } from "react";
import { FiCopy, FiFileText, FiExternalLink, FiChevronDown } from "react-icons/fi";
import { SiOpenai, SiAnthropic, SiPerplexity } from "react-icons/si";

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
              href="https://chat.openai.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 w-full px-4 py-3 hover:bg-[#2a2a2a] transition-colors"
            >
              <div className="mt-0.5 text-text-secondary"><SiOpenai size={16} /></div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#eee] flex items-center gap-1">Open in ChatGPT <FiExternalLink size={12} /></span>
                <span className="text-xs text-text-muted">Ask questions about this page</span>
              </div>
            </a>

            <a 
              href="https://claude.ai/new"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 w-full px-4 py-3 hover:bg-[#2a2a2a] transition-colors"
            >
              <div className="mt-0.5 text-text-secondary"><SiAnthropic size={16} /></div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#eee] flex items-center gap-1">Open in Claude <FiExternalLink size={12} /></span>
                <span className="text-xs text-text-muted">Ask questions about this page</span>
              </div>
            </a>

            <a 
              href="https://www.perplexity.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 w-full px-4 py-3 hover:bg-[#2a2a2a] transition-colors"
            >
              <div className="mt-0.5 text-text-secondary"><SiPerplexity size={16} /></div>
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
