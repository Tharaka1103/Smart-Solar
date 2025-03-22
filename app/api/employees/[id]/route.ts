import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Employee from '@/models/Employee';
import { verifyJwt } from '@/lib/edge-jwt';

// Get a single employee
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    
    const employee = await Employee.findById(params.id);
    
    if (!employee) {
      return NextResponse.json(
        { message: 'Employee not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(employee);
  } catch (error: any) {
    console.error('Error fetching employee:', error);
    return NextResponse.json(
      { message: 'Error fetching employee', error: error.message },
      { status: 500 }
    );
  }
}

// Update an employee
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Verify the token
    await verifyJwt(token);
    
    await connectToDatabase();
    
    const data = await req.json();
    
    const employee = await Employee.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!employee) {
      return NextResponse.json(
        { message: 'Employee not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(employee);
  } catch (error: any) {
    console.error('Error updating employee:', error);
    return NextResponse.json(
      { message: 'Error updating employee', error: error.message },
      { status: 500 }
    );
  }
}

// Delete an employee
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Verify the token
    await verifyJwt(token);
    
    await connectToDatabase();
    
    const employee = await Employee.findByIdAndDelete(params.id);
    
    if (!employee) {
      return NextResponse.json(
        { message: 'Employee not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Employee deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting employee:', error);
    return NextResponse.json(
      { message: 'Error deleting employee', error: error.message },
      { status: 500 }
    );
  }
}
