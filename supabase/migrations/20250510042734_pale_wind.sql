/*
  # Fix profiles table RLS policies

  1. Changes
    - Drop existing restrictive RLS policies
    - Add new policies to allow:
      - Profile creation for authenticated users
      - Profile reading for authenticated users
      - Profile updates for own profile
    
  2. Security
    - Maintains RLS protection
    - Users can only access their own profiles
    - Authenticated users can create their own profile
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

-- Create new policies
CREATE POLICY "Enable read access for authenticated users"
ON profiles FOR SELECT
TO authenticated
USING (
  auth.uid() = id
);

CREATE POLICY "Enable insert access for authenticated users"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = id
);

CREATE POLICY "Enable update access for users"
ON profiles FOR UPDATE
TO authenticated
USING (
  auth.uid() = id
)
WITH CHECK (
  auth.uid() = id
);

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;