'use client'

import { useDropzone } from 'react-dropzone'
import { Upload, File, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'

interface FileUploaderProps {
  accept: string
  maxSize?: number
  onFileSelect?: (file: File) => void
}

export function FileUploader({ accept, maxSize = 5242880, onFileSelect }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    maxSize,
    multiple: false,
    onDrop: (acceptedFiles) => {
      const selectedFile = acceptedFiles[0]
      setFile(selectedFile)
      if (onFileSelect) {
        onFileSelect(selectedFile)
      }
    },
  })

  const removeFile = () => {
    setFile(null)
    if (onFileSelect) {
      onFileSelect(null as any)
    }
  }

  return (
    <div className="w-full">
      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {isDragActive ? 'Drop the file here' : 'Drag & drop or click to select'}
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-2 p-2 border rounded-lg">
          <File className="h-5 w-5 text-blue-500" />
          <span className="flex-1 truncate text-sm">{file.name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={removeFile}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
