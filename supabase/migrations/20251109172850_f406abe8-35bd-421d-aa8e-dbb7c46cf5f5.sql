-- Fix function search path security issue by recreating trigger and function
DROP TRIGGER IF EXISTS update_listings_updated_at ON public.listings;
DROP FUNCTION IF EXISTS public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();