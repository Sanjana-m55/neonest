// lib/smartcare-analyzer.js
export class SmartCareAnalyzer {
  constructor(babyId) {
    this.babyId = babyId;
    this.confidenceThreshold = 0.7;
  }

  analyzeFeedingPatterns(feedingData) {
    if (!feedingData || feedingData.length < 3) {
      return {
        confidence: 0.3,
        next_feeding: null,
        message: "Need more feeding data for accurate predictions",
        avg_interval_hours: null
      };
    }

    // Calculate intervals between feedings
    const intervals = [];
    for (let i = 1; i < feedingData.length; i++) {
      const prevTime = new Date(feedingData[i-1].timestamp || feedingData[i-1].created_at);
      const currTime = new Date(feedingData[i].timestamp || feedingData[i].created_at);
      const hoursDiff = (currTime - prevTime) / (1000 * 60 * 60);
      intervals.push(hoursDiff);
    }

    // Calculate average interval
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const stdDeviation = Math.sqrt(
      intervals.reduce((sq, n) => sq + Math.pow(n - avgInterval, 2), 0) / intervals.length
    );

    // Predict next feeding
    const lastFeeding = new Date(feedingData[feedingData.length - 1].timestamp || feedingData[feedingData.length - 1].created_at);
    const nextFeeding = new Date(lastFeeding.getTime() + (avgInterval * 60 * 60 * 1000));

    // Calculate confidence (lower std deviation = higher confidence)
    const confidence = Math.max(0.3, Math.min(0.95, 1 - (stdDeviation / avgInterval)));

    return {
      next_feeding: nextFeeding.toISOString(),
      confidence: confidence,
      avg_interval_hours: Math.round(avgInterval * 10) / 10,
      message: `Next feeding predicted in ${Math.round(avgInterval * 10) / 10} hours`
    };
  }

  analyzeSleepPatterns(sleepData) {
    if (!sleepData || sleepData.length < 2) {
      return {
        confidence: 0.3,
        next_nap: null,
        message: "Need more sleep data for predictions",
        avg_nap_time: null
      };
    }

    // Extract nap times
    const napTimes = sleepData
      .filter(sleep => sleep.type === 'nap' || sleep.sleep_type === 'nap')
      .map(sleep => {
        const startTime = new Date(sleep.start_time || sleep.timestamp);
        return startTime.getHours() + (startTime.getMinutes() / 60);
      });

    if (napTimes.length === 0) {
      return {
        confidence: 0.3,
        next_nap: null,
        message: "No nap data available",
        avg_nap_time: null
      };
    }

    // Calculate average nap time
    const avgNapTime = napTimes.reduce((a, b) => a + b, 0) / napTimes.length;
    const napHour = Math.floor(avgNapTime);
    const napMinute = Math.floor((avgNapTime % 1) * 60);

    // Calculate next nap
    const now = new Date();
    let nextNap = new Date();
    nextNap.setHours(napHour, napMinute, 0, 0);

    if (nextNap <= now) {
      nextNap.setDate(nextNap.getDate() + 1);
    }

    return {
      next_nap: nextNap.toISOString(),
      confidence: 0.8,
      avg_nap_time: `${napHour.toString().padStart(2, '0')}:${napMinute.toString().padStart(2, '0')}`,
      message: `Optimal nap window: ${napHour.toString().padStart(2, '0')}:${napMinute.toString().padStart(2, '0')}`
    };
  }

  analyzeGrowthTrends(growthData) {
    if (!growthData || growthData.length < 2) {
      return {
        confidence: 0.3,
        message: "Need more growth measurements for trend analysis",
        weight_trend: null,
        height_trend: null
      };
    }

    // Sort by date
    const sortedData = growthData.sort((a, b) => 
      new Date(a.date || a.timestamp) - new Date(b.date || b.timestamp)
    );

    const analysis = {};

    // Weight trend analysis
    const weights = sortedData.filter(d => d.weight).map(d => parseFloat(d.weight));
    if (weights.length >= 2) {
      const weightChange = weights[weights.length - 1] - weights[0];
      const timeSpan = weights.length;
      const weightTrend = weightChange / timeSpan;

      analysis.weight_trend = {
        trend: weightChange > 0.1 ? "increasing" : weightChange < -0.1 ? "decreasing" : "stable",
        rate: Math.round(weightTrend * 100) / 100,
        confidence: 0.85,
        total_change: Math.round(weightChange * 100) / 100
      };
    }

    // Height trend analysis
    const heights = sortedData.filter(d => d.height).map(d => parseFloat(d.height));
    if (heights.length >= 2) {
      const heightChange = heights[heights.length - 1] - heights[0];
      const timeSpan = heights.length;
      const heightTrend = heightChange / timeSpan;

      analysis.height_trend = {
        trend: heightChange > 0.5 ? "increasing" : heightChange < -0.5 ? "decreasing" : "stable",
        rate: Math.round(heightTrend * 100) / 100,
        confidence: 0.85,
        total_change: Math.round(heightChange * 100) / 100
      };
    }

    return analysis;
  }

  async generateInsights(babyData) {
    const insights = {
      feeding: this.analyzeFeedingPatterns(babyData.feeding || []),
      sleep: this.analyzeSleepPatterns(babyData.sleep || []),
      growth: this.analyzeGrowthTrends(babyData.growth || []),
      timestamp: new Date().toISOString(),
      baby_id: this.babyId
    };

    return insights;
  }
}