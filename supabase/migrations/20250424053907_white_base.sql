/*
  # Add more NASDAQ 100 constituents

  1. New Stocks
    - Add more technology companies (AMAT, ASML, KLAC, LRCX, etc.)
    - Add semiconductor companies (ADI, MCHP, MRVL)
    - Add biotech companies (VRTX, ISRG, DXCM)
    - Add consumer companies (ABNB, BKNG, PDD)
    - Add fintech companies (COIN, PYPL)

  2. Changes
    - Add new stocks to the stocks table
    - Update index_constituents with new weights
*/

-- Add new stocks
INSERT INTO stocks (symbol, name, price, change, percent_change, volume, market_cap, ai_score)
VALUES
  -- Technology & Semiconductors
  ('AMAT', 'Applied Materials, Inc.', 0, 0, 0, 0, 0, 85),
  ('ASML', 'ASML Holding N.V.', 0, 0, 0, 0, 0, 89),
  ('KLAC', 'KLA Corporation', 0, 0, 0, 0, 0, 83),
  ('LRCX', 'Lam Research Corporation', 0, 0, 0, 0, 0, 86),
  ('ADI', 'Analog Devices, Inc.', 0, 0, 0, 0, 0, 82),
  ('MCHP', 'Microchip Technology Inc.', 0, 0, 0, 0, 0, 78),
  ('MRVL', 'Marvell Technology, Inc.', 0, 0, 0, 0, 0, 84),
  ('SNPS', 'Synopsys, Inc.', 0, 0, 0, 0, 0, 87),
  ('CDNS', 'Cadence Design Systems, Inc.', 0, 0, 0, 0, 0, 86),
  
  -- Healthcare & Biotech
  ('VRTX', 'Vertex Pharmaceuticals Inc.', 0, 0, 0, 0, 0, 85),
  ('ISRG', 'Intuitive Surgical, Inc.', 0, 0, 0, 0, 0, 88),
  ('DXCM', 'DexCom, Inc.', 0, 0, 0, 0, 0, 82),
  ('ILMN', 'Illumina, Inc.', 0, 0, 0, 0, 0, 81),
  
  -- Consumer & Travel
  ('ABNB', 'Airbnb, Inc.', 0, 0, 0, 0, 0, 79),
  ('BKNG', 'Booking Holdings Inc.', 0, 0, 0, 0, 0, 84),
  ('PDD', 'PDD Holdings Inc.', 0, 0, 0, 0, 0, 83),
  ('PANW', 'Palo Alto Networks, Inc.', 0, 0, 0, 0, 0, 89),
  
  -- Fintech
  ('COIN', 'Coinbase Global, Inc.', 0, 0, 0, 0, 0, 76),
  ('FTNT', 'Fortinet, Inc.', 0, 0, 0, 0, 0, 85),
  ('CRWD', 'CrowdStrike Holdings, Inc.', 0, 0, 0, 0, 0, 88)
ON CONFLICT (symbol) DO NOTHING;

-- Add new constituents to NASDAQ100
INSERT INTO index_constituents (index_id, stock_symbol, weight, sector)
VALUES
  -- Technology & Semiconductors
  ('NASDAQ100', 'AMAT', 1.6, 'Technology'),
  ('NASDAQ100', 'ASML', 1.5, 'Technology'),
  ('NASDAQ100', 'KLAC', 1.4, 'Technology'),
  ('NASDAQ100', 'LRCX', 1.3, 'Technology'),
  ('NASDAQ100', 'ADI', 1.2, 'Technology'),
  ('NASDAQ100', 'MCHP', 1.1, 'Technology'),
  ('NASDAQ100', 'MRVL', 1.0, 'Technology'),
  ('NASDAQ100', 'SNPS', 0.9, 'Technology'),
  ('NASDAQ100', 'CDNS', 0.8, 'Technology'),
  
  -- Healthcare & Biotech
  ('NASDAQ100', 'VRTX', 1.1, 'Healthcare'),
  ('NASDAQ100', 'ISRG', 1.0, 'Healthcare'),
  ('NASDAQ100', 'DXCM', 0.9, 'Healthcare'),
  ('NASDAQ100', 'ILMN', 0.8, 'Healthcare'),
  
  -- Consumer & Travel
  ('NASDAQ100', 'ABNB', 0.9, 'Consumer Discretionary'),
  ('NASDAQ100', 'BKNG', 1.2, 'Consumer Discretionary'),
  ('NASDAQ100', 'PDD', 1.1, 'Consumer Discretionary'),
  ('NASDAQ100', 'PANW', 1.3, 'Technology'),
  
  -- Fintech & Security
  ('NASDAQ100', 'COIN', 0.7, 'Financial Services'),
  ('NASDAQ100', 'FTNT', 0.8, 'Technology'),
  ('NASDAQ100', 'CRWD', 0.9, 'Technology')
ON CONFLICT DO NOTHING;