-- ====================================================================
-- TO-LET BABA (toletbaba.in) - Database Schema & DDL
-- "Direct Owner to Tenant • Zero Brokerage Local Rentals"
-- PostgreSQL / Supabase Migration Script
-- ====================================================================

-- 1. Enable Extensions
create extension if not exists "uuid-ossp";

-- 2. Define Custom Enums
do $$
begin
  if not exists (select 1 from pg_type where typname = 'property_category') then
    create type property_category as enum (
      '1 RK / Room', 
      '1 BHK Flat', 
      '2 BHK Flat', 
      '3+ BHK Flat', 
      'Independent House/Villa', 
      'PG / Co-living', 
      'Commercial Shop / Office'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'furnishing_status') then
    create type furnishing_status as enum (
      'Unfurnished', 
      'Semi-Furnished', 
      'Fully Furnished'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'tenant_preference') then
    create type tenant_preference as enum (
      'Family Only', 
      'Bachelors Only', 
      'Girls Only', 
      'Boys Only', 
      'Anyone'
    );
  end if;
end$$;

-- 3. Create Properties Table
create table if not exists public.properties (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text not null,
  category property_category not null,
  rent_amount integer not null,
  deposit_amount integer not null,
  maintenance_charges integer default 0,
  furnishing furnishing_status default 'Unfurnished',
  tenant_type tenant_preference default 'Anyone',
  available_from date default current_date,
  
  city text not null,
  locality text not null,
  sub_locality text,
  address text not null,
  pincode text not null,
  
  amenities text[] default '{}',
  images text[] default '{}',
  owner_name text not null,
  owner_phone text not null,
  whatsapp_number text not null,
  
  is_verified boolean default false,
  is_featured boolean default false,
  is_active boolean default true,
  is_rented_out boolean default false,
  views_count integer default 0
);

-- 4. Enable Row Level Security (RLS)
alter table public.properties enable row level security;

-- 5. Define RLS Policies
drop policy if exists "Public can view active properties" on public.properties;
create policy "Public can view active properties" 
  on public.properties 
  for select 
  using (is_active = true);

drop policy if exists "Anyone can insert new property listing" on public.properties;
create policy "Anyone can insert new property listing" 
  on public.properties 
  for insert 
  with check (true);

drop policy if exists "Owners can update their listing status" on public.properties;
create policy "Owners can update their listing status" 
  on public.properties 
  for update 
  using (true);

drop policy if exists "Owners can delete their listing" on public.properties;
create policy "Owners can delete their listing" 
  on public.properties 
  for delete 
  using (true);

-- 6. Helpful Indexes for Lightning Fast OLX-style Search & Filters
create index if not exists idx_properties_city on public.properties(city);
create index if not exists idx_properties_category on public.properties(category);
create index if not exists idx_properties_rent on public.properties(rent_amount);
create index if not exists idx_properties_created_at on public.properties(created_at desc);
create index if not exists idx_properties_locality on public.properties using gin (to_tsvector('english', locality || ' ' || title || ' ' || city));

-- 7. Setup Storage Bucket for Images (in Supabase Storage)
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

create policy "Public Access to Property Images"
  on storage.objects for select
  using ( bucket_id = 'property-images' );

create policy "Anyone can upload Property Images"
  on storage.objects for insert
  with check ( bucket_id = 'property-images' );
