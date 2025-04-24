import React from 'react';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';
import type { Stock } from '../types';

interface RecommendationsTabProps {
  stocks: Stock[];
}

const RecommendationsTab: React.FC<RecommendationsTabProps> = ({ stocks }) => {
  const getRecommendedStocks = () => {
    return stocks
      .filter(stock => stock.aiScore >= 75)
      .sort((a, b) => b.aiScore - a.aiScore);
  };

  const recommendedStocks = getRecommendedStocks();

  if (recommendedStocks.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="text-center text-gray-600 dark:text-gray-400">
          No recommendations available at this time.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">AI Investment Recommendations</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendedStocks.map((stock) => (
          <div key={stock.symbol} className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl p-6 shadow-sm border border-blue-100 dark:border-blue-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold text-lg text-gray-900 dark:text-white">{stock.symbol}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stock.name}</p>
              </div>
              <div className="bg-blue-600/10 dark:bg-blue-400/10 px-3 py-1 rounded-full">
                <span className="text-blue-700 dark:text-blue-300 font-semibold">Score: {stock.aiScore}</span>
              </div>
            </div>
            <div className="space-y-3">
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
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between items-center mb-1">
                  <span>Volume</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Intl.NumberFormat().format(stock.volume)}
                  </span>
                </div>
                {stock.prediction && (
                  <div className="flex justify-between items-center">
                    <span>1 Month Forecast</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${stock.prediction.oneMonth.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsTab;