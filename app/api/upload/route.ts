import { NextRequest, NextResponse } from 'next/server';
import { uploadFile } from '@/lib/google-drive';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { mkdir } from 'fs/promises';

// Ensure temp directory exists
const ensureTempDir = async () => {
  const tempDir = path.join(process.cwd(), 'temp');
  try {
    await mkdir(tempDir, { recursive: true });
  } catch (error) {
    console.error('Error creating temp directory:', error);
  }
  return tempDir;
};

export async function POST(request: NextRequest) {
  try {
    console.log('Starting file upload process');
    
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file || !(file instanceof File)) {
      console.error('No file in request or invalid file object');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    
    const documentType = formData.get('documentType')?.toString() || 'document';
    const projectId = formData.get('projectId')?.toString();
    
    console.log(`Received file: ${file.name}, Type: ${documentType}, Size: ${file.size} bytes`);
    
    // Create temp directory and write file to disk
    const tempDir = await ensureTempDir();
    const tempFilePath = path.join(tempDir, `${uuidv4()}-${file.name}`);
    
    const fileArrayBuffer = await file.arrayBuffer();
    await writeFile(tempFilePath, Buffer.from(fileArrayBuffer));
    
    console.log(`Temporary file created at: ${tempFilePath}`);
    
    // Upload to Google Drive
    console.log('Uploading to Google Drive...');
    const fileInfo = await uploadFile(tempFilePath, file.name, file.type);
    console.log('Upload successful:', fileInfo);
    
    // Remove temp file here if needed (done in uploadFile function)
    
    return NextResponse.json(fileInfo, { status: 201 });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Error uploading file' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
