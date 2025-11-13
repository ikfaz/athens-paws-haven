-- Create role enum if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    create type public.app_role as enum ('admin', 'user');
  END IF;
END $$;

-- Create user_roles table if not exists
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamp with time zone default now(),
  unique (user_id, role)
);

-- Enable RLS
alter table public.user_roles enable row level security;

-- Create function to check if user has a role
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Create function to check if user email is admin email
create or replace function public.is_admin_email(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from auth.users
    where id = _user_id
      and email = 'i.k.fazlul@gmail.com'
  )
$$;

-- Drop existing policies if they exist
drop policy if exists "Users can view their own roles" on public.user_roles;
drop policy if exists "Only designated email can be admin" on public.user_roles;
drop policy if exists "Authenticated users can insert listings" on public.listings;
drop policy if exists "Authenticated users can update listings" on public.listings;
drop policy if exists "Authenticated users can delete listings" on public.listings;
drop policy if exists "Only admins can insert listings" on public.listings;
drop policy if exists "Only admins can update listings" on public.listings;
drop policy if exists "Only admins can delete listings" on public.listings;

-- RLS policies for user_roles table
-- Users can view their own roles
create policy "Users can view their own roles"
on public.user_roles
for select
to authenticated
using (auth.uid() = user_id);

-- Only the specific admin email can insert admin role
create policy "Only designated email can be admin"
on public.user_roles
for insert
to authenticated
with check (
  (role = 'admin' and public.is_admin_email(auth.uid())) 
  or role = 'user'
);

-- Update listings table RLS policies
create policy "Only admins can insert listings"
on public.listings
for insert
to authenticated
with check (public.has_role(auth.uid(), 'admin'));

create policy "Only admins can update listings"
on public.listings
for update
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Only admins can delete listings"
on public.listings
for delete
to authenticated
using (public.has_role(auth.uid(), 'admin'));