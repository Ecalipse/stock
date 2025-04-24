import React from 'react';
import { ArrowUp, ArrowDown, Zap } from 'lucide-react';
import { Stock } from '../types';

interface StockCardProps {
  stock: Stock;
  onClick?: (symbol: string) => void;
}

const StockCard: React.FC<StockCardProps> = ({ stock, onClick }) => {
  const isPositive = stock.percentChange >= 0;
  
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4 cursor-pointer"
      onClick={() => onClick && onClick(stock.symbol)}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{stock.symbol}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{stock.name}</p>
        </div>
        <div className="flex items-center gap-1">
          <div 
            className={`px-2 py-1 rounded-full flex items-center text-xs ${
              stock.aiScore >= 80 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' : 
              stock.aiScore >= 50 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' : 
              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}
          >
            <Zap size={12} className="mr-1" />
            <span>{stock.aiScore}</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-end">
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${stock.price.toFixed(2)}
          </p>
          <div className={`flex items-center ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            <span className="text-sm font-medium ml-1">
              {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.percentChange.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400">AI Prediction (1d)</p>
          <p className={`text-sm font-medium ${stock.prediction.oneDay > stock.price ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            ${stock.prediction.oneDay.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockCard;