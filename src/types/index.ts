export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percentChange: number;
  volume: number;
  marketCap: number;
  aiScore: number;
  prediction?: StockPrediction;
}

export interface StockPrediction {
  oneDay: number;
  oneWeek: number;
  oneMonth: number;
  accuracy?: {
    oneDay: number;
    oneWeek: number;
    oneMonth: number;
  };
  confidence?: {
    oneDay: 'low' | 'medium' | 'high';
    oneWeek: 'low' | 'medium' | 'high';
    oneMonth: 'low' | 'medium' | 'high';
  };
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  image: string;
  publishDate: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  aiSummary: string;
}

export interface MarketInsight {
  id: string;
  title: string;
  description: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  date: string;
}

export interface IndexConstituent {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percentChange: number;
  aiScore: number;
  weight: number;
  sector: string;
}