import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Project from '@/models/Project';
import { deleteFile } from '@/lib/google-drive';


export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const projectId = pathSegments[pathSegments.length - 3]; // Get project ID from URL
    const documentType = pathSegments[pathSegments.length - 1]; // Get document type from URL
    
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

    // Check if document exists
const document = (project.documents as Record<string, any>)?.[documentType];
    if (!document) {
      return NextResponse.json(
        { message: 'Document not found' },
        { status: 404 }
      );
    }

    try {
      // Delete from Google Drive
      await deleteFile(document.fileId);
    } catch (driveError) {
      console.error('Google Drive delete error:', driveError);
      // Continue with database update even if Google Drive deletion fails
    }

    // Update project to remove document
    const updateData = {
      [`documents.${documentType}`]: null
    };
    
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { $unset: updateData },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json(updatedProject);
    
  } catch (error: any) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { message: 'Error deleting document', error: error.message },
      { status: 500 }
    );
  }
}