import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import LiveTicker from "@/components/intelligence/LiveTicker";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Navbar from "@/components/layout/Navbar";
import MobileBottomBar from "@/components/layout/MobileBottomBar";
import { CommandPalette } from "@/components/ui/CommandPalette";
import ErrorBoundary from "@/components/providers/ErrorBoundary";
import { NAV_PILLARS, NAV_ACTIONS } from "@/lib/navigation";

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
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#0c0c0a" />
      </head>
      <body className="antialiased bg-background text-foreground transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <CommandPalette />
          
          <main className="pt-[var(--header-height)] min-h-screen">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>

          {/* Live Ticker — hidden on mobile, visible on lg+ */}
          <div className="hidden lg:block">
            <LiveTicker />
          </div>

          {/* Mobile Bottom Navigation */}
          <MobileBottomBar />

          <footer className="py-12 border-t border-border-glass bg-background/50 pb-20 lg:pb-12">
            <div className="container max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
              <div className="text-left">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 bg-accent-crimson rounded flex items-center justify-center font-bold text-[10px] text-white">C</div>
                  <span className="text-[13px] font-bold uppercase tracking-tight">Crime Intelligence SA</span>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Digital Vigilance Protocol</span>
                <p className="text-[12px] text-muted-foreground mt-3 max-w-sm font-light leading-relaxed italic">
                  "Transparency is the ultimate weapon against systemic corruption. We document the truth to protect the future."
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                {NAV_PILLARS.slice(0, 2).map((pillar) => (
                  <div key={pillar.id} className="space-y-3">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{pillar.label}</p>
                    <div className="flex flex-col gap-2 text-[12px] text-muted-foreground font-medium">
                      {pillar.items.slice(0, 3).map((item) => (
                        <Link key={item.href} href={item.href} className="hover:text-foreground transition-colors">
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-left md:text-right">
                 <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest mb-4">© 2026 Crime Intel SA</p>
                 <div className="inline-flex items-center gap-3 px-4 py-2 border border-border-glass rounded-full bg-bg-glass">
                    <div className="w-1.5 h-1.5 bg-accent-blue rounded-full animate-pulse" />
                    <span className="text-[11px] font-mono text-muted-foreground tracking-wider uppercase">Encryption Active</span>
                 </div>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
