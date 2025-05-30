import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Employee from '@/models/Employee';
import { verifyJwt } from '@/lib/edge-jwt';

// Get a single employee
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    
    await connectToDatabase();
    
    const employee = await Employee.findOne({ 
      _id: id, 
      isDeleted: { $ne: true } 
    });
    
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
export async function PUT(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    
    const token = req.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Verify the token
    await verifyJwt(token);
    
    await connectToDatabase();
    
    const data = await req.json();
    
    const employee = await Employee.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
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

// Delete an employee (hard delete)
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    
    const token = req.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Verify the token
    await verifyJwt(token);
    
    await connectToDatabase();
    
    const employee = await Employee.findByIdAndDelete(id);
    
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