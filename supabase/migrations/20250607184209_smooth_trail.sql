/*
  # Create goals and life summaries tables

  1. New Tables
    - `goals`
      - `id` (uuid, primary key)
      - `user_id` (text, references auth.users)
      - `goal_data` (jsonb, stores Goal object)
      - `created_at` (timestamp)
    - `life_summaries`
      - `id` (uuid, primary key) 
      - `user_id` (text, references auth.users)
      - `summary_data` (jsonb, stores LifeSummary object)
      - `updated_at` (timestamp)
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  goal_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create life_summaries table  
CREATE TABLE IF NOT EXISTS life_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  summary_data jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_summaries ENABLE ROW LEVEL SECURITY;

-- Create policies for goals table
CREATE POLICY "Users can read own goals"
  ON goals
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own goals"
  ON goals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own goals"
  ON goals
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own goals"
  ON goals
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Create policies for life_summaries table
CREATE POLICY "Users can read own life summaries"
  ON life_summaries
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own life summaries"
  ON life_summaries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own life summaries"
  ON life_summaries
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own life summaries"
  ON life_summaries
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS goals_user_id_idx ON goals(user_id);
CREATE INDEX IF NOT EXISTS goals_created_at_idx ON goals(created_at);
CREATE INDEX IF NOT EXISTS life_summaries_user_id_idx ON life_summaries(user_id);