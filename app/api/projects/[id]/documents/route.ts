import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Project from '@/models/Project';
import { uploadFile } from '@/lib/google-drive';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const projectId = pathSegments[pathSegments.length - 2]; // Get project ID from URL
    
    // Parse the form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const documentType = formData.get('documentType') as string;
    
    if (!file || !documentType) {
      return NextResponse.json(
        { message: 'File and document type are required' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: 'Invalid file type. Only PDF, DOC, DOCX, JPG, JPEG, PNG files are allowed' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();
    
    // Find the project
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Generate unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileExtension = path.extname(file.name);
    const fileName = `${project.projectId}_${documentType}_${timestamp}${fileExtension}`;
    
    try {
      // Upload to Google Drive
      const driveResult = await uploadFile(buffer, fileName, file.type);
      
      // Update project document
      const updateData = {
        [`documents.${documentType}`]: {
          fileId: driveResult.fileId,
          webViewLink: driveResult.webViewLink
        }
      };
      
      const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        { $set: updateData },
        { new: true, runValidators: true }
      );
      
      return NextResponse.json(updatedProject);
      
    } catch (driveError) {
      console.error('Google Drive upload error:', driveError);
      return NextResponse.json(
        { message: 'Failed to upload file to Google Drive' },
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