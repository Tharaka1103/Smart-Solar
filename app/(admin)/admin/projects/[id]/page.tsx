'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  Loader2,
  PlusCircle
} from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

interface Project {
  _id: string
  title: string
  userName: string
  email: string
  contact: string
  location: string
  status: 'pending' | 'approved' | 'completed'
  date: string
  systemSize: string
  installationDate: string
  completionDate: string
  documents: {
    nic: { fileId: string; webViewLink: string } | null;
    proposal: { fileId: string; webViewLink: string } | null;
    lightBill: { fileId: string; webViewLink: string } | null;
    clearanceLetter: { fileId: string; webViewLink: string } | null;
    cebAgreement: { fileId: string; webViewLink: string } | null;
    cebApplication: { fileId: string; webViewLink: string } | null;
    maintenanceAgreement: { fileId: string; webViewLink: string } | null;
  }
  progress: {
    date: string
    status: string
  }[]
}

export default function ProjectDetails() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [progressStatus, setProgressStatus] = useState('')
  const [isProgressDialogOpen, setIsProgressDialogOpen] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<'pending' | 'approved' | 'completed'>('pending')

  const fetchProject = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${id}`)
      if (!response.ok) {
        if (response.status === 404) {

          router.push('/admin/projects')
          return
        }
        throw new Error('Failed to fetch project details')
      }
      const data = await response.json()
      setProject(data)
    } catch (error) {
      console.error('Error fetching project details:', error)

    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProject()
  }, [id])

  const handleAddProgress = async () => {
    if (!progressStatus.trim()) {

      return
    }
    
    setIsUpdating(true)
    
    try {
      const response = await fetch(`/api/projects/${id}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: progressStatus }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update progress')
      }
      
      const updatedProject = await response.json()
      setProject(updatedProject)
      setProgressStatus('')
      setIsProgressDialogOpen(false)
      

    } catch (error) {
      console.error('Error updating progress:', error)

    } finally {
      setIsUpdating(false)
    }
  }

  const handleUpdateStatus = async () => {
    setIsUpdating(true)
    
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update project status')
      }
      
      const updatedProject = await response.json()
      setProject(updatedProject)
      setIsStatusDialogOpen(false)
      

    } catch (error) {
      console.error('Error updating project status:', error)

    } finally {
      setIsUpdating(false)
    }
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800'
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Loading project details...</p>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <p className="text-gray-600 mb-6">The project you're looking for does not exist or has been removed.</p>
          <Link href="/admin/projects">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/admin/projects">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
          </Button>
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">{project.title}</h1>
            <p className="">Project ID: {project._id}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Badge className={`${statusColors[project.status]} text-sm px-4 py-1`}>
              {project.status}
            </Badge>
            <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Update Status
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Update Project Status</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Project Status</Label>
                    <select 
                      id="status"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as any)}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsStatusDialogOpen(false)}
                      disabled={isUpdating}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleUpdateStatus}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Update Status'
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{project.userName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span>{project.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <span>{project.contact}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span>{project.location}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  System Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="">System Size</span>
                  <span className="font-medium">{project.systemSize}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="">Installation Date</span>
                  <span className="font-medium">{project.installationDate || 'Pending'}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="">Completion Date</span>
                  <span className="font-medium">{project.completionDate || 'Pending'}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="">Project Created</span>
                  <span className="font-medium">{new Date(project.date).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Project Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.documents && Object.entries(project.documents).map(([key, value]) => (
                  <div key={key} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors">
                    <span className="capitalize flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    {value ? (
                      <div className="flex gap-2">
                        <a href={value.webViewLink} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="hover:bg-blue-50">
                            View
                          </Button>
                        </a>
                        <a href={`/api/download/${value.fileId}`} target="_blank" rel="noopener noreferrer">
                          <Button variant="default" size="sm">
                            <Download className="h-4 w-4 mr-2" /> Download
                          </Button>
                        </a>
                      </div>
                    ) : (
                      <Badge variant="outline">Not uploaded</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Project Timeline
              </CardTitle>
              <Dialog open={isProgressDialogOpen} onOpenChange={setIsProgressDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Progress
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Progress Update</DialogTitle>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="progress">Progress Status</Label>
                      <Input
                        id="progress"
                        placeholder="e.g., Installation Started"
                        value={progressStatus}
                        onChange={(e) => setProgressStatus(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsProgressDialogOpen(false)}
                        disabled={isUpdating}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleAddProgress}
                        disabled={isUpdating || !progressStatus.trim()}
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          'Add Progress'
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {project.progress && project.progress.length > 0 ? (
                  project.progress.map((step, index) => (
                    <div key={index} className="mb-8 flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-md">
                          {index + 1}
                        </div>
                        {index < project.progress.length - 1 && (
                          <div className="w-0.5 h-full bg-primary/20 mt-2" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="bg-muted p-4 rounded-lg">
                          <h3 className="font-medium text-primary">{step.status}</h3>
                          <p className="text-sm text-muted-foreground flex items-center mt-2">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(step.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No progress updates yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

