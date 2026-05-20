"use client";

import { useState, useEffect } from "react";
import { Lightbulb } from "lucide-react";

interface GuidanceToggleProps {
  guidance: string;
  title: string;
}

export default function GuidanceToggle({ guidance, title }: GuidanceToggleProps) {
  const [guidanceOpen, setGuidanceOpen] = useState(false);

  useEffect(() => {
    // Auto-expand guidance on first visit to this page
    try {
      const key = `cisa-guidance-${title.replace(/\s+/g, '-').toLowerCase()}`;
      const seen = localStorage.getItem(key);
      if (!seen) {
        setGuidanceOpen(true);
        localStorage.setItem(key, 'true');
      }
    } catch {
      setGuidanceOpen(true);
    }
  }, [title]);

  return (
    <div className="mt-4 max-w-2xl">
      <button
        onClick={() => setGuidanceOpen(!guidanceOpen)}
        className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
      >
        <Lightbulb className="w-3.5 h-3.5" />
        {guidanceOpen ? 'Hide explanation' : 'What is this page?'}
      </button>
      {guidanceOpen && (
        <p className="mt-3 text-[13px] text-muted-foreground leading-relaxed font-light p-4 bg-bg-glass border border-border-glass rounded-xl">
          {guidance}
        </p>
      )}
    </div>
  );
}
