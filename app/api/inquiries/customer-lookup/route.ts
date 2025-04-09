import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Customer from '@/models/customer';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const { identifier } = await req.json();
    
    if (!identifier) {
      return NextResponse.json(
        { message: 'Identifier is required' },
        { status: 400 }
      );
    }
    
    // Look up customer by NIC or electricity account number
    const customer = await Customer.findOne({
      $or: [
        { nic: identifier },
        { electricityAccountNumber: identifier }
      ]
    });
    
    if (!customer) {
      return NextResponse.json(
        { message: 'Customer not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(customer);
  } catch (error: any) {
    console.error('Error looking up customer:', error);
    return NextResponse.json(
      { message: 'Failed to look up customer', error: error.message },
      { status: 500 }
    );
  }
}
