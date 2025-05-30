import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Employee from '@/models/Employee';
import { sendEmail } from '@/lib/email';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import { addCompanyHeader, COMPANY } from '@/lib/pdfUtils';
import 'jspdf-autotable';

// Declare jsPDF autotable extension
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const data = await req.json();
    const { employeeId, year, month, customPeriod = false } = data;
    
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
    
    if (!employee.email) {
      return NextResponse.json(
        { message: 'Employee does not have an email address' },
        { status: 400 }
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
      // Regular month period
      periodLabel = `${monthNames[month]} ${year}`;
    }
    
    // Fetch attendance data for the period
    let attendanceData: { entries: any; totalSalary: any; totalHours: any; };
    
    if (customPeriod) {
      // For custom period, we need to collect entries from both months
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      
      attendanceData = {
        entries: [],
        totalHours: 0,
        totalSalary: 0
      };
      
      // Get previous month's attendance
      const prevMonthAttendance = employee.attendance.find(
        (a: any) => a.year === prevYear && a.month === prevMonth
      );
      
      if (prevMonthAttendance) {
        const prevMonthEntries = prevMonthAttendance.entries.filter((entry: any) => {
          const entryDate = new Date(entry.date);
          return entryDate.getDate() >= 25;
        });
        
        attendanceData.entries = [...attendanceData.entries, ...prevMonthEntries];
      }
      
      // Get current month's attendance
      const currentMonthAttendance = employee.attendance.find(
        (a: any) => a.year === year && a.month === month
      );
      
      if (currentMonthAttendance) {
        const currentMonthEntries = currentMonthAttendance.entries.filter((entry: any) => {
          const entryDate = new Date(entry.date);
          return entryDate.getDate() <= 25;
        });
        
        attendanceData.entries = [...attendanceData.entries, ...currentMonthEntries];
        
        // Use manual salary adjustment if available
        if (currentMonthAttendance.manualSalaryAdjustment) {
          attendanceData.totalSalary = currentMonthAttendance.totalSalary;
        } else {
          // Calculate salary based on hours worked
          attendanceData.entries.forEach((entry: any) => {
            if (!entry.isLeave) {
              attendanceData.totalHours += entry.hoursWorked;
            }
          });
          
          attendanceData.totalSalary = attendanceData.totalHours * employee.hourlyRate;
        }
      }
    } else {
      // Regular month attendance
      const monthAttendance = employee.attendance.find(
        (a: any) => a.year === year && a.month === month
      );
      
      if (!monthAttendance) {
        return NextResponse.json(
          { message: 'No attendance data found for this period' },
          { status: 404 }
        );
      }
      
      attendanceData = {
        entries: monthAttendance.entries || [],
        totalHours: monthAttendance.totalHours || 0,
        totalSalary: monthAttendance.totalSalary || 0
      };
    }
    
    // Generate PDF to attach to email
    const pdf = new jsPDF();
    
    // Add company header
    addCompanyHeader(pdf);
    
    // Add salary report title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(44, 62, 80); // Dark blue heading
    pdf.text('Salary Report', 105, 45, { align: 'center' });
    
    // Add employee details in a styled box
    pdf.setFillColor(240, 240, 240); // Light gray background
    pdf.roundedRect(20, 50, 170, 40, 3, 3, 'F');
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(44, 62, 80);
    pdf.text('Employee Details', 25, 60);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(80, 80, 80);
    
    // Left column
    pdf.text(`Name: ${employee.name}`, 25, 70);
    pdf.text(`Email: ${employee.email}`, 25, 77);
    pdf.text(`Role: ${employee.role}`, 25, 84);
    
    // Right column
    pdf.text(`Employee ID: ${employee._id.toString().slice(-8)}`, 110, 70);
    pdf.text(`Contact: ${employee.contact}`, 110, 77);
    pdf.text(`Joining Date: ${format(new Date(employee.joiningDate), 'PPP')}`, 110, 84);
    
    // Salary period and details
    pdf.setFillColor(230, 240, 250); // Light blue background
    pdf.roundedRect(20, 95, 170, 45, 3, 3, 'F');
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(44, 62, 80);
    pdf.text('Salary Details', 25, 105);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    // Salary details
    pdf.text(`Period: ${periodLabel}`, 25, 115);
    pdf.text(`Hourly Rate: LKR ${employee.hourlyRate.toFixed(2)}`, 25, 122);
    pdf.text(`Total Hours Worked: ${attendanceData.totalHours}`, 25, 129);
    
    // Highlight total salary
    pdf.setFillColor(41, 128, 185); // Blue background for salary
    pdf.roundedRect(110, 115, 75, 18, 3, 3, 'F');
    
    pdf.setTextColor(255); // White text for salary
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Total Salary', 115, 123);
    pdf.setFontSize(14);
    pdf.text(`LKR ${attendanceData.totalSalary.toFixed(2)}`, 115, 130);
    
    // Add attendance details as lists instead of tables
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(44, 62, 80);
    pdf.text('Attendance Details', 105, 180, { align: 'center' });
    
    // Set starting position for the attendance list
    let yPos = 190;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(80, 80, 80);
    
    // Headers
    pdf.setFont('helvetica', 'bold');
    pdf.setFillColor(41, 128, 185);
    pdf.rect(20, yPos, 170, 7, 'F');
    pdf.setTextColor(255);
    pdf.text('Date', 25, yPos + 5);
    pdf.text('Day', 70, yPos + 5);
    pdf.text('Status', 100, yPos + 5);
    pdf.text('Hours', 130, yPos + 5);
    pdf.text('Amount (LKR)', 160, yPos + 5);
    
    yPos += 10;
    pdf.setTextColor(80, 80, 80);
    pdf.setFont('helvetica', 'normal');
    
    // Sort entries by date
    attendanceData.entries.sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Create attendance entries list
    for (let i = 0; i < attendanceData.entries.length; i++) {
      const entry = attendanceData.entries[i];
      const entryDate = new Date(entry.date);
      const dayOfWeek = format(entryDate, 'EEE');
      const dateStr = format(entryDate, 'MMM dd, yyyy');
      const status = entry.isLeave ? 'Leave' : 'Present';
      const hours = entry.isLeave ? '-' : entry.hoursWorked.toString();
      const amount = entry.isLeave ? '-' : (entry.hoursWorked * employee.hourlyRate).toFixed(2);
      
      // Check if we need a new page
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
        
        // Add headers on new page
        pdf.setFont('helvetica', 'bold');
        pdf.setFillColor(41, 128, 185);
        pdf.rect(20, yPos, 170, 7, 'F');
        pdf.setTextColor(255);
        pdf.text('Date', 25, yPos + 5);
        pdf.text('Day', 70, yPos + 5);
        pdf.text('Status', 100, yPos + 5);
        pdf.text('Hours', 130, yPos + 5);
        pdf.text('Amount (LKR)', 160, yPos + 5);
        
        yPos += 10;
        pdf.setTextColor(80, 80, 80);
        pdf.setFont('helvetica', 'normal');
      }
      
      // Add entry to the list
      pdf.text(dateStr, 25, yPos);
      pdf.text(dayOfWeek, 70, yPos);
      pdf.text(status, 100, yPos);
      pdf.text(hours, 130, yPos);
      pdf.text(amount, 160, yPos);
      
      // Add alternate row coloring
      if (i % 2 === 0) {
        pdf.setFillColor(240, 240, 240);
        pdf.rect(20, yPos - 5, 170, 7, 'F');
      }
      
      yPos += 7;
    }
    
    // Add footer and signature sections similar to SalaryReportComponent
    const pageCount = (pdf as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(
        `${COMPANY.name} - Confidential | Page ${i} of ${pageCount}`, 
        105, 
        pdf.internal.pageSize.height - 10, 
        { align: 'center' }
      );
    }
    
    // Generate PDF buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));
    
    // Generate email content
    const emailSubject = `Salary Report - ${periodLabel}`;
    const emailText = `
      Dear ${employee.name},
      
      Please find attached your salary summary for ${periodLabel}:
      
      - Total Hours Worked: ${attendanceData.totalHours}
      - Hourly Rate: LKR ${employee.hourlyRate.toFixed(2)}
      - Total Salary: LKR ${attendanceData.totalSalary.toFixed(2)}
      
      For a detailed breakdown, please see the attached PDF.
      If you have any questions regarding your salary, please contact HR.
      
      Best regards,
      ${COMPANY.name}
    `;
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #3498db; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">${COMPANY.name}</h2>
        </div>
        <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
          <p>Dear <strong>${employee.name}</strong>,</p>
          
          <p>Please find attached your salary summary for <strong>${periodLabel}</strong>:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: #f5f5f5;">
              <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Description</th>
              <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Details</th>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">Total Hours Worked</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${attendanceData.totalHours}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">Hourly Rate</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">LKR ${employee.hourlyRate.toFixed(2)}</td>
            </tr>
            <tr style="font-weight: bold; background-color: #eaf2f8;">
              <td style="padding: 10px; border: 1px solid #ddd;">Total Salary</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">LKR ${attendanceData.totalSalary.toFixed(2)}</td>
            </tr>
          </table>
          
          <p>For a detailed breakdown, please see the attached PDF.</p>
          <p>If you have any questions regarding your salary, please contact HR.</p>
          
          <p>Best regards,<br/>${COMPANY.name}</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #777;">
          <p>${COMPANY.address}<br/>
          Phone: ${COMPANY.phone} | Email: ${COMPANY.email}<br/>
          &copy; ${new Date().getFullYear()} ${COMPANY.name}. All rights reserved.</p>
        </div>
      </div>
    `;
    
    // Send the email using the email utility
    await sendEmail({
      to: employee.email,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
      attachments: [
        {
          filename: `salary-report-${employee.name.replace(/\s+/g, '-')}-${periodLabel.replace(/\s+/g, '-')}.pdf`,
          content: pdfBuffer
        }
      ]
    });
    
    return NextResponse.json({ 
      message: 'Salary information email sent successfully',
      success: true 
    });
  } catch (error: any) {
    console.error('Error sending salary email:', error);
    return NextResponse.json(
      { message: 'Error sending salary email', error: error.message },
      { status: 500 }
    );
  }
}
