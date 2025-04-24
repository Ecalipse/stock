import { supabase } from './supabase';
import type { IndexConstituent } from '../types';

export async function getIndexConstituents(indexId: string): Promise<IndexConstituent[]> {
  try {
    const { data, error } = await supabase
      .from('index_constituents')
      .select(`
        stock_symbol,
        weight,
        sector,
        stocks (
          symbol,
          name,
          price,
          change,
          percent_change,
          ai_score
        )
      `)
      .eq('index_id', indexId)
      .order('weight', { ascending: false });

    if (error) throw error;

    const constituents = (data || []).map(item => ({
      symbol: item.stock_symbol,
      name: item.stocks?.name || '',
      price: item.stocks?.price || 0,
      change: item.stocks?.change || 0,
      percentChange: item.stocks?.percent_change || 0,
      aiScore: item.stocks?.ai_score || 0,
      weight: item.weight || 0,
      sector: item.sector || ''
    }));

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      return constituents;
    }

    // For each stock with price 0, trigger a fetch of real-time data
    const updatePromises = constituents.map(async (stock) => {
      if (stock.price === 0) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

          const response = await fetch(`${supabaseUrl}/functions/v1/stocks`, {
            method: 'POST',
            signal: controller.signal,
            headers: {
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ symbol: stock.symbol }),
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const stockData = await response.json();
          if (stockData.error) {
            throw new Error(stockData.error);
          }

          stock.price = stockData.price;
          stock.change = stockData.change;
          stock.percentChange = stockData.percentChange;
        } catch (error) {
          console.error(`Error fetching real-time data for ${stock.symbol}:`, error);
          // Keep existing values on error
        }
      }
      return stock;
    });

    // Wait for all updates to complete
    await Promise.allSettled(updatePromises);

    // Sort by weight, but prioritize stocks with prices
    return constituents.sort((a, b) => {
      if (a.price === 0 && b.price > 0) return 1;
      if (a.price > 0 && b.price === 0) return -1;
      return b.weight - a.weight;
    });
  } catch (error) {
    console.error('Error fetching index constituents:', error);
    return [];
  }
}