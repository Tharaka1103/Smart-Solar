import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

// Declare jsPDF autotable extension
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// Company details for reports
export const COMPANY = {
  name: "Luminex Solar (Pvt) Ltd",
  logo: "", // Base64 encoded logo could be added here
  address: "123 Solar Avenue, Colombo 05, Sri Lanka",
  phone: "+94 11 2345678",
  email: "info@luminexsolar.com",
  website: "www.luminexsolar.com",
  regNumber: "REG123456789"
};

// Helper function to add company header to PDF
export function addCompanyHeader(doc: jsPDF) {
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

// Function to generate employee list PDF
export function generateEmployeeListPDF(employees: any[], role?: string) {
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
  
  return doc;
}

// Function to generate salary report PDF
export function generateSalaryReportPDF(
  employee: any,
  attendanceData: {
    entries: Array<{
      date: string;
      hoursWorked: number;
      isLeave: boolean;
    }>;
    totalHours: number;
    totalSalary: number;
  },
  periodLabel: string,
  useList: boolean = false
) {
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
  doc.text(`Total Hours Worked: ${attendanceData.totalHours}`, 25, 129);
  
  // Highlight total salary
  doc.setFillColor(41, 128, 185); // Blue background for salary
  doc.roundedRect(110, 115, 75, 18, 3, 3, 'F');
  
  doc.setTextColor(255); // White text for salary
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Total Salary', 115, 123);
  doc.setFontSize(14);
  doc.text(`LKR ${attendanceData.totalSalary.toFixed(2)}`, 115, 130);
  
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
    if (employee.bankDetails.accountNumber) bankInfo.push(`Account: ${employee.bankDetails.accountNumber}`);
    
    doc.text(bankInfo.join(' | '), 25, 165);
  }
  
  // Add attendance details section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(44, 62, 80);
  doc.text('Attendance Details', 105, 180, { align: 'center' });
  
  // Sort entries by date
  const sortedEntries = [...attendanceData.entries].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  if (useList) {
    // Use list format instead of table
    let yPos = 190;
    
    // Add headers
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(41, 128, 185);
    doc.rect(20, yPos, 170, 7, 'F');
    doc.setTextColor(255);
    doc.text('Date', 25, yPos + 5);
    doc.text('Day', 70, yPos + 5);
    doc.text('Status', 100, yPos + 5);
    doc.text('Hours', 130, yPos + 5);
    doc.text('Amount', 160, yPos + 5);
    
    yPos += 10;
    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica', 'normal');
    
    // Add entries as a list
    for (let i = 0; i < sortedEntries.length; i++) {
      const entry = sortedEntries[i];
      const entryDate = new Date(entry.date);
      const dayOfWeek = format(entryDate, 'EEE');
      const dateStr = format(entryDate, 'MMM dd, yyyy');
      const status = entry.isLeave ? 'Leave' : 'Present';
      const hours = entry.isLeave ? '-' : entry.hoursWorked.toString();
      const amount = entry.isLeave ? '-' : `LKR ${(entry.hoursWorked * employee.hourlyRate).toFixed(2)}`;
      
      // Check if we need a new page
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
        
        // Add headers on new page
        doc.setFont('helvetica', 'bold');
        doc.setFillColor(41, 128, 185);
        doc.rect(20, yPos, 170, 7, 'F');
        doc.setTextColor(255);
        doc.text('Date', 25, yPos + 5);
        doc.text('Day', 70, yPos + 5);
        doc.text('Status', 100, yPos + 5);
        doc.text('Hours', 130, yPos + 5);
        doc.text('Amount', 160, yPos + 5);
        
        yPos += 10;
        doc.setTextColor(80, 80, 80);
        doc.setFont('helvetica', 'normal');
      }
      
      // Add alternating row background
      if (i % 2 === 0) {
        doc.setFillColor(240, 240, 240);
        doc.rect(20, yPos - 5, 170, 7, 'F');
      }
      
      // Add entry to the list
      doc.text(dateStr, 25, yPos);
      doc.text(dayOfWeek, 70, yPos);
      doc.text(status, 100, yPos);
      doc.text(hours, 130, yPos);
      doc.text(amount, 160, yPos);
      
      yPos += 7;
    }
  } else {
    // Use table format (recommended for more entries)
    doc.autoTable({
      startY: 185,
      head: [['Date', 'Day', 'Status', 'Hours', 'Amount (LKR)']],
      body: sortedEntries.map((entry) => {
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
  }
  
  // Add summary at the end
  const finalY = useList ? (doc.internal.pageSize.height - 70) : ((doc as any).lastAutoTable.finalY + 10);
  
  // Check if we need a new page
  if (finalY > 250) {
    doc.addPage();
    
    // Add summary box
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(20, 20, 170, 50, 3, 3, 'F');
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(44, 62, 80);
    doc.text('Summary', 25, 30);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    
    const daysPresent = sortedEntries.filter(e => !e.isLeave).length;
    const daysLeave = sortedEntries.filter(e => e.isLeave).length;
    
    doc.text(`Days Present: ${daysPresent}`, 25, 40);
    doc.text(`Leave Days: ${daysLeave}`, 25, 47);
    doc.text(`Total Working Hours: ${attendanceData.totalHours}`, 25, 54);
    doc.text(`Hourly Rate: LKR ${employee.hourlyRate.toFixed(2)}`, 25, 61);
    doc.text(`Total Salary: LKR ${attendanceData.totalSalary.toFixed(2)}`, 25, 68);
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
    
    const daysPresent = sortedEntries.filter(e => !e.isLeave).length;
    const daysLeave = sortedEntries.filter(e => e.isLeave).length;
    
    doc.text(`Days Present: ${daysPresent}`, 25, finalY + 20);
    doc.text(`Leave Days: ${daysLeave}`, 25, finalY + 27);
    doc.text(`Total Working Hours: ${attendanceData.totalHours}`, 25, finalY + 34);
    doc.text(`Hourly Rate: LKR ${employee.hourlyRate.toFixed(2)}`, 25, finalY + 41);
    doc.text(`Total Salary: LKR ${attendanceData.totalSalary.toFixed(2)}`, 25, finalY + 48);
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
  
  return doc;
}
