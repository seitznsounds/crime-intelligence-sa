'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  count?: string | number;
}

interface DataTabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
}

export default function DataTabs({ tabs, activeTab, onChange }: DataTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-border pb-6 mb-12 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`relative px-6 py-2.5 rounded-full border text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 whitespace-nowrap flex items-center gap-3 ${
            activeTab === tab.id
              ? 'border-charcoal bg-charcoal text-white shadow-button-inset'
              : 'border-charcoal-40 bg-transparent text-charcoal-83 hover:border-charcoal hover:text-charcoal'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
              activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-charcoal-3 text-charcoal-40'
            }`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
