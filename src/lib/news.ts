import { supabase } from './supabase';
import type { NewsItem, MarketInsight } from '../types';

export async function getNews(): Promise<NewsItem[]> {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('publish_date', { ascending: false });

    if (error) throw error;

    return (data || []).map(item => ({
      id: item.id,
      title: item.title,
      source: item.source,
      url: item.url,
      image: item.image_url,
      publishDate: item.publish_date,
      sentiment: item.sentiment,
      aiSummary: item.ai_summary
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

export async function getMarketInsights(): Promise<MarketInsight[]> {
  try {
    const { data, error } = await supabase
      .from('market_insights')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      sentiment: item.sentiment,
      impact: item.impact,
      date: item.created_at
    }));
  } catch (error) {
    console.error('Error fetching market insights:', error);
    return [];
  }
}