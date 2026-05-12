import { triggerVolumeBackfill, getTrcVolumes } from '../src/app/accountability/actions';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function triggerNext() {
  const volumes = await getTrcVolumes();
  const next = volumes.find(v => v.status === 'QUEUED');
  
  if (!next) {
    console.log("No queued volumes found.");
    return;
  }

  console.log(`Triggering Volume ${next.volume_number}: ${next.title}`);
  const result = await triggerVolumeBackfill(next.volume_number);
  console.log("Result:", result);
}

triggerNext().catch(console.error);
