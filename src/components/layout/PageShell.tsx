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
  crimson:
    "bg-accent-crimson/5 border-accent-crimson/15 text-accent-crimson",
  gold: "bg-accent-gold/5 border-accent-gold/15 text-accent-gold",
  blue: "bg-accent-blue/5 border-accent-blue/15 text-accent-blue",
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
    <div className="relative min-h-screen bg-background overflow-hidden transition-colors duration-300">
      {/* Shared background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(var(--border-glass)_1px,transparent_1px),linear-gradient(90deg,var(--border-glass)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_85%)] pointer-events-none" />

      {/* Subtle accent bloom */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[400px] bg-accent-crimson/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div
        className={`relative z-10 ${
          isFullscreen
            ? "w-full h-screen"
            : isCentered
            ? "container max-w-3xl py-16 sm:py-20 px-4 sm:px-6"
            : "container max-w-7xl py-16 sm:py-20 px-4 sm:px-6"
        }`}
      >
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 1 && !isFullscreen && (
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-1.5 text-[12px] text-muted-foreground"
          >
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="w-3 h-3 opacity-40" />}
                {i < breadcrumbs.length - 1 ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-foreground transition-colors font-medium"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-foreground font-semibold">
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Header */}
        {!isFullscreen && (
          <header className="mb-10 sm:mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div className="flex items-start gap-4">
              {icon && (
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${
                    BADGE_COLORS[badgeColor]
                  }`}
                >
                  {icon}
                </div>
              )}
              <div>
                {badge && (
                  <div
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md border mb-2 ${BADGE_COLORS[badgeColor]}`}
                  >
                    <span className="text-[11px] font-bold tracking-[0.2em] uppercase">
                      {badge}
                    </span>
                  </div>
                )}
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-[14px] text-muted-foreground mt-1.5 max-w-2xl leading-relaxed font-light">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
          </header>
        )}

        {/* Content */}
        <div className={className}>{children}</div>
      </div>
    </div>
  );
}
