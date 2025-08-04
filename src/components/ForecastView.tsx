import { Card } from '@/components/ui/card';
import WeatherIcon from './WeatherIcon';
import { ForecastData } from '@/store/weatherStore';

interface ForecastViewProps {
  forecast: ForecastData[];
}

export default function ForecastView({ forecast }: ForecastViewProps) {
  return (
    <Card className="weather-panel p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        5-Day Forecast
      </h3>
      <div className="space-y-3">
        {forecast.map((day, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <WeatherIcon iconCode={day.icon} size={28} />
              <div>
                <div className="font-medium">
                  {new Date(day.date).toLocaleDateString('en-US', { 
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
                <div className="text-sm text-muted-foreground capitalize">
                  {day.description}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold">
                {Math.round(day.temperature.max)}°
              </div>
              <div className="text-sm text-muted-foreground">
                {Math.round(day.temperature.min)}°
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}