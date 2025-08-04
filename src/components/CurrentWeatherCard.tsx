import { Card } from '@/components/ui/card';
import { Thermometer, Droplets, Wind, Eye } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { WeatherData } from '@/store/weatherStore';

interface CurrentWeatherCardProps {
  weather: WeatherData;
}

export default function CurrentWeatherCard({ weather }: CurrentWeatherCardProps) {
  return (
    <Card className="weather-panel p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {weather.location}
        </h2>
        <div className="flex items-center justify-center gap-4 mb-4">
          <WeatherIcon iconCode={weather.icon} size={48} />
          <div className="text-right">
            <div className="text-4xl font-bold text-primary">
              {Math.round(weather.temperature)}°
            </div>
            <div className="text-muted-foreground text-sm">
              Feels like {Math.round(weather.feelsLike)}°
            </div>
          </div>
        </div>
        <p className="text-lg text-muted-foreground capitalize">
          {weather.description}
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
          <Droplets className="text-accent" size={20} />
          <div>
            <div className="text-sm text-muted-foreground">Humidity</div>
            <div className="font-semibold">{weather.humidity}%</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
          <Wind className="text-accent" size={20} />
          <div>
            <div className="text-sm text-muted-foreground">Wind</div>
            <div className="font-semibold">{weather.windSpeed} km/h</div>
          </div>
        </div>
      </div>
    </Card>
  );
}