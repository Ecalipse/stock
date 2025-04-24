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
    - Add policies for public read access
*/

-- Create stocks table if it doesn't exist
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS stocks (
    symbol text PRIMARY KEY,
    name text NOT NULL,
    price numeric NOT NULL DEFAULT 0,
    change numeric NOT NULL DEFAULT 0,
    percent_change numeric NOT NULL DEFAULT 0,
    volume bigint NOT NULL DEFAULT 0,
    market_cap bigint NOT NULL DEFAULT 0,
    ai_score integer NOT NULL CHECK (ai_score >= 0 AND ai_score <= 100),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Create predictions table if it doesn't exist
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS predictions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    stock_symbol text REFERENCES stocks(symbol) ON DELETE CASCADE,
    one_day numeric NOT NULL DEFAULT 0,
    one_week numeric NOT NULL DEFAULT 0,
    one_month numeric NOT NULL DEFAULT 0,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Enable RLS if not already enabled
DO $$ BEGIN
  ALTER TABLE stocks ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create policies if they don't exist
DO $$ BEGIN
  CREATE POLICY "Allow public read access to stocks"
    ON stocks FOR SELECT TO public USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public read access to predictions"
    ON predictions FOR SELECT TO public USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Insert initial stock data
INSERT INTO stocks (symbol, name, price, change, percent_change, volume, market_cap, ai_score)
VALUES 
  ('AAPL', 'Apple Inc.', 0, 0, 0, 0, 0, 86),
  ('MSFT', 'Microsoft Corporation', 0, 0, 0, 0, 0, 92),
  ('GOOGL', 'Alphabet Inc.', 0, 0, 0, 0, 0, 88),
  ('AMZN', 'Amazon.com Inc.', 0, 0, 0, 0, 0, 85),
  ('NVDA', 'NVIDIA Corporation', 0, 0, 0, 0, 0, 94),
  ('META', 'Meta Platforms Inc.', 0, 0, 0, 0, 0, 83),
  ('TSLA', 'Tesla, Inc.', 0, 0, 0, 0, 0, 78),
  ('AMD', 'Advanced Micro Devices, Inc.', 0, 0, 0, 0, 0, 82)
ON CONFLICT (symbol) DO NOTHING;

-- Insert initial predictions
INSERT INTO predictions (stock_symbol, one_day, one_week, one_month)
SELECT symbol, 0, 0, 0
FROM stocks
ON CONFLICT DO NOTHING;