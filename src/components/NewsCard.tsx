import React from 'react';
import { ExternalLink, Zap } from 'lucide-react';
import { NewsItem } from '../types';

interface NewsCardProps {
  news: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const getSentimentColor = () => {
    switch (news.sentiment) {
      case 'positive':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      case 'negative':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'neutral':
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <div className="relative h-40 overflow-hidden">
        <img 
          src={news.image} 
          alt={news.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor()}`}>
            {news.sentiment}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">{news.source}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(news.publishDate).toLocaleDateString()}
          </span>
        </div>
        
        <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-2">
          {news.title}
        </h3>
        
        <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-md mb-3">
          <div className="flex items-start mb-1">
            <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-1 mt-0.5" />
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">AI ANALYSIS</span>
          </div>
          <p className="text-sm text-gray-800 dark:text-gray-200">
            {news.aiSummary}
          </p>
        </div>
        
        <a 
          href={news.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          Read More <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      </div>
    </div>
  );
};

export default NewsCard;