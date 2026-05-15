import { type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface PageShellProps {
  /** Page title */
  title: string;
  /** Optional subtitle below the title */
  subtitle?: string;
  /** Optional small badge label above the title */
  badge?: string;
  /** Badge accent color */
  badgeColor?: "crimson" | "gold" | "blue";
  /** Icon displayed beside the title */
  icon?: ReactNode;
  /** Right-side header actions (buttons, filters, etc.) */
  actions?: ReactNode;
  /** Breadcrumb trail */
  breadcrumbs?: BreadcrumbItem[];
  /** Layout variant */
  variant?: "default" | "fullscreen" | "centered";
  /** Additional className for the content wrapper */
  className?: string;
  /** Child content */
  children: ReactNode;
}

const BADGE_COLORS = {
  crimson: "bg-accent-crimson/5 border-accent-crimson/20 text-accent-crimson",
  gold: "bg-accent-gold/5 border-accent-gold/20 text-accent-gold",
  blue: "bg-accent-blue/5 border-accent-blue/20 text-accent-blue",
};

export default function PageShell({
  title,
  subtitle,
  badge,
  badgeColor = "crimson",
  icon,
  actions,
  breadcrumbs,
  variant = "default",
  className = "",
  children,
}: PageShellProps) {
  const isFullscreen = variant === "fullscreen";
  const isCentered = variant === "centered";

  return (
    <div className="relative min-h-screen bg-background transition-colors duration-500 selection:bg-accent-blue/10 selection:text-accent-blue">
      {/* Editorial breathing room via vertical padding */}
      <div
        className={`relative z-10 ${
          isFullscreen
            ? "w-full h-screen"
            : isCentered
            ? "container max-w-3xl py-24 sm:py-32 px-6 sm:px-8"
            : "container max-w-7xl py-24 sm:py-32 px-6 sm:px-8"
        }`}
      >
        {/* Breadcrumbs - Restrained opacity grays */}
        {breadcrumbs && breadcrumbs.length > 1 && !isFullscreen && (
          <nav
            aria-label="Breadcrumb"
            className="mb-10 flex items-center gap-2 text-[13px] text-charcoal-40 font-medium uppercase tracking-widest"
          >
            {breadcrumbs.map((crumb, i) => (
              <span key={`${crumb.href}-${i}`} className="flex items-center gap-2">
                {i > 0 && <ChevronRight className="w-3 h-3 opacity-30" />}
                {i < breadcrumbs.length - 1 ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-charcoal transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-charcoal-83">
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Header - Editorial typography */}
        {!isFullscreen && (
          <header className="mb-16 sm:mb-20 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-10">
            <div className="flex items-start gap-6">
              {icon && (
                <div
                  className={`w-14 h-14 rounded-[22px] flex items-center justify-center border shrink-0 ${
                    BADGE_COLORS[badgeColor]
                  } shadow-sm`}
                >
                  {icon}
                </div>
              )}
              <div className="space-y-4">
                {badge && (
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full border ${BADGE_COLORS[badgeColor]}`}
                  >
                    <span className="text-[10px] font-black tracking-[0.25em] uppercase">
                      {badge}
                    </span>
                  </div>
                )}
                <h1 className="text-[10vw] sm:text-5xl lg:text-6xl font-black text-charcoal tracking-tight break-words">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-base sm:text-lg lg:text-xl text-charcoal-82 max-w-2xl leading-relaxed font-normal break-words">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            {actions && <div className="flex items-center gap-4 shrink-0 pb-2">{actions}</div>}
          </header>
        )}

        {/* Content */}
        <div className={className}>{children}</div>
      </div>
    </div>
  );
}
