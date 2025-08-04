-- Create recent_locations table for storing user's recent weather lookups
CREATE TABLE public.recent_locations (
  id BIGSERIAL PRIMARY KEY,
  city_name TEXT NOT NULL,
  latitude FLOAT8 NOT NULL,
  longitude FLOAT8 NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.recent_locations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read recent locations (public data)
CREATE POLICY "Anyone can view recent locations" 
ON public.recent_locations 
FOR SELECT 
USING (true);

-- Create policy to allow anyone to insert recent locations
CREATE POLICY "Anyone can insert recent locations" 
ON public.recent_locations 
FOR INSERT 
WITH CHECK (true);

-- Create index for better performance on location queries
CREATE INDEX idx_recent_locations_coords ON public.recent_locations (latitude, longitude);
CREATE INDEX idx_recent_locations_viewed_at ON public.recent_locations (viewed_at DESC);