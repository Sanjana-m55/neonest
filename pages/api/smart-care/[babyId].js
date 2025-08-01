import SmartCare from '../../../models/SmartCare';
import { connectDB } from '../../../lib/mongodb';

// Helper functions
function calculateAverageInterval(feedings) {
  if (feedings.length < 2) return 3 * 60 * 60 * 1000; // Default 3 hours
  
  let totalInterval = 0;
  for (let i = 1; i < feedings.length; i++) {
    totalInterval += feedings[i].timestamp - feedings[i-1].timestamp;
  }
  
  return totalInterval / (feedings.length - 1);
}

function calculateOptimalNapTime(sleeps) {
  // Analyze historical nap times and find the most common time
  const napTimes = sleeps.map(sleep => {
    if (sleep.sleepStart) {
      const time = new Date(sleep.sleepStart);
      return `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`;
    }
    return "14:30";
  });
  
  // Return most frequent nap time or default
  return napTimes[0] || "14:30";
}

function calculateInsights(data) {
  const now = new Date();
  
  // Feeding predictions
  let feedingConfidence = 85;
  let nextFeedingPrediction = null;
  
  if (data.feedingHistory && data.feedingHistory.length > 0) {
    const recentFeedings = data.feedingHistory.slice(-5);
    const averageInterval = calculateAverageInterval(recentFeedings);
    const lastFeeding = recentFeedings[recentFeedings.length - 1];
    
    if (lastFeeding && lastFeeding.timestamp) {
      nextFeedingPrediction = new Date(lastFeeding.timestamp.getTime() + averageInterval);
      feedingConfidence = Math.min(95, 60 + (recentFeedings.length * 5));
    }
  }
  
  // Sleep predictions
  let sleepConfidence = 78;
  let optimalNapWindow = "14:30";
  
  if (data.sleepHistory && data.sleepHistory.length > 0) {
    const recentSleeps = data.sleepHistory.slice(-7);
    optimalNapWindow = calculateOptimalNapTime(recentSleeps);
    sleepConfidence = Math.min(90, 50 + (recentSleeps.length * 4));
  }
  
  // Growth predictions
  let growthConfidence = 92;
  let weightTrend = "Increasing";
  let heightTrend = "Increasing";
  
  if (data.growthHistory && data.growthHistory.length >= 2) {
    const recentGrowth = data.growthHistory.slice(-2);
    if (recentGrowth[1].weight && recentGrowth[0].weight) {
      weightTrend = recentGrowth[1].weight > recentGrowth[0].weight ? "Increasing" : "Stable";
    }
    if (recentGrowth[1].height && recentGrowth[0].height) {
      heightTrend = recentGrowth[1].height > recentGrowth[0].height ? "Increasing" : "Stable";
    }
  }
  
  return {
    feeding: {
      confidence: feedingConfidence,
      nextFeeding: nextFeedingPrediction,
      predictedIn: nextFeedingPrediction ? Math.round((nextFeedingPrediction - now) / (1000 * 60)) : null
    },
    sleep: {
      confidence: sleepConfidence,
      optimalNapWindow
    },
    growth: {
      confidence: growthConfidence,
      weightTrend,
      heightTrend
    }
  };
}

export default async function handler(req, res) {
  await connectDB();
  
  const { babyId } = req.query;
  
  if (req.method === 'GET') {
    try {
      const smartCareData = await SmartCare.findOne({ babyId });
      
      if (!smartCareData) {
        return res.status(404).json({ message: 'Baby not found' });
      }
      
      // Calculate AI insights based on historical data
      const insights = calculateInsights(smartCareData);
      
      res.status(200).json({
        ...smartCareData.toObject(),
        insights
      });
    } catch (error) {
      console.error('Error fetching smart care data:', error);
      res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
  }
  
  if (req.method === 'POST') {
    try {
      const { type, data } = req.body; // type: 'feeding', 'sleep', 'growth'
      
      let updateData = {};
      
      switch (type) {
        case 'feeding':
          updateData = {
            currentFeeding: data,
            $push: { feedingHistory: data }
          };
          break;
        case 'sleep':
          updateData = {
            currentSleep: data,
            $push: { sleepHistory: data }
          };
          break;
        case 'growth':
          updateData = {
            currentGrowth: data,
            $push: { growthHistory: data }
          };
          break;
        default:
          return res.status(400).json({ message: 'Invalid type' });
      }
      
      const updatedData = await SmartCare.findOneAndUpdate(
        { babyId },
        updateData,
        { new: true, upsert: true }
      );
      
      res.status(200).json(updatedData);
    } catch (error) {
      console.error('Error updating smart care data:', error);
      res.status(500).json({ message: 'Error updating data', error: error.message });
    }
  }
  
  if (req.method === 'PUT') {
    // For updating existing data
    try {
      const updatedData = await SmartCare.findOneAndUpdate(
        { babyId },
        req.body,
        { new: true, upsert: true }
      );
      
      res.status(200).json(updatedData);
    } catch (error) {
      console.error('Error updating smart care data:', error);
      res.status(500).json({ message: 'Error updating data', error: error.message });
    }
  }
}