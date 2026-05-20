"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Globe, Megaphone, X } from "lucide-react";

const ONBOARDING_KEY = "cisa-onboarding-dismissed";

const QUICK_STARTS = [
  {
    emoji: "🔍",
    title: "I want to see who's corrupt",
    description: "Browse profiles of politicians and officials linked to corruption and organised crime.",
    href: "/expose",
    icon: Search,
  },
  {
    emoji: "📊",
    title: "I want to check crime in my area",
    description: "Explore an interactive map showing crime density across every province and police station.",
    href: "/map",
    icon: Globe,
  },
  {
    emoji: "📢",
    title: "I want to report corruption",
    description: "Submit a fully anonymous report — we never see your name, IP address, or device info.",
    href: "/report",
    icon: Megaphone,
  },
];

export default function OnboardingBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(ONBOARDING_KEY);
      if (!dismissed) {
        setVisible(true);
      }
    } catch {
      // localStorage not available
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(ONBOARDING_KEY, "true");
    } catch {
      // localStorage not available
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 sm:mb-16 relative"
        >
          <div className="glass-card p-8 sm:p-10 border-accent-blue/20 bg-accent-blue/[0.03] relative overflow-hidden">
            {/* Dismiss button */}
            <button
              onClick={dismiss}
              className="absolute top-4 right-4 p-2 rounded-full bg-bg-glass border border-border-glass text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all"
              aria-label="Dismiss welcome banner"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Welcome heading */}
            <div className="mb-8">
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-foreground mb-2">
                Welcome to Crime Intelligence SA
              </h2>
              <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-2xl">
                South Africa's largest free corruption database. Start by choosing what you'd like to do:
              </p>
            </div>

            {/* Quick start cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {QUICK_STARTS.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={dismiss}
                  className="group flex flex-col p-5 sm:p-6 rounded-2xl bg-background border border-border-glass hover:border-accent-blue/30 hover:bg-accent-blue/[0.02] transition-all"
                >
                  <span className="text-2xl mb-3">{item.emoji}</span>
                  <h3 className="text-[13px] font-black uppercase tracking-tight text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed font-light flex-1">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>

            {/* Dismiss link */}
            <button
              onClick={dismiss}
              className="mt-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              Got it, let me explore →
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
