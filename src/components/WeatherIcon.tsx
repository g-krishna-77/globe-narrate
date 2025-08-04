import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  Zap, 
  CloudDrizzle,
  Eye,
  Wind
} from 'lucide-react';

interface WeatherIconProps {
  iconCode: string;
  size?: number;
  className?: string;
}

export default function WeatherIcon({ iconCode, size = 24, className = "" }: WeatherIconProps) {
  const getWeatherIcon = (code: string) => {
    // OpenWeatherMap icon codes mapping
    switch (code) {
      case '01d':
      case '01n':
        return <Sun size={size} className={`text-weather-sunny ${className}`} />;
      case '02d':
      case '02n':
      case '03d':
      case '03n':
      case '04d':
      case '04n':
        return <Cloud size={size} className={`text-weather-cloudy ${className}`} />;
      case '09d':
      case '09n':
        return <CloudDrizzle size={size} className={`text-weather-rainy ${className}`} />;
      case '10d':
      case '10n':
        return <CloudRain size={size} className={`text-weather-rainy ${className}`} />;
      case '11d':
      case '11n':
        return <Zap size={size} className={`text-weather-stormy ${className}`} />;
      case '13d':
      case '13n':
        return <CloudSnow size={size} className={`text-weather-snowy ${className}`} />;
      case '50d':
      case '50n':
        return <Eye size={size} className={`text-weather-cloudy ${className}`} />;
      default:
        return <Sun size={size} className={`text-weather-sunny ${className}`} />;
    }
  };

  return (
    <div className="weather-float">
      {getWeatherIcon(iconCode)}
    </div>
  );
}