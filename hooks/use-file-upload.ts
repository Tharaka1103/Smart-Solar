import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

interface FileInfo {
  fileId: string
  webViewLink: string
}

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const uploadFile = async (
    file: File,
    documentType: string,
    projectId?: string
  ): Promise<FileInfo | null> => {
    if (!file) return null

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('documentType', documentType)
      
      if (projectId) {
        formData.append('projectId', projectId)
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()
      
      toast({
        title: "Success",
        description: "File uploaded successfully",
      })
      
      return result
    } catch (error) {
      console.error('Upload error:', error)
      
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      })
      
      return null
    } finally {
      setIsUploading(false)
    }
  }

  return {
    uploadFile,
    isUploading
  }
}
