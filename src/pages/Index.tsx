import { Suspense } from 'react';
import { useWeatherStore } from '@/store/weatherStore';
import InteractiveGlobe from '@/components/InteractiveGlobe';
import WeatherDisplayPanel from '@/components/WeatherDisplayPanel';
import LoadingSpinner from '@/components/LoadingSpinner';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const { setSelectedLocation, setError } = useWeatherStore();

  const handleLocationSelect = async (coords: { lat: number; lon: number }) => {
    setSelectedLocation(coords);
    setError(null);
    
    // For now, show a demo message since we need Supabase for API calls
    toast({
      title: "Location Selected",
      description: `Latitude: ${coords.lat.toFixed(2)}, Longitude: ${coords.lon.toFixed(2)}`,
    });
    
    // TODO: Connect to Supabase for real weather data
    console.log('Selected coordinates:', coords);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold bg-gradient-sky bg-clip-text text-transparent">
            🌍 Global Weather Explorer
          </h1>
          <p className="text-muted-foreground mt-2">
            Discover weather worldwide with AI-powered insights
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
            {/* Globe Section */}
            <div className="relative">
              <Suspense 
                fallback={
                  <div className="flex items-center justify-center h-full">
                    <LoadingSpinner size="lg" />
                  </div>
                }
              >
                <InteractiveGlobe onLocationSelect={handleLocationSelect} />
              </Suspense>
            </div>

            {/* Weather Display Section */}
            <div className="overflow-y-auto">
              <WeatherDisplayPanel />
            </div>
          </div>
        </div>
      </main>

      {/* Floating Connect Notice */}
      <div className="fixed bottom-6 left-6 right-6 z-20">
        <div className="max-w-md mx-auto weather-panel p-4 rounded-xl border border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-primary rounded-full pulse-glow"></div>
            <div className="text-sm">
              <div className="font-semibold text-foreground">Connect Supabase</div>
              <div className="text-muted-foreground">
                Enable real weather data & AI narratives
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
