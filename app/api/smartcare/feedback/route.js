// app/api/smartcare/feedback/route.js
import { NextResponse } from 'next/server';
import { connectDB, SmartCareFeedback } from '../../../../lib/database';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { baby_id, insight_type, accurate, user_id } = body;

    // Validate required fields
    if (!baby_id || !insight_type || typeof accurate !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save feedback
    const feedback = await SmartCareFeedback.create({
      baby_id,
      insight_type,
      accurate,
      user_id: user_id || 'anonymous', // Get from session/auth
      timestamp: new Date()
    });

    return NextResponse.json({
      status: 'success',
      message: 'Feedback recorded successfully',
      feedback_id: feedback._id
    });

  } catch (error) {
    console.error('Feedback API Error:', error);
    return NextResponse.json(
      { error: 'Failed to record feedback' },
      { status: 500 }
    );
  }
}