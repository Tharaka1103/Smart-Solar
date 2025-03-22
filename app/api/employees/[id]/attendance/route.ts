import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Employee from '@/models/Employee';
import { verifyJwt } from '@/lib/edge-jwt';

// Get attendance for an employee
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const yearParam = searchParams.get('year');
    const monthParam = searchParams.get('month');
    
    const year = yearParam ? parseInt(yearParam) : new Date().getFullYear();
    const month = monthParam ? parseInt(monthParam) : new Date().getMonth();
    
    const employee = await Employee.findById(params.id);
    
    if (!employee) {
      return NextResponse.json(
        { message: 'Employee not found' },
        { status: 404 }
      );
    }
    
    // Find attendance for the specified month
    const attendance = employee.attendance.find(
        (      a: { year: number; month: number; }) => a.year === year && a.month === month
    ) || { year, month, entries: [], totalHours: 0, totalSalary: 0 };
    
    return NextResponse.json(attendance);
  } catch (error: any) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json(
      { message: 'Error fetching attendance', error: error.message },
      { status: 500 }
    );
  }
}

// Update attendance for an employee
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Verify the token
    await verifyJwt(token);
    
    await connectToDatabase();
    
    const data = await req.json();
    const { year, month, entries } = data;
    
    if (!year || month === undefined || !entries) {
      return NextResponse.json(
        { message: 'Year, month and entries are required' },
        { status: 400 }
      );
    }
    
    const employee = await Employee.findById(params.id);
    
    if (!employee) {
      return NextResponse.json(
        { message: 'Employee not found' },
        { status: 404 }
      );
    }
    
    // Calculate total hours and salary
    let totalHours = 0;
    entries.forEach((entry: any) => {
      if (!entry.isLeave) {
        totalHours += entry.hoursWorked;
      }
    });
    
    const totalSalary = totalHours * employee.hourlyRate;
    
    // Find if attendance for this month already exists
    const attendanceIndex = employee.attendance.findIndex(
        (      a: { year: any; month: any; }) => a.year === year && a.month === month
    );
    
    if (attendanceIndex >= 0) {
      // Update existing attendance
      employee.attendance[attendanceIndex] = {
        year,
        month,
        entries,
        totalHours,
        totalSalary
      };
    } else {
      // Add new attendance
      employee.attendance.push({
        year,
        month,
        entries,
        totalHours,
        totalSalary
      });
    }
    
    await employee.save();
    
    return NextResponse.json({
      message: 'Attendance updated successfully',
      attendance: {
        year,
        month,
        entries,
        totalHours,
        totalSalary
      }
    });
  } catch (error: any) {
    console.error('Error updating attendance:', error);
    return NextResponse.json(
      { message: 'Error updating attendance', error: error.message },
      { status: 500 }
    );
  }
}
