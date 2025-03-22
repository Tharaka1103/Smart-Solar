import { NextRequest, NextResponse } from 'next/server';
import { getDownloadUrl } from '@/lib/google-drive';

export async function GET(
  req: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const fileId = params.fileId;
    
    if (!fileId) {
      return NextResponse.json(
        { message: 'File ID is required' },
        { status: 400 }
      );
    }
    
    // Get download URL from Google Drive
    const downloadUrl = await getDownloadUrl(fileId);
    
    if (!downloadUrl) {
      return NextResponse.json(
        { message: 'Download URL not found' },
        { status: 404 }
      );
    }
    
    // Redirect to the download URL
    return NextResponse.redirect(downloadUrl);
  } catch (error: any) {
    console.error('Error downloading file:', error);
    return NextResponse.json(
      { message: 'Error downloading file', error: error.message },
      { status: 500 }
    );
  }
}