/*
  # Create resources table for storing user resources data

  1. New Tables
    - `resources`
      - `id` (uuid, primary key)
      - `user_id` (text, references auth users)
      - `resources_data` (jsonb, contains book recommendations and other resources)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `resources` table
    - Add policies for authenticated users to manage their own resources

  3. Performance
    - Add indexes on user_id and updated_at columns
*/

-- Create resources table only if it doesn't exist
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  resources_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security only if not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'resources' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing policies if they exist, then recreate them
DO $$
BEGIN
  -- Drop policies if they exist
  DROP POLICY IF EXISTS "Users can read own resources" ON resources;
  DROP POLICY IF EXISTS "Users can insert own resources" ON resources;
  DROP POLICY IF EXISTS "Users can update own resources" ON resources;
  DROP POLICY IF EXISTS "Users can delete own resources" ON resources;
  
  -- Create new policies
  CREATE POLICY "Users can read own resources"
    ON resources
    FOR SELECT
    TO authenticated
    USING (auth.uid()::text = user_id);

  CREATE POLICY "Users can insert own resources"
    ON resources
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid()::text = user_id);

  CREATE POLICY "Users can update own resources"
    ON resources
    FOR UPDATE
    TO authenticated
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

  CREATE POLICY "Users can delete own resources"
    ON resources
    FOR DELETE
    TO authenticated
    USING (auth.uid()::text = user_id);
END $$;

-- Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS resources_user_id_idx ON resources(user_id);
CREATE INDEX IF NOT EXISTS resources_updated_at_idx ON resources(updated_at);

-- Add comment to document the structure
COMMENT ON COLUMN resources.resources_data IS 
'JSONB object containing the resources data with the following structure:
{
  "books": [
    {
      "id": "string",
      "title": "string",
      "author": "string",
      "description": "string",
      "coverUrl": "string",
      "amazonUrl": "string",
      "category": "string",
      "relevantGoals": ["string"],
      "tags": ["string"],
      "rating": number
    }
  ],
  "personalizedNote": "string",
  "lastUpdated": "string"
}';