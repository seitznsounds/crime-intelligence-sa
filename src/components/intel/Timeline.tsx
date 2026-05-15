"use client";

import React from 'react';
import { motion } from 'framer-motion';

export interface TimelineEvent {
  year: string | number;
  title: string;
  description: string;
  isKey?: boolean;
}

export function Timeline({ events }: { events: TimelineEvent[] }) {
  if (!events || events.length === 0) return null;

  return (
    <div className="relative pl-4 border-l border-border-glass/50 space-y-6">
      {events.map((event, idx) => (
        <motion.div 
          key={idx}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="relative"
        >
          {/* Node marker */}
          <div className={`absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-background shadow-sm ${event.isKey ? 'bg-accent-crimson shadow-glow-crimson' : 'bg-accent-blue'}`} />
          
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">{event.year}</span>
            <h4 className="text-[12px] font-bold text-foreground leading-tight">{event.title}</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">{event.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
