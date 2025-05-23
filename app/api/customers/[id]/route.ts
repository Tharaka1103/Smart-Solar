import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Customer from '@/models/customer';
import mongoose from 'mongoose';

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Extract customer ID from URL
function getCustomerIdFromUrl(request: NextRequest): string {
  // Get the URL path segments
  const pathSegments = request.nextUrl.pathname.split('/');
  // The ID will be the last segment in the path /api/customers/[id]
  return pathSegments[pathSegments.length - 1];
}

// GET a specific customer
export async function GET(request: NextRequest) {
  try {
    const id = getCustomerIdFromUrl(request);

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: 'Invalid customer ID' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Find the customer by ID
    const customer = await Customer.findById(id);

    if (!customer) {
      return NextResponse.json(
        { message: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (error: any) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { message: 'Failed to fetch customer', error: error.message },
      { status: 500 }
    );
  }
}

// PUT update a specific customer
export async function PUT(request: NextRequest) {
  try {
    const id = getCustomerIdFromUrl(request);
    const body = await request.json();

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: 'Invalid customer ID' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Check if the updated email or NIC belongs to another customer
    const existingCustomer = await Customer.findOne({
      $and: [
        { _id: { $ne: id } },
        { $or: [{ email: body.email }, { nic: body.nic }] }
      ]
    });

    if (existingCustomer) {
      return NextResponse.json(
        { message: 'Another customer with this email or NIC already exists' },
        { status: 400 }
      );
    }

    // Update the customer
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedCustomer) {
      return NextResponse.json(
        { message: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCustomer);
  } catch (error: any) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { message: 'Failed to update customer', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE a specific customer
export async function DELETE(request: NextRequest) {
  try {
    const id = getCustomerIdFromUrl(request);

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: 'Invalid customer ID' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Delete the customer
    const deletedCustomer = await Customer.findByIdAndDelete(id);

    if (!deletedCustomer) {
      return NextResponse.json(
        { message: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Customer deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { message: 'Failed to delete customer', error: error.message },
      { status: 500 }
    );
  }
}
