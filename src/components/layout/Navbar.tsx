"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Search as SearchIcon, Megaphone } from "lucide-react";
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
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-semibold tracking-tight transition-all ${
          isActive
            ? `${colors.text}`
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-expanded={isOpen}
      >
        <pillar.icon className="w-4 h-4" />
        <span>{pillar.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Active pillar underline */}
      {isActive && (
        <motion.div
          layoutId="active-pillar"
          className={`absolute bottom-[-13px] left-3 right-3 h-[2px] rounded-full ${colors.indicator}`}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 mt-3 w-[320px] p-2 rounded-2xl bg-background/95 backdrop-blur-2xl border border-border-glass shadow-xl shadow-background/50 z-50"
          >
            {pillar.items.map((item) => {
              const isItemActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onToggle}
                  className={`flex items-start gap-3 p-3 rounded-xl transition-all group ${
                    isItemActive
                      ? `${colors.bg} ${colors.border} border`
                      : "hover:bg-bg-glass-heavy"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                      isItemActive
                        ? `${colors.bg} ${colors.border}`
                        : "bg-bg-glass border-border-glass group-hover:border-border-glass-bright"
                    }`}
                  >
                    <item.icon
                      className={`w-4 h-4 ${
                        isItemActive ? colors.text : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-[13px] font-semibold tracking-tight mb-0.5 ${
                        isItemActive ? "text-foreground" : "text-foreground/80"
                      }`}
                    >
                      {item.label}
                    </p>
                    {item.description && (
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
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
        className="fixed top-0 left-0 w-full z-50 h-[var(--header-height)] bg-background/80 backdrop-blur-2xl border-b border-border-glass"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="h-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 bg-accent-crimson rounded-lg shadow-glow flex items-center justify-center font-bold text-sm transform group-hover:rotate-12 transition-transform duration-500 text-white">
              C
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold tracking-tight text-foreground leading-none">
                Crime Intelligence
              </span>
              <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground leading-none hidden sm:block">
                South Africa
              </span>
            </div>
          </Link>

          {/* Desktop Navigation — Pillar Dropdowns */}
          <div className="hidden lg:flex items-center gap-1">
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
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <CommandPalette />
            </div>
            <ThemeToggle />

            {/* Report CTA — Desktop */}
            <Link
              href="/report"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-accent-crimson text-white text-[12px] font-bold uppercase tracking-wider rounded-xl hover:scale-105 active:scale-95 transition-all shadow-glow"
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Report</span>
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-bg-glass border border-border-glass text-foreground hover:bg-bg-glass-heavy transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
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
