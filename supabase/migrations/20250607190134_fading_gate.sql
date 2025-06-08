/*
  # Fix RLS policies for user profiles

  1. Security Updates
    - Update RLS policies to work correctly with authentication
    - Ensure policies allow authenticated users to manage their own data
    - Fix policy conditions to properly match user IDs

  2. Changes
    - Drop existing policies that may have incorrect conditions
    - Create new policies with proper user ID matching
    - Ensure INSERT, SELECT, UPDATE, and DELETE operations work correctly
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert their own profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can view their own profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete their own profiles" ON user_profiles;

-- Create new policies with proper conditions
CREATE POLICY "Users can insert their own profiles"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own profiles"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own profiles"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Also fix policies for goals table
DROP POLICY IF EXISTS "Users can insert their own goals" ON goals;
DROP POLICY IF EXISTS "Users can view their own goals" ON goals;
DROP POLICY IF EXISTS "Users can update their own goals" ON goals;
DROP POLICY IF EXISTS "Users can delete their own goals" ON goals;

CREATE POLICY "Users can insert their own goals"
  ON goals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own goals"
  ON goals
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own goals"
  ON goals
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own goals"
  ON goals
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Also fix policies for life_summaries table
DROP POLICY IF EXISTS "Users can insert their own summaries" ON life_summaries;
DROP POLICY IF EXISTS "Users can view their own summaries" ON life_summaries;
DROP POLICY IF EXISTS "Users can update their own summaries" ON life_summaries;
DROP POLICY IF EXISTS "Users can delete their own summaries" ON life_summaries;

CREATE POLICY "Users can insert their own summaries"
  ON life_summaries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own summaries"
  ON life_summaries
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own summaries"
  ON life_summaries
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own summaries"
  ON life_summaries
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id);