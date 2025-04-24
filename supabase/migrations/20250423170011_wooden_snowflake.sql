/*
  # Add news and market insights tables

  1. New Tables
    - `news`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `source` (text)
      - `url` (text)
      - `image_url` (text)
      - `publish_date` (timestamptz)
      - `sentiment` (text)
      - `ai_summary` (text)
      - `created_at` (timestamptz)

    - `market_insights`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `sentiment` (text)
      - `impact` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
*/

-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  source text NOT NULL,
  url text NOT NULL,
  image_url text NOT NULL,
  publish_date timestamptz NOT NULL,
  sentiment text NOT NULL CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  ai_summary text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create market insights table
CREATE TABLE IF NOT EXISTS market_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  sentiment text NOT NULL CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  impact text NOT NULL CHECK (impact IN ('high', 'medium', 'low')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_insights ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to news"
  ON news FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access to market_insights"
  ON market_insights FOR SELECT TO public USING (true);

-- Insert sample news data
INSERT INTO news (title, content, source, url, image_url, publish_date, sentiment, ai_summary)
VALUES 
  (
    'NVIDIA Announces Revolutionary AI Chip',
    'NVIDIA unveiled its next-generation AI chip, promising 4x performance improvement.',
    'TechNews',
    'https://example.com/nvidia-news',
    'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg',
    now(),
    'positive',
    'The new chip could significantly boost NVIDIA''s market share in the AI sector and drive revenue growth.'
  ),
  (
    'Apple''s Mixed Reality Headset Launch Date Confirmed',
    'Apple announces June release date for its highly anticipated mixed reality headset.',
    'TechCrunch',
    'https://example.com/apple-news',
    'https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg',
    now(),
    'positive',
    'This launch represents Apple''s biggest new product category since the Apple Watch.'
  );

-- Insert sample market insights
INSERT INTO market_insights (title, description, sentiment, impact)
VALUES 
  (
    'AI Sector Growth Accelerating',
    'Enterprise AI adoption rates have doubled in Q1 2025, indicating strong growth potential for tech companies with AI capabilities.',
    'positive',
    'high'
  ),
  (
    'Semiconductor Supply Chain Stabilizing',
    'Global semiconductor production capacity has increased by 15%, reducing supply chain constraints.',
    'positive',
    'medium'
  );