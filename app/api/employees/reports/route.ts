import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Employee from '@/models/Employee';
import { verifyJwt } from '@/lib/edge-jwt';
import jsPDF from 'jspdf';
import nodemailer from 'nodemailer';
import { format, parseISO } from 'date-fns';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}
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

// Company details for reports
const COMPANY = {
  name: "Luminex Solar (Pvt) Ltd",
  logo: "", // Base64 encoded logo could be added here
  address: "123 Solar Avenue, Colombo 05, Sri Lanka",
  phone: "+94 11 2345678",
  email: "info@luminexsolar.com",
  website: "www.luminexsolar.com",
  regNumber: "REG123456789"
};

// Generate PDF for employees list
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
    const employeeId = searchParams.get('employeeId');
    const yearParam = searchParams.get('year');
    const monthParam = searchParams.get('month');
    const customPeriod = searchParams.get('customPeriod') === 'true';
    
    // If employeeId is provided, generate salary report
    if (employeeId && yearParam && monthParam) {
      return generateSalaryReport(
        employeeId, 
        parseInt(yearParam), 
        parseInt(monthParam),
        customPeriod
      );
    }
    
    // Otherwise generate employee list report
    // Build query
    let query: any = {};
    if (role) query.role = role;
    
    const employees = await Employee.find(query).sort({ name: 1 });
    
    // Generate PDF using jsPDF
    const doc = new jsPDF();
    
    // Add company header
    addCompanyHeader(doc);
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80); // Dark blue heading
    doc.text('Employee Report', 105, 40, { align: 'center' });
    
    if (role) {
      doc.setFontSize(14);
      doc.text(`Role: ${role}`, 105, 50, { align: 'center' });
    }
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100); // Gray text
    doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 105, 60, { align: 'center' });
    
    // Create table for employees
    // @ts-ignore - jspdf-autotable adds this method to jsPDF
    doc.autoTable({
      startY: 70,
      head: [['Name', 'Email', 'Role', 'Contact', 'Hourly Rate']],
      body: employees.map(emp => [
        emp.name,
        emp.email,
        emp.role,
        emp.contact,
        `LKR ${emp.hourlyRate.toFixed(2)}`
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [41, 128, 185], // Blue header
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240] // Light gray for alternate rows
      },
      margin: { top: 70 }
    });
    
    // Add footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `${COMPANY.name} - Confidential | Page ${i} of ${pageCount}`, 
        105, 
        doc.internal.pageSize.height - 10, 
        { align: 'center' }
      );
    }
    
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
// Helper function to add company header to PDF
function addCompanyHeader(doc: jsPDF) {
  // Add company logo (if available)
  // if (COMPANY.logo) {
  //   doc.addImage(COMPANY.logo, 'PNG', 20, 10, 40, 15);
  // }
  
  // Add company name and details
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(41, 128, 185); // Blue color for company name
  doc.text(COMPANY.name, 20, 20);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100); // Gray for company details
  doc.text(COMPANY.address, 20, 25);
  doc.text(`Phone: ${COMPANY.phone} | Email: ${COMPANY.email}`, 20, 30);
  doc.text(`Website: ${COMPANY.website} | Reg: ${COMPANY.regNumber}`, 20, 35);
  
  // Add horizontal line
  doc.setDrawColor(220, 220, 220); // Light gray line
  doc.line(20, 37, 190, 37);
}

