import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useWeatherStore } from '@/store/weatherStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { setLoading, setCurrentWeather, setForecast, setError, setWeatherNarrative } = useWeatherStore();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setLoading(true);
    setError(null);

    try {
      console.log('Searching for city:', searchTerm);

      // Call weather-city edge function
      const { data, error } = await supabase.functions.invoke('weather-city', {
        body: { city: searchTerm },
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
      } else {
        setWeatherNarrative(narrativeData.narrative);
      }

      toast({
        title: "Weather Found",
        description: `Showing weather for ${data.currentWeather.location}`,
      });

    } catch (error) {
      console.error('Search error:', error);
      setError(`Failed to find weather for "${searchTerm}"`);
      toast({
        title: "Search Failed",
        description: `Could not find weather for "${searchTerm}"`,
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          type="text"
          placeholder="Search city or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 weather-panel border-primary/20"
          disabled={isSearching}
        />
      </div>
      <Button 
        type="submit" 
        disabled={isSearching || !searchTerm.trim()}
        className="shrink-0"
      >
        {isSearching ? 'Searching...' : 'Search'}
      </Button>
    </form>
  );
}