import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Inquiry from '@/models/inquiry';
import mongoose from 'mongoose';

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

// POST add a response to an inquiry
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { message } = await req.json();

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: 'Invalid inquiry ID' },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { message: 'Response message is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    const inquiry = await Inquiry.findById(id);
    
    if (!inquiry) {
      return NextResponse.json(
        { message: 'Inquiry not found' },
        { status: 404 }
      );
    }
    
    // Add response
    const response = {
      message,
      respondedBy:  'Admin' ,
      respondedAt: new Date()
    };
    
    inquiry.responses.push(response);
    
    // If admin is responding, update status to responded
    if (inquiry.status === 'pending') {
      inquiry.status = 'responded';
    }
    
    await inquiry.save();
    
    return NextResponse.json(inquiry);
  } catch (error: any) {
    console.error('Error adding response:', error);
    return NextResponse.json(
      { message: 'Failed to add response', error: error.message },
      { status: 500 }
    );
  }
}
