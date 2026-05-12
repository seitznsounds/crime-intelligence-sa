import { triggerVolumeBackfill } from '../src/app/accountability/actions';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function runTrigger() {
  console.log("Triggering backfill for Volume 2...");
  const result = await triggerVolumeBackfill(2);
  console.log("Result:", result);
}

runTrigger().catch(console.error);
