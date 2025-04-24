import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getStockBySymbol } from '../lib/stocks';
import type { Stock } from '../types';

const PredictionTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;

    setLoading(true);
    setError(null);

    try {
      const stock = await getStockBySymbol(searchQuery.toUpperCase());
      if (stock) {
        setSelectedStock(stock);
        startPolling(searchQuery.toUpperCase());
      } else {
        setError('Stock not found');
      }
    } catch (err) {
      setError('Failed to fetch stock data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const startPolling = (symbol: string) => {
    const interval = setInterval(async () => {
      try {
        const updatedStock = await getStockBySymbol(symbol);
        if (updatedStock) {
          setSelectedStock(updatedStock);
        }
      } catch (err) {
        console.error('Error polling stock data:', err);
      }
    }, 60000);

    return () => clearInterval(interval);
  };

  useEffect(() => {
    return () => {
      // Cleanup function will be called when component unmounts
    };
  }, []);

  const getConfidenceIcon = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'medium':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'low':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
  };

  const getAccuracyColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  if (!selectedStock && !loading && !error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter stock symbol (e.g., AAPL)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Search
          </button>
        </form>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="text-red-500 mb-4">{error}</div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter stock symbol (e.g., AAPL)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Search
          </button>
        </form>
      </div>
    );
  }

  if (!selectedStock) return null;

  const predictionData = [
    { 
      name: 'Current', 
      price: selectedStock.price,
      predictedPrice: selectedStock.price 
    },
    { 
      name: '1 Day', 
      price: selectedStock.price,
      predictedPrice: selectedStock.prediction?.oneDay || selectedStock.price
    },
    { 
      name: '1 Week', 
      price: selectedStock.price,
      predictedPrice: selectedStock.prediction?.oneWeek || selectedStock.price
    },
    { 
      name: '1 Month', 
      price: selectedStock.price,
      predictedPrice: selectedStock.prediction?.oneMonth || selectedStock.price
    },
  ];

  const priceChange = selectedStock.change;
  const percentageChange = selectedStock.percentChange;
  const isPositive = priceChange >= 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter stock symbol (e.g., AAPL)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Search
          </button>
        </form>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedStock.symbol}</h2>
            <p className="text-gray-600 dark:text-gray-400">{selectedStock.name}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${selectedStock.price.toFixed(2)}</p>
            <p className={`flex items-center ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
              <ArrowRight className={`h-4 w-4 ${isPositive ? 'rotate-45' : '-rotate-45'}`} />
              <span>{isPositive ? '+' : ''}{priceChange.toFixed(2)} ({isPositive ? '+' : ''}{percentageChange.toFixed(2)}%)</span>
            </p>
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={predictionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#F3F4F6'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                name="Current Price"
                dataKey="price"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                name="Predicted Price"
                dataKey="predictedPrice"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">1 Day Prediction</p>
            {selectedStock.prediction?.confidence?.oneDay && (
              <div className="flex items-center gap-1">
                {getConfidenceIcon(selectedStock.prediction.confidence.oneDay)}
                <span className="text-xs capitalize">{selectedStock.prediction.confidence.oneDay}</span>
              </div>
            )}
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            ${selectedStock.prediction?.oneDay?.toFixed(2) || selectedStock.price.toFixed(2)}
          </p>
          {selectedStock.prediction?.accuracy?.oneDay !== undefined && (
            <p className={`text-sm ${getAccuracyColor(selectedStock.prediction.accuracy.oneDay)}`}>
              Accuracy: {selectedStock.prediction.accuracy.oneDay}%
            </p>
          )}
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">1 Week Prediction</p>
            {selectedStock.prediction?.confidence?.oneWeek && (
              <div className="flex items-center gap-1">
                {getConfidenceIcon(selectedStock.prediction.confidence.oneWeek)}
                <span className="text-xs capitalize">{selectedStock.prediction.confidence.oneWeek}</span>
              </div>
            )}
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            ${selectedStock.prediction?.oneWeek?.toFixed(2) || selectedStock.price.toFixed(2)}
          </p>
          {selectedStock.prediction?.accuracy?.oneWeek !== undefined && (
            <p className={`text-sm ${getAccuracyColor(selectedStock.prediction.accuracy.oneWeek)}`}>
              Accuracy: {selectedStock.prediction.accuracy.oneWeek}%
            </p>
          )}
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">1 Month Prediction</p>
            {selectedStock.prediction?.confidence?.oneMonth && (
              <div className="flex items-center gap-1">
                {getConfidenceIcon(selectedStock.prediction.confidence.oneMonth)}
                <span className="text-xs capitalize">{selectedStock.prediction.confidence.oneMonth}</span>
              </div>
            )}
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            ${selectedStock.prediction?.oneMonth?.toFixed(2) || selectedStock.price.toFixed(2)}
          </p>
          {selectedStock.prediction?.accuracy?.oneMonth !== undefined && (
            <p className={`text-sm ${getAccuracyColor(selectedStock.prediction.accuracy.oneMonth)}`}>
              Accuracy: {selectedStock.prediction.accuracy.oneMonth}%
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictionTab;