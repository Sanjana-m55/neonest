import { connectDB } from '@/lib/mongodb';
import SmartCare from '@/app/models/SmartCare';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectDB();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const babyId = searchParams.get('babyId');
    
    let smartCareData;
    
    if (babyId) {
      // Get specific baby's data
      smartCareData = await SmartCare.findOne({ babyId });
    } else {
      // Get the latest SmartCare data (for demo purposes)
      smartCareData = await SmartCare.findOne().sort({ createdAt: -1 });
    }
    
    if (!smartCareData) {
      return NextResponse.json({ 
        error: 'No SmartCare data found',
        message: 'Please run the initialization script first: npm run init-smartcare'
      }, { status: 404 });
    }

    // Update insights with real-time calculations
    const now = new Date();
    const updatedData = {
      ...smartCareData.toObject(),
      insights: {
        ...smartCareData.insights,
        lastUpdated: now
      }
    };

    return NextResponse.json(updatedData);
  } catch (error) {
    console.error('SmartCare API Error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch SmartCare data',
      details: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const data = await request.json();
    const smartCare = new SmartCare(data);
    await smartCare.save();
    
    return NextResponse.json(smartCare, { status: 201 });
  } catch (error) {
    console.error('SmartCare POST Error:', error);
    return NextResponse.json({ 
      error: 'Failed to create SmartCare data',
      details: error.message
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    
    const data = await request.json();
    const { babyId } = data;
    
    if (!babyId) {
      return NextResponse.json({ error: 'babyId is required' }, { status: 400 });
    }
    
    const updatedSmartCare = await SmartCare.findOneAndUpdate(
      { babyId },
      { ...data, 'insights.lastUpdated': new Date() },
      { new: true, upsert: true }
    );
    
    return NextResponse.json(updatedSmartCare);
  } catch (error) {
    console.error('SmartCare PUT Error:', error);
    return NextResponse.json({ 
      error: 'Failed to update SmartCare data',
      details: error.message
    }, { status: 500 });
  }
}