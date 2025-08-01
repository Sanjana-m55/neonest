import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Baby, 
  Clock, 
  TrendingUp, 
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Zap
} from 'lucide-react';

const SmartCare = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Get baby ID from your app context/state
  const babyId = "current-baby-id"; // Replace with actual baby ID logic

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/smartcare/insights/${babyId}`);
      const data = await response.json();
      setInsights(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch insights:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 2-3 minutes
  useEffect(() => {
    fetchInsights();
    
    if (autoRefresh) {
      const interval = setInterval(fetchInsights, 150000); // 2.5 minutes
      return () => clearInterval(interval);
    }
  }, [autoRefresh, babyId]);

  const submitFeedback = async (type, accurate) => {
    try {
      await fetch('/api/smartcare/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baby_id: babyId,
          insight_type: type,
          accurate: accurate,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to submit feedback:', error);
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

  if (loading && !insights) {
    return (
      <div className="smart-care-container">
        <div className="loading-spinner">
          <RefreshCw className="animate-spin" size={32} />
          <p>Analyzing your baby's patterns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="smart-care-container p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="smart-care-header mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="text-blue-600" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Smart Care</h1>
              <p className="text-gray-600">AI-powered insights for your baby</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live • Updated {lastUpdate?.toLocaleTimeString()}</span>
            </div>
            <button 
              onClick={fetchInsights}
              className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <RefreshCw size={20} className="text-blue-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="insights-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Feeding Insights */}
        <div className="insight-card bg-white rounded-xl shadow-lg p-6 border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Baby className="text-orange-500" size={24} />
              <h3 className="text-lg font-semibold">Feeding</h3>
            </div>
            <span className={`text-sm font-medium ${getConfidenceColor(insights?.feeding?.confidence || 0)}`}>
              {Math.round((insights?.feeding?.confidence || 0) * 100)}% confidence
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="next-event">
              <p className="text-sm text-gray-600">Next feeding in:</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatTimeUntil(insights?.feeding?.next_feeding)}
              </p>
            </div>
            
            <div className="insight-details">
              <p className="text-sm text-gray-700">
                {insights?.feeding?.message || "Analyzing feeding patterns..."}
              </p>
            </div>
            
            <div className="feedback-buttons flex gap-2 mt-4">
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
        <div className="insight-card bg-white rounded-xl shadow-lg p-6 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Clock className="text-purple-500" size={24} />
              <h3 className="text-lg font-semibold">Sleep</h3>
            </div>
            <span className={`text-sm font-medium ${getConfidenceColor(insights?.sleep?.confidence || 0)}`}>
              {Math.round((insights?.sleep?.confidence || 0) * 100)}% confidence
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="next-event">
              <p className="text-sm text-gray-600">Optimal nap window:</p>
              <p className="text-2xl font-bold text-gray-800">
                {insights?.sleep?.avg_nap_time || "Analyzing..."}
              </p>
            </div>
            
            <div className="insight-details">
              <p className="text-sm text-gray-700">
                {insights?.sleep?.message || "Learning sleep patterns..."}
              </p>
            </div>
            
            <div className="feedback-buttons flex gap-2 mt-4">
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
        <div className="insight-card bg-white rounded-xl shadow-lg p-6 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-green-500" size={24} />
              <h3 className="text-lg font-semibold">Growth</h3>
            </div>
            <span className={`text-sm font-medium ${getConfidenceColor(insights?.growth?.weight_trend?.confidence || 0)}`}>
              {Math.round((insights?.growth?.weight_trend?.confidence || 0) * 100)}% confidence
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="growth-trend">
              <p className="text-sm text-gray-600">Weight trend:</p>
              <p className="text-lg font-semibold text-gray-800 capitalize">
                {insights?.growth?.weight_trend?.trend || "Analyzing..."}
              </p>
            </div>
            
            {insights?.growth?.height_trend && (
              <div className="growth-trend">
                <p className="text-sm text-gray-600">Height trend:</p>
                <p className="text-lg font-semibold text-gray-800 capitalize">
                  {insights.growth.height_trend.trend}
                </p>
              </div>
            )}
            
            <div className="feedback-buttons flex gap-2 mt-4">
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
      <div className="quick-actions mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="text-yellow-500" size={20} />
          Quick Actions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
            <h4 className="font-medium text-gray-800">Log Feeding</h4>
            <p className="text-sm text-gray-600">Quick feeding entry</p>
          </button>
          
          <button className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
            <h4 className="font-medium text-gray-800">Start Sleep Timer</h4>
            <p className="text-sm text-gray-600">Track nap time</p>
          </button>
          
          <button className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
            <h4 className="font-medium text-gray-800">View Trends</h4>
            <p className="text-sm text-gray-600">Detailed analytics</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartCare;