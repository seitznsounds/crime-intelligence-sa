import { Suspense } from "react";
import LeadershipClient from "./LeadershipClient";

export const metadata = {
  title: "Leadership Accountability Audit | Crime Intelligence SA",
  description: "Interactive organizational mapping of Tier-1 PEPs and systemic corruption flows."
};

// Mock data representing the National Government Leadership Audit
const MOCK_LEADERSHIP_DATA = {
  stats: {
    auditedDepartments: 14,
    compromiseIndex: 68
  },
  nodes: [
    {
      id: "pres",
      role: "Presidency / Core Executive",
      name: "Executive Node Alpha",
      riskLevel: "medium", // 'high', 'medium', 'low'
      score: 55,
      x: 500,
      y: 50,
      description: "Central executive authority. Moderate risk flags on associated procurement directives."
    },
    {
      id: "min_police",
      role: "Minister of Police",
      name: "Bheki Cele (Historical)",
      riskLevel: "high",
      score: 89,
      x: 300,
      y: 250,
      description: "High volume of unaudited procurement within SAPS. Documented political interference in Hawks operations."
    },
    {
      id: "min_finance",
      role: "Minister of Finance",
      name: "E. Godongwana",
      riskLevel: "medium",
      score: 45,
      x: 700,
      y: 250,
      description: "Treasury oversight node. Secondary risks related to municipal bailouts and delayed SOE audits."
    },
    {
      id: "dir_saps",
      role: "National Commissioner",
      name: "F. Masemola",
      riskLevel: "high",
      score: 92,
      x: 150,
      y: 450,
      description: "Direct oversight of CI (Crime Intelligence) slush funds. Severe audit findings from AG."
    },
    {
      id: "dir_hawks",
      role: "Head of DPCI (Hawks)",
      name: "G. Lebeya",
      riskLevel: "medium",
      score: 60,
      x: 450,
      y: 450,
      description: "Slow prosecution rates on TRC and State Capture volumes. Systemic capacity constraints."
    },
    {
      id: "dir_sars",
      role: "SARS Commissioner",
      name: "E. Kieswetter",
      riskLevel: "low",
      score: 15,
      x: 700,
      y: 450,
      description: "Rebuilding capacity. Low risk index but operating in a hostile political ecosystem."
    }
  ],
  links: [
    { source: "pres", target: "min_police" },
    { source: "pres", target: "min_finance" },
    { source: "min_police", target: "dir_saps" },
    { source: "min_police", target: "dir_hawks" },
    { source: "min_finance", target: "dir_sars" }
  ]
};

export default async function LeadershipPage() {
  await new Promise(resolve => setTimeout(resolve, 800));

  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground animate-pulse">Decrypting leadership networks...</div>}>
      <LeadershipClient data={MOCK_LEADERSHIP_DATA} />
    </Suspense>
  );
}
