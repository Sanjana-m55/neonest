'use client';
import { useState, useEffect } from 'react';

export default function SmartCarePage() {
  // Fix hydration issue with time display
  const [currentTime, setCurrentTime] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date().toLocaleTimeString());
    
    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header with fixed time display */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🧠</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Smart Care</h1>
              <p className="text-gray-400">AI-powered insights for your baby</p>
            </div>
          </div>
          
          {/* Fixed time display - no hydration error */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            {mounted ? (
              <span>Live • Updated {currentTime}</span>
            ) : (
              <span>Live • Loading...</span>
            )}
            <button className="ml-2 p-1 hover:bg-gray-800 rounded">
              🔄
            </button>
          </div>
        </div>

        {/* Rest of your Smart Care content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Feeding Card */}
          <div className="bg-gray-800 rounded-xl p-6 border-l-4 border-orange-500">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🍼</span>
              <div>
                <h3 className="text-xl font-semibold">Feeding</h3>
                <span className="text-green-400 text-sm">85% confidence</span>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-400 text-sm">Next feeding in:</p>
              <p className="text-3xl font-bold">2h 0m</p>
              <p className="text-gray-400 text-sm">Next feeding predicted in 2.1 hours</p>
            </div>
            
            <div className="flex gap-2">
              <button className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm">
                👍 Accurate
              </button>
              <button className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm">
                👎 Off
              </button>
            </div>
          </div>

          {/* Sleep Card */}
          <div className="bg-gray-800 rounded-xl p-6 border-l-4 border-purple-500">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">😴</span>
              <div>
                <h3 className="text-xl font-semibold">Sleep</h3>
                <span className="text-yellow-400 text-sm">78% confidence</span>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-400 text-sm">Optimal nap window:</p>
              <p className="text-3xl font-bold">14:30</p>
              <p className="text-gray-400 text-sm">Optimal nap window: 14:30</p>
            </div>
            
            <div className="flex gap-2">
              <button className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm">
                👍 Helpful
              </button>
              <button className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm">
                👎 Not helpful
              </button>
            </div>
          </div>

          {/* Growth Card */}
          <div className="bg-gray-800 rounded-xl p-6 border-l-4 border-green-500">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">📈</span>
              <div>
                <h3 className="text-xl font-semibold">Growth</h3>
                <span className="text-green-400 text-sm">92% confidence</span>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-400 text-sm">Weight trend:</p>
              <p className="text-xl font-bold text-green-400">Increasing (+0.8kg)</p>
              <p className="text-gray-400 text-sm">Height trend:</p>
              <p className="text-xl font-bold text-green-400">Increasing (+2.1cm)</p>
            </div>
            
            <div className="flex gap-2">
              <button className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm">
                👍 Accurate
              </button>
              <button className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm">
                👎 Inaccurate
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            ⚡ Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-gray-800 hover:bg-gray-700 p-4 rounded-xl text-left">
              <h3 className="font-semibold mb-2">Log Feeding</h3>
              <p className="text-gray-400 text-sm">Quick feeding entry</p>
            </button>
            
            <button className="bg-gray-800 hover:bg-gray-700 p-4 rounded-xl text-left">
              <h3 className="font-semibold mb-2">Start Sleep Timer</h3>
              <p className="text-gray-400 text-sm">Track nap time</p>
            </button>
            
            <button className="bg-gray-800 hover:bg-gray-700 p-4 rounded-xl text-left">
              <h3 className="font-semibold mb-2">View Trends</h3>
              <p className="text-gray-400 text-sm">Detailed analytics</p>
            </button>
          </div>
        </div>

        {/* Demo Mode Notice */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <p className="text-blue-300">
            <strong>Demo Mode:</strong> This is showing mock data. Once you connect your database, 
            it will analyze real feeding, sleep, and growth patterns!
          </p>
        </div>
      </div>
    </div>
  );
}