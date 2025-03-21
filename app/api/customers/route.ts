import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Customer from '@/models/customer';

// GET all customers with pagination, search, and filtering
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const district = searchParams.get('district') || '';
    const service = searchParams.get('service') || '';

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Connect to the database
    await connectToDatabase();

    // Build the query
    let query: any = {};

    // Add search functionality
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { contact: { $regex: search, $options: 'i' } },
          { nic: { $regex: search, $options: 'i' } }
        ]
      };
    }

    // Add district filter
    if (district) {
      query.district = district;
    }

    // Add service filter
    if (service) {
      query.service = service;
    }

    // Execute the query with pagination
    const customers = await Customer.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Customer.countDocuments(query);

    return NextResponse.json({
      customers,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error: any) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { message: 'Failed to fetch customers', error: error.message },
      { status: 500 }
    );
  }
}

// POST create a new customer
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Connect to the database
    await connectToDatabase();

    // Check if customer with the same email or NIC already exists
    const existingCustomer = await Customer.findOne({
      $or: [
        { email: body.email },
        { nic: body.nic }
      ]
    });

    if (existingCustomer) {
      return NextResponse.json(
        { message: 'A customer with this email or NIC already exists' },
        { status: 400 }
      );
    }

    // Create a new customer
    const customer = new Customer(body);
    await customer.save();

    return NextResponse.json(customer, { status: 201 });
  } catch (error: any) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { message: 'Failed to create customer', error: error.message },
      { status: 500 }
    );
  }
}
