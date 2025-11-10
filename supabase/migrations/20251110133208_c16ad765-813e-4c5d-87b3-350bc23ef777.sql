-- Drop the old category check constraint
ALTER TABLE public.listings DROP CONSTRAINT IF EXISTS listings_category_check;

-- Add new category check constraint that includes taxi
ALTER TABLE public.listings ADD CONSTRAINT listings_category_check 
  CHECK (category IN ('cafe', 'hotel', 'vet', 'petshop', 'park', 'grooming', 'taxi'));