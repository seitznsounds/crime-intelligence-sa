"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Search as SearchIcon, Megaphone, Cpu, Brain } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { CommandPalette } from "./CommandPalette";
import { NAV_PILLARS, NAV_ACTIONS, getActivePillar, type NavPillar } from "@/lib/navigation";

const PILLAR_COLORS = {
  crimson: {
    text: "text-accent-crimson",
    bg: "bg-accent-crimson/5",
    border: "border-accent-crimson/20",
    indicator: "bg-accent-crimson",
  },
  gold: {
    text: "text-accent-gold",
    bg: "bg-accent-gold/5",
    border: "border-accent-gold/20",
    indicator: "bg-accent-gold",
  },
  blue: {
    text: "text-accent-blue",
    bg: "bg-accent-blue/5",
    border: "border-accent-blue/20",
    indicator: "bg-accent-blue",
  },
};

function DesktopDropdown({
  pillar,
  isOpen,
  onToggle,
  isActive,
}: {
  pillar: NavPillar;
  isOpen: boolean;
  onToggle: () => void;
  isActive: boolean;
}) {
  const colors = PILLAR_COLORS[pillar.color];
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        if (isOpen) onToggle();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onToggle]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-black uppercase tracking-[0.15em] transition-all ${
          isActive
            ? `${colors.text} bg-background border border-border`
            : "text-charcoal-40 hover:text-charcoal"
        }`}
        aria-expanded={isOpen}
      >
        <pillar.icon className="w-3.5 h-3.5" />
        <span>{pillar.label}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 mt-4 w-[340px] p-3 rounded-2xl bg-white border border-border shadow-focus-warm z-50"
          >
            {pillar.items.map((item) => {
              const isItemActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onToggle}
                  className={`flex items-start gap-4 p-4 rounded-xl transition-all group ${
                    isItemActive
                      ? `bg-charcoal-3`
                      : "hover:bg-charcoal-3"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                      isItemActive
                        ? `${colors.bg} ${colors.border}`
                        : "bg-background border-border group-hover:border-charcoal-40"
                    }`}
                  >
                    <item.icon
                      className={`w-4 h-4 ${
                        isItemActive ? colors.text : "text-charcoal-40"
                      }`}
                    />
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-[14px] font-black tracking-tight mb-1 uppercase ${
                        isItemActive ? "text-charcoal" : "text-charcoal-83"
                      }`}
                    >
                      {item.label}
                    </p>
                    {item.description && (
                      <p className="text-[12px] text-charcoal-40 leading-snug font-medium">
                        {item.description}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const activePillar = getActivePillar(pathname);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-50 h-[var(--header-height)] bg-background/90 border-b border-border"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="h-full max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Logo - Switch based on theme using CSS */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative h-16 w-40">
              <Image
                src="/Crime Intelligence Logo Light (225x100).svg"
                alt="Crime Intelligence SA"
                fill
                className="dark:hidden block object-contain"
                priority
              />
              <Image
                src="/Crime Intelligence Logo Dark (225x100).svg"
                alt="Crime Intelligence SA"
                fill
                className="hidden dark:block object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation — Pillar Dropdowns */}
          <div className="hidden lg:flex items-center gap-2">
            {NAV_PILLARS.map((pillar) => (
              <DesktopDropdown
                key={pillar.id}
                pillar={pillar}
                isOpen={openDropdown === pillar.id}
                onToggle={() =>
                  setOpenDropdown((prev) =>
                    prev === pillar.id ? null : pillar.id
                  )
                }
                isActive={activePillar === pillar.id}
              />
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <CommandPalette />
              </div>

              <ThemeToggle />

            {/* Report CTA — Desktop */}
            <Link
              href="/report"
              className="hidden sm:inline-flex items-center gap-2 px-6 py-2.5 bg-accent-crimson text-white text-[11px] font-black uppercase tracking-widest rounded-full hover:opacity-80 active:scale-95 transition-all shadow-button-inset"
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Secure Uplink</span>
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-full bg-charcoal-3 border border-border text-charcoal hover:border-charcoal-40 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Scrim */}
            <div
              className="absolute inset-0 bg-background/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-0 right-0 bottom-0 w-full max-w-sm bg-background border-l border-border-glass overflow-y-auto"
            >
              <div className="p-6 pt-20 space-y-6">
                {NAV_PILLARS.map((pillar) => {
                  const colors = PILLAR_COLORS[pillar.color];
                  return (
                    <div key={pillar.id}>
                      <div
                        className={`flex items-center gap-2 mb-3 px-1 ${colors.text}`}
                      >
                        <pillar.icon className="w-4 h-4" />
                        <span className="text-[12px] font-bold uppercase tracking-widest">
                          {pillar.label}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {pillar.items.map((item) => {
                          const isItemActive = pathname.startsWith(item.href);
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setMobileOpen(false)}
                              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                                isItemActive
                                  ? `${colors.bg} border ${colors.border}`
                                  : "hover:bg-bg-glass-heavy"
                              }`}
                            >
                              <item.icon
                                className={`w-4 h-4 ${
                                  isItemActive
                                    ? colors.text
                                    : "text-muted-foreground"
                                }`}
                              />
                              <div>
                                <p
                                  className={`text-[14px] font-semibold ${
                                    isItemActive
                                      ? "text-foreground"
                                      : "text-foreground/80"
                                  }`}
                                >
                                  {item.label}
                                </p>
                                {item.description && (
                                  <p className="text-[11px] text-muted-foreground">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Actions */}
                <div className="pt-4 border-t border-border-glass space-y-2">
                  {NAV_ACTIONS.map((action) => (
                    <Link
                      key={action.href}
                      href={action.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-bg-glass-heavy transition-all"
                    >
                      <action.icon className="w-4 h-4 text-accent-crimson" />
                      <div>
                        <p className="text-[14px] font-semibold text-foreground/80">
                          {action.label}
                        </p>
                        {action.description && (
                          <p className="text-[11px] text-muted-foreground">
                            {action.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
