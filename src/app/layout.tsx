import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Crime Intelligence SA | Transparency & Justice",
  description: "Democratizing crime intelligence in South Africa. Exposing corruption through data-driven evidence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <nav className="fixed top-0 left-0 w-full z-50 h-[var(--header-height)] bg-background/80 backdrop-blur-xl border-b border-white/[0.05] flex items-center justify-between px-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-7 h-7 bg-accent-crimson rounded-md shadow-glow flex items-center justify-center font-bold text-sm transform group-hover:rotate-12 transition-transform duration-500">C</div>
            <span className="text-base font-bold tracking-tighter uppercase">Crime <span className="text-white/30">Intelligence</span></span>
          </Link>
          
          <div className="hidden md:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
            <Link href="/" className="hover:text-white transition-colors">Intelligence Hub</Link>
            <Link href="/expose" className="text-accent-crimson hover:text-accent-crimson/80 transition-colors">Expose Board</Link>
            <Link href="/stats" className="hover:text-white transition-colors">Station Stats</Link>
            <Link href="/about" className="hover:text-white transition-colors">Our Mission</Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/10 hover:bg-white/5 transition-all text-white/70 hover:text-white">
              Report Incident
            </button>
          </div>
        </nav>
        
        <main className="pt-[var(--header-height)] min-h-screen">
          {children}
        </main>

        <footer className="py-16 border-t border-white/[0.03] bg-black/50">
          <div className="container flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-left">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Digital Vigilance</span>
              <p className="text-xs text-white/40 mt-2 max-w-sm font-light">Built for a safer South Africa. We believe that data is the ultimate weapon against corruption.</p>
            </div>
            <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">© 2026 Crime Intel SA // Radical Transparency</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
