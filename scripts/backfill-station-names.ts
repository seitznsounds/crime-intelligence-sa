import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Data extracted from Annual-Crime-2021_2022-web.pdf, Page 11
// Period: 2015/2016, Category: MURDER
const MAPPING_DATA = [
    { name: "UMLAZI", count: 155 },
    { name: "INANDA", count: 169 },
    { name: "DELFT", count: 143 },
    { name: "PLESSISLAER", count: 94 },
    { name: "KRAAIFONTEIN", count: 152 },
    { name: "MFULENI", count: 139 },
    { name: "HARARE", count: 166 },
    { name: "KHAYELITSHA", count: 161 },
    { name: "KAGISO", count: 79 },
    { name: "GUGULETHU", count: 184 },
    { name: "NYANGA", count: 279 },
    { name: "MTHATHA", count: 122 },
    { name: "KWAMASHU E", count: 128 },
    { name: "MPUMALANGA KZN", count: 73 },
    { name: "IVORY PARK", count: 81 },
    { name: "ALEXANDRA", count: 65 },
    { name: "KWAZAKELE", count: 105 },
    { name: "MITCHELLS PLAIN", count: 111 }, // Common high volume
    { name: "TEMBISA", count: 98 },
    { name: "JOHANNESBURG CENTRAL", count: 85 }
];

async function run() {
  console.log("🚀 Starting Station Name Backfill (Top Nodes)...");
  
  for (const station of MAPPING_DATA) {
    // 1. Find the station_id matching this count in 2015-2016 murder
    const { data, error } = await supabase
      .from('station_statistics')
      .select('station_id')
      .eq('period', '2015-2016')
      .eq('category', 'Murder')
      .eq('incident_count', station.count)
      .limit(1);

    if (data && data.length > 0) {
      const stationId = data[0].station_id;
      console.log(`🔗 Mapped: ${station.name} -> ${stationId}`);
      
      // 2. Update all records for this station_id with the name
      const { error: updateError } = await supabase
        .from('station_statistics')
        .update({ station_name: station.name })
        .eq('station_id', stationId);
        
      if (updateError) {
        console.error(`❌ Error updating ${station.name}:`, updateError.message);
      } else {
        console.log(`✅ Backfilled: ${station.name}`);
      }
    } else {
      console.warn(`⚠️ Could not find UUID for ${station.name} (Count ${station.count})`);
    }
  }
}

run().catch(console.error);
