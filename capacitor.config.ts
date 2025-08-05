import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.4b91b30af3d643ebbdfa94f465646f6b',
  appName: 'globe-narrate',
  webDir: 'dist',
  server: {
    url: 'https://4b91b30a-f3d6-43eb-bdfa-94f465646f6b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1e40af',
      showSpinner: false
    }
  }
};

export default config;