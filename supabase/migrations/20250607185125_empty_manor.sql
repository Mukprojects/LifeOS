/*
  # Create user_profiles table and fix user_id data types

  1. New Tables
    - `user_profiles`
      - `user_id` (uuid, primary key, references auth.users)
      - `profile_data` (jsonb)
      - `updated_at` (timestamp)

  2. Schema Updates
    - Update existing tables to use uuid for user_id instead of text
    - Ensure proper foreign key relationships with auth.users

  3. Security
    - Enable RLS on user_profiles table
    - Add policies for authenticated users to manage their own data
    - Update policies on existing tables to work with uuid user_id
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id uuid REFERENCES auth.users(id) PRIMARY KEY,
  profile_data jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view their own profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profiles"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profiles"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profiles"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Update existing tables to use uuid for user_id and add proper foreign keys
-- First, we need to handle the data type conversion carefully

-- For goals table: Convert text user_id to uuid
DO $$
BEGIN
  -- Check if user_id is still text type
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'goals' 
    AND column_name = 'user_id' 
    AND data_type = 'text'
  ) THEN
    -- Drop existing policies that reference the old text user_id
    DROP POLICY IF EXISTS "Users can delete own goals" ON goals;
    DROP POLICY IF EXISTS "Users can insert own goals" ON goals;
    DROP POLICY IF EXISTS "Users can read own goals" ON goals;
    DROP POLICY IF EXISTS "Users can update own goals" ON goals;
    
    -- Convert user_id from text to uuid
    ALTER TABLE goals ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
    
    -- Add foreign key constraint
    ALTER TABLE goals ADD CONSTRAINT goals_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES auth.users(id);
    
    -- Recreate policies with proper uuid comparison
    CREATE POLICY "Users can view their own goals"
      ON goals
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert their own goals"
      ON goals
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update their own goals"
      ON goals
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can delete their own goals"
      ON goals
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- For life_summaries table: Convert text user_id to uuid
DO $$
BEGIN
  -- Check if user_id is still text type
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'life_summaries' 
    AND column_name = 'user_id' 
    AND data_type = 'text'
  ) THEN
    -- Drop existing policies that reference the old text user_id
    DROP POLICY IF EXISTS "Users can delete own life summaries" ON life_summaries;
    DROP POLICY IF EXISTS "Users can insert own life summaries" ON life_summaries;
    DROP POLICY IF EXISTS "Users can read own life summaries" ON life_summaries;
    DROP POLICY IF EXISTS "Users can update own life summaries" ON life_summaries;
    
    -- Convert user_id from text to uuid
    ALTER TABLE life_summaries ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
    
    -- Add foreign key constraint
    ALTER TABLE life_summaries ADD CONSTRAINT life_summaries_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES auth.users(id);
    
    -- Recreate policies with proper uuid comparison
    CREATE POLICY "Users can view their own summaries"
      ON life_summaries
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert their own summaries"
      ON life_summaries
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update their own summaries"
      ON life_summaries
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can delete their own summaries"
      ON life_summaries
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS user_profiles_updated_at_idx ON user_profiles (updated_at);