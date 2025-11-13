-- Enable Row Level Security on listings table
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view listings (public read access for directory)
CREATE POLICY "Public read access for listings"
ON public.listings
FOR SELECT
USING (true);

-- Only authenticated admins can insert listings
CREATE POLICY "Admin insert access for listings"
ON public.listings
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Only authenticated admins can update listings
CREATE POLICY "Admin update access for listings"
ON public.listings
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Only authenticated admins can delete listings
CREATE POLICY "Admin delete access for listings"
ON public.listings
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);