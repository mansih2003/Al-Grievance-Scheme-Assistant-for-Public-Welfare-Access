/*
  # Fix profiles table RLS policies for proper authentication flow
  
  1. Changes
    - Drop all existing RLS policies for profiles table
    - Add new comprehensive policies that properly handle:
      - Profile creation during signup
      - Profile reading for authenticated users
      - Profile updates for own profile
    
  2. Security
    - Maintains RLS protection while allowing necessary operations
    - Users can only access their own profiles
    - Authenticated users can create their profile during signup
*/

-- Drop all existing policies for profiles table
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable update access for users" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

-- Create new comprehensive policies
CREATE POLICY "Enable insert for authenticated users only"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable select for authenticated users only"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Enable update for users based on id"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;