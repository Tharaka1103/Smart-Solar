import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Employee from '@/models/Employee';
import { verifyJwt } from '@/lib/edge-jwt';

// Get attendance for an employee
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams, pathname } = new URL(req.url);
    const employeeId = pathname.split('/')[3]; // Get ID from URL path
    const yearParam = searchParams.get('year');
    const monthParam = searchParams.get('month');
    const customPeriod = searchParams.get('customPeriod') === 'true';
    
    const year = yearParam ? parseInt(yearParam) : new Date().getFullYear();
    const month = monthParam ? parseInt(monthParam) : new Date().getMonth();
    
    const employee = await Employee.findById(employeeId);
    
    if (!employee) {
      return NextResponse.json(
        { message: 'Employee not found' },
        { status: 404 }
      );
    }
    
    // In the GET function where we process custom periods
    if (customPeriod) {
      // Custom period from 25th of previous month to 25th of current month
      const attendance: {
        year: number;
        month: number;
        entries: Array<any>;
        totalHours: number;
        totalSalary: number;
        customPeriod: boolean;
      } = {
        year,
        month,
        entries: [],
        totalHours: 0,
        totalSalary: 0,
        customPeriod: true
      };

      try {
        // Find entries from the 25th of previous month
        let prevMonth = month - 1;
        let prevYear = year;
        if (prevMonth < 0) {
          prevMonth = 11;
          prevYear = year - 1;
        }

        // Safely find and process previous month attendance
        if (employee.attendance && Array.isArray(employee.attendance)) {
          const prevMonthAttendance = employee.attendance.find(
            (a: { year: number; month: number; }) => a.year === prevYear && a.month === prevMonth
          );

          // Find entries from the current month
          const currentMonthAttendance = employee.attendance.find(
            (a: { year: number; month: number; }) => a.year === year && a.month === month
          );

          // Combine entries: from previous month (25th onwards) and current month (up to 25th)
          if (prevMonthAttendance && Array.isArray(prevMonthAttendance.entries)) {
            const prevMonthEntries = prevMonthAttendance.entries.filter((entry: any) => {
              try {
                const entryDate = new Date(entry.date);
                return entryDate.getDate() >= 25;
              } catch (err) {
                console.error('Error processing entry date:', err);
                return false;
              }
            });
            attendance.entries = [...attendance.entries, ...prevMonthEntries];
          }

          if (currentMonthAttendance && Array.isArray(currentMonthAttendance.entries)) {
            const currentMonthEntries = currentMonthAttendance.entries.filter((entry: any) => {
              try {
                const entryDate = new Date(entry.date);
                return entryDate.getDate() <= 25;
              } catch (err) {
                console.error('Error processing entry date:', err);
                return false;
              }
            });
            attendance.entries = [...attendance.entries, ...currentMonthEntries];
          }
        }

        // Calculate total hours and salary with proper error handling
        attendance.entries.forEach((entry: any) => {
          if (!entry.isLeave && typeof entry.hoursWorked === 'number') {
            attendance.totalHours += entry.hoursWorked;
          }
        });
        
        attendance.totalSalary = attendance.totalHours * (employee.hourlyRate || 0);
        
        return NextResponse.json(attendance);
      } catch (error) {
        console.error('Error processing custom period attendance:', error);
        // Return empty data instead of failing
        return NextResponse.json(attendance);
      }
    } else {
      // Regular month-based attendance
      const attendance = employee.attendance.find(
        (a: { year: number; month: number; }) => a.year === year && a.month === month
      ) || { year, month, entries: [], totalHours: 0, totalSalary: 0 };
      
      return NextResponse.json(attendance);
    }
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
    
    // Verify the token
    await verifyJwt(token);
    
    await connectToDatabase();
    
    const { pathname } = new URL(req.url);
    const employeeId = pathname.split('/')[3]; // Get ID from URL path
    
    const data = await req.json();
    const { year, month, entries, customPeriod, manualSalary } = data;
    
    if (!year || month === undefined || !entries) {
      return NextResponse.json(
        { message: 'Year, month and entries are required' },
        { status: 400 }
      );
    }
    
    const employee = await Employee.findById(employeeId);
    
    if (!employee) {
      return NextResponse.json(
        { message: 'Employee not found' },
        { status: 404 }
      );
    }
    
    // Handle custom period (25th to 25th)
    if (customPeriod) {
      // Group entries by month
      const entriesByMonth = new Map();
      
      entries.forEach((entry: any) => {
        const entryDate = new Date(entry.date);
        const entryMonth = entryDate.getMonth();
        const entryYear = entryDate.getFullYear();
        
        const key = `${entryYear}-${entryMonth}`;
        if (!entriesByMonth.has(key)) {
          entriesByMonth.set(key, []);
        }
        
        entriesByMonth.get(key).push(entry);
      });
      
      // Update entries for each month
      for (const [key, monthEntries] of entriesByMonth.entries()) {
        const [entryYear, entryMonth] = key.split('-').map(Number);
        
        // Calculate total hours for this month's entries
        let totalHours = 0;
        monthEntries.forEach((entry: any) => {
          if (!entry.isLeave) {
            totalHours += entry.hoursWorked;
          }
        });
        
        const totalSalary = manualSalary || (totalHours * employee.hourlyRate);
        
        // Find if attendance for this month already exists
        const attendanceIndex = employee.attendance.findIndex(
          (a: { year: number; month: number; }) => a.year === entryYear && a.month === entryMonth
        );
        
        if (attendanceIndex >= 0) {
          // Update existing month's entries with new ones
          const currentEntries = employee.attendance[attendanceIndex].entries;
          
          // Keep entries that are not in the current update (outside of 25th-25th range)
          const remainingEntries = currentEntries.filter((entry: any) => {
            const entryDate = new Date(entry.date);
            return (entryMonth === month - 1 && entryDate.getDate() < 25) || 
                   (entryMonth === month && entryDate.getDate() > 25);
          });
          
          employee.attendance[attendanceIndex] = {
            year: entryYear,
            month: entryMonth,
            entries: [...remainingEntries, ...monthEntries],
            totalHours,
            totalSalary
          };
        } else {
          // Add new attendance month
          employee.attendance.push({
            year: entryYear,
            month: entryMonth,
            entries: monthEntries,
            totalHours,
            totalSalary
          });
        }
      }
    } else {
      // Regular monthly attendance (not custom period)
      // Calculate total hours and salary
      let totalHours = 0;
      entries.forEach((entry: any) => {
        if (!entry.isLeave) {
          totalHours += entry.hoursWorked;
        }
      });
      
      const totalSalary = manualSalary || (totalHours * employee.hourlyRate);
      
      // Find if attendance for this month already exists
      const attendanceIndex = employee.attendance.findIndex(
        (a: { year: number; month: number; }) => a.year === year && a.month === month
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
    }
    
    await employee.save();
    
    return NextResponse.json({
      message: 'Attendance updated successfully',
      attendance: {
        year,
        month,
        entries,
        totalHours: employee.attendance.find(
          (a: { year: number; month: number; }) => a.year === year && a.month === month
        )?.totalHours || 0,
        totalSalary: employee.attendance.find(
          (a: { year: number; month: number; }) => a.year === year && a.month === month
        )?.totalSalary || 0
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