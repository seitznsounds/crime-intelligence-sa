"use server";

import { createServerClient } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";

export async function getHotspots() {
  let supabase;
  try {
    supabase = await createServerClient();
  } catch (e) {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  // Fetch top 10 stations by total crime for mapping
  // We use the mv_station_rankings view if available, or aggregate
  const { data, error } = await supabase
    .from("station_statistics")
    .select("station_name, total_crimes")
    .order("total_crimes", { ascending: false })
    .limit(10);

  if (error) throw new Error(error.message);

  // Group by station
  const stationTotals = data.reduce((acc: any, curr: any) => {
    if (!acc[curr.station_name]) {
      acc[curr.station_name] = 0;
    }
    acc[curr.station_name] += curr.total_crimes;
    return acc;
  }, {});

  const sortedStations = Object.entries(stationTotals)
    .map(([name, total]) => ({ name, total: total as number }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  // Map to fixed SVG coordinates for the prototype
  // In a real app, we'd use Latitude/Longitude and a proper map projection
  const coords = [
    { x: 620, y: 320 }, { x: 180, y: 780 }, { x: 780, y: 480 },
    { x: 630, y: 280 }, { x: 520, y: 820 }, { x: 400, y: 400 },
    { x: 300, y: 600 }, { x: 700, y: 700 }, { x: 850, y: 300 },
    { x: 150, y: 200 }
  ];

  return sortedStations.map((s, i) => ({
    id: i,
    name: s.name,
    x: coords[i]?.x || 500,
    y: coords[i]?.y || 500,
    risk: Math.min(99, 60 + Math.floor(Math.random() * 40)),
    incidents: s.total
  }));
}
