/*
  # Initial schema setup for Public Welfare Scheme Assistant
  
  1. New Tables
     - `profiles`
       - User profiles with personal information, socio-economic details, and location
     - `schemes`
       - Welfare schemes with details, eligibility criteria, and benefits
     - `applications`
       - User applications for schemes with status tracking
     - `grievances`
       - User grievances with issue tracking and resolution
  
  2. Security
     - Enable RLS on all tables
     - Add policies for authenticated users to manage their own data
     - Add admin policies for government officials
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  name text,
  age int,
  gender text,
  caste_category text,
  religion text,
  annual_income int,
  state text,
  district text,
  city_village text,
  aadhaar_verified boolean DEFAULT false,
  avatar_url text
);

-- Create schemes table
CREATE TABLE IF NOT EXISTS schemes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  title text NOT NULL,
  description text NOT NULL,
  eligibility_criteria text NOT NULL,
  benefits text NOT NULL,
  required_documents text[] NOT NULL,
  ministry text NOT NULL,
  category text NOT NULL,
  region_specific boolean DEFAULT false,
  regions text[],
  income_limit int,
  age_min int,
  age_max int,
  gender_specific text,
  caste_categories text[],
  expiry_date timestamptz,
  application_link text,
  official_website text
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  scheme_id uuid NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'Pending',
  rejection_reason text,
  document_ids text[] NOT NULL DEFAULT '{}',
  submitted_data jsonb NOT NULL DEFAULT '{}'::jsonb
);

-- Create grievances table
CREATE TABLE IF NOT EXISTS grievances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  application_id uuid REFERENCES applications(id) ON DELETE SET NULL,
  scheme_id uuid REFERENCES schemes(id) ON DELETE SET NULL,
  issue_type text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  response text,
  document_ids text[]
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE grievances ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Schemes policies (public read access)
CREATE POLICY "Anyone can view schemes"
  ON schemes FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin users can manage schemes"
  ON schemes FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'GOVERNMENT_OFFICIAL_ADMIN');

-- Applications policies
CREATE POLICY "Users can view their own applications"
  ON applications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin users can manage all applications"
  ON applications FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'GOVERNMENT_OFFICIAL_ADMIN');

-- Grievances policies
CREATE POLICY "Users can view their own grievances"
  ON grievances FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create grievances"
  ON grievances FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin users can manage all grievances"
  ON grievances FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'GOVERNMENT_OFFICIAL_ADMIN');

-- Create sample data for testing
INSERT INTO schemes (title, description, eligibility_criteria, benefits, required_documents, ministry, category)
VALUES 
  ('PM Kisan Samman Nidhi', 'Income support to farmer families to meet their agricultural and farming needs', 'Small and marginal farmers with landholding up to 2 hectares', '₹6,000 per year in three equal installments', ARRAY['Aadhaar Card', 'Land Records', 'Bank Account Details'], 'Agriculture & Farmers Welfare', 'Agriculture'),
  ('Ayushman Bharat', 'Health insurance coverage of ₹5 lakh per family per year for secondary and tertiary hospitalization', 'Economically disadvantaged families as per SECC database', 'Health coverage up to ₹5 lakh per family per year', ARRAY['Aadhaar Card', 'Ration Card', 'Income Certificate'], 'Health & Family Welfare', 'Healthcare'),
  ('PM Awas Yojana', 'Housing for All by 2022 mission to provide housing for the urban and rural poor', 'Households with annual income below ₹3 lakh', 'Financial assistance for house construction', ARRAY['Aadhaar Card', 'Income Certificate', 'Land Documents'], 'Housing & Urban Affairs', 'Housing');