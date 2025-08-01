// app/smart-care/page.js
'use client'
import React, { useState, useEffect } from 'react';
import { Brain, Baby, Clock, TrendingUp, RefreshCw, ThumbsUp, ThumbsDown, Zap } from 'lucide-react';

export default function SmartCarePage() {
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Mock data for testing
  const mockInsights = {
    feeding: {
      confidence: 0.85,
      next_feeding: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      message: "Next feeding predicted in 2.1 hours",
      avg_interval_hours: 2.5
    },
    sleep: {
      confidence: 0.78,
      avg_nap_time: "14:30",
      message: "Optimal nap window: 14:30",
      next_nap: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString()
    },
    growth: {
      weight_trend: {
        trend: "increasing",
        rate: 0.15,
        confidence: 0.92,
        total_change: 0.8
      },
      height_trend: {
        trend: "increasing", 
        rate: 0.8,
        confidence: 0.88,
        total_change: 2.1
      }
    }
  };

  const formatTimeUntil = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const now = new Date();
    const target = new Date(timestamp);
    const diff = target - now;
    
    if (diff < 0) return 'Now';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleRefresh = () => {
    setLastUpdate(new Date());
    // In real implementation, this would fetch new data
    console.log('Refreshing insights...');
  };

  const submitFeedback = (type, accurate) => {
    console.log(`Feedback: ${type} prediction was ${accurate ? 'accurate' : 'inaccurate'}`);
    // In real implementation, this would send to API
    alert(`Thanks for feedback! ${type} prediction marked as ${accurate ? 'accurate' : 'inaccurate'}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="text-pink-600" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Smart Care</h1>
                <p className="text-gray-600">AI-powered insights for your baby</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live • Updated {lastUpdate.toLocaleTimeString()}</span>
              </div>
              <button 
                onClick={handleRefresh}
                className="p-2 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors"
              >
                <RefreshCw size={20} className="text-pink-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Feeding Insights */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-l-orange-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Baby className="text-orange-500" size={24} />
                <h3 className="text-lg font-semibold">Feeding</h3>
              </div>
              <span className={`text-sm font-medium ${getConfidenceColor(mockInsights.feeding.confidence)}`}>
                {Math.round(mockInsights.feeding.confidence * 100)}% confidence
              </span>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Next feeding in:</p>
                <p className="text-2xl font-bold text-gray-800">
                  {formatTimeUntil(mockInsights.feeding.next_feeding)}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-700">
                  {mockInsights.feeding.message}
                </p>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => submitFeedback('feeding', true)}
                  className="flex-1 flex items-center justify-center gap-2 p-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
                >
                  <ThumbsUp size={16} />
                  <span className="text-sm">Accurate</span>
                </button>
                <button 
                  onClick={() => submitFeedback('feeding', false)}
                  className="flex-1 flex items-center justify-center gap-2 p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                >
                  <ThumbsDown size={16} />
                  <span className="text-sm">Off</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sleep Insights */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Clock className="text-purple-500" size={24} />
                <h3 className="text-lg font-semibold">Sleep</h3>
              </div>
              <span className={`text-sm font-medium ${getConfidenceColor(mockInsights.sleep.confidence)}`}>
                {Math.round(mockInsights.sleep.confidence * 100)}% confidence
              </span>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Optimal nap window:</p>
                <p className="text-2xl font-bold text-gray-800">
                  {mockInsights.sleep.avg_nap_time}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-700">
                  {mockInsights.sleep.message}
                </p>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => submitFeedback('sleep', true)}
                  className="flex-1 flex items-center justify-center gap-2 p-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
                >
                  <ThumbsUp size={16} />
                  <span className="text-sm">Helpful</span>
                </button>
                <button 
                  onClick={() => submitFeedback('sleep', false)}
                  className="flex-1 flex items-center justify-center gap-2 p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                >
                  <ThumbsDown size={16} />
                  <span className="text-sm">Not helpful</span>
                </button>
              </div>
            </div>
          </div>

          {/* Growth Insights */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-l-green-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-green-500" size={24} />
                <h3 className="text-lg font-semibold">Growth</h3>
              </div>
              <span className={`text-sm font-medium ${getConfidenceColor(mockInsights.growth.weight_trend.confidence)}`}>
                {Math.round(mockInsights.growth.weight_trend.confidence * 100)}% confidence
              </span>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Weight trend:</p>
                <p className="text-lg font-semibold text-gray-800 capitalize">
                  {mockInsights.growth.weight_trend.trend} (+{mockInsights.growth.weight_trend.total_change}kg)
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Height trend:</p>
                <p className="text-lg font-semibold text-gray-800 capitalize">
                  {mockInsights.growth.height_trend.trend} (+{mockInsights.growth.height_trend.total_change}cm)
                </p>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => submitFeedback('growth', true)}
                  className="flex-1 flex items-center justify-center gap-2 p-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
                >
                  <ThumbsUp size={16} />
                  <span className="text-sm">Accurate</span>
                </button>
                <button 
                  onClick={() => submitFeedback('growth', false)}
                  className="flex-1 flex items-center justify-center gap-2 p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                >
                  <ThumbsDown size={16} />
                  <span className="text-sm">Inaccurate</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="text-yellow-500" size={20} />
            Quick Actions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => alert('Navigate to Feeding page')}
              className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <h4 className="font-medium text-gray-800">Log Feeding</h4>
              <p className="text-sm text-gray-600">Quick feeding entry</p>
            </button>
            
            <button 
              onClick={() => alert('Navigate to Sleep page')}
              className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <h4 className="font-medium text-gray-800">Start Sleep Timer</h4>
              <p className="text-sm text-gray-600">Track nap time</p>
            </button>
            
            <button 
              onClick={() => alert('Navigate to Growth page')}
              className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <h4 className="font-medium text-gray-800">View Trends</h4>
              <p className="text-sm text-gray-600">Detailed analytics</p>
            </button>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            <strong>Demo Mode:</strong> This is showing mock data. Once you connect your database, 
            it will analyze real feeding, sleep, and growth patterns!
          </p>
        </div>
      </div>
    </div>
  );
}

