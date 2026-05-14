import { Suspense } from "react";
import AboutClient from "./AboutClient";

export const metadata = {
  title: "Platform Intelligence Engine | Crime Intelligence SA",
  description: "Explore the technical architecture, manifesto, and live telemetry of our intelligence platform."
};

const MOCK_TELEMETRY = {
  recordsProcessed: 32450,
  pepsMapped: 1288,
  highRiskLinks: 47,
  vectorSearches: 124,
  uptime: "99.98%"
};

export default async function AboutPage() {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate load

  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground animate-pulse">Initializing Command Center...</div>}>
      <AboutClient telemetry={MOCK_TELEMETRY} />
    </Suspense>
  );
}
