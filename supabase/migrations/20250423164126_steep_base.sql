/*
  # Add initial stock data

  1. Data Population
    - Insert initial records for NVDA, AAPL, and TSLA
    - Set initial values that will be updated by the Edge Function
*/

INSERT INTO stocks (symbol, name, price, change, percent_change, volume, market_cap, ai_score)
VALUES 
  ('NVDA', 'NVIDIA Corporation', 0, 0, 0, 0, 0, 94),
  ('AAPL', 'Apple Inc.', 0, 0, 0, 0, 0, 86),
  ('TSLA', 'Tesla, Inc.', 0, 0, 0, 0, 0, 73)
ON CONFLICT (symbol) 
DO NOTHING;

-- Insert initial predictions
INSERT INTO predictions (stock_symbol, one_day, one_week, one_month)
VALUES 
  ('NVDA', 0, 0, 0),
  ('AAPL', 0, 0, 0),
  ('TSLA', 0, 0, 0)
ON CONFLICT DO NOTHING;