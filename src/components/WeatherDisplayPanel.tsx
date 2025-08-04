import { useWeatherStore } from '@/store/weatherStore';
import CurrentWeatherCard from './CurrentWeatherCard';
import ForecastView from './ForecastView';
import WeatherNarrative from './WeatherNarrative';
import LoadingSpinner from './LoadingSpinner';
import { Card } from '@/components/ui/card';

export default function WeatherDisplayPanel() {
  const {
    loading,
    narrativeLoading,
    error,
    currentWeather,
    forecast,
    weatherNarrative
  } = useWeatherStore();

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="weather-panel p-8 text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Fetching weather data...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="weather-panel p-6 text-center">
        <div className="text-destructive text-lg mb-2">⚠️ Weather Unavailable</div>
        <p className="text-muted-foreground">{error}</p>
      </Card>
    );
  }

  if (!currentWeather) {
    return (
      <Card className="weather-panel p-8 text-center">
        <div className="text-6xl mb-4">🌍</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Explore Global Weather
        </h3>
        <p className="text-muted-foreground">
          Click anywhere on the globe to get real-time weather information
          and an AI-generated weather narrative for that location.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <CurrentWeatherCard weather={currentWeather} />
      
      <WeatherNarrative 
        narrative={weatherNarrative} 
        loading={narrativeLoading} 
      />
      
      {forecast && <ForecastView forecast={forecast} />}
    </div>
  );
}