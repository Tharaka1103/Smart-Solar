import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Inquiry from '@/models/inquiry';
import mongoose from 'mongoose';

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET a specific inquiry
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: 'Invalid inquiry ID' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    const inquiry = await Inquiry.findById(id)
      .populate('customerId', 'name email contact address district');

    if (!inquiry) {
      return NextResponse.json(
        { message: 'Inquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(inquiry);
  } catch (error: any) {
    console.error('Error fetching inquiry:', error);
    return NextResponse.json(
      { message: 'Failed to fetch inquiry', error: error.message },
      { status: 500 }
    );
  }
}

// PUT update inquiry status
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { status } = await req.json();

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: 'Invalid inquiry ID' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedInquiry) {
      return NextResponse.json(
        { message: 'Inquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedInquiry);
  } catch (error: any) {
    console.error('Error updating inquiry:', error);
    return NextResponse.json(
      { message: 'Failed to update inquiry', error: error.message },
      { status: 500 }
    );
  }
}
