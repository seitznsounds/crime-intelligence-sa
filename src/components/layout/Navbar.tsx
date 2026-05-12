"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 h-[var(--header-height)] bg-background/60 backdrop-blur-2xl border-b border-border-glass flex items-center justify-between px-10">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-accent-crimson rounded-lg shadow-glow-crimson flex items-center justify-center font-bold text-sm transform group-hover:rotate-12 transition-transform duration-500 text-white">C</div>
          <span className="text-lg font-bold tracking-tighter uppercase text-foreground">Crime <span className="text-foreground/30">Intelligence</span></span>
        </Link>

        <div className="h-4 w-px bg-border-glass mx-2" />

        <div className="hidden lg:flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          <Link href="/restitution" className="hover:text-foreground transition-colors">Restitution</Link>
          <Link href="/accountability" className="hover:text-foreground transition-colors">Accountability</Link>
          <Link href="/victims" className="hover:text-foreground transition-colors">Victim Tributes</Link>
          <Link href="/amnesty" className="hover:text-foreground transition-colors">Amnesty</Link>
          <Link href="/audits" className="hover:text-foreground transition-colors text-accent-gold">Audits</Link>
        </div>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        <Link href="/expose" className="text-accent-crimson hover:text-accent-crimson/80 transition-colors">Expose Board</Link>
        <Link href="/stats" className="hover:text-foreground transition-colors">Police Audits</Link>
        <Link href="/network" className="hover:text-foreground transition-colors">Network Map</Link>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Link 
          href="/report"
          className="px-6 py-2.5 bg-accent-crimson text-white text-[9px] font-bold uppercase tracking-[0.2em] rounded-full hover:scale-105 transition-all shadow-glow-crimson"
        >
          Report Incident
        </Link>
      </div>
    </nav>
  );
}
