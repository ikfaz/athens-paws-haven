-- Create listings table
CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('cafe', 'hotel', 'vet', 'petshop', 'park', 'grooming')),
  address TEXT NOT NULL,
  description TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  website TEXT,
  maps_link TEXT NOT NULL,
  image TEXT NOT NULL,
  tag TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can view listings (public read)
CREATE POLICY "Anyone can view listings"
  ON public.listings
  FOR SELECT
  USING (true);

-- RLS Policy: Authenticated users can insert listings
CREATE POLICY "Authenticated users can insert listings"
  ON public.listings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policy: Authenticated users can update listings
CREATE POLICY "Authenticated users can update listings"
  ON public.listings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policy: Authenticated users can delete listings
CREATE POLICY "Authenticated users can delete listings"
  ON public.listings
  FOR DELETE
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index on category for faster filtering
CREATE INDEX idx_listings_category ON public.listings(category);

-- Enable realtime for listings table
ALTER PUBLICATION supabase_realtime ADD TABLE public.listings;