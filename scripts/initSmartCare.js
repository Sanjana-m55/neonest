import mongoose from 'mongoose';
import { connectDB } from '../lib/mongodb.js';
import SmartCare from '../models/SmartCare.js';

// Utility function to calculate next feeding time
function calculateNextFeedingTime(currentTime, ageInDays) {
  const baseInterval = ageInDays < 30 ? 3 : 4; // hours
  return new Date(currentTime.getTime() + (baseInterval * 60 * 60 * 1000));
}

// Generate realistic sample data
function generateSampleData() {
  const now = new Date();
  const birthDate = new Date('2024-01-15');
  const ageInDays = Math.ceil((now - birthDate) / (1000 * 60 * 60 * 24));
  
  return {
    babyId: 'baby_001',
    babyName: 'Emma Johnson',
    dateOfBirth: birthDate,
    parentId: 'parent_001',
    
    currentFeeding: {
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      nextFeedingTime: calculateNextFeedingTime(now, ageInDays),
      amount: 120,
      type: 'bottle',
      duration: 15,
      notes: 'Fed well, no issues'
    },
    
    currentSleep: {
      timestamp: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
      sleepStart: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      sleepEnd: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
      duration: 90,
      quality: 'good',
      napWindow: '14:30',
      notes: 'Peaceful afternoon nap'
    },
    
    currentGrowth: {
      timestamp: now,
      weight: 4.2,
      height: 52,
      headCircumference: 35.5,
      notes: 'Healthy growth pattern, following 50th percentile'
    },
    
    feedingHistory: [
      {
        timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        nextFeedingTime: new Date(now.getTime() - 3 * 60 * 60 * 1000),
        amount: 110,
        type: 'bottle',
        duration: 12,
        notes: 'Morning feeding'
      },
      {
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        nextFeedingTime: new Date(now.getTime() - 21 * 60 * 60 * 1000),
        amount: 115,
        type: 'bottle',
        duration: 14,
        notes: 'Previous day feeding'
      }
    ],
    
    sleepHistory: [
      {
        timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000),
        sleepStart: new Date(now.getTime() - 12 * 60 * 60 * 1000),
        sleepEnd: new Date(now.getTime() - 4 * 60 * 60 * 1000),
        duration: 480,
        quality: 'excellent',
        notes: 'Full night sleep, 8 hours'
      },
      {
        timestamp: new Date(now.getTime() - 36 * 60 * 60 * 1000),
        sleepStart: new Date(now.getTime() - 36 * 60 * 60 * 1000),
        sleepEnd: new Date(now.getTime() - 34 * 60 * 60 * 1000),
        duration: 120,
        quality: 'good',
        notes: 'Afternoon nap'
      }
    ],
    
    growthHistory: [
      {
        timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        weight: 4.1,
        height: 51.5,
        headCircumference: 35.2,
        notes: 'Weekly checkup - good progress'
      },
      {
        timestamp: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
        weight: 3.9,
        height: 51.0,
        headCircumference: 35.0,
        notes: 'Two weeks ago measurement'
      }
    ],
    
    insights: {
      feedingConfidence: 85,
      sleepConfidence: 78,
      growthConfidence: 92,
      lastUpdated: now
    },
    
    settings: {
      timezone: 'Asia/Kolkata',
      units: {
        weight: 'kg',
        height: 'cm'
      },
      notifications: {
        feeding: true,
        sleep: true,
        growth: true
      }
    }
  };
}

// Initialize SmartCare data
async function initSmartCare() {
  try {
    console.log('🚀 Initializing SmartCare data...');

    const sampleData = generateSampleData();

    // Check if data already exists
    const existingBaby = await SmartCare.findOne({ babyId: sampleData.babyId });
    
    if (existingBaby) {
      console.log('⚠️  SmartCare data already exists for this baby');
      console.log('Existing baby:', existingBaby.babyName);
      console.log('Last updated:', existingBaby.updatedAt);
      
      // Optionally update the existing record with new insights
      existingBaby.insights.lastUpdated = new Date();
      await existingBaby.save();
      console.log('✅ Updated existing record with current timestamp');
      return existingBaby;
    }

    // Create new SmartCare record
    const newSmartCare = new SmartCare(sampleData);
    await newSmartCare.save();
    
    console.log('✅ SmartCare data initialized successfully!');
    console.log('Baby Name:', newSmartCare.babyName);
    console.log('Baby ID:', newSmartCare.babyId);
    console.log('Date of Birth:', newSmartCare.dateOfBirth.toDateString());
    console.log('Age in days:', newSmartCare.ageInDays);
    console.log('Next feeding:', newSmartCare.currentFeeding.nextFeedingTime.toLocaleString());
    
    return newSmartCare;
    
  } catch (error) {
    console.error('❌ Error initializing SmartCare data:', error);
    throw error;
  }
}

// Main execution function
async function main() {
  try {
    console.log('🔄 Starting SmartCare initialization...');
    
    // Connect to database
    await connectDB();
    console.log('📡 Database connected successfully');
    
    // Initialize data
    const result = await initSmartCare();
    
    console.log('🎉 Initialization complete!');
    console.log('Record ID:', result._id);
    
  } catch (error) {
    console.error('❌ Initialization failed:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.disconnect();
    console.log('📡 Database connection closed');
    process.exit(0);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { initSmartCare, generateSampleData };