import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    // Try to get city from request body first, then from URL path
    let city;
    
    if (req.method === 'POST') {
      const body = await req.json();
      city = body.city;
    } else {
      const url = new URL(req.url);
      const pathParts = url.pathname.split('/');
      city = pathParts[pathParts.length - 1];
    }

    if (!city) {
      return new Response(
        JSON.stringify({ error: 'City name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching weather for city: ${city}`);

    const openWeatherKey = 'c831ded1c99baf06655a60a4f918f102';
    
    // First get coordinates from city name
    const geocodingResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${openWeatherKey}`
    );

    if (!geocodingResponse.ok) {
      throw new Error(`Geocoding API error: ${geocodingResponse.status}`);
    }

    const geocodingData = await geocodingResponse.json();
    
    if (geocodingData.length === 0) {
      return new Response(
        JSON.stringify({ error: 'City not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { lat, lon } = geocodingData[0];

    // Now fetch weather using coordinates by calling the weather-coords function directly
    
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
      location: currentWeatherData.name || city,
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

    const weatherData = {
      currentWeather,
      forecast: dailyForecasts
    };


    console.log('City weather data fetched successfully');

    return new Response(
      JSON.stringify(weatherData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in weather-city function:', error);
    return new Response(
      JSON.stringify({ error: `Failed to fetch city weather: ${error.message}` }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});