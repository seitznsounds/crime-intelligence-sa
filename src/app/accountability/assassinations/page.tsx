import { Suspense } from "react";
import AssassinationsClient from "./AssassinationsClient";

export const metadata = {
  title: "Assassination & Retribution Tracker | Crime Intelligence SA",
  description: "Visualizing the Protection-Implementation Paradox and physical impunity rates."
};

// In a real scenario, this data would come from Supabase.
// We are mocking the PPLAAF ingestion data for Sprint 5 dashboard integration.
const MOCK_METRICS = {
  impunityRate: 98,
  totalHits: 47,
  protectionFailure: "84%"
};

const MOCK_EVENTS = [
  {
    id: "evt_1",
    date: "2021-08-23",
    victim_name: "Babita Deokaran",
    role: "Senior Finance Executive (Gauteng Dept of Health)",
    event_type: "retaliation",
    description: "Assassinated outside her home after flagging R850 million in suspicious payments.",
    implicated_pep: "Various Provincial Health Officials"
  },
  {
    id: "evt_2",
    date: "2021-08-01",
    victim_name: "Babita Deokaran",
    role: "Senior Finance Executive",
    event_type: "disclosure",
    description: "Filed detailed internal report stopping payments to 217 shell companies.",
    implicated_pep: null
  },
  {
    id: "evt_3",
    date: "2023-02-10",
    victim_name: "Cloete Murray",
    role: "Liquidator / Financial Investigator",
    event_type: "retaliation",
    description: "Assassinated alongside his son in Midrand while investigating high-profile state capture liquidations (Bosasa).",
    implicated_pep: "Bosasa Network"
  },
  {
    id: "evt_4",
    date: "2023-01-15",
    victim_name: "Cloete Murray",
    role: "Liquidator",
    event_type: "disclosure",
    description: "Seized assets and bank accounts belonging to key state capture architects.",
    implicated_pep: null
  }
];

const MOCK_WPU_DATA = {
  stats: {
    budgetAllocated: "R450m",
    budgetSpent: "R112m",
    safehousesRequired: 85,
    safehousesActive: 12
  },
  vacancies: [
    { id: "v1", role: "Director of Covert Protection", department: "Strategic Command", monthsVacant: 24, risk: "CRITICAL" },
    { id: "v2", role: "Safehouse Logistics Coordinator", department: "Operations", monthsVacant: 18, risk: "CRITICAL" },
    { id: "v3", role: "Forensic Accountant", department: "Financial Monitoring", monthsVacant: 6, risk: "HIGH" },
    { id: "v4", role: "Secure Transport Specialist", department: "Tactical Movement", monthsVacant: 14, risk: "CRITICAL" },
    { id: "v5", role: "Vetting & Integrity Auditor", department: "Internal Security", monthsVacant: 32, risk: "CRITICAL" }
  ]
};

export default async function AssassinationsPage() {
  // Simulate network delay for data fetching
  await new Promise(resolve => setTimeout(resolve, 800));

  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground animate-pulse">Loading intelligence...</div>}>
      <AssassinationsClient metrics={MOCK_METRICS} events={MOCK_EVENTS} wpuData={MOCK_WPU_DATA} />
    </Suspense>
  );
}
