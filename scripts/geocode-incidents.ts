import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Johannesburg': { lat: -26.2041, lng: 28.0473 },
  'Pretoria': { lat: -25.7479, lng: 28.2293 },
  'Cape Town': { lat: -33.9249, lng: 18.4241 },
  'Durban': { lat: -29.8587, lng: 31.0218 },
  'Gqeberha': { lat: -33.9608, lng: 25.6022 },
  'Port Elizabeth': { lat: -33.9608, lng: 25.6022 },
  'Bloemfontein': { lat: -29.1181, lng: 26.2231 },
  'Polokwane': { lat: -23.8962, lng: 29.4486 },
  'Mbombela': { lat: -25.4753, lng: 30.9694 },
  'Nelspruit': { lat: -25.4753, lng: 30.9694 },
  'Kimberley': { lat: -28.7282, lng: 24.7499 },
  'Mahikeng': { lat: -25.8560, lng: 25.6403 },
  'Lusikisiki': { lat: -31.3653, lng: 29.5746 },
  'Motherwell': { lat: -33.8055, lng: 25.5684 },
  'Soweto': { lat: -26.2361, lng: 27.8543 },
  'Bekkersdal': { lat: -26.3861, lng: 27.7128 },
  'Dimbaza': { lat: -32.8464, lng: 27.1353 }
};

async function geocodeIncidents() {
  console.log('🌍 Starting Geocoding Backfill...');

  const { data: incidents, error } = await supabase
    .from('incidents')
    .select('id, location, city')
    .is('latitude', null)
    .limit(500);

  if (error) {
    console.error('❌ Error fetching incidents:', error);
    return;
  }

  console.log(`🔍 Found ${incidents.length} incidents to geocode.`);

  let updatedCount = 0;

  for (const incident of incidents) {
    let coords = null;
    const searchText = (incident.location || '') + ' ' + (incident.city || '');

    for (const [city, cityCoords] of Object.entries(CITY_COORDINATES)) {
      if (searchText.toLowerCase().includes(city.toLowerCase())) {
        coords = cityCoords;
        break;
      }
    }

    if (coords) {
      const { error: updateError } = await supabase
        .from('incidents')
        .update({
          latitude: coords.lat,
          longitude: coords.lng
        })
        .eq('id', incident.id);

      if (!updateError) updatedCount++;
    }
  }

  console.log(`✅ Geocoded ${updatedCount} incidents.`);
}

geocodeIncidents();
