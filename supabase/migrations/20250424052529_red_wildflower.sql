/*
  # Add initial index data

  1. Data Population
    - Insert initial records for NASDAQ100 and SP500 constituents
    - Link to existing stocks
*/

-- Insert NASDAQ100 constituents
INSERT INTO index_constituents (index_id, stock_symbol, weight, sector) VALUES
  ('NASDAQ100', 'AAPL', 12.5, 'Technology'),
  ('NASDAQ100', 'MSFT', 11.8, 'Technology'),
  ('NASDAQ100', 'GOOGL', 7.2, 'Technology'),
  ('NASDAQ100', 'AMZN', 6.9, 'Consumer Discretionary'),
  ('NASDAQ100', 'NVDA', 6.5, 'Technology'),
  ('NASDAQ100', 'META', 4.2, 'Technology'),
  ('NASDAQ100', 'TSLA', 3.8, 'Consumer Discretionary'),
  ('NASDAQ100', 'AMD', 2.1, 'Technology')
ON CONFLICT DO NOTHING;

-- Insert SP500 constituents
INSERT INTO index_constituents (index_id, stock_symbol, weight, sector) VALUES
  ('SP500', 'AAPL', 7.2, 'Technology'),
  ('SP500', 'MSFT', 6.9, 'Technology'),
  ('SP500', 'GOOGL', 4.1, 'Technology'),
  ('SP500', 'AMZN', 3.8, 'Consumer Discretionary'),
  ('SP500', 'NVDA', 3.5, 'Technology'),
  ('SP500', 'META', 2.4, 'Technology'),
  ('SP500', 'TSLA', 1.8, 'Consumer Discretionary'),
  ('SP500', 'AMD', 1.2, 'Technology')
ON CONFLICT DO NOTHING;