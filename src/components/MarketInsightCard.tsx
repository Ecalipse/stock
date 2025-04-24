import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, BarChart2 } from 'lucide-react';
import { MarketInsight } from '../types';

interface MarketInsightCardProps {
  insight: MarketInsight;
}

const MarketInsightCard: React.FC<MarketInsightCardProps> = ({ insight }) => {
  // Icon and color based on sentiment
  const renderSentimentIcon = () => {
    switch (insight.sentiment) {
      case 'positive':
        return <TrendingUp className="h-5 w-5 text-emerald-500" />;
      case 'negative':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      case 'neutral':
      default:
        return <Minus className="h-5 w-5 text-gray-500" />;
    }
  };

  // Background color based on impact
  const getImpactStyles = () => {
    switch (insight.impact) {
      case 'high':
        return 'border-l-4 border-blue-500';
      case 'medium':
        return 'border-l-4 border-amber-500';
      case 'low':
      default:
        return 'border-l-4 border-gray-300 dark:border-gray-700';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 ${getImpactStyles()}`}>
      <div className="flex items-start mb-2">
        <div className="mr-3 mt-1">
          {renderSentimentIcon()}
        </div>
        <div>
          <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-1">
            {insight.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {insight.description}
          </p>
        </div>
      </div>
      <div className="flex justify-between items-center mt-3 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center">
          <BarChart2 className="h-3 w-3 mr-1" />
          <span>Impact: {insight.impact}</span>
        </div>
        <time>
          {new Date(insight.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </time>
      </div>
    </div>
  );
};

export default MarketInsightCard;