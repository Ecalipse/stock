import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';
import type { IndexConstituent } from '../types';
import { getIndexConstituents } from '../lib/market-indices';

const AdvancedInsightsTab: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stocks, setStocks] = useState<IndexConstituent[]>([]);

  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      try {
        const data = await getIndexConstituents('NASDAQ100');
        setStocks(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching stocks:', err);
        setError('Failed to fetch stocks data');
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => setLoading(true)} // Retry
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            NASDAQ 100 Components
          </h2>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b dark:border-gray-700">
              <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">Symbol</th>
              <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">Name</th>
              <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">Sector</th>
              <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">Weight</th>
              <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">Price</th>
              <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">Change</th>
              <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">AI Score</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock.symbol} className="border-b dark:border-gray-700">
                <td className="py-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-2">
                      <BarChart2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{stock.symbol}</span>
                  </div>
                </td>
                <td className="py-4 text-gray-600 dark:text-gray-400">{stock.name}</td>
                <td className="py-4 text-gray-600 dark:text-gray-400">{stock.sector}</td>
                <td className="py-4 text-gray-600 dark:text-gray-400">{stock.weight.toFixed(2)}%</td>
                <td className="py-4 font-medium text-gray-900 dark:text-white">
                  ${stock.price.toFixed(2)}
                </td>
                <td className="py-4">
                  <div className={`flex items-center ${stock.change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {stock.change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                    <span>
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.change >= 0 ? '+' : ''}{stock.percentChange.toFixed(2)}%)
                    </span>
                  </div>
                </td>
                <td className="py-4">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    stock.aiScore >= 80 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' :
                    stock.aiScore >= 50 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {stock.aiScore}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdvancedInsightsTab;