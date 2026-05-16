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

export async function getTemporalData() {
  let supabase;
  try {
    supabase = await createServerClient();
  } catch (e) {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  const { data: incidents, error } = await supabase
    .from("incidents")
    .select("occurred_at, created_at");

  if (error) return { hourly: [], monthly: [] };

  const hourlyCounts = new Array(24).fill(0);
  const monthlyCounts = new Array(12).fill(0);

  incidents.forEach((inc) => {
    const date = new Date(inc.occurred_at || inc.created_at);
    if (!isNaN(date.getTime())) {
      hourlyCounts[date.getHours()]++;
      monthlyCounts[date.getMonth()]++;
    }
  });

  const maxHour = Math.max(...hourlyCounts, 1);
  const maxMonth = Math.max(...monthlyCounts, 1);

  const hourly = hourlyCounts.map((count, i) => ({
    label: `${i.toString().padStart(2, '0')}:00`,
    count,
    intensity: count / maxHour
  }));

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthly = monthlyCounts.map((count, i) => ({
    label: months[i],
    count,
    intensity: count / maxMonth
  }));

  return { hourly, monthly };
}
