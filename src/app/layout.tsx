import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import LiveTicker from "@/components/intelligence/LiveTicker";

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
      <body className="antialiased pb-16">
        <nav className="fixed top-0 left-0 w-full z-50 h-[var(--header-height)] bg-black/60 backdrop-blur-2xl border-b border-white/[0.05] flex items-center justify-between px-10">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-accent-crimson rounded-lg shadow-glow-crimson flex items-center justify-center font-bold text-sm transform group-hover:rotate-12 transition-transform duration-500">C</div>
              <span className="text-lg font-bold tracking-tighter uppercase">Crime <span className="text-white/30">Intelligence</span></span>
            </Link>

            <div className="h-4 w-px bg-white/10 mx-2" />

            <div className="hidden lg:flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
              <Link href="/restitution" className="hover:text-white transition-colors">Restitution</Link>
              <Link href="/accountability" className="hover:text-white transition-colors">Accountability</Link>
              <Link href="/victims" className="hover:text-white transition-colors">Victim Tributes</Link>
              <Link href="/amnesty" className="hover:text-white transition-colors">Amnesty</Link>
              <Link href="/audits" className="hover:text-white transition-colors text-accent-gold">Audits</Link>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
            <Link href="/expose" className="text-accent-crimson hover:text-accent-crimson/80 transition-colors">Expose Board</Link>
            <Link href="/stats" className="hover:text-white transition-colors">Police Audits</Link>
            <Link href="/network" className="hover:text-white transition-colors">Network Map</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/report"
              className="px-6 py-2.5 bg-accent-crimson text-white text-[9px] font-bold uppercase tracking-[0.2em] rounded-full hover:scale-105 transition-all shadow-glow-crimson"
            >
              Report Incident
            </Link>
          </div>
        </nav>
        
        <main className="pt-[var(--header-height)] min-h-screen">
          {children}
        </main>

        <LiveTicker />

        <footer className="py-24 border-t border-white/[0.03] bg-[#050505] pb-32">
          <div className="container grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="text-left">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-6 bg-accent-crimson rounded flex items-center justify-center font-bold text-[10px]">C</div>
                <span className="text-sm font-bold uppercase tracking-tighter">Crime Intelligence SA</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Digital Vigilance Protocol</span>
              <p className="text-xs text-white/40 mt-4 max-w-sm font-light leading-relaxed italic">
                "Transparency is the ultimate weapon against systemic corruption. We document the truth to protect the future."
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Sectors</p>
                <div className="flex flex-col gap-3 text-[10px] text-white/20 uppercase font-mono tracking-tight">
                   <Link href="/audits" className="hover:text-accent-gold">Institutional Audits</Link>
                   <Link href="/restitution" className="hover:text-accent-crimson">Land Restoration</Link>
                   <Link href="/amnesty" className="hover:text-accent-blue">Legal Truth</Link>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Protocol</p>
                <div className="flex flex-col gap-3 text-[10px] text-white/20 uppercase font-mono tracking-tight">
                   <Link href="/vault" className="hover:text-white">Sealed Vault</Link>
                   <Link href="/vote" className="hover:text-white">Citizen Voting</Link>
                   <Link href="/network" className="hover:text-white">Network Intel</Link>
                </div>
              </div>
            </div>

            <div className="text-right">
               <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest mb-4">© 2026 Crime Intel SA // Radical Transparency</p>
               <div className="inline-flex items-center gap-3 px-4 py-2 border border-white/5 rounded-full bg-white/[0.02]">
                  <div className="w-1.5 h-1.5 bg-accent-blue rounded-full animate-pulse" />
                  <span className="text-[9px] font-mono text-white/40 tracking-widest uppercase">Encryption_Active: AES-256</span>
               </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

