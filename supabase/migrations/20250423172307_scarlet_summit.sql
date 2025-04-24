/*
  # Add prediction accuracy tracking

  1. Changes
    - Add accuracy columns to predictions table
    - Add historical predictions table for tracking
    - Add functions to calculate prediction accuracy
*/

-- Add accuracy columns to predictions table
ALTER TABLE predictions
ADD COLUMN IF NOT EXISTS accuracy_score integer DEFAULT 0 CHECK (accuracy_score >= 0 AND accuracy_score <= 100),
ADD COLUMN IF NOT EXISTS confidence_level text DEFAULT 'medium' CHECK (confidence_level IN ('low', 'medium', 'high'));

-- Create historical predictions table
CREATE TABLE IF NOT EXISTS historical_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_symbol text REFERENCES stocks(symbol) ON DELETE CASCADE,
  predicted_price numeric NOT NULL,
  actual_price numeric,
  prediction_date timestamptz NOT NULL,
  target_date timestamptz NOT NULL,
  prediction_type text NOT NULL CHECK (prediction_type IN ('one_day', 'one_week', 'one_month')),
  accuracy_score integer CHECK (accuracy_score >= 0 AND accuracy_score <= 100),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on new table
ALTER TABLE historical_predictions ENABLE ROW LEVEL SECURITY;

-- Add policy for public read access
CREATE POLICY "Allow public read access to historical_predictions"
  ON historical_predictions FOR SELECT TO public USING (true);

-- Function to calculate prediction accuracy
CREATE OR REPLACE FUNCTION calculate_prediction_accuracy(
  predicted_price numeric,
  actual_price numeric
) RETURNS integer AS $$
DECLARE
  percentage_diff numeric;
  accuracy integer;
BEGIN
  -- Calculate percentage difference
  percentage_diff := ABS(actual_price - predicted_price) / actual_price * 100;
  
  -- Convert to accuracy score (0-100)
  -- Less than 1% diff = 90-100
  -- 1-3% diff = 70-89
  -- 3-5% diff = 50-69
  -- 5-10% diff = 30-49
  -- >10% diff = 0-29
  IF percentage_diff <= 1 THEN
    accuracy := 90 + (10 * (1 - percentage_diff));
  ELSIF percentage_diff <= 3 THEN
    accuracy := 70 + (20 * (3 - percentage_diff) / 2);
  ELSIF percentage_diff <= 5 THEN
    accuracy := 50 + (20 * (5 - percentage_diff) / 2);
  ELSIF percentage_diff <= 10 THEN
    accuracy := 30 + (20 * (10 - percentage_diff) / 5);
  ELSE
    accuracy := GREATEST(0, 30 - ((percentage_diff - 10) * 2));
  END IF;

  RETURN GREATEST(0, LEAST(100, accuracy));
END;
$$ LANGUAGE plpgsql;