import { create } from 'zustand';

export interface WeatherData {
  location: string;
  temperature: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  coordinates: {
    lat: number;
    lon: number;
  };
}

export interface ForecastData {
  date: string;
  temperature: {
    max: number;
    min: number;
  };
  description: string;
  icon: string;
}

interface WeatherStore {
  loading: boolean;
  narrativeLoading: boolean;
  error: string | null;
  selectedLocation: { lat: number; lon: number } | null;
  currentWeather: WeatherData | null;
  forecast: ForecastData[] | null;
  weatherNarrative: string | null;
  
  setLoading: (loading: boolean) => void;
  setNarrativeLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedLocation: (location: { lat: number; lon: number } | null) => void;
  setCurrentWeather: (weather: WeatherData | null) => void;
  setForecast: (forecast: ForecastData[] | null) => void;
  setWeatherNarrative: (narrative: string | null) => void;
  clearWeatherData: () => void;
}

export const useWeatherStore = create<WeatherStore>((set) => ({
  loading: false,
  narrativeLoading: false,
  error: null,
  selectedLocation: null,
  currentWeather: null,
  forecast: null,
  weatherNarrative: null,
  
  setLoading: (loading) => set({ loading }),
  setNarrativeLoading: (narrativeLoading) => set({ narrativeLoading }),
  setError: (error) => set({ error }),
  setSelectedLocation: (selectedLocation) => set({ selectedLocation }),
  setCurrentWeather: (currentWeather) => set({ currentWeather }),
  setForecast: (forecast) => set({ forecast }),
  setWeatherNarrative: (weatherNarrative) => set({ weatherNarrative }),
  clearWeatherData: () => set({
    currentWeather: null,
    forecast: null,
    weatherNarrative: null,
    error: null
  }),
}));