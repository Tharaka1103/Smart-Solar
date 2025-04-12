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
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  ClipboardCheck,
  Clock,
  Tag
} from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Project {
  _id: string
  projectId: string
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
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<'pending' | 'approved' | 'completed'>('pending')
  const [isCompleting, setIsCompleting] = useState(false)
  const { successt, errort } = useToast()

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
      errort({
        title: "Error",
        description: "Failed to load project details",
      })
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
      successt({
        title: "Progress Updated",
        description: "Project progress has been updated successfully",
      })
    } catch (error) {
      console.error('Error updating progress:', error)
      errort({
        title: "Error",
        description: "Failed to update progress",
      })
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
      successt({
        title: "Status Updated",
        description: "Project status has been updated successfully",
      })
    } catch (error) {
      console.error('Error updating project status:', error)
      errort({
        title: "Error",
        description: "Failed to update project status",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleMarkAsComplete = async () => {
    if (!project) return;
    
    setIsCompleting(true);
    
    try {
      const response = await fetch(`/api/projects/${id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark project as complete');
      }
      
      const result = await response.json();
      
      setProject(result.project);
      setIsCompleteDialogOpen(false);
      
      successt({
        title: "Project Completed",
        description: "Project has been marked as complete and maintenance has been scheduled",
      });
      
      // Show a success notification with the maintenance info
      setTimeout(() => {
        errort({
          title: "Maintenance Scheduled",
          description: `Annual maintenance scheduled for ${new Date(result.maintenanceRecord.maintenanceDate).toLocaleDateString()}`,
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error marking project as complete:', error);
      errort({
        title: "Error",
        description: "Failed to mark project as complete",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    approved: 'bg-blue-100 text-blue-800 border-blue-300',
    completed: 'bg-green-100 text-green-800 border-green-300'
  }

  const statusIcons = {
    pending: <Clock className="h-4 w-4 mr-1" />,
    approved: <ClipboardCheck className="h-4 w-4 mr-1" />,
    completed: <CheckCircle2 className="h-4 w-4 mr-1" />
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="mb-8">
        <Link href="/admin/projects">
          <Button variant="ghost" className="mb-4 hover:bg-primary/10 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
          </Button>
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <motion.h1 
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            >
              {project.title}
            </motion.h1>
            <p className="text-muted-foreground">Project ID: {project._id}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Badge className={`${statusColors[project.status] || ''} text-sm px-4 py-1 flex items-center gap-1`}>
              {statusIcons[project.status]}
              {project.status?.toUpperCase()}
            </Badge>
            <Badge className="bg-lime-100 text-lime-800 border-lime-300 text-sm px-4 py-1 flex items-center gap-1">
              <Tag className="h-4 w-4 mr-1" />
              {project.projectId}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-6 space-x-4">
        {project.status !== 'completed' && (
          <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg">
                <CheckCircle2 className="h-5 w-5" />
                Mark as Complete
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Mark Project as Complete</DialogTitle>
                <DialogDescription>
                  This will mark the project as complete and automatically schedule annual maintenance for one year from today.
                </DialogDescription>
              </DialogHeader>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mt-4 shadow-sm">
                <p className="text-amber-700 text-sm font-medium flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  This action will:
                </p>
                <ul className="mt-2 text-amber-700 text-sm list-disc list-inside space-y-1">
                  <li>Change the project status to "Completed"</li>
                  <li>Set today as the completion date</li>
                  <li>Create a maintenance record scheduled one year from today</li>
                  <li>Generate a notification for the scheduled maintenance</li>
                </ul>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCompleteDialogOpen(false)}
                  disabled={isCompleting}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleMarkAsComplete}
                  disabled={isCompleting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isCompleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Confirm Completion
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 shadow-md">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary/10">Overview</TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-primary/10">Documents</TabsTrigger>
          <TabsTrigger value="progress" className="data-[state=active]:bg-primary/10">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="hover:shadow-lg transition-shadow border-primary/10">
              <CardHeader className="bg-gray-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md transition-colors">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{project.userName}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md transition-colors">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <span>{project.email}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md transition-colors">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <span>{project.contact}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md transition-colors">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span>{project.location}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow border-primary/10">
                <CardHeader className="bg-gray-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    System Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-5">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                    <span className="text-gray-700">System Size</span>
                    <span className="font-medium">{project.systemSize} kW</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                    <span className="text-gray-700">Installation Date</span>
                    <span className="font-medium">{project.installationDate || 'Pending'}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                    <span className="text-gray-700">Completion Date</span>
                    <span className="font-medium">{project.completionDate || 'Pending'}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                    <span className="text-gray-700">Project Created</span>
                    <span className="font-medium">{new Date(project.date).toLocaleDateString()}</span>
                  </div>
                  
                  <motion.div 
                    className={cn(
                      "flex justify-between items-center p-3 rounded-md",
                      project.status === 'completed' ? 'bg-green-50 hover:bg-green-100' : 'bg-amber-50 hover:bg-amber-100',
                      "transition-colors"
                    )}
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="text-gray-700">Status</span>
                    <Badge className={`${statusColors[project.status] || ''} flex items-center`}>
                      {statusIcons[project.status]}
                      {project.status?.toUpperCase()}
                    </Badge>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="hover:shadow-lg transition-shadow border-primary/10">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Project Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.documents && Object.entries(project.documents).map(([key, value], index) => (
                  <motion.div 
                    key={key}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors shadow-sm hover:shadow"
                    whileHover={{ y: -2 }}
                  >
                    <span className="capitalize flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
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
                          <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90">
                            <Download className="h-4 w-4 mr-2" /> Download
                          </Button>
                        </a>
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-gray-500">Not uploaded</Badge>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress">
          <Card className="hover:shadow-lg transition-shadow border-primary/10">
            <CardHeader className="bg-gray-50 rounded-t-lg flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Project Timeline
              </CardTitle>
              <Dialog open={isProgressDialogOpen} onOpenChange={setIsProgressDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-primary hover:bg-primary/90 shadow-sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Progress
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Add Progress Update</DialogTitle>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="progress">Progress Status</Label>
                      <Input
                        id="progress"
                        placeholder="e.g., Installation Started"
                        value={progressStatus}
                        onChange={(e) => setProgressStatus(e.target.value)}
                        className="border-primary/20 focus:border-primary"
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
                        className="bg-primary hover:bg-primary/90"
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
            <CardContent className="p-5">
              <div className="relative">
                {project.progress && project.progress.length > 0 ? (
                  <div className="space-y-0">
                    {project.progress.map((step, index) => (
                      <motion.div 
                        key={index} 
                        className="mb-8 flex gap-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shadow-md">
                            {index + 1}
                          </div>
                          {index < project.progress.length - 1 && (
                            <div className="w-0.5 h-full bg-primary/20 mt-2" />
                          )}
                        </div>
                        <div className="flex-1">
                          <motion.div 
                            className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-all"
                            whileHover={{ scale: 1.02 }}
                          >
                            <h3 className="font-medium text-primary">{step.status}</h3>
                            <p className="text-sm text-muted-foreground flex items-center mt-2">
                              <Calendar className="h-4 w-4 mr-2" />
                              {new Date(step.date).toLocaleDateString()}
                            </p>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
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

      {project.status === 'completed' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-green-800">Project Successfully Completed</h3>
              <p className="text-green-700">This project was completed on {project.completionDate || 'N/A'}</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
