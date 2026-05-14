import { Suspense } from "react";
import VoidClient from "./VoidClient";

export const metadata = {
  title: "The Reporting Void | Crime Intelligence SA",
  description: "Interactive visualization demonstrating the 4.9x gap between official SAPS data and StatsSA surveys."
};

// Mock baseline data based on the intelligence brief
const MOCK_CRIME_CATEGORIES = [
  { name: "Home Robbery", sapVolume: 21400, multiplier: 4.9 },
  { name: "Extortion / Protection Rings", sapVolume: 8400, multiplier: 3.5 },
  { name: "Aggravated Assault", sapVolume: 165000, multiplier: 1.8 }
];

export default async function ReportingVoidPage() {
  await new Promise(resolve => setTimeout(resolve, 800));

  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground animate-pulse">Calculating reporting voids...</div>}>
      <VoidClient categories={MOCK_CRIME_CATEGORIES} />
    </Suspense>
  );
}
