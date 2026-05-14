import {
  Search,
  Network,
  Users,
  Brain,
  UserX,
  Heart,
  Scale,
  MapPinned,
  BookOpen,
  BarChart3,
  Globe,
  Building2,
  Award,
  Megaphone,
  Vote,
  ShieldCheck,
  Calculator,
  Cpu,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
}

export interface NavPillar {
  id: string;
  label: string;
  color: "crimson" | "gold" | "blue";
  icon: LucideIcon;
  items: NavItem[];
}

export const NAV_PILLARS: NavPillar[] = [
  {
    id: "investigate",
    label: "Investigate",
    color: "crimson",
    icon: Search,
    items: [
      {
        label: "Expose Board",
        href: "/expose",
        icon: Search,
        description: "Risk-ranked dossiers on high-value targets",
      },
      {
        label: "Research Portal",
        href: "/research",
        icon: Brain,
        description: "Autonomous investigative intelligence",
      },
      {
        label: "Network Map",
        href: "/network",
        icon: Network,
        description: "Interactive corruption link graph",
      },
      {
        label: "Syndicates",
        href: "/syndicates",
        icon: Users,
        description: "Organized crime hierarchy mapping",
      },
      {
        label: "AI Forecast",
        href: "/forecast",
        icon: Brain,
        description: "Predictive corruption modeling",
      },
    ],
  },
  {
    id: "history",
    label: "History & Justice",
    color: "gold",
    icon: Scale,
    items: [
      {
        label: "About Project",
        href: "/about",
        icon: Cpu,
        description: "Platform architecture & manifesto",
      },
      {
        label: "Anti-Corruption Hub",
        href: "/anticorruption",
        icon: ShieldCheck,
        description: "OPI Transition Tracker & Reform KPIs",
      },
      {
        label: "Incentive Calculator",
        href: "/anticorruption#calculator",
        icon: Calculator,
        description: "Calculate rewards for state capture disclosure",
      },
      {
        label: "Accountability Board",
        href: "/accountability",
        icon: UserX,
        description: "Tracking unpunished perpetrators",
      },
      {
        label: "Victim Tributes",
        href: "/victims",
        icon: Heart,
        description: "TRC narratives & Assassination Board",
      },
      {
        label: "Amnesty Tracker",
        href: "/amnesty",
        icon: Scale,
        description: "TRC Amnesty Committee findings",
      },
      {
        label: "Land Restitution",
        href: "/restitution",
        icon: MapPinned,
        description: "Historical displacement mapping",
      },
    ],
  },
  {
    id: "data",
    label: "Data",
    color: "blue",
    icon: BarChart3,
    items: [
      {
        label: "TRC Vault",
        href: "/vault",
        icon: BookOpen,
        description: "Sealed intelligence archive",
      },
      {
        label: "Station Audits",
        href: "/stats",
        icon: BarChart3,
        description: "True Crime vs Recorded Stats Leaderboard",
      },
      {
        label: "Crime Heatmap",
        href: "/map",
        icon: Globe,
        description: "Geospatial crime density visualization",
      },
      {
        label: "Institutional Audits",
        href: "/audits",
        icon: Building2,
        description: "SAPS & SADF department audits",
      },
      {
        label: "Global Benchmarks",
        href: "/benchmarks",
        icon: Award,
        description: "International transparency index",
      },
    ],
  },
];

export const NAV_ACTIONS: NavItem[] = [
  {
    label: "Report Corruption",
    href: "/report",
    icon: Megaphone,
    description: "Anonymous encrypted uplink",
  },
  {
    label: "Citizen Voting",
    href: "/vote",
    icon: Vote,
    description: "Democratic investigation priorities",
  },
  {
    label: "About Engine",
    href: "/about",
    icon: Cpu,
    description: "Platform architecture & telemetry",
  },
  {
    label: "Research Portal",
    href: "/research",
    icon: Brain,
    description: "Autonomous investigative intelligence",
  },
  {
    label: "Support Project",
    href: "/about#support",
    icon: Heart,
    description: "Contribute to project sustainability",
  },
];

/** Determine which pillar is active based on current pathname */
export function getActivePillar(pathname: string): string | null {
  for (const pillar of NAV_PILLARS) {
    if (pillar.items.some((item) => pathname.startsWith(item.href))) {
      return pillar.id;
    }
  }
  return null;
}

/** Get breadcrumb trail from pathname */
export function getBreadcrumbs(
  pathname: string
): { label: string; href: string }[] {
  const crumbs: { label: string; href: string }[] = [
    { label: "Home", href: "/" },
  ];

  for (const pillar of NAV_PILLARS) {
    const matchedItem = pillar.items.find((item) =>
      pathname.startsWith(item.href)
    );
    if (matchedItem) {
      crumbs.push({ label: pillar.label, href: matchedItem.href });
      crumbs.push({ label: matchedItem.label, href: matchedItem.href });

      // Handle dynamic segments like /stats/[id]
      const subPath = pathname.slice(matchedItem.href.length);
      if (subPath && subPath !== "/") {
        crumbs.push({
          label: "Detail",
          href: pathname,
        });
      }
      return crumbs;
    }
  }

  // Check actions
  const matchedAction = NAV_ACTIONS.find((a) =>
    pathname.startsWith(a.href)
  );
  if (matchedAction) {
    crumbs.push({ label: matchedAction.label, href: matchedAction.href });
  }

  return crumbs;
}
