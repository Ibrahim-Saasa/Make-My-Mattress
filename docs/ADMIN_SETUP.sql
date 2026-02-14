-- Admin Account Setup Script
-- Run this in Supabase SQL Editor to create or update admin accounts

-- Example 1: Create a new admin user via SQL (email must exist in auth.users)
-- First, create the user in Supabase Auth dashboard, then run:

UPDATE public.profiles
SET role = 'SUPER_ADMIN'
WHERE email = 'admin@hindustan-mattress.com';

-- Example 2: Check existing admin accounts
SELECT id, email, role 
FROM auth.users 
LEFT JOIN public.profiles ON auth.users.id = profiles.id
WHERE profiles.role = 'SUPER_ADMIN'
ORDER BY auth.users.created_at DESC;

-- Example 3: View all users and their roles
SELECT 
  auth.users.email,
  auth.users.id,
  COALESCE(profiles.role, 'NO_ROLE') as role,
  auth.users.created_at
FROM auth.users
LEFT JOIN public.profiles ON auth.users.id = profiles.id
ORDER BY auth.users.created_at DESC;

-- Example 4: Change a user's role from END_USER to SUPER_ADMIN
UPDATE public.profiles
SET role = 'SUPER_ADMIN'
WHERE id = (SELECT id FROM auth.users WHERE email = 'user@example.com');

-- Example 5: Demote an admin back to regular user
UPDATE public.profiles
SET role = 'END_USER'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');

-- Example 6: Create admin if profile doesn't exist
INSERT INTO public.profiles (id, role)
SELECT id, 'SUPER_ADMIN'
FROM auth.users
WHERE email = 'admin@hindustan-mattress.com'
AND id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO UPDATE SET role = 'SUPER_ADMIN';

-- Example 7: List all users with their first names
SELECT 
  auth.users.email,
  profiles.first_name,
  profiles.role
FROM auth.users
LEFT JOIN public.profiles ON auth.users.id = profiles.id
ORDER BY auth.users.created_at DESC;
