import { Stock, MarketInsight, NewsItem } from '../types';

export const mockStocks: Stock[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 172.62,
    change: -0.86,
    percentChange: -0.49,
    volume: 52409432,
    marketCap: 2680000000000,
    aiScore: 86,
    prediction: {
      oneDay: 174.35,
      oneWeek: 176.80,
      oneMonth: 180.45
    }
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 417.88,
    change: 2.53,
    percentChange: 0.61,
    volume: 21843256,
    marketCap: 3100000000000,
    aiScore: 92,
    prediction: {
      oneDay: 420.45,
      oneWeek: 425.30,
      oneMonth: 432.65
    }
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 147.68,
    change: -0.45,
    percentChange: -0.30,
    volume: 15632145,
    marketCap: 1850000000000,
    aiScore: 78,
    prediction: {
      oneDay: 148.92,
      oneWeek: 151.45,
      oneMonth: 155.30
    }
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 178.35,
    change: 1.23,
    percentChange: 0.69,
    volume: 32568741,
    marketCap: 1860000000000,
    aiScore: 81,
    prediction: {
      oneDay: 180.45,
      oneWeek: 183.20,
      oneMonth: 188.75
    }
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 175.28,
    change: -3.42,
    percentChange: -1.91,
    volume: 75489632,
    marketCap: 557000000000,
    aiScore: 73,
    prediction: {
      oneDay: 177.45,
      oneWeek: 180.80,
      oneMonth: 185.90
    }
  },
  {
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    price: 505.95,
    change: 5.78,
    percentChange: 1.15,
    volume: 23451678,
    marketCap: 1290000000000,
    aiScore: 88,
    prediction: {
      oneDay: 510.45,
      oneWeek: 518.30,
      oneMonth: 525.80
    }
  },
  {
    symbol: 'NFLX',
    name: 'Netflix, Inc.',
    price: 605.88,
    change: 7.32,
    percentChange: 1.22,
    volume: 9873452,
    marketCap: 265000000000,
    aiScore: 84,
    prediction: {
      oneDay: 610.45,
      oneWeek: 618.30,
      oneMonth: 625.90
    }
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 878.35,
    change: 12.45,
    percentChange: 1.44,
    volume: 42567893,
    marketCap: 2170000000000,
    aiScore: 94,
    prediction: {
      oneDay: 885.45,
      oneWeek: 895.30,
      oneMonth: 910.80
    }
  }
];

export const mockMarketInsights: MarketInsight[] = [
  {
    id: '1',
    title: 'Tech sector showing strong recovery signals',
    description: 'Our AI models detect strengthening fundamentals in the technology sector with increased corporate spending on cloud services and AI applications.',
    sentiment: 'positive',
    impact: 'high',
    date: '2025-06-05T08:30:00Z'
  },
  {
    id: '2',
    title: 'Inflation concerns affecting retail stocks',
    description: 'Consumer spending patterns show caution due to persistent inflation, potentially impacting retail sector performance in Q3.',
    sentiment: 'negative',
    impact: 'medium',
    date: '2025-06-05T10:15:00Z'
  },
  {
    id: '3',
    title: 'Renewable energy stocks poised for growth',
    description: 'New policy frameworks and technological advancements suggest strong growth potential for companies in the renewable energy space.',
    sentiment: 'positive',
    impact: 'medium',
    date: '2025-06-05T09:45:00Z'
  },
  {
    id: '4',
    title: 'Healthcare innovation driving sector outperformance',
    description: 'Breakthrough treatments and AI diagnostics are creating significant value in select healthcare stocks with strong R&D pipelines.',
    sentiment: 'positive',
    impact: 'high',
    date: '2025-06-04T14:20:00Z'
  }
];

export const mockNewsItems: NewsItem[] = [
  {
    id: '1',
    title: 'Apple Unveils Revolutionary AI-Enhanced Chip for Next-Gen Devices',
    source: 'TechCrunch',
    url: '#',
    image: 'https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    publishDate: '2025-06-05T08:30:00Z',
    sentiment: 'positive',
    aiSummary: "Apple's new M3 Ultra chip features enhanced AI capabilities that could drive 15-20% revenue growth in their hardware division over the next 2 years."
  },
  {
    id: '2',
    title: 'Federal Reserve Signals Potential Rate Cut in September Meeting',
    source: 'Bloomberg',
    url: '#',
    image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    publishDate: '2025-06-05T10:15:00Z',
    sentiment: 'positive',
    aiSummary: "The Fed's pivot toward rate cuts could benefit growth stocks and companies with high debt loads while potentially increasing inflation risks."
  },
  {
    id: '3',
    title: 'NVIDIA Announces Breakthrough in Quantum Computing Integration',
    source: 'Wired',
    url: '#',
    image: 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    publishDate: '2025-06-04T14:20:00Z',
    sentiment: 'positive',
    aiSummary: "NVIDIA's quantum-accelerated GPU technology could revolutionize complex modeling for pharmaceutical and materials science industries."
  },
  {
    id: '4',
    title: 'Global Supply Chain Disruptions Expected to Continue Through Q4',
    source: 'Wall Street Journal',
    url: '#',
    image: 'https://images.pexels.com/photos/1427541/pexels-photo-1427541.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    publishDate: '2025-06-03T16:45:00Z',
    sentiment: 'negative',
    aiSummary: 'Ongoing logistics challenges may negatively impact margins for consumer electronics and automotive manufacturers dependent on Asian component suppliers.'
  }
];