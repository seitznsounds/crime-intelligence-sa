"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search, Scale, BarChart3, Megaphone } from "lucide-react";
import { getActivePillar } from "@/lib/navigation";

const TABS = [
  { id: "home", label: "Home", href: "/", icon: Home },
  { id: "investigate", label: "Explore", href: "/expose", icon: Search },
  { id: "history", label: "Justice", href: "/accountability", icon: Scale },
  { id: "data", label: "Stats", href: "/stats", icon: BarChart3 },
  { id: "act", label: "Report", href: "/report", icon: Megaphone },
] as const;

export default function MobileBottomBar() {
  const pathname = usePathname();
  const activePillar = getActivePillar(pathname);

  function isActive(tab: (typeof TABS)[number]): boolean {
    if (tab.id === "home") return pathname === "/";
    if (tab.id === "act")
      return pathname.startsWith("/report") || pathname.startsWith("/vote");
    return activePillar === tab.id;
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/90 backdrop-blur-2xl border-t border-border-glass"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {TABS.map((tab) => {
          const active = isActive(tab);
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`relative flex flex-col items-center justify-center gap-1 w-16 h-14 rounded-xl transition-colors ${
                active
                  ? "text-accent-crimson"
                  : "text-muted-foreground active:text-foreground"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold tracking-tight">
                {tab.label}
              </span>
              {active && (
                <motion.div
                  layoutId="mobile-active"
                  className="absolute -top-[1px] left-3 right-3 h-[2px] bg-accent-crimson rounded-full"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
