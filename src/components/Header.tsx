import React, { useState, useEffect } from 'react';
import { BarChart2, Moon, Sun } from 'lucide-react';

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <BarChart2 size={24} />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">StockAI</h1>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;