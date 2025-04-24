/*
  # Create stocks and predictions tables

  1. New Tables
    - `stocks`
      - `symbol` (text, primary key)
      - `name` (text)
      - `price` (numeric)
      - `change` (numeric)
      - `percent_change` (numeric)
      - `volume` (bigint)
      - `market_cap` (bigint)
      - `ai_score` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `predictions`
      - `id` (uuid, primary key)
      - `stock_symbol` (text, foreign key)
      - `one_day` (numeric)
      - `one_week` (numeric)
      - `one_month` (numeric)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read data
*/

CREATE TABLE stocks (
  symbol text PRIMARY KEY,
  name text NOT NULL,
  price numeric NOT NULL,
  change numeric NOT NULL,
  percent_change numeric NOT NULL,
  volume bigint NOT NULL,
  market_cap bigint NOT NULL,
  ai_score integer NOT NULL CHECK (ai_score >= 0 AND ai_score <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_symbol text REFERENCES stocks(symbol) ON DELETE CASCADE,
  one_day numeric NOT NULL,
  one_week numeric NOT NULL,
  one_month numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE stocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to stocks"
  ON stocks
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to predictions"
  ON predictions
  FOR SELECT
  TO public
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update the updated_at column
CREATE TRIGGER update_stocks_updated_at
  BEFORE UPDATE ON stocks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();