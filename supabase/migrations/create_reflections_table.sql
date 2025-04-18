/*
  # Create reflections table

  1. New Tables
    - `reflections`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `date` (text, ISO date string)
      - `timestamp` (text, ISO timestamp)
      - `gratitude` (text)
      - `achievement` (text)
      - `improvement` (text)
      - `mood` (text)
      - `created_at` (timestamptz, default now())
  2. Security
    - Enable RLS on `reflections` table
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  date text NOT NULL,
  timestamp text NOT NULL,
  gratitude text NOT NULL,
  achievement text NOT NULL,
  improvement text NOT NULL,
  mood text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;

-- Policy for users to select their own reflections
CREATE POLICY "Users can view their own reflections"
  ON reflections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for users to insert their own reflections
CREATE POLICY "Users can insert their own reflections"
  ON reflections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own reflections
CREATE POLICY "Users can update their own reflections"
  ON reflections
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for users to delete their own reflections
CREATE POLICY "Users can delete their own reflections"
  ON reflections
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
