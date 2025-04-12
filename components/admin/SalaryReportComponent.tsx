'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { addCompanyHeader, COMPANY } from '@/lib/pdfUtils';

// Declare jsPDF autotable extension
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface SalaryReportProps {
  employee: any;
  year: number;
  month: number;
  customPeriod?: boolean;
  previewMode?: boolean;
  onGenerate?: (pdf: jsPDF) => void;
}

interface AttendanceData {
  entries: {
    date: string;
    hoursWorked: number;
    isLeave: boolean;
  }[];
  totalHours: number;
  totalSalary: number;
}

const SalaryReportComponent: React.FC<SalaryReportProps> = ({
  employee,
  year,
  month,
  customPeriod = false,
  previewMode = false,
  onGenerate,
}) => {
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update in the useEffect hook for fetching attendance data
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        
        // Build the query parameters
        const queryParams = new URLSearchParams({
          year: year.toString(),
          month: month.toString(),
        });
        
        if (customPeriod) {
          queryParams.append('customPeriod', 'true');
        }
        
        const response = await fetch(`/api/employees/${employee._id}/attendance?${queryParams.toString()}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to fetch attendance data');
        }
        
        const data = await response.json();
        
        // Validate the data is in the expected format
        if (data && Array.isArray(data.entries)) {
          setAttendanceData(data);
          
          // Generate PDF if not in preview mode and onGenerate callback is provided
          if (!previewMode && onGenerate && data.entries.length > 0) {
            const pdf = generatePDF(data);
            onGenerate(pdf);
          }
        } else {
          console.warn('Received unexpected data format:', data);
          // Create default structure if data is malformed
          setAttendanceData({
            entries: [],
            totalHours: 0,
            totalSalary: 0
          });
        }
      } catch (err) {
        console.error('Error fetching attendance data:', err);
        setError('Failed to load attendance data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (employee && employee._id) {
      fetchAttendanceData();
    }
  }, [employee, year, month, customPeriod, onGenerate, previewMode]);
  
  // Generate PDF function
  const generatePDF = (data: AttendanceData) => {
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
    doc.text(`Total Hours Worked: ${data.totalHours}`, 25, 129);
    
    // Highlight total salary
    doc.setFillColor(41, 128, 185); // Blue background for salary
    doc.roundedRect(110, 115, 75, 18, 3, 3, 'F');
    
    doc.setTextColor(255); // White text for salary
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Total Salary', 115, 123);
    doc.setFontSize(14);
    doc.text(`LKR ${data.totalSalary.toFixed(2)}`, 115, 130);
    
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
    
    // Add attendance details as lists instead of tables
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(44, 62, 80);
    doc.text('Attendance Details', 105, 180, { align: 'center' });
    
    try {
      // Set starting position for the attendance list
      let yPos = 190;
      let currentPage = 1;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      
      // Headers
      doc.setFont('helvetica', 'bold');
      doc.setFillColor(41, 128, 185);
      doc.rect(20, yPos, 170, 7, 'F');
      doc.setTextColor(255);
      doc.text('Date', 25, yPos + 5);
      doc.text('Day', 70, yPos + 5);
      doc.text('Status', 100, yPos + 5);
      doc.text('Hours', 130, yPos + 5);
      doc.text('Amount (LKR)', 160, yPos + 5);
      
      yPos += 10;
      doc.setTextColor(80, 80, 80);
      doc.setFont('helvetica', 'normal');
      
      // Create attendance entries list
      const attendanceEntries = data.entries;
      for (let i = 0; i < attendanceEntries.length; i++) {
        try {
          const entry = attendanceEntries[i];
          const entryDate = new Date(entry.date);
          const dayOfWeek = format(entryDate, 'EEE');
          const dateStr = format(entryDate, 'MMM dd, yyyy');
          const status = entry.isLeave ? 'Leave' : 'Present';
          const hours = entry.isLeave ? '-' : entry.hoursWorked.toString();
          const amount = entry.isLeave ? '-' : (entry.hoursWorked * employee.hourlyRate).toFixed(2);
          
          // Check if we need a new page
          if (yPos > 270) {
            doc.addPage();
            currentPage++;
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
            doc.text('Amount (LKR)', 160, yPos + 5);
            
            yPos += 10;
            doc.setTextColor(80, 80, 80);
            doc.setFont('helvetica', 'normal');
          }
          
          // Add entry to the list
          doc.text(dateStr, 25, yPos);
          doc.text(dayOfWeek, 70, yPos);
          doc.text(status, 100, yPos);
          doc.text(hours, 130, yPos);
          doc.text(amount, 160, yPos);
          
          // Add alternate row coloring
          if (i % 2 === 0) {
            doc.setFillColor(240, 240, 240);
            doc.rect(20, yPos - 5, 170, 7, 'F');
          }
          
          yPos += 7;
        } catch (e) {
          console.error('Error processing entry for list:', e);
        }
      }
      
      // Add summary and notes
      const finalY = yPos + 10;
      
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
        doc.text('Total Working Hours: ' + data.totalHours, 25, 49);
        doc.text('Hourly Rate: LKR ' + employee.hourlyRate.toFixed(2), 25, 56);
        doc.text('Total Salary: LKR ' + data.totalSalary.toFixed(2), 25, 63);
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
        doc.text('Total Working Hours: ' + data.totalHours, 25, finalY + 34);
        doc.text('Hourly Rate: LKR ' + employee.hourlyRate.toFixed(2), 25, finalY + 41);
        doc.text('Total Salary: LKR ' + data.totalSalary.toFixed(2), 25, finalY + 48);
      }
    } catch (tableError) {
      console.error('Error creating attendance list:', tableError);
      // Just add an error message to the PDF instead of failing
      doc.setTextColor(255, 0, 0);
      doc.setFontSize(12);
      doc.text('Error creating attendance list. Please contact support.', 105, 185, { align: 'center' });
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
  };

  // Get month name
  const getMonthName = (monthIndex: number) => {
    return [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ][monthIndex];
  };
  
  // Get custom period label
  const getCustomPeriodLabel = () => {
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    
    return `${getMonthName(prevMonth)} 25, ${prevYear} - ${getMonthName(month)} 25, ${year}`;
  };
  
  // Method to generate and download PDF directly
  const downloadPDF = () => {
    if (!attendanceData) return;
    
    const doc = generatePDF(attendanceData);
    doc.save(`salary-report-${employee.name.replace(/\s+/g, '-')}-${getMonthName(month)}-${year}.pdf`);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        <p>{error}</p>
      </div>
    );
  }
  
  if (!attendanceData) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        <p>No attendance data available for this period.</p>
      </div>
    );
  }
  
  // For a preview, show a simplified version
  if (previewMode) {
    return (
      <div className="p-4 text-sm">
        <div className="font-bold text-center mb-4">Salary Report Preview</div>
        <div className="mb-2">
          <span className="font-semibold">Employee:</span> {employee.name}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Period:</span> {customPeriod ? getCustomPeriodLabel() : `${getMonthName(month)} ${year}`}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Total Hours:</span> {attendanceData.totalHours}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Total Salary:</span> LKR {attendanceData.totalSalary.toFixed(2)}
        </div>
        {/* Just show first few entries in preview */}
        {attendanceData.entries.slice(0, 3).map((entry, index) => (
          <div key={index} className="text-xs mb-1 grid grid-cols-3">
            <span>{format(new Date(entry.date), 'MMM dd')}</span>
            <span>{entry.isLeave ? 'Leave' : `${entry.hoursWorked}h`}</span>
            <span>{entry.isLeave ? '-' : `LKR ${(entry.hoursWorked * employee.hourlyRate).toFixed(2)}`}</span>
          </div>
        ))}
        {attendanceData.entries.length > 3 && (
          <div className="text-xs text-center mt-2 text-muted-foreground">
            ...and {attendanceData.entries.length - 3} more entries
          </div>
        )}
        <div className="mt-4 flex justify-center">
          <button 
            onClick={downloadPDF} 
            className="text-xs px-3 py-1 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          >
            Download Full Report
          </button>
        </div>
      </div>
    );
  }
  
  // For actual PDF generation, render nothing as we're just processing data
  return null;
};

export default SalaryReportComponent;

