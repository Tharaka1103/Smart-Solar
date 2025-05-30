import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Employee from '@/models/Employee';
import { verifyJwt } from '@/lib/edge-jwt';

// Get attendance for an employee
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams, pathname } = new URL(req.url);
    const employeeId = pathname.split('/')[3];
    const yearParam = searchParams.get('year');
    const monthParam = searchParams.get('month');
    const periodType = searchParams.get('periodType') as 'regular' | 'custom' || 'regular';
    
    const year = yearParam ? parseInt(yearParam) : new Date().getFullYear();
    const month = monthParam ? parseInt(monthParam) : new Date().getMonth();
    
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
    
    // Find attendance for specific period
    const attendance = employee.attendance.find(
      (a: any) => a.year === year && a.month === month && a.periodType === periodType
    ) || { 
      year, 
      month, 
      periodType, 
      entries: [], 
      totalWorkingDays: 0, 
      totalSalary: 0,
      startDate: null,
      endDate: null
    };
    
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
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    await verifyJwt(token);
    await connectToDatabase();
    
    const { pathname } = new URL(req.url);
    const employeeId = pathname.split('/')[3];
    
    const data = await req.json();
    const { 
      year, 
      month, 
      periodType, 
      entries, 
      overrideSalary, 
      useOverrideSalary,
      startDate,
      endDate
    } = data;
    
    if (!year || month === undefined || !entries || !periodType) {
      return NextResponse.json(
        { message: 'Year, month, periodType and entries are required' },
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
    
    // Calculate total working days and salary
    let totalWorkingDays = 0;
    let totalSalary = 0;
    
    entries.forEach((entry: any) => {
      switch (entry.type) {
        case 'fullday':
          totalWorkingDays += 1;
          totalSalary += employee.dailyRate;
          break;
        case 'halfday':
          totalWorkingDays += 0.5;
          totalSalary += employee.dailyRate / 2;
          break;
        case 'custom':
          totalWorkingDays += 1;
          totalSalary += entry.customSalary || 0;
          break;
        case 'absent':
        default:
          // No change for absent days
          break;
      }
    });
    
    // Use override salary if specified
    if (useOverrideSalary && overrideSalary !== undefined) {
      totalSalary = overrideSalary;
    }
    
    // Find if attendance for this period already exists
    const attendanceIndex = employee.attendance.findIndex(
      (a: any) => a.year === year && a.month === month && a.periodType === periodType
    );
    
    const attendanceData = {
      year,
      month,
      periodType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      entries: entries.map((entry: any) => ({
        ...entry,
        date: new Date(entry.date)
      })),
      totalWorkingDays,
      totalSalary,
      overrideSalary: useOverrideSalary ? overrideSalary : undefined,
      useOverrideSalary: useOverrideSalary || false
    };
    
    if (attendanceIndex >= 0) {
      // Update existing attendance
      employee.attendance[attendanceIndex] = attendanceData;
    } else {
      // Add new attendance
      employee.attendance.push(attendanceData);
    }
    
    await employee.save();
    
    return NextResponse.json({
      message: 'Attendance updated successfully',
      attendance: attendanceData
    });
  } catch (error: any) {
    console.error('Error updating attendance:', error);
    return NextResponse.json(
      { message: 'Error updating attendance', error: error.message },
      { status: 500 }
    );
  }
}

// Debug version to see what's happening
export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    await verifyJwt(token);
    await connectToDatabase();
    
    const { pathname } = new URL(req.url);
    const employeeId = pathname.split('/')[3];
    
    const data = await req.json();
    const { year, month, periodType } = data;
    
    console.log('Delete request data:', { year, month, periodType, employeeId });
    
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
    
    console.log('Employee attendance before deletion:', employee.attendance.length);
    console.log('Looking for attendance with:', { year, month, periodType });
    
    // Find the attendance record
    const attendanceIndex = employee.attendance.findIndex(
      (a: any) => {
        console.log('Checking attendance:', { 
          aYear: a.year, 
          aMonth: a.month, 
          aPeriodType: a.periodType,
          match: a.year === year && a.month === month && a.periodType === periodType
        });
        return a.year === year && a.month === month && a.periodType === periodType;
      }
    );
    
    console.log('Found attendance index:', attendanceIndex);
    
    if (attendanceIndex === -1) {
      return NextResponse.json(
        { message: 'Attendance record not found' },
        { status: 404 }
      );
    }
    
    // Store the attendance record before deletion
    const deletedAttendance = employee.attendance[attendanceIndex];
    console.log('Deleting attendance:', deletedAttendance);
    
    // Remove the attendance record from the array
    employee.attendance.splice(attendanceIndex, 1);
    console.log('Employee attendance after splice:', employee.attendance.length);
    
    // Save the employee
    await employee.save({ validateBeforeSave: false });
    console.log('Employee saved successfully');
    
    return NextResponse.json({
      message: 'Attendance deleted successfully',
      deletedAttendance: deletedAttendance
    });
  } catch (error: any) {
    console.error('Error deleting attendance:', error);
    return NextResponse.json(
      { message: 'Error deleting attendance', error: error.message },
      { status: 500 }
    );
  }
}
