import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'za.co.visita.crime.app',
  appName: 'Visita Crime Intelligence',
  webDir: 'out',
  server: {
    url: 'https://crime.visita.co.za',
    allowNavigation: [
      '*.supabase.co',
      '*.paystack.com'
    ]
  },
  android: {
    buildOptions: {
      keystorePath: 'C:\\Users\\Faiz\\Documents\\visita-release-key.jks',
      keystoreAlias: 'visita-key',
    }
  }
};

export default config;
