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
  DollarSign,
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
    label: "Explore",
    color: "crimson",
    icon: Search,
    items: [
      {
        label: "People of Interest",
        href: "/expose",
        icon: Search,
        description: "Browse profiles of politicians, officials, and suspects linked to corruption",
      },
      {
        label: "Deep Investigations",
        href: "/research",
        icon: Brain,
        description: "Read detailed investigative reports on major corruption cases",
      },
      {
        label: "Corruption Connections",
        href: "/network",
        icon: Network,
        description: "See how corrupt officials, syndicates, and organisations are connected",
      },
      {
        label: "Crime Syndicates",
        href: "/syndicates",
        icon: Users,
        description: "Explore the structure of major crime networks in South Africa",
      },
      {
        label: "Corruption Predictions",
        href: "/forecast",
        icon: Brain,
        description: "See which areas and networks are predicted to become corruption hotspots",
      },
    ],
  },
  {
    id: "history",
    label: "Justice",
    color: "gold",
    icon: Scale,
    items: [
      {
        label: "Court Rulings",
        href: "/justice/judgments",
        icon: Scale,
        description: "Search real criminal court judgments and case outcomes",
      },
      {
        label: "Court Case Map",
        href: "/justice/heatmap",
        icon: Globe,
        description: "See where criminal cases are being heard across the country",
      },
      {
        label: "About This Project",
        href: "/about",
        icon: Cpu,
        description: "Learn what this platform is, why it exists, and how it works",
      },
      {
        label: "Anti-Corruption Tracker",
        href: "/anticorruption",
        icon: ShieldCheck,
        description: "Track South Africa's progress on anti-corruption reforms",
      },
      {
        label: "Whistleblower Rewards",
        href: "/anticorruption#calculator",
        icon: Calculator,
        description: "Calculate what you could earn by exposing corruption",
      },
      {
        label: "Unpunished Perpetrators",
        href: "/accountability",
        icon: UserX,
        description: "See who committed crimes and was never held accountable",
      },
      {
        label: "Honouring Victims",
        href: "/victims",
        icon: Heart,
        description: "Memorials for victims of apartheid and political violence",
      },
      {
        label: "Amnesty Decisions",
        href: "/amnesty",
        icon: Scale,
        description: "Browse decisions made by the Truth & Reconciliation Amnesty Committee",
      },
      {
        label: "Stolen Land Tracker",
        href: "/restitution",
        icon: MapPinned,
        description: "Track land stolen during apartheid and its current status",
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
        label: "Evidence Vault",
        href: "/vault",
        icon: BookOpen,
        description: "Securely stored evidence packages prepared for international courts",
      },
      {
        label: "Police Station Rankings",
        href: "/stats",
        icon: BarChart3,
        description: "Compare crime statistics across all 1,154 police stations",
      },
      {
        label: "Seized Assets",
        href: "/stats/recovery",
        icon: DollarSign,
        description: "Track property and money recovered from corrupt officials and syndicates",
      },
      {
        label: "Crime Map",
        href: "/map",
        icon: Globe,
        description: "Interactive map showing where crime is happening across South Africa",
      },
      {
        label: "Government Audits",
        href: "/audits",
        icon: Building2,
        description: "Audits of police, military, and government departments",
      },
      {
        label: "How SA Compares",
        href: "/benchmarks",
        icon: Award,
        description: "See how South Africa ranks against other countries on corruption",
      },
    ],
  },
];

export const NAV_ACTIONS: NavItem[] = [
  {
    label: "Report Corruption",
    href: "/report",
    icon: Megaphone,
    description: "Anonymously report corruption — your identity is fully protected",
  },
  {
    label: "Vote on Priorities",
    href: "/vote",
    icon: Vote,
    description: "Help decide which corruption cases we investigate next",
  },
  {
    label: "About This Project",
    href: "/about",
    icon: Cpu,
    description: "Learn how this platform works and what it does",
  },
  {
    label: "Deep Investigations",
    href: "/research",
    icon: Brain,
    description: "Read detailed investigative reports",
  },
  {
    label: "Support This Project",
    href: "/donate",
    icon: Heart,
    description: "Help fund this platform's mission",
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
