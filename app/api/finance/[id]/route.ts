import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Finance from '@/models/Finance';

// Get finance by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const finance = await Finance.findById(params.id);
    
    if (!finance) {
      return NextResponse.json({ error: 'Finance record not found' }, { status: 404 });
    }
    
    return NextResponse.json(finance);
  } catch (error) {
    console.error('Error fetching finance:', error);
    return NextResponse.json({ error: 'Failed to fetch finance record' }, { status: 500 });
  }
}

// Update finance
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    await connectToDatabase();
    
    const updatedFinance = await Finance.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!updatedFinance) {
      return NextResponse.json({ error: 'Finance record not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedFinance);
  } catch (error) {
    console.error('Error updating finance:', error);
    return NextResponse.json({ error: 'Failed to update finance record' }, { status: 500 });
  }
}

// Delete finance
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const deletedFinance = await Finance.findByIdAndDelete(params.id);
    
    if (!deletedFinance) {
      return NextResponse.json({ error: 'Finance record not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Finance record deleted successfully' });
  } catch (error) {
    console.error('Error deleting finance:', error);
    return NextResponse.json({ error: 'Failed to delete finance record' }, { status: 500 });
  }
}
