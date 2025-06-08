/*
  # Create resources table for book recommendations

  1. New Table
    - `resources`
      - `id` (uuid, primary key)
      - `user_id` (text, references auth.users)
      - `resources_data` (jsonb, stores ResourcesData object)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  2. Security
    - Enable RLS on the table
    - Add policies for authenticated users to manage their own data
*/

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  resources_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Create policies for resources table
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

-- Create indexes for better performance
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