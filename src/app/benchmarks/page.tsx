import BenchmarksClient from "./BenchmarksClient";
import { getBenchmarks } from "./actions";

export const dynamic = "force-dynamic";

export default async function BenchmarksPage() {
  const initialBenchmarks = await getBenchmarks();

  return <BenchmarksClient initialBenchmarks={initialBenchmarks} />;
}
