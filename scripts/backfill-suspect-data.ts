import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("🚀 Starting Suspect Bio/Image Backfill...");
  
  const people = [
    { 
      full_name: 'Vusimuzi Matlala', 
      description: 'Underworld kingpin known as "Cat". Centre of the Madlanga Commission. Alleged leader of the Big Five Cartel involved in drug trafficking and R360m SAPS tender fraud.', 
      profile_image_url: 'https://images.summitmedia-digital.com/preview/images/2023/10/30/vusimuzi-matlala-cat-nm.jpg' 
    },
    { 
      full_name: 'Ebrahim Kadwa', 
      description: 'Former Major-General and Gauteng Head of the Hawks. Arrested in May 2026 for illegal gold dealing and corruption related to a precious metals syndicate.', 
      profile_image_url: 'https://cdn.dailymaverick.co.za/wp-content/uploads/Kadwa-Ebrahim-Hawks.jpg' 
    },
    {
      full_name: 'Feroz Khan',
      description: 'SAPS Major-General and Head of Counter-Intelligence. Arrested alongside Kadwa in May 2026. Allegedly controlled a commercial empire funded by illicit precious metals.',
      profile_image_url: 'https://img.news24.com/cms/news24/images/20260511/feroz_khan_court.jpg'
    }
  ];

  for (const p of people) {
    const { error } = await supabase
      .from('people')
      .update(p)
      .eq('full_name', p.full_name);
    
    if (error) {
        console.error(`❌ Error updating ${p.full_name}:`, error.message);
    } else {
        console.log(`✅ Updated: ${p.full_name}`);
    }
  }
}

run().catch(console.error);
