import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import LiveTicker from "@/components/intelligence/LiveTicker";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Navbar from "@/components/layout/Navbar";

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
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased pb-16 bg-background text-foreground transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          
          <main className="pt-[var(--header-height)] min-h-screen">
            {children}
          </main>

          <LiveTicker />

          <footer className="py-24 border-t border-border-glass bg-background/50 pb-32">
            <div className="container grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="text-left">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-6 h-6 bg-accent-crimson rounded flex items-center justify-center font-bold text-[10px] text-white">C</div>
                  <span className="text-sm font-bold uppercase tracking-tighter">Crime Intelligence SA</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Digital Vigilance Protocol</span>
                <p className="text-xs text-muted-foreground mt-4 max-w-sm font-light leading-relaxed italic">
                  "Transparency is the ultimate weapon against systemic corruption. We document the truth to protect the future."
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sectors</p>
                  <div className="flex flex-col gap-3 text-[10px] text-muted-foreground uppercase font-mono tracking-tight">
                     <Link href="/audits" className="hover:text-accent-gold transition-colors">Institutional Audits</Link>
                     <Link href="/restitution" className="hover:text-accent-crimson transition-colors">Land Restoration</Link>
                     <Link href="/amnesty" className="hover:text-accent-blue transition-colors">Legal Truth</Link>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Protocol</p>
                  <div className="flex flex-col gap-3 text-[10px] text-muted-foreground uppercase font-mono tracking-tight">
                     <Link href="/vault" className="hover:text-foreground transition-colors">Sealed Vault</Link>
                     <Link href="/vote" className="hover:text-foreground transition-colors">Citizen Voting</Link>
                     <Link href="/network" className="hover:text-foreground transition-colors">Network Intel</Link>
                  </div>
                </div>
              </div>

              <div className="text-right">
                 <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-4">© 2026 Crime Intel SA // Radical Transparency</p>
                 <div className="inline-flex items-center gap-3 px-4 py-2 border border-border-glass rounded-full bg-bg-glass">
                    <div className="w-1.5 h-1.5 bg-accent-blue rounded-full animate-pulse" />
                    <span className="text-[9px] font-mono text-muted-foreground tracking-widest uppercase">Encryption_Active: AES-256</span>
                 </div>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}

