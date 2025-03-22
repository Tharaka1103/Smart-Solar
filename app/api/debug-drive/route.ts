import { NextRequest, NextResponse } from 'next/server';
import { getDriveInstance } from '@/lib/google-drive';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Test connection to Google Drive
    const drive = await getDriveInstance();
    
    // Create a test file
    const testFilePath = path.join(process.cwd(), 'test-file.txt');
    fs.writeFileSync(testFilePath, 'This is a test file for Google Drive.');
    
    // Test file metadata
    const fileMetadata = {
      name: 'test-upload.txt',
    };
    
    // If you have a folder ID, use it
    if (process.env.GOOGLE_DRIVE_FOLDER_ID) {
      // @ts-ignore
      fileMetadata.parents = [process.env.GOOGLE_DRIVE_FOLDER_ID];
    }
    
    // Upload the test file
    const media = {
      mimeType: 'text/plain',
      body: fs.createReadStream(testFilePath),
    };
    
    const uploadResponse = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id,webViewLink',
    });
    
    // Clean up
    fs.unlinkSync(testFilePath);
    
    return NextResponse.json({
      message: 'Google Drive test',
      success: true,
      uploadResult: uploadResponse.data,
      auth: {
        type: process.env.NODE_ENV === 'production' ? 'JWT' : 'OAuth2',
        credentialsExist: !!process.env.GOOGLE_APPLICATION_CREDENTIALS,
        folderIdExists: !!process.env.GOOGLE_DRIVE_FOLDER_ID
      }
    });
  } catch (error: any) {
    console.error('Google Drive test error:', error);
    return NextResponse.json({
      message: 'Google Drive test failed',
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
