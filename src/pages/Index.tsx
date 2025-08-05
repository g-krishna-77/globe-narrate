import { Suspense } from 'react';
import { useWeatherStore } from '@/store/weatherStore';
import InteractiveGlobe from '@/components/InteractiveGlobe';
import WeatherDisplayPanel from '@/components/WeatherDisplayPanel';
import LoadingSpinner from '@/components/LoadingSpinner';
import SearchBar from '@/components/SearchBar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const { 
    setSelectedLocation, 
    setError, 
    setLoading, 
    setNarrativeLoading, 
    setCurrentWeather, 
    setForecast, 
    setWeatherNarrative 
  } = useWeatherStore();

  const handleLocationSelect = async (coords: { lat: number; lon: number }) => {
    setSelectedLocation(coords);
    setError(null);
    setLoading(true);
    setNarrativeLoading(true);

    try {
      console.log('Fetching weather for coordinates:', coords);

      // Call weather-coords edge function
      const { data, error } = await supabase.functions.invoke('weather-coords', {
        body: { lat: coords.lat, lon: coords.lon },
      });

      if (error) throw error;

      setCurrentWeather(data.currentWeather);
      setForecast(data.forecast);

      // Generate AI narrative
      const { data: narrativeData, error: narrativeError } = await supabase.functions.invoke('ai-narrative', {
        body: {
          weatherData: data.currentWeather,
          forecastData: data.forecast
        }
      });

      if (narrativeError) {
        console.error('Failed to generate narrative:', narrativeError);
        setWeatherNarrative('Weather narrative temporarily unavailable.');
      } else {
        setWeatherNarrative(narrativeData.narrative);
      }

      toast({
        title: "Weather Loaded",
        description: `Showing weather for ${data.currentWeather.location}`,
      });

    } catch (error) {
      console.error('Location selection error:', error);
      setError('Failed to fetch weather data. Please try again.');
      toast({
        title: "Weather Error",
        description: "Failed to fetch weather data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setNarrativeLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="relative z-10 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-sky bg-clip-text text-transparent">
            🌍 Global Weather Explorer
          </h1>
          <p className="text-muted-foreground mt-2 mb-4 lg:mb-6 text-sm lg:text-base">
            Discover weather worldwide with AI-powered insights
          </p>
          <SearchBar />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 pb-4 lg:px-6 lg:pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Layout - Stack vertically */}
          <div className="lg:hidden space-y-6">
            {/* Globe Section - Mobile */}
            <div className="h-[60vh] min-h-[400px] relative">
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

            {/* Weather Display Section - Mobile */}
            <div className="min-h-[40vh]">
              <WeatherDisplayPanel />
            </div>
          </div>

          {/* Desktop Layout - Side by side */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
            {/* Globe Section - Desktop */}
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

            {/* Weather Display Section - Desktop */}
            <div className="overflow-y-auto">
              <WeatherDisplayPanel />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
