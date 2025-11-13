-- Create or replace function to check if user has a role
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

-- Create or replace function to check if user email is admin email
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

-- Update listings table RLS policies
drop policy if exists "Authenticated users can insert listings" on public.listings;
drop policy if exists "Authenticated users can update listings" on public.listings;
drop policy if exists "Authenticated users can delete listings" on public.listings;
drop policy if exists "Only admins can insert listings" on public.listings;
drop policy if exists "Only admins can update listings" on public.listings;
drop policy if exists "Only admins can delete listings" on public.listings;

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

-- Update user_roles policies
drop policy if exists "Only designated email can be admin" on public.user_roles;

create policy "Only designated email can be admin"
on public.user_roles
for insert
to authenticated
with check (
  (role = 'admin' and public.is_admin_email(auth.uid())) 
  or role = 'user'
);