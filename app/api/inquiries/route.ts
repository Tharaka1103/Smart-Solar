import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Inquiry from '@/models/inquiry';
import Customer from '@/models/customer';

// GET all inquiries (with filtering options)
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const customerType = searchParams.get('customerType');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    // Build query
    let query: any = {};
    
    if (customerType) {
      query.customerType = customerType;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { 'customerDetails.name': { $regex: search, $options: 'i' } },
        { 'customerDetails.email': { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    const inquiries = await Inquiry.find(query)
      .sort({ createdAt: -1 })
      .populate('customerId', 'name email contact address district');
    
    return NextResponse.json(inquiries);
  } catch (error: any) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { message: 'Failed to fetch inquiries', error: error.message },
      { status: 500 }
    );
  }
}

// POST create a new inquiry
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const { customerType, customerId, customerDetails, subject, message, type } = body;
    
    // Validate required fields
    if (!customerType || !subject || !message || !type) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // If existing customer, validate customer exists
    if (customerType === 'existing' && customerId) {
      const customer = await Customer.findById(customerId);
      if (!customer) {
        return NextResponse.json(
          { message: 'Customer not found' },
          { status: 404 }
        );
      }
    }
    
    // Create new inquiry
    const inquiry = new Inquiry({
      customerType,
      customerId: customerType === 'existing' ? customerId : undefined,
      customerDetails,
      subject,
      message,
      type,
      status: 'pending'
    });
    
    await inquiry.save();
    
    return NextResponse.json(inquiry, { status: 201 });
  } catch (error: any) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json(
      { message: 'Failed to create inquiry', error: error.message },
      { status: 500 }
    );
  }
}
