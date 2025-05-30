import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Employee from '@/models/Employee';

// Check if attendance exists for a specific period
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams, pathname } = new URL(req.url);
    const employeeId = pathname.split('/')[3];
    const year = parseInt(searchParams.get('year') || '');
    const month = parseInt(searchParams.get('month') || '');
    const periodType = searchParams.get('periodType') as 'regular' | 'custom';
    
    if (!year || month === undefined || !periodType) {
      return NextResponse.json(
        { message: 'Year, month, and periodType are required' },
        { status: 400 }
      );
    }
    
    const employee = await Employee.findOne({ 
      _id: employeeId, 
      isDeleted: { $ne: true } 
    });
    
    if (!employee) {
      return NextResponse.json(
        { message: 'Employee not found' },
        { status: 404 }
      );
    }
    
    // Check if attendance exists for this period
    const existingAttendance = employee.attendance.find(
      (a: any) => a.year === year && a.month === month && a.periodType === periodType
    );
    
    return NextResponse.json({
      exists: !!existingAttendance,
      attendance: existingAttendance || null
    });
  } catch (error: any) {
    console.error('Error checking attendance:', error);
    return NextResponse.json(
      { message: 'Error checking attendance', error: error.message },
      { status: 500 }
    );
  }
}