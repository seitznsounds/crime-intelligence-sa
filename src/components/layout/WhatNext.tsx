"use client";

import Link from "next/link";
import { ArrowRight, Network, Users, Megaphone, Search, ShieldAlert, Map, FileText, Zap, Target, Heart, Award, Vote, ShieldCheck, Globe, Building2, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

const ICON_MAP: Record<string, LucideIcon> = {
  Network,
  Users,
  Megaphone,
  Search,
  ShieldAlert,
  Map,
  FileText,
  Zap,
  Target,
  Heart,
  Award,
  Vote,
  ShieldCheck,
  Globe,
  Building2
};

export interface WhatNextSuggestion {
  title: string;
  description: string;
  href: string;
  icon?: LucideIcon | string;
}

interface WhatNextProps {
  suggestions: WhatNextSuggestion[];
}

export default function WhatNext({ suggestions }: WhatNextProps) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <section className="mt-20 sm:mt-28 pt-16 border-t border-border-glass">
      <div className="mb-10">
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-2">
          📍 Where to go next
        </p>
        <p className="text-sm text-muted-foreground font-light">
          Continue exploring related information on this platform.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {suggestions.map((suggestion, i) => {
          let Icon: LucideIcon = ArrowRight; // Default fallback
          
          if (typeof suggestion.icon === 'string') {
              Icon = ICON_MAP[suggestion.icon] || ArrowRight;
          } else if (suggestion.icon) {
              Icon = suggestion.icon;
          }

          return (
            <motion.div
                key={suggestion.href}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
                <Link
                href={suggestion.href}
                className="group flex flex-col h-full p-6 sm:p-8 rounded-2xl bg-bg-glass border border-border-glass hover:border-foreground/15 hover:bg-bg-glass-heavy transition-all"
                >
                <div className="w-10 h-10 rounded-xl bg-bg-glass-heavy border border-border-glass flex items-center justify-center mb-5 group-hover:border-foreground/20 transition-colors">
                    <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <h3 className="text-[14px] font-black uppercase tracking-tight text-foreground mb-2">
                    {suggestion.title}
                </h3>
                <p className="text-[12px] text-muted-foreground leading-relaxed font-light mb-6 flex-1">
                    {suggestion.description}
                </p>
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
                </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
