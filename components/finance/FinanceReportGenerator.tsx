'use client';

import { useState } from 'react';
import { FileDown, Download, Check } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Finance {
  _id: string;
  title: string;
  amount: number;
  category: 'income' | 'expense';
  date: string;
  description: string;
  paymentMethod: string;
  reference: string;
  attachmentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface FinanceReportGeneratorProps {
  finances: Finance[];
  category: string;
}

export function FinanceReportGenerator({ finances, category }: FinanceReportGeneratorProps) {
  const [loading, setLoading] = useState(false);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
    }).format(amount);
  };

  // Generate CSV
  const generateCSV = () => {
    setLoading(true);
    
    try {
      // Filter finances by category if needed
      let dataToExport = finances;
      if (category !== 'all') {
        dataToExport = finances.filter(finance => finance.category === category);
      }
      
      if (dataToExport.length === 0) {

        setLoading(false);
        return;
      }
      
      // CSV Header
      const headers = ["Title", "Amount", "Category", "Date", "Description", "Payment Method", "Reference"];
      
      // Format the data
      const csvData = dataToExport.map((finance) => [
        finance.title,
        finance.amount.toString(),
        finance.category,
        format(new Date(finance.date), 'yyyy-MM-dd'),
        finance.description,
        finance.paymentMethod,
        finance.reference
      ]);
      
      // Combine header and data
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(cell => `"${cell?.replace(/"/g, '""')}"`).join(','))
      ].join('\n');
      
      // Create file and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Set filename with date and category
      const reportName = `${category === 'all' ? 'all-finances' : category}-report-${format(new Date(), 'yyyy-MM-dd')}`;
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${reportName}.csv`);
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
 

    } catch (error) {
      console.error('Error generating report:', error);

    } finally {
      setLoading(false);
    }
  };
  
  // Generate PDF
  const generatePDF = async () => {
    setLoading(true);
    
    try {
      // Filter finances by category if needed
      let dataToExport = finances;
      if (category !== 'all') {
        dataToExport = finances.filter(finance => finance.category === category);
      }
      
      if (dataToExport.length === 0) {

        setLoading(false);
        return;
      }
      
      // We'll use jspdf and jspdf-autotable for PDF generation
      // These would need to be imported at the top of the file
      // import jsPDF from 'jspdf';
      // import 'jspdf-autotable';
      
      // Dynamically import the libraries (to avoid SSR issues)
      const jsPDF = (await import('jspdf')).default;
      const autoTable = (await import('jspdf-autotable')).default;
      
      const doc = new jsPDF();
      
      // Add title
      const reportName = `${category.charAt(0).toUpperCase() + category.slice(1)} Finance Report`;
      doc.setFontSize(18);
      doc.text(reportName, 14, 22);
      
      // Add date
      doc.setFontSize(11);
      doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 14, 30);
      
      // Summary section
      const totalAmount = dataToExport.reduce((sum, finance) => sum + finance.amount, 0);
      doc.setFontSize(12);
      doc.text(`Total ${category === 'all' ? 'Balance' : category === 'income' ? 'Income' : 'Expenses'}: ${formatCurrency(totalAmount)}`, 14, 40);
      
      // Create table
      const tableColumn = ["Title", "Amount", "Category", "Date", "Payment Method", "Reference"];
      const tableRows = dataToExport.map((finance) => [
        finance.title,
        formatCurrency(finance.amount),
        finance.category.charAt(0).toUpperCase() + finance.category.slice(1),
        format(new Date(finance.date), 'PPP'),
        finance.paymentMethod,
        finance.reference
      ]);
      
      // Generate table
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 50,
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [66, 135, 245],
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },
      });
      
      // Footer
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(
          'LUMINEX Solar - Financial Report',
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
      
      // Save the PDF
      const filename = `${category === 'all' ? 'all-finances' : category}-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      doc.save(filename);
      

    } catch (error) {
      console.error('Error generating PDF report:', error);

    } finally {
      setLoading(false);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FileDown className="h-4 w-4" />
          {loading ? 'Generating...' : 'Generate Report'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Report Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={generateCSV} disabled={loading} className="cursor-pointer flex items-center gap-2">
          <Download className="h-4 w-4" />
          <span>Export as CSV</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={generatePDF} disabled={loading} className="cursor-pointer flex items-center gap-2">
          <FileDown className="h-4 w-4" />
          <span>Export as PDF</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
