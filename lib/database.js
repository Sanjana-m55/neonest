// lib/database.js
import mongoose from 'mongoose';

// If you're using MongoDB with Mongoose
const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

// Smart Care Feedback Schema
const smartCareFeedbackSchema = new mongoose.Schema({
  baby_id: {
    type: String,
    required: true
  },
  insight_type: {
    type: String,
    required: true,
    enum: ['feeding', 'sleep', 'growth']
  },
  accurate: {
    type: Boolean,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  user_id: {
    type: String,
    required: true
  }
});

// Smart Care Insights Cache Schema (optional - for caching predictions)
const smartCareInsightsSchema = new mongoose.Schema({
  baby_id: {
    type: String,
    required: true
  },
  insights: {
    type: Object,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now,
    expires: 300 // Cache for 5 minutes
  }
});

export const SmartCareFeedback = mongoose.models.SmartCareFeedback || 
  mongoose.model('SmartCareFeedback', smartCareFeedbackSchema);

export const SmartCareInsights = mongoose.models.SmartCareInsights || 
  mongoose.model('SmartCareInsights', smartCareInsightsSchema);

export { connectDB };

