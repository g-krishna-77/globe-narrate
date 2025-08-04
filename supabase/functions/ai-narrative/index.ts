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
    const { weatherData, forecastData } = await req.json();

    if (!weatherData) {
      return new Response(
        JSON.stringify({ error: 'Weather data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating AI narrative for:', weatherData.location);

    // Create forecast summary
    const forecastSummary = forecastData 
      ? forecastData.slice(0, 3).map(day => 
          `${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}: ${Math.round(day.temperature.max)}°/${Math.round(day.temperature.min)}° ${day.description}`
        ).join(', ')
      : 'No forecast available';

    // Construct the prompt using the specified template
    const prompt = `You are a friendly and cheerful weather assistant. Based on the following data for ${weatherData.location}, write a short, conversational, and helpful weather summary in 2-4 sentences. Give a feel for the day and maybe a lighthearted suggestion (e.g., 'it's a great day for a walk,' or 'don't forget an umbrella!'). Do not just list the data. Be creative and personable.

Current Weather:
- Temperature: ${Math.round(weatherData.temperature)}°C
- Feels Like: ${Math.round(weatherData.feelsLike)}°C
- Condition: ${weatherData.description}
- Humidity: ${weatherData.humidity}%
- Wind: ${weatherData.windSpeed.toFixed(1)} kph

Forecast Summary:
- ${forecastSummary}

Your creative summary:`;

    const openRouterKey = Deno.env.get('OPENROUTER_API_KEY');
    
    if (!openRouterKey) {
      return new Response(
        JSON.stringify({ error: 'OpenRouter API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openrouter/horizon-beta',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 200
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const narrative = data.choices[0].message.content.trim();

    console.log('AI narrative generated successfully');

    return new Response(
      JSON.stringify({ narrative }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in ai-narrative function:', error);
    return new Response(
      JSON.stringify({ error: `Failed to generate narrative: ${error.message}` }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});