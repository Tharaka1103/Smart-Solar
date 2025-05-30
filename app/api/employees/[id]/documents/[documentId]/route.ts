import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Employee from '@/models/Employee';
import { verifyJwt } from '@/lib/edge-jwt';
import { getDownloadUrl } from '@/lib/google-drive';
import { getDriveInstance } from '@/lib/google-drive';
// Get download URL for a specific document
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const { pathname } = new URL(req.url);
    const pathParts = pathname.split('/');
    const employeeId = pathParts[3];
    const documentId = pathParts[5];
    
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
    
    const document = employee.documents?.find((doc: { _id: { toString: () => string; }; }) => doc._id?.toString() === documentId);
    
    if (!document) {
      return NextResponse.json(
        { message: 'Document not found' },
        { status: 404 }
      );
    }
    
    try {
      const downloadUrl = await getDownloadUrl(document.driveFileId);
      
      return NextResponse.json({
        downloadUrl,
        fileName: document.originalName,
        fileType: document.fileType
      });
    } catch (driveError: any) {
      console.error('Error getting download URL from Google Drive:', driveError);
      return NextResponse.json(
        { message: 'Failed to generate download URL', error: driveError.message },
        { status: 500 }
      );
    }
    
  } catch (error: any) {
    console.error('Error getting document download URL:', error);
    return NextResponse.json(
      { message: 'Error getting download URL', error: error.message },
      { status: 500 }
    );
  }
}


// Delete a document
export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    await verifyJwt(token);
    await connectToDatabase();
    
    const { pathname } = new URL(req.url);
    const pathParts = pathname.split('/');
    const employeeId = pathParts[3];
    const documentId = pathParts[5];
    
    if (!employeeId || !documentId) {
      return NextResponse.json(
        { message: 'Employee ID and Document ID are required' },
        { status: 400 }
      );
    }
    
    // First, get the document details for Google Drive cleanup
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
    
    const document = employee.documents?.find((doc: { _id: { toString: () => string; }; }) => doc._id?.toString() === documentId);
    
    if (!document) {
      return NextResponse.json(
        { message: 'Document not found' },
        { status: 404 }
      );
    }
    
    // Delete from Google Drive first (optional)
    let driveDeleted = false;
    if (document.driveFileId) {
      try {
        const drive = await getDriveInstance();
        await drive.files.delete({ fileId: document.driveFileId });
        driveDeleted = true;
        console.log(`Deleted file from Google Drive: ${document.driveFileId}`);
      } catch (driveError: any) {
        console.warn(`Could not delete file from Google Drive (${document.driveFileId}):`, driveError.message);
        // Continue with database deletion even if Drive deletion fails
      }
    }
    
    // Remove from database using atomic operation
    const updatedEmployee = await Employee.findOneAndUpdate(
      { 
        _id: employeeId, 
        isDeleted: { $ne: true },
        'documents._id': documentId 
      },
      { 
        $pull: { documents: { _id: documentId } }
      },
      { 
        new: true,
        validateBeforeSave: false 
      }
    );
    
    if (!updatedEmployee) {
      return NextResponse.json(
        { message: 'Failed to delete document from database' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: 'Document deleted successfully',
      driveDeleted,
      documentInfo: {
        fileName: document.originalName,
        fileId: document.driveFileId
      }
    });
  } catch (error: any) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { message: 'Error deleting document', error: error.message },
      { status: 500 }
    );
  }
}

