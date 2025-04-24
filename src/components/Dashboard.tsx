import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, LineChart, BarChart2 } from 'lucide-react';
import { getStocks } from '../lib/stocks';
import { getNews, getMarketInsights } from '../lib/news';
import type { Stock, NewsItem, MarketInsight } from '../types';
import NewsCard from './NewsCard';
import MarketInsightCard from './MarketInsightCard';
import PredictionTab from './PredictionTab';
import AdvancedInsightsTab from './AdvancedInsightsTab';
import RecommendationsTab from './RecommendationsTab';

const Dashboard = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [insights, setInsights] = useState<MarketInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'predictions' | 'advanced' | 'recommendations'>('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stocksData, newsData, insightsData] = await Promise.all([
          getStocks(),
          getNews(),
          getMarketInsights()
        ]);
        
        setStocks(stocksData);
        setNews(newsData);
        setInsights(insightsData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh data every minute
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Market Overview</h2>
            <p className="text-gray-600 dark:text-gray-400">Real-time market data with AI insights</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('predictions')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'predictions'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              AI Predictions
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'recommendations'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              AI Recommendations
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'advanced'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              Advanced Insights
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stocks.map((stock) => (
              <div key={stock.symbol} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                      <BarChart2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{stock.symbol}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{stock.name}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${stock.price.toFixed(2)}
                    </span>
                    <div className={`flex items-center ${stock.change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                      {stock.change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                      <span className="text-sm font-medium">
                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.change >= 0 ? '+' : ''}{stock.percentChange.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Volume</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Intl.NumberFormat().format(stock.volume)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">AI Score</span>
                    <span className={`font-medium ${
                      stock.aiScore >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
                      stock.aiScore >= 50 ? 'text-amber-600 dark:text-amber-400' :
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {stock.aiScore}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Latest News</h3>
              <div className="grid gap-6">
                {news.map((item) => (
                  <NewsCard key={item.id} news={item} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Market Insights</h3>
              <div className="space-y-4">
                {insights.map((insight) => (
                  <MarketInsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            </div>
          </div>
        </>
      ) : activeTab === 'predictions' ? (
        <PredictionTab />
      ) : activeTab === 'recommendations' ? (
        <RecommendationsTab stocks={stocks} />
      ) : (
        <AdvancedInsightsTab />
      )}
    </div>
  );
};

export default Dashboard;