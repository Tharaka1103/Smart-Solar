import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Employee from '@/models/Employee';
import { verifyJwt } from '@/lib/edge-jwt';
import { uploadFile } from '@/lib/google-drive';

// Get all documents for an employee
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const { pathname } = new URL(req.url);
    const employeeId = pathname.split('/')[3];
    
    const employee = await Employee.findOne({ 
      _id: employeeId, 
      isDeleted: { $ne: true } 
    }).select('documents');
    
    if (!employee) {
      return NextResponse.json(
        { message: 'Employee not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(employee.documents || []);
  } catch (error: any) {
    console.error('Error fetching employee documents:', error);
    return NextResponse.json(
      { message: 'Error fetching documents', error: error.message },
      { status: 500 }
    );
  }
}

// Upload a new document for an employee
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
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const description = formData.get('description') as string;
    
    if (!file) {
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Validate file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: 'File size exceeds 10MB limit' },
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
    
    try {
      // Convert file to buffer for Google Drive upload
      const arrayBuffer = await file.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);
      
      // Generate unique filename
      const timestamp = Date.now();
      const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `employee_${employeeId}_${timestamp}_${sanitizedOriginalName}`;
      
      // Upload to Google Drive
      const driveResult = await uploadFile(fileBuffer, fileName, file.type);
      
      // Create document record
      const documentData = {
        fileName: fileName,
        originalName: file.name,
        fileType: file.type,
        fileSize: file.size,
        driveFileId: driveResult.fileId,
        webViewLink: driveResult.webViewLink,
        uploadedAt: new Date(),
        description: description || ''
      };
      
      // Add document to employee
      if (!employee.documents) {
        employee.documents = [];
      }
      employee.documents.push(documentData);
      
      await employee.save();
      
      return NextResponse.json({
        message: 'Document uploaded successfully',
        document: documentData
      }, { status: 201 });
      
    } catch (uploadError: any) {
      console.error('Error uploading to Google Drive:', uploadError);
      return NextResponse.json(
        { message: 'Failed to upload file to storage', error: uploadError.message },
        { status: 500 }
      );
    }
    
  } catch (error: any) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { message: 'Error uploading document', error: error.message },
      { status: 500 }
    );
  }
}