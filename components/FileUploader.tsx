'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FileIcon, UploadIcon, Loader2 } from 'lucide-react';

interface FileUploaderProps {
  accept: string;
  documentType: string;
  onChange?: (fileInfo: { fileId: string; webViewLink: string } | null) => void;
  value?: { fileId: string; webViewLink: string } | null;
}

export function FileUploader({
  accept,
  documentType,
  onChange,
  value: externalValue,
}: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileInfo, setFileInfo] = useState<{ fileId: string; webViewLink: string } | null>(externalValue || null);

  // Update internal state when external value changes
  useEffect(() => {
    if (externalValue !== undefined) {
      setFileInfo(externalValue);
    }
  }, [externalValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    console.log(`Starting upload for ${documentType}: ${file.name}`);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const responseText = await response.text();
      console.log(`Upload response for ${documentType}:`, responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing response:', e);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      setFileInfo(result);
      
      if (onChange) {
        onChange(result);
      }


    } catch (error: any) {
      console.error(`Upload error for ${documentType}:`, error);

    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      {fileInfo ? (
        <div className="flex items-center justify-between p-2 border rounded">
          <div className="flex items-center">
            <FileIcon className="h-4 w-4 mr-2" />
            <a 
              href={fileInfo.webViewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View uploaded file
            </a>
          </div>
          <Button 
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setFileInfo(null);
              setFile(null);
              if (onChange) onChange(null);
            }}
          >
            Change
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="file"
            accept={accept}
            id={`file-${documentType}`}
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById(`file-${documentType}`)?.click()}
            disabled={isUploading}
            className="flex-1 border border-primary"
          >
            Select File
          </Button>
          {file && (
            <Button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UploadIcon className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      )}
      {file && !isUploading && !fileInfo && (
        <p className="text-sm mt-1">
          {file.name} ({Math.round(file.size / 1024)} KB)
        </p>
      )}
    </div>
  );
}
