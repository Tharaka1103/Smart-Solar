import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import { JWT, OAuth2Client } from 'google-auth-library';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];
// The file token.json stores the user's access and refresh tokens
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 */
async function loadSavedCredentialsIfExist(): Promise<OAuth2Client | null> {
  try {
    const content = fs.readFileSync(TOKEN_PATH, 'utf8');
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials) as OAuth2Client;
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 */
async function saveCredentials(client: OAuth2Client) {
  const content = fs.readFileSync(CREDENTIALS_PATH, 'utf8');
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  fs.writeFileSync(TOKEN_PATH, payload);
}

/**
 * Initialize the auth client - this replaces the problematic authorize function
 */
async function authorize(): Promise<OAuth2Client | null> {
  // First try to load saved credentials
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  
  try {
    // If no saved credentials, create a new OAuth2 client
    const content = fs.readFileSync(CREDENTIALS_PATH, 'utf8');
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    
    const oAuth2Client = new OAuth2Client({
      clientId: key.client_id,
      clientSecret: key.client_secret,
      redirectUri: key.redirect_uris[0],
    });
    
    console.log('No saved credentials found. Please visit this URL to authorize:');
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log(authUrl);
    
    // Since we can't get the code interactively in an API, we'll return null
    // You'll need to manually get the code and save the token
    return null;
  } catch (error) {
    console.error('Error creating OAuth client:', error);
    return null;
  }
}

/**
 * Create JWT client from service account
 */
function createJWTClient(): JWT | null {
  // For production environments, use service account
  try {
    const serviceAccountKeyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS || '';
    if (!fs.existsSync(serviceAccountKeyFile)) {
      console.error(`Service account key file does not exist: ${serviceAccountKeyFile}`);
      return null;
    }
    
    const credentials = JSON.parse(fs.readFileSync(serviceAccountKeyFile, 'utf8'));
    
    return new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: SCOPES,
    });
  } catch (error) {
    console.error('Error creating JWT client:', error);
    return null;
  }
}

/**
 * Get Google Drive instance
 */
export async function getDriveInstance() {
  let auth;
  
  // Always try to use JWT client first (for both production and development)
  auth = createJWTClient();
  
  // Fall back to OAuth client if JWT fails
  if (!auth) {
    auth = await authorize();
  }
  
  if (!auth) {
    throw new Error('Authentication failed. Please check your credentials.');
  }
  
  return google.drive({ version: 'v3', auth });
}

/**
 * Upload a file to Google Drive
 * Function overloads to support both string paths and Buffers
 */
export async function uploadFile(filePath: string, fileName: string, mimeType: string): Promise<{fileId: string, webViewLink: string}>;
export async function uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<{fileId: string, webViewLink: string}>;
export async function uploadFile(fileInput: string | Buffer, fileName: string, mimeType: string): Promise<{fileId: string, webViewLink: string}> {
  const drive = await getDriveInstance();
  
  // Create a temporary file from the buffer if needed
  let tempFilePath = '';
  let fileStream;
  
  if (Buffer.isBuffer(fileInput)) {
    // It's a buffer, create a temp file
    tempFilePath = path.join(process.cwd(), 'temp', `temp-${Date.now()}-${fileName}`);
    const tempDir = path.dirname(tempFilePath);
    
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    fs.writeFileSync(tempFilePath, fileInput);
    fileStream = fs.createReadStream(tempFilePath);
  } else if (typeof fileInput === 'string') {
    // It's a file path
    fileStream = fs.createReadStream(fileInput);
  } else {
    throw new Error('Invalid file input - must be Buffer or file path string');
  }
  
  // Modified fileMetadata - removing parents if it's causing issues
  const fileMetadata: any = {
    name: fileName,
    // Only add parents if folder ID exists and is valid
  };
  
  // Check if folder ID exists before using it
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (folderId && folderId.trim() !== '') {
    // Check if folder exists and is accessible
    try {
      await drive.files.get({ fileId: folderId });
      // If we get here, the folder exists and is accessible
      fileMetadata.parents = [folderId];
    } catch (folderError) {
      console.warn(`Warning: Could not access folder ID ${folderId} - uploading to root instead:`, folderError);
      // Continue without parents - will upload to root
    }
  }
  
  const media = {
    mimeType,
    body: fileStream,
  };
  
  try {
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id,webViewLink',
    });
    
    // Set file to be readable by anyone with the link
    if (!response.data.id) {
      throw new Error('File upload successful but no ID was returned');
    }
    
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });
    
    if (!response.data.webViewLink) {
      throw new Error('File upload successful but no webViewLink was returned');
    }
    
    return {
      fileId: response.data.id,
      webViewLink: response.data.webViewLink,
    };
  } catch (error) {
    console.error('Error uploading file to Google Drive:', error);
    throw error;
  } finally {
    // Clean up the temporary file if we created one
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
}
/**
 * Get a file from Google Drive
 */
export async function getFile(fileId: string) {
  const drive = await getDriveInstance();
  
  try {
    const response = await drive.files.get({
      fileId,
      alt: 'media',
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting file from Google Drive:', error);
    throw error;
  }
}

/**
 * Get download URL for a file
 */
export async function getDownloadUrl(fileId: string) {
  const drive = await getDriveInstance();
  
  try {
    const file = await drive.files.get({
      fileId,
      fields: 'webContentLink',
    });
    
    return file.data.webContentLink;
  } catch (error) {
    console.error('Error getting download URL:', error);
    throw error;
  }
}
