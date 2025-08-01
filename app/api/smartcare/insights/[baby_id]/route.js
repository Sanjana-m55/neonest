// app/api/smartcare/insights/[baby_id]/route.js
import { NextResponse } from 'next/server';
import { connectDB, SmartCareInsights } from '../../../../../lib/database';
import { SmartCareAnalyzer } from '../../../../../lib/smartcare-analyzer';

// Mock function - replace with your actual data fetching logic
async function getBabyData(babyId, dataType, limit = 20) {
  // This should connect to your existing database and fetch:
  // - Feeding data from your feeding table/collection
  // - Sleep data from your sleep table/collection  
  // - Growth data from your growth table/collection
  
  // Example implementation (adjust based on your database structure):
  try {
    switch (dataType) {
      case 'feeding':
        // Replace with your actual feeding data query
        // const feedingData = await FeedingModel.find({ baby_id: babyId }).limit(limit).sort({ timestamp: -1 });
        // return feedingData;
        return []; // Placeholder
        
      case 'sleep':
        // Replace with your actual sleep data query
        // const sleepData = await SleepModel.find({ baby_id: babyId }).limit(limit).sort({ timestamp: -1 });
        // return sleepData;
        return []; // Placeholder
        
      case 'growth':
        // Replace with your actual growth data query
        // const growthData = await GrowthModel.find({ baby_id: babyId }).limit(limit).sort({ date: -1 });
        // return growthData;
        return []; // Placeholder
        
      default:
        return [];
    }
  } catch (error) {
    console.error(`Error fetching ${dataType} data:`, error);
    return [];
  }
}

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { baby_id } = params;

    // Check for cached insights first (optional optimization)
    const cached = await SmartCareInsights.findOne({ 
      baby_id,
      created_at: { $gte: new Date(Date.now() - 5 * 60 * 1000) } // 5 minutes
    });

    if (cached) {
      return NextResponse.json(cached.insights);
    }

    // Fetch fresh data
    const analyzer = new SmartCareAnalyzer(baby_id);
    
    const [feedingData, sleepData, growthData] = await Promise.all([
      getBabyData(baby_id, 'feeding', 20),
      getBabyData(baby_id, 'sleep', 15),
      getBabyData(baby_id, 'growth', 10)
    ]);

    const insights = await analyzer.generateInsights({
      feeding: feedingData,
      sleep: sleepData,
      growth: growthData
    });

    // Cache the insights (optional)
    await SmartCareInsights.create({
      baby_id,
      insights,
      expires_at: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    });

    return NextResponse.json(insights);

  } catch (error) {
    console.error('Smart Care API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}