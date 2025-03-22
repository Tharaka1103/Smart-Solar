import { NextApiRequest, NextApiResponse } from 'next';
import PDFDocument from 'pdfkit';
import { connectToDatabase } from '@/lib/db';
import Employee from '@/models/Employee';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();
    
    const { role } = req.query;
    
    // Build query
    let query: any = {};
    if (role) query.role = role;
    
    const employees = await Employee.find(query).sort({ name: 1 });
    
    // Create a buffer to store PDF data
    const chunks: any[] = [];
    
    // Create PDF document
    const doc = new PDFDocument();
    
    // Handle PDF data chunks
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=employees-report.pdf');
      res.setHeader('Content-Length', pdfBuffer.length);
      // Send the PDF buffer
      res.send(pdfBuffer);
    });
    
    // Add content to PDF
    doc.fontSize(20).text('Employee Report', { align: 'center' });
    doc.moveDown();
    
    if (role) {
      doc.fontSize(16).text(`Role: ${role}`, { align: 'center' });
      doc.moveDown();
    }
    
    doc.fontSize(12);
    employees.forEach((employee, index) => {
      doc.text(`${index + 1}. ${employee.name}`);
      doc.text(`   Email: ${employee.email}`);
      doc.text(`   Role: ${employee.role}`);
      doc.text(`   Contact: ${employee.contact}`);
      doc.text(`   Hourly Rate: LKR: ${employee.hourlyRate}`);
      doc.moveDown();
    });
    
    // Finalize PDF
    doc.end();
  } catch (error: any) {
    console.error('Error generating employee report:', error);
    res.status(500).json({
      message: 'Error generating employee report',
      error: error.message
    });
  }
}