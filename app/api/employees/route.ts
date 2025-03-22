import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Employee from '@/models/Employee';
import { verifyJwt } from '@/lib/edge-jwt';

// Get all employees
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get query parameters for filtering
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
    const search = searchParams.get('search');
    
    // Build query
    let query: any = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const employees = await Employee.find(query).sort({ name: 1 });
    
    return NextResponse.json(employees);
  } catch (error: any) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { message: 'Error fetching employees', error: error.message },
      { status: 500 }
    );
  }
}

// Create a new employee
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Verify the token
    await verifyJwt(token);
    
    await connectToDatabase();
    
    const data = await req.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.role || !data.contact || !data.address || !data.hourlyRate) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Check for existing employee with same email
    const existingEmployee = await Employee.findOne({ email: data.email });
    if (existingEmployee) {
      return NextResponse.json(
        { message: 'Employee with this email already exists' },
        { status: 400 }
      );
    }
    
    const employee = new Employee(data);
    await employee.save();
    
    return NextResponse.json(employee, { status: 201 });
  } catch (error: any) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { message: 'Error creating employee', error: error.message },
      { status: 500 }
    );
  }
}