// Generate salary report for a specific employee
// Inside the generateSalaryReport function
async function generateSalaryReport(
  employeeId: string, 
  year: number, 
  month: number,
  customPeriod = false
) {
  try {
    const employee = await Employee.findById(employeeId);
    
    if (!employee) {
      return NextResponse.json(
        { message: 'Employee not found' },
        { status: 404 }
      );
    }
    
    // Define attendance period
    let periodLabel: string;
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'];
    
    if (customPeriod) {
      // Custom period: 25th of previous month to 25th of current month
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      
      periodLabel = `${monthNames[prevMonth]} 25, ${prevYear} - ${monthNames[month]} 25, ${year}`;
    } else {
      periodLabel = `${monthNames[month]} ${year}`;
    }
    
    // Get attendance data from specified period - with defensive programming
    let attendanceEntries: any[] = [];
    let totalHours = 0;
    let totalSalary = 0;
    
    try {
      if (customPeriod) {
        // For custom period, we need to collect entries from both months
        const prevMonth = month === 0 ? 11 : month - 1;
        const prevYear = month === 0 ? year - 1 : year;
        
        // Get previous month's attendance - safely with null checks
        if (employee.attendance && employee.attendance.length > 0) {
          const prevMonthAttendance = employee.attendance.find(
            (a: any) => a.year === prevYear && a.month === prevMonth
          );
          
          if (prevMonthAttendance && Array.isArray(prevMonthAttendance.entries)) {
            const prevMonthEntries = prevMonthAttendance.entries.filter((entry: any) => {
              try {
                const entryDate = new Date(entry.date);
                return entryDate.getDate() >= 25;
              } catch (err) {
                console.error('Error processing prev month entry date:', err);
                return false;
              }
            });
            
            attendanceEntries = [...attendanceEntries, ...prevMonthEntries];
          }
          
          // Get current month's attendance - safely with null checks
          const currentMonthAttendance = employee.attendance.find(
            (a: any) => a.year === year && a.month === month
          );
          
          if (currentMonthAttendance && Array.isArray(currentMonthAttendance.entries)) {
            const currentMonthEntries = currentMonthAttendance.entries.filter((entry: any) => {
              try {
                const entryDate = new Date(entry.date);
                return entryDate.getDate() <= 25;
              } catch (err) {
                console.error('Error processing current month entry date:', err);
                return false;
              }
            });
            
            attendanceEntries = [...attendanceEntries, ...currentMonthEntries];
            
            // If we have a manual salary adjustment in either month, use it
            if (currentMonthAttendance.manualSalaryAdjustment) {
              totalSalary = currentMonthAttendance.totalSalary || 0;
            }
          }
        }
      } else {
        // For regular month view
        if (employee.attendance && employee.attendance.length > 0) {
          const attendance = employee.attendance.find(
            (a: any) => a.year === year && a.month === month
          );
          
          if (attendance) {
            attendanceEntries = Array.isArray(attendance.entries) ? attendance.entries : [];
            totalHours = typeof attendance.totalHours === 'number' ? attendance.totalHours : 0;
            totalSalary = typeof attendance.totalSalary === 'number' ? attendance.totalSalary : 0;
          }
        }
      }
    } catch (entriesError) {
      console.error('Error processing attendance entries:', entriesError);
      // Continue with empty data rather than failing
      attendanceEntries = [];
      totalHours = 0;
      totalSalary = 0;
    }
    
    // Sort entries by date - safely
    try {
      attendanceEntries.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    } catch (sortError) {
      console.error('Error sorting attendance entries:', sortError);
      // Continue with unsorted data
    }
    
    // Calculate total hours and salary if needed
    if (totalHours === 0 || totalSalary === 0) {
      try {
        totalHours = 0;
        attendanceEntries.forEach(entry => {
          if (!entry.isLeave && typeof entry.hoursWorked === 'number') {
            totalHours += entry.hoursWorked;
          }
        });
        
        totalSalary = totalHours * (employee.hourlyRate || 0);
      } catch (calcError) {
        console.error('Error calculating totals:', calcError);
        totalHours = 0;
        totalSalary = 0;
      }
    }
    
    // Generate PDF using jsPDF with more professional design
    const doc = new jsPDF();
    
    // Add company header
    addCompanyHeader(doc);
    
    // Add salary report title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(44, 62, 80); // Dark blue heading
    doc.text('Salary Report', 105, 45, { align: 'center' });
    
    // Add employee details in a styled box
    doc.setFillColor(240, 240, 240); // Light gray background
    doc.roundedRect(20, 50, 170, 40, 3, 3, 'F');
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(44, 62, 80);
    doc.text('Employee Details', 25, 60);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    
    // Left column
    doc.text(`Name: ${employee.name}`, 25, 70);
    doc.text(`Email: ${employee.email}`, 25, 77);
    doc.text(`Role: ${employee.role}`, 25, 84);
    
    // Right column
    doc.text(`Employee ID: ${employee._id.toString().slice(-8)}`, 110, 70);
    doc.text(`Contact: ${employee.contact}`, 110, 77);
    doc.text(`Joining Date: ${format(new Date(employee.joiningDate), 'PPP')}`, 110, 84);
    
    // Salary period and details
    doc.setFillColor(230, 240, 250); // Light blue background
    doc.roundedRect(20, 95, 170, 45, 3, 3, 'F');
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(44, 62, 80);
    doc.text('Salary Details', 25, 105);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Salary details
    doc.text(`Period: ${periodLabel}`, 25, 115);
    doc.text(`Hourly Rate: LKR ${employee.hourlyRate.toFixed(2)}`, 25, 122);
    doc.text(`Total Hours Worked: ${totalHours}`, 25, 129);
    
    // Highlight total salary
    doc.setFillColor(41, 128, 185); // Blue background for salary
    doc.roundedRect(110, 115, 75, 18, 3, 3, 'F');
    
    doc.setTextColor(255); // White text for salary
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Total Salary', 115, 123);
    doc.setFontSize(14);
    doc.text(`LKR ${totalSalary.toFixed(2)}`, 115, 130);
    
    // Bank details if available
    if (employee.bankDetails && (employee.bankDetails.accountNumber || employee.bankDetails.bankName)) {
      doc.setFillColor(240, 240, 240); // Light gray background
      doc.roundedRect(20, 145, 170, 25, 3, 3, 'F');
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(44, 62, 80);
      doc.text('Bank Details', 25, 155);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      
      const bankInfo = [];
      if (employee.bankDetails.bankName) bankInfo.push(`Bank: ${employee.bankDetails.bankName}`);
      if (employee.bankDetails.branch) bankInfo.push(`Branch: ${employee.bankDetails.branch}`);
      
      doc.text(bankInfo.join(' | '), 25, 165);
    }
    
    // Add attendance details table
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(44, 62, 80);
    doc.text('Attendance Details', 105, 180, { align: 'center' });
    
    // Create attendance table
    // @ts-ignore - jspdf-autotable extends jsPDF
    doc.autoTable({
      startY: 185,
      head: [['Date', 'Day', 'Status', 'Hours', 'Amount (LKR)']],
      body: attendanceEntries.map((entry: any) => {
        const entryDate = new Date(entry.date);
        const dayOfWeek = format(entryDate, 'EEE');
        const dateStr = format(entryDate, 'MMM dd, yyyy');
        const status = entry.isLeave ? 'Leave' : 'Present';
        const hours = entry.isLeave ? '-' : entry.hoursWorked.toString();
        const amount = entry.isLeave ? '-' : (entry.hoursWorked * employee.hourlyRate).toFixed(2);
        
        return [dateStr, dayOfWeek, status, hours, amount];
      }),
      theme: 'grid',
      headStyles: {
        fillColor: [41, 128, 185], // Blue header
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240] // Light gray for alternate rows
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 20 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 40 }
      },
      margin: { left: 20, right: 20 }
    });
    
    // Add summary and notes
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    // Check if we need a new page
    if (finalY > 250) {
      doc.addPage();
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(44, 62, 80);
      doc.text('Summary', 105, 20, { align: 'center' });
      
      // Add summary box
      doc.setFillColor(240, 240, 240);
      doc.roundedRect(20, 25, 170, 50, 3, 3, 'F');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      
      doc.text('Days Present: ' + attendanceEntries.filter((e: any) => !e.isLeave).length, 25, 35);
      doc.text('Leave Days: ' + attendanceEntries.filter((e: any) => e.isLeave).length, 25, 42);
      doc.text('Total Working Hours: ' + totalHours, 25, 49);
      doc.text('Hourly Rate: LKR ' + employee.hourlyRate.toFixed(2), 25, 56);
      doc.text('Total Salary: LKR ' + totalSalary.toFixed(2), 25, 63);
    } else {
      // Add summary box
      doc.setFillColor(240, 240, 240);
      doc.roundedRect(20, finalY, 170, 50, 3, 3, 'F');
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(44, 62, 80);
      doc.text('Summary', 25, finalY + 10);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      
      doc.text('Days Present: ' + attendanceEntries.filter((e: any) => !e.isLeave).length, 25, finalY + 20);
      doc.text('Leave Days: ' + attendanceEntries.filter((e: any) => e.isLeave).length, 25, finalY + 27);
      doc.text('Total Working Hours: ' + totalHours, 25, finalY + 34);
      doc.text('Hourly Rate: LKR ' + employee.hourlyRate.toFixed(2), 25, finalY + 41);
      doc.text('Total Salary: LKR ' + totalSalary.toFixed(2), 25, finalY + 48);
    }
    
    // Add footer with page numbers
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `${COMPANY.name} - Confidential | Page ${i} of ${pageCount}`, 
        105, 
        doc.internal.pageSize.height - 10, 
        { align: 'center' }
      );
    }
    
    // Add signature section on last page
    doc.setPage(pageCount);
    const pageHeight = doc.internal.pageSize.height;
    
    doc.setDrawColor(100, 100, 100);
    
    // HR signature
    doc.line(30, pageHeight - 30, 80, pageHeight - 30);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('HR Signature', 55, pageHeight - 25, { align: 'center' });
    
    // Employee signature
    doc.line(120, pageHeight - 30, 170, pageHeight - 30);
    doc.text('Employee Signature', 145, pageHeight - 25, { align: 'center' });
    
    // Convert to buffer
    const buffer = Buffer.from(doc.output('arraybuffer'));
    
    const response = new NextResponse(buffer);
    response.headers.set('Content-Type', 'application/pdf');
    response.headers.set('Content-Disposition', `attachment; filename=salary-report-${employee.name.replace(/\s+/g, '-')}-${month}-${year}.pdf`);
    
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
    const { employeeId, year, month, sendEmail, customPeriod = false } = data;
    
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
    
    // Define attendance period
    let periodLabel: string;
    let startDate: Date;
    let endDate: Date;
    
    if (customPeriod) {
      // Custom period: 25th of previous month to 25th of current month
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      
      startDate = new Date(prevYear, prevMonth, 25);
      endDate = new Date(year, month, 25);
      
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'];
      
      periodLabel = `${monthNames[prevMonth]} 25, ${prevYear} - ${monthNames[month]} 25, ${year}`;
    } else {
      // Regular month period
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'];
      
      startDate = new Date(year, month, 1);
      endDate = new Date(year, month + 1, 0); // Last day of month
      
      periodLabel = `${monthNames[month]} ${year}`;
    }
    
    // Generate the PDF (same code as above)
    // Generate PDF using jsPDF
    const doc = new jsPDF();
    
    // Add company header and professional formatting similar to the GET method
    // This is a simplified version for brevity
    addCompanyHeader(doc);
    
    // Add salary report title and content
    doc.setFontSize(20);
    doc.text('Salary Report', 105, 40, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Employee: ${employee.name}`, 20, 60);
    doc.text(`Period: ${periodLabel}`, 20, 70);
    
    // Add other content as in the GET method...
    
    // Generate PDF buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    
    // If sending email
    if (sendEmail && employee.email) {
      // Send email with attachment
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || COMPANY.email,
        to: employee.email,
        subject: `Salary Report - ${periodLabel}`,
        text: `Dear ${employee.name},\n\nPlease find attached your salary report for ${periodLabel}.\n\nBest regards,\n${COMPANY.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #3498db; color: white; padding: 20px; text-align: center;">
              <h2 style="margin: 0;">${COMPANY.name}</h2>
            </div>
            <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
              <p>Dear <strong>${employee.name}</strong>,</p>
              <p>Please find attached your salary report for <strong>${periodLabel}</strong>.</p>
              <p>This is an automated email. Please do not reply to this message.</p>
              <p>If you have any questions regarding your salary report, please contact our HR department.</p>
              <p>Best regards,<br/>${COMPANY.name}</p>
            </div>
            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #777;">
              <p>${COMPANY.address}<br/>
              Phone: ${COMPANY.phone} | Email: ${COMPANY.email}<br/>
              &copy; ${new Date().getFullYear()} ${COMPANY.name}. All rights reserved.</p>
            </div>
          </div>
        `,
        attachments: [
          {
            filename: `salary-report-${employee.name.replace(/\s+/g, '-')}-${periodLabel.replace(/\s+/g, '-')}.pdf`,
            content: pdfBuffer
          }
        ]
      });
      
      return NextResponse.json({ message: 'Report generated and sent successfully' });
    } else {
      // Return PDF if email not requested
      const response = new NextResponse(pdfBuffer);
      response.headers.set('Content-Type', 'application/pdf');
      response.headers.set('Content-Disposition', `attachment; filename=salary-report-${employee.name.replace(/\s+/g, '-')}-${periodLabel.replace(/\s+/g, '-')}.pdf`);
      
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
