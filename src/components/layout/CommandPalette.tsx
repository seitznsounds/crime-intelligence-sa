"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Terminal, 
  ArrowRight, 
  Moon, 
  Sun, 
  Laptop,
  Command as CommandIcon,
  X
} from "lucide-react";
import { useTheme } from "next-themes";
import { NAV_PILLARS, NAV_ACTIONS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 px-6 py-2.5 bg-background border border-border-glass-bright/30 rounded-full text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:border-accent-blue/50 hover:text-foreground transition-all group shadow-sm active:scale-95"
      >
        <Search className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
        <span className="hidden md:inline">Search</span>
        <kbd className="hidden md:flex items-center gap-1 px-2 py-0.5 bg-background border border-border rounded-full text-[9px] font-mono opacity-60">
          <CommandIcon className="w-2.5 h-2.5" /> K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -12 }}
              className="w-full max-w-2xl"
            >
              <Command className="glass-card bg-background border-border overflow-hidden shadow-focus-warm">
                <div className="flex items-center gap-4 px-8 py-6 border-b border-border bg-charcoal-3">
                  <Terminal className="w-4 h-4 text-accent-blue" />
                  <Command.Input
                    autoFocus
                    placeholder="Search pages and features..."
                    className="flex-1 bg-transparent text-sm font-black uppercase tracking-widest text-charcoal outline-none placeholder:text-charcoal-40"
                  />
                  <button 
                    onClick={() => setOpen(false)}
                    className="p-2 hover:bg-background rounded-full border border-transparent hover:border-border transition-all"
                  >
                    <X className="w-4 h-4 text-charcoal-40" />
                  </button>
                </div>

                <Command.List className="max-h-[400px] overflow-y-auto p-4 scrollbar-hide bg-background">
                  <Command.Empty className="px-6 py-16 text-center">
                    <p className="text-[10px] font-black text-charcoal-40 uppercase tracking-[0.2em]">
                      No results found.
                    </p>
                  </Command.Empty>

                  {NAV_PILLARS.map((pillar) => (
                    <Command.Group 
                      key={pillar.id}
                      heading={
                        <div className="px-4 py-3 text-[11px] font-black uppercase tracking-[0.25em] text-charcoal-40 flex items-center gap-3">
                          <pillar.icon className={cn("w-3.5 h-3.5", {
                            "text-accent-crimson": pillar.color === "crimson",
                            "text-accent-gold": pillar.color === "gold",
                            "text-accent-blue": pillar.color === "blue"
                          })} />
                          {pillar.label}
                        </div>
                      }
                      className="mb-4"
                    >
                      {pillar.items.map((item) => (
                        <Command.Item
                          key={item.href}
                          onSelect={() => runCommand(() => router.push(item.href))}
                          className="flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer aria-selected:bg-bg-glass group transition-all"
                        >
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center border border-border-glass bg-bg-glass group-aria-selected:border-foreground/20", {
                            "group-aria-selected:text-accent-crimson": pillar.color === "crimson",
                            "group-aria-selected:text-accent-gold": pillar.color === "gold",
                            "group-aria-selected:text-accent-blue": pillar.color === "blue"
                          })}>
                            <item.icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold tracking-tight text-foreground">{item.label}</p>
                            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{item.description}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-aria-selected:opacity-100 -translate-x-2 group-aria-selected:translate-x-0 transition-all" />
                        </Command.Item>
                      ))}
                    </Command.Group>
                  ))}

                  <Command.Group 
                    heading={<div className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Quick Actions</div>}
                  >
                    {NAV_ACTIONS.map((action) => (
                      <Command.Item
                        key={action.href}
                        onSelect={() => runCommand(() => router.push(action.href))}
                        className="flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer aria-selected:bg-bg-glass group transition-all"
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-border-glass bg-bg-glass group-aria-selected:border-foreground/20">
                          <action.icon className="w-4 h-4 text-accent-blue" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold tracking-tight text-foreground">{action.label}</p>
                          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{action.description}</p>
                        </div>
                      </Command.Item>
                    ))}
                    
                    <Command.Item
                      onSelect={() => runCommand(() => setTheme("light"))}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer aria-selected:bg-bg-glass group transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-border-glass bg-bg-glass group-aria-selected:border-foreground/20">
                        <Sun className="w-4 h-4 text-accent-gold" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold tracking-tight text-foreground">Light Mode</p>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Switch to light theme</p>
                      </div>
                    </Command.Item>

                    <Command.Item
                      onSelect={() => runCommand(() => setTheme("dark"))}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer aria-selected:bg-bg-glass group transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-border-glass bg-bg-glass group-aria-selected:border-foreground/20">
                        <Moon className="w-4 h-4 text-accent-blue" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold tracking-tight text-foreground">Dark Mode</p>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Switch to dark theme</p>
                      </div>
                    </Command.Item>
                  </Command.Group>
                </Command.List>

                <div className="px-6 py-4 border-t border-border-glass bg-bg-glass flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><kbd className="px-1 py-0.5 bg-bg-glass-heavy border border-border-glass rounded text-[9px]">↑↓</kbd> Navigate</span>
                    <span className="flex items-center gap-1.5"><kbd className="px-1 py-0.5 bg-bg-glass-heavy border border-border-glass rounded text-[9px]">ENTER</kbd> Open</span>
                  </div>
                  <span className="opacity-40">Quick Search</span>
                </div>
              </Command>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
