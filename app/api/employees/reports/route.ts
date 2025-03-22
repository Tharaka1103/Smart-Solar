import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Employee from '@/models/Employee';
import { verifyJwt } from '@/lib/edge-jwt';
import jsPDF from 'jspdf';
import nodemailer from 'nodemailer';
import { Readable } from 'stream';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

// Generate PDF for employees list
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
    const employeeId = searchParams.get('employeeId');
    const yearParam = searchParams.get('year');
    const monthParam = searchParams.get('month');
    
    // If employeeId is provided, generate salary report
    if (employeeId && yearParam && monthParam) {
      return generateSalaryReport(employeeId, parseInt(yearParam), parseInt(monthParam));
    }
    
    // Otherwise generate employee list report
    // Build query
    let query: any = {};
    if (role) query.role = role;
    
    const employees = await Employee.find(query).sort({ name: 1 });
    
    // Generate PDF using jsPDF
    const doc = new jsPDF();
    
    // Add content to the PDF
    doc.setFontSize(20);
    doc.text('Employee Report', 105, 20, { align: 'center' });
    
    if (role) {
      doc.setFontSize(16);
      doc.text(`Role: ${role}`, 105, 30, { align: 'center' });
    }
    
    doc.setFontSize(12);
    let yPos = 40;
    
    employees.forEach((employee, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.text(`${index + 1}. ${employee.name}`, 20, yPos);
      yPos += 7;
      doc.text(`   Email: ${employee.email}`, 20, yPos);
      yPos += 7;
      doc.text(`   Role: ${employee.role}`, 20, yPos);
      yPos += 7;
      doc.text(`   Contact: ${employee.contact}`, 20, yPos);
      yPos += 7;
      doc.text(`   Hourly Rate: Rs. ${employee.hourlyRate.toFixed(2)}`, 20, yPos);
      yPos += 12;
    });
    
    // Convert to buffer
    const buffer = Buffer.from(doc.output('arraybuffer'));
    
    const response = new NextResponse(buffer);
    response.headers.set('Content-Type', 'application/pdf');
    response.headers.set('Content-Disposition', 'attachment; filename=employees-report.pdf');
    
    return response;
  } catch (error: any) {
    console.error('Error generating employee report:', error);
    return NextResponse.json(
      { message: 'Error generating employee report', error: error.message },
      { status: 500 }
    );
  }
}

// Generate salary report for a specific employee
async function generateSalaryReport(employeeId: string, year: number, month: number) {
  try {
    const employee = await Employee.findById(employeeId);
    
    if (!employee) {
      return NextResponse.json(
        { message: 'Employee not found' },
        { status: 404 }
      );
    }
    
    // Find attendance for the specified month
    const attendance = employee.attendance.find(
        (      a: { year: number; month: number; }) => a.year === year && a.month === month
    );
    
    if (!attendance) {
      return NextResponse.json(
        { message: 'Attendance record not found for this month' },
        { status: 404 }
      );
    }
    
    // Format month name
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Generate PDF using jsPDF
    const doc = new jsPDF();
    
    // Add content to the PDF
    doc.setFontSize(20);
    doc.text('Salary Report', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text(`Employee: ${employee.name}`, 20, 40);
    doc.setFontSize(12);
    doc.text(`Email: ${employee.email}`, 20, 50);
    doc.text(`Role: ${employee.role}`, 20, 60);
    doc.text(`Period: ${monthNames[month]} ${year}`, 20, 70);
    
    doc.text(`Hourly Rate: Rs. ${employee.hourlyRate.toFixed(2)}`, 20, 85);
    doc.text(`Total Hours Worked: ${attendance.totalHours}`, 20, 95);
    doc.text(`Total Salary: Rs. ${attendance.totalSalary.toFixed(2)}`, 20, 105);
    
    // Add attendance details table
    doc.setFontSize(14);
    doc.text('Attendance Details', 20, 120);
    
    // Sort entries by date
    const sortedEntries = [...attendance.entries].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Table headers
    let yPos = 130;
    doc.setFontSize(10);
    doc.text('Date', 20, yPos);
    doc.text('Hours Worked', 80, yPos);
    doc.text('Status', 140, yPos);
    doc.text('Earnings', 180, yPos);
    yPos += 5;
    
    // Draw header line
    doc.line(20, yPos, 190, yPos);
    yPos += 10;
    
    // Table rows
    sortedEntries.forEach(entry => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      const date = new Date(entry.date);
      const dateStr = date.toLocaleDateString();
      const status = entry.isLeave ? 'Leave' : 'Present';
      const earnings = entry.isLeave ? '-' : `Rs. ${(entry.hoursWorked * employee.hourlyRate).toFixed(2)}`;
      
      doc.text(dateStr, 20, yPos);
      doc.text(entry.isLeave ? '-' : entry.hoursWorked.toString(), 80, yPos);
      doc.text(status, 140, yPos);
      doc.text(earnings, 180, yPos);
      
      yPos += 10;
    });
    
    // Convert to buffer
    const buffer = Buffer.from(doc.output('arraybuffer'));
    
    const response = new NextResponse(buffer);
    response.headers.set('Content-Type', 'application/pdf');
    response.headers.set('Content-Disposition', `attachment; filename=salary-report-${employee.name.replace(/\s+/g, '-')}-${monthNames[month]}-${year}.pdf`);
    
    return response;
  } catch (error: any) {
    console.error('Error generating salary report:', error);
    return NextResponse.json(
      { message: 'Error generating salary report', error: error.message },
      { status: 500 }
    );
  }
}

// Generate and send salary report by email
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const data = await req.json();
    const { employeeId, year, month, sendEmail } = data;
    
    if (!employeeId || year === undefined || month === undefined) {
      return NextResponse.json(
        { message: 'Employee ID, year and month are required' },
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
    
    // Find attendance for the specified month
    const attendance = employee.attendance.find(
        (      a: { year: any; month: any; }) => a.year === year && a.month === month
    );
    
    if (!attendance) {
      return NextResponse.json(
        { message: 'Attendance record not found for this month' },
        { status: 404 }
      );
    }
    
    // Format month name
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Generate PDF using jsPDF
    const doc = new jsPDF();
    
    // Add content to the PDF (same as in GET method)
    doc.setFontSize(20);
    doc.text('Salary Report', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text(`Employee: ${employee.name}`, 20, 40);
    doc.setFontSize(12);
    doc.text(`Email: ${employee.email}`, 20, 50);
    doc.text(`Role: ${employee.role}`, 20, 60);
    doc.text(`Period: ${monthNames[month]} ${year}`, 20, 70);
    
    doc.text(`Hourly Rate: Rs. ${employee.hourlyRate.toFixed(2)}`, 20, 85);
    doc.text(`Total Hours Worked: ${attendance.totalHours}`, 20, 95);
    doc.text(`Total Salary: Rs. ${attendance.totalSalary.toFixed(2)}`, 20, 105);
    
    // Rest of PDF generation same as above
    
    // If sending email
    if (sendEmail && employee.email) {
      const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
      
      // Send email with attachment
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: employee.email,
        subject: `Salary Report - ${monthNames[month]} ${year}`,
        text: `Dear ${employee.name},\n\nPlease find attached your salary report for ${monthNames[month]} ${year}.\n\nBest regards,\nLuminex Solar`,
        attachments: [
          {
            filename: `salary-report-${monthNames[month]}-${year}.pdf`,
            content: pdfBuffer
          }
        ]
      });
      
      return NextResponse.json({ message: 'Report generated and sent successfully' });
    } else {
      // Return PDF if email not requested
      const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
      
      const response = new NextResponse(pdfBuffer);
      response.headers.set('Content-Type', 'application/pdf');
      response.headers.set('Content-Disposition', `attachment; filename=salary-report-${employee.name.replace(/\s+/g, '-')}-${monthNames[month]}-${year}.pdf`);
      
      return response;
    }
  } catch (error: any) {
    console.error('Error with salary report:', error);
    return NextResponse.json(
      { message: 'Error with salary report', error: error.message },
      { status: 500 }
    );
  }
}