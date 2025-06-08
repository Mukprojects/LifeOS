/*
  # Change user_id columns from uuid to text for Firebase compatibility

  1. Changes
    - Change user_id column type from uuid to text in goals table
    - Change user_id column type from uuid to text in life_summaries table  
    - Change user_id column type from uuid to text in user_profiles table
    - Update foreign key constraints to reference text type
    - Recreate indexes with new data type

  2. Security
    - Maintain existing RLS policies
    - Update policy conditions to work with text user_id

  This migration allows the application to use Firebase UIDs (which are strings) 
  instead of requiring UUID format for user identification.
*/

-- Drop existing foreign key constraints
ALTER TABLE goals DROP CONSTRAINT IF EXISTS goals_user_id_fkey;
ALTER TABLE life_summaries DROP CONSTRAINT IF EXISTS life_summaries_user_id_fkey;
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_user_id_fkey;

-- Drop existing indexes on user_id columns
DROP INDEX IF EXISTS goals_user_id_idx;
DROP INDEX IF EXISTS life_summaries_user_id_idx;

-- Change user_id column types from uuid to text
ALTER TABLE goals ALTER COLUMN user_id TYPE text;
ALTER TABLE life_summaries ALTER COLUMN user_id TYPE text;
ALTER TABLE user_profiles ALTER COLUMN user_id TYPE text;

-- Recreate indexes with new data type
CREATE INDEX goals_user_id_idx ON goals USING btree (user_id);
CREATE INDEX life_summaries_user_id_idx ON life_summaries USING btree (user_id);

-- Update RLS policies to use auth.uid()::text for comparison
-- Goals table policies
DROP POLICY IF EXISTS "Users can view their own goals" ON goals;
DROP POLICY IF EXISTS "Users can insert their own goals" ON goals;
DROP POLICY IF EXISTS "Users can update their own goals" ON goals;
DROP POLICY IF EXISTS "Users can delete their own goals" ON goals;

CREATE POLICY "Users can view their own goals"
  ON goals
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own goals"
  ON goals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

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

-- Life summaries table policies
DROP POLICY IF EXISTS "Users can view their own summaries" ON life_summaries;
DROP POLICY IF EXISTS "Users can insert their own summaries" ON life_summaries;
DROP POLICY IF EXISTS "Users can update their own summaries" ON life_summaries;
DROP POLICY IF EXISTS "Users can delete their own summaries" ON life_summaries;

CREATE POLICY "Users can view their own summaries"
  ON life_summaries
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own summaries"
  ON life_summaries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

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

-- User profiles table policies
DROP POLICY IF EXISTS "Users can view their own profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete their own profiles" ON user_profiles;

CREATE POLICY "Users can view their own profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own profiles"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

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