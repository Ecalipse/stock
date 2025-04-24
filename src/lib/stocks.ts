import { supabase } from './supabase';
import type { Stock } from '../types';

export async function getStocks(): Promise<Stock[]> {
  try {
    const { data: stocksData, error: stocksError } = await supabase
      .from('stocks')
      .select('*')
      .gt('price', 0) // Only get stocks with prices greater than 0
      .order('ai_score', { ascending: false }) // Order by AI score to show best stocks first
      .limit(8); // Limit to 8 stocks to avoid overwhelming the overview

    if (stocksError) throw stocksError;

    // Fetch predictions for all stocks
    const { data: predictionsData, error: predictionsError } = await supabase
      .from('predictions')
      .select('*')
      .in('stock_symbol', (stocksData || []).map(s => s.symbol));

    if (predictionsError) {
      console.error('Error fetching predictions:', predictionsError);
    }

    // Create a map of predictions by stock symbol
    const predictionsBySymbol = (predictionsData || []).reduce((acc, pred) => {
      acc[pred.stock_symbol] = {
        oneDay: pred.one_day,
        oneWeek: pred.one_week,
        oneMonth: pred.one_month,
        accuracy: {
          oneDay: pred.accuracy_score,
          oneWeek: pred.accuracy_score,
          oneMonth: pred.accuracy_score
        },
        confidence: {
          oneDay: pred.confidence_level as 'low' | 'medium' | 'high',
          oneWeek: pred.confidence_level as 'low' | 'medium' | 'high',
          oneMonth: pred.confidence_level as 'low' | 'medium' | 'high'
        }
      };
      return acc;
    }, {} as Record<string, any>);

    return (stocksData || []).map((stock) => ({
      symbol: stock.symbol,
      name: stock.name,
      price: stock.price || 0,
      change: stock.change || 0,
      percentChange: stock.percent_change || 0,
      volume: stock.volume || 0,
      marketCap: stock.market_cap || 0,
      aiScore: stock.ai_score,
      prediction: predictionsBySymbol[stock.symbol] || null
    }));

  } catch (error) {
    console.error('Error fetching stocks:', error);
    return [];
  }
}

export async function getStockBySymbol(symbol: string): Promise<Stock | null> {
  try {
    // Fetch both stock and prediction data
    const { data: stockData, error: stockError } = await supabase
      .from('stocks')
      .select('*')
      .eq('symbol', symbol)
      .single();

    if (stockError) {
      console.error('Error fetching stock by symbol:', stockError);
      return null;
    }

    // Fetch the latest prediction for this stock - removed .single() to handle no results
    const { data: predictionData, error: predictionError } = await supabase
      .from('predictions')
      .select('*')
      .eq('stock_symbol', symbol)
      .order('created_at', { ascending: false })
      .limit(1);

    if (predictionError) {
      console.error('Error fetching prediction:', predictionError);
    }

    // Get the first prediction if it exists, otherwise null
    const latestPrediction = predictionData && predictionData.length > 0 ? predictionData[0] : null;

    return {
      symbol: stockData.symbol,
      name: stockData.name,
      price: stockData.price || 0,
      change: stockData.change || 0,
      percentChange: stockData.percent_change || 0,
      volume: stockData.volume || 0,
      marketCap: stockData.market_cap || 0,
      aiScore: stockData.ai_score,
      prediction: latestPrediction ? {
        oneDay: latestPrediction.one_day,
        oneWeek: latestPrediction.one_week,
        oneMonth: latestPrediction.one_month,
        accuracy: {
          oneDay: latestPrediction.accuracy_score,
          oneWeek: latestPrediction.accuracy_score,
          oneMonth: latestPrediction.accuracy_score
        },
        confidence: {
          oneDay: latestPrediction.confidence_level as 'low' | 'medium' | 'high',
          oneWeek: latestPrediction.confidence_level as 'low' | 'medium' | 'high',
          oneMonth: latestPrediction.confidence_level as 'low' | 'medium' | 'high'
        }
      } : null
    };
  } catch (error) {
    console.error('Error fetching stock:', error);
    return null;
  }
}