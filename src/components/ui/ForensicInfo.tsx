'use client';

import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Info } from 'lucide-react';

interface ForensicInfoProps {
  title: string;
  content: string;
  source?: string;
  children?: React.ReactNode;
}

export default function ForensicInfo({ title, content, source, children }: ForensicInfoProps) {
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          {children || (
            <button className="inline-flex items-center gap-1 text-charcoal-40 hover:text-charcoal transition-colors outline-none group">
              <Info className="w-4 h-4" />
            </button>
          )}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="z-[100] max-w-[300px] bg-[#fcfbf8] border border-border p-6 rounded-2xl shadow-focus-warm animate-in fade-in zoom-in duration-300"
            sideOffset={8}
          >
            <div className="space-y-4">
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-charcoal-83 border-b border-border pb-3 mb-2">
                Glossary // {title}
              </p>
              <p className="text-[13px] text-charcoal-82 leading-relaxed font-normal italic">
                "{content}"
              </p>
              {source && (
                <div className="pt-3 flex justify-between items-center border-t border-border mt-2">
                  <span className="text-[9px] font-bold text-charcoal-40 uppercase tracking-widest text-nowrap">Verification:</span>
                  <span className="text-[9px] font-mono text-accent-blue font-bold uppercase truncate ml-3">{source}</span>
                </div>
              )}
            </div>
            <Tooltip.Arrow className="fill-border" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
