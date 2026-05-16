"use server";

import { createServerClient } from "@/lib/supabase-server";

export interface ExposeFilters {
  query?: string;
  status?: string;
  tier?: string;
  isDeceased?: boolean | null;
  page?: number;
  pageSize?: number;
}

export async function getExposeData(filters: ExposeFilters = {}) {
  const {
    query = "",
    status = "ALL",
    tier = "ALL",
    isDeceased = null,
    page = 1,
    pageSize = 12
  } = filters;

  const supabase = await createServerClient();

  let dbQuery = supabase
    .from("people")
    .select("id, full_name, pep_tier, risk_score, status, role, profile_image_url, metadata, is_deceased", { count: "exact" });

  // Apply Search
  if (query) {
    dbQuery = dbQuery.or(`full_name.ilike.%${query}%,role.ilike.%${query}%`);
  }

  // Apply Status Filter
  if (status !== "ALL") {
    dbQuery = dbQuery.eq("status", status);
  }

  // Apply Tier Filter
  if (tier === "PEP") {
    dbQuery = dbQuery.not("pep_tier", "is", null);
  } else if (tier === "NON-PEP") {
    dbQuery = dbQuery.is("pep_tier", null);
  }

  // Apply Alive/Deceased Filter
  if (isDeceased !== null) {
    dbQuery = dbQuery.eq("is_deceased", isDeceased);
  }

  // Sorting
  dbQuery = dbQuery.order("risk_score", { ascending: false });

  // Pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  dbQuery = dbQuery.range(from, to);

  const { data, count, error } = await dbQuery;

  if (error) {
    console.error("Error fetching expose data:", error);
    return { people: [], totalCount: 0 };
  }

  return {
    people: data || [],
    totalCount: count || 0
  };
}

export async function getUniqueStatuses() {
    const supabase = await createServerClient();
    const { data } = await supabase.from('people').select('status');
    const statuses = new Set<string>();
    data?.forEach(p => {
        if (p.status) statuses.add(p.status);
    });
    return Array.from(statuses).sort();
}
