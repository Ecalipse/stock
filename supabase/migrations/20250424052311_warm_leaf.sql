/*
  # Create index constituents table

  1. New Tables
    - `index_constituents`
      - `id` (uuid, primary key)
      - `index_id` (text, not null) - e.g., 'NASDAQ100', 'SP500'
      - `stock_symbol` (text, foreign key to stocks.symbol)
      - `weight` (numeric, not null) - weight in the index
      - `sector` (text) - sector classification
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `index_constituents` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS index_constituents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  index_id text NOT NULL,
  stock_symbol text NOT NULL REFERENCES stocks(symbol) ON DELETE CASCADE,
  weight numeric NOT NULL CHECK (weight >= 0 AND weight <= 100),
  sector text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE index_constituents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to index_constituents"
  ON index_constituents
  FOR SELECT
  TO public
  USING (true);