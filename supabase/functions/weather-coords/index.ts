import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Try to get coordinates from request body first, then from URL params
    let lat, lon;
    
    if (req.method === 'POST') {
      const body = await req.json();
      lat = body.lat?.toString();
      lon = body.lon?.toString();
    } else {
      const url = new URL(req.url);
      lat = url.searchParams.get('lat');
      lon = url.searchParams.get('lon');
    }

    if (!lat || !lon) {
      return new Response(
        JSON.stringify({ error: 'Missing latitude or longitude parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching weather for coordinates: ${lat}, ${lon}`);

    const openWeatherKey = 'c831ded1c99baf06655a60a4f918f102';
    
    // Fetch current weather
    const currentWeatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherKey}&units=metric`
    );

    if (!currentWeatherResponse.ok) {
      throw new Error(`Weather API error: ${currentWeatherResponse.status}`);
    }

    const currentWeatherData = await currentWeatherResponse.json();

    // Fetch 5-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${openWeatherKey}&units=metric`
    );

    if (!forecastResponse.ok) {
      throw new Error(`Forecast API error: ${forecastResponse.status}`);
    }

    const forecastData = await forecastResponse.json();

    // Process current weather
    const currentWeather = {
      location: currentWeatherData.name || `${parseFloat(lat).toFixed(2)}, ${parseFloat(lon).toFixed(2)}`,
      temperature: currentWeatherData.main.temp,
      feelsLike: currentWeatherData.main.feels_like,
      description: currentWeatherData.weather[0].description,
      humidity: currentWeatherData.main.humidity,
      windSpeed: (currentWeatherData.wind.speed * 3.6), // Convert m/s to km/h
      icon: currentWeatherData.weather[0].icon,
      coordinates: {
        lat: parseFloat(lat),
        lon: parseFloat(lon)
      }
    };

    // Process forecast (group by day, take midday data)
    const dailyForecasts = [];
    const processedDates = new Set();
    
    for (const item of forecastData.list) {
      const date = new Date(item.dt * 1000).toDateString();
      
      if (!processedDates.has(date) && dailyForecasts.length < 5) {
        processedDates.add(date);
        dailyForecasts.push({
          date: item.dt_txt.split(' ')[0],
          temperature: {
            max: item.main.temp_max,
            min: item.main.temp_min
          },
          description: item.weather[0].description,
          icon: item.weather[0].icon
        });
      }
    }

    // Save to recent locations (optional feature)
    try {
      const supabase = createClient(
        'https://iqnafwkhwyyjivrzowip.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbmFmd2tod3l5aml2cnpvd2lwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMjc2MDEsImV4cCI6MjA2OTkwMzYwMX0.JCq5UgSgJYLHPs9eQbmIDVNOYL7mHk37Op9J2P8DK4E'
      );

      await supabase.from('recent_locations').insert({
        city_name: currentWeather.location,
        latitude: parseFloat(lat),
        longitude: parseFloat(lon)
      });
    } catch (error) {
      console.log('Failed to save to recent locations:', error);
      // Don't fail the request if we can't save to DB
    }

    console.log('Weather data fetched successfully');

    return new Response(
      JSON.stringify({
        currentWeather,
        forecast: dailyForecasts
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in weather-coords function:', error);
    return new Response(
      JSON.stringify({ error: `Failed to fetch weather data: ${error.message}` }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});