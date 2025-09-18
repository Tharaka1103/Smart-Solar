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
  Tag,
  Upload,
  Trash2,
  Edit,
  AlertCircle,
  User,
  Building,
  Zap,
  Eye,
  Star
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
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

const documentLabels = {
  nic: 'National ID Copy',
  proposal: 'Project Proposal',
  lightBill: 'Electricity Bill',
  clearanceLetter: 'Clearance Letter',
  cebAgreement: 'CEB Agreement',
  cebApplication: 'CEB Application',
  maintenanceAgreement: 'Maintenance Agreement'
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
  
  // Document upload states
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [uploadingDocumentType, setUploadingDocumentType] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [deletingDocument, setDeletingDocument] = useState<string>('')
  
  const { toast } = useToast()

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
      toast({
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
      toast({
        title: "Progress Updated",
        description: "Project progress has been updated successfully",
      })
    } catch (error) {
      console.error('Error updating progress:', error)
      toast({
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
      toast({
        title: "Status Updated",
        description: "Project status has been updated successfully",
      })
    } catch (error) {
      console.error('Error updating project status:', error)
      toast({
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
      
      toast({
        title: "Project Completed",
        description: "Project has been marked as complete and maintenance has been scheduled",
      });
      
      setTimeout(() => {
        toast({
          title: "Maintenance Scheduled",
          description: `Annual maintenance scheduled for ${new Date(result.maintenanceRecord.maintenanceDate).toLocaleDateString()}`,
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error marking project as complete:', error);
      toast({
        title: "Error",
        description: "Failed to mark project as complete",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !uploadingDocumentType) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('documentType', uploadingDocumentType);

      const response = await fetch(`/api/projects/${id}/documents`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload document');
      }

      const updatedProject = await response.json();
      setProject(updatedProject);
      setSelectedFile(null);
      setUploadingDocumentType('');
      setIsUploadDialogOpen(false);
      
      toast({
        title: "Document Uploaded",
        description: `${documentLabels[uploadingDocumentType as keyof typeof documentLabels]} has been uploaded successfully`,
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (documentType: string) => {
    setDeletingDocument(documentType);
    
    try {
      const response = await fetch(`/api/projects/${id}/documents/${documentType}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      const updatedProject = await response.json();
      setProject(updatedProject);
      
      toast({
        title: "Document Deleted",
        description: `${documentLabels[documentType as keyof typeof documentLabels]} has been deleted successfully`,
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete document. Please try again.",
      });
    } finally {
      setDeletingDocument('');
    }
  };

  const openUploadDialog = (documentType: string) => {
    setUploadingDocumentType(documentType);
    setSelectedFile(null);
    setIsUploadDialogOpen(true);
  };

  const statusConfig = {
    pending: {
      color: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: <Clock className="h-4 w-4" />,
      label: 'Pending Review'
    },
    approved: {
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: <ClipboardCheck className="h-4 w-4" />,
      label: 'Approved'
    },
    completed: {
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: <CheckCircle2 className="h-4 w-4" />,
      label: 'Completed'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
            <Zap className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Project Details</h3>
          <p className="text-gray-600">Please wait while we fetch the project information...</p>
        </motion.div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h2>
          <p className="text-gray-600 mb-8">The project you're looking for doesn't exist or has been removed from the system.</p>
          <Link href="/admin/projects">
            <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/admin/projects">
            <Button variant="ghost" className="mb-6 hover:bg-green-50 text-green-700 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Building className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{project.title}</h1>
                    <p className="text-gray-500 text-sm">ID: {project._id}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <Badge className={`${statusConfig[project.status].color} px-4 py-2 font-medium border`}>
                  {statusConfig[project.status].icon}
                  <span className="ml-2">{statusConfig[project.status].label}</span>
                </Badge>
                <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2 font-medium">
                  <Tag className="h-4 w-4 mr-2" />
                  {project.projectId}
                </Badge>
                {project.status !== 'completed' && (
                  <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark Complete
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          Complete Project
                        </DialogTitle>
                        <DialogDescription>
                          Mark this project as completed and schedule maintenance.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mt-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                          <div className="text-sm text-amber-800">
                            <p className="font-medium mb-2">This action will:</p>
                            <ul className="space-y-1 list-disc list-inside">
                              <li>Set project status to "Completed"</li>
                              <li>Record today as completion date</li>
                              <li>Schedule annual maintenance</li>
                              <li>Send completion notifications</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 mt-6">
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
                              Confirm
                            </>
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white rounded-xl shadow-sm border border-gray-200 p-1">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-lg transition-all"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="documents" 
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-lg transition-all"
              >
                <FileText className="h-4 w-4 mr-2" />
                Documents
              </TabsTrigger>
              <TabsTrigger 
                value="progress" 
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-lg transition-all"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Progress
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Information */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="h-full bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
                    <CardHeader className="bg-green-50 border-b border-green-100">
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <User className="h-5 w-5 text-green-600" />
                        </div>
                        Customer Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="font-semibold text-gray-900">{project.userName}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Mail className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Email Address</p>
                            <p className="font-semibold text-gray-900">{project.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Phone className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Phone Number</p>
                            <p className="font-semibold text-gray-900">{project.contact}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <MapPin className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="font-semibold text-gray-900">{project.location}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* System Information */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="h-full bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
                    <CardHeader className="bg-green-50 border-b border-green-100">
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Zap className="h-5 w-5 text-green-600" />
                        </div>
                        System Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-green-50 to-green-100 border border-green-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                              <Zap className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-medium text-gray-700">System Size</span>
                          </div>
                          <span className="text-xl font-bold text-green-600">{project.systemSize} kW</span>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3">
                          {[
                            { label: 'Installation Date', value: project.installationDate || 'Pending', icon: Calendar },
                            { label: 'Completion Date', value: project.completionDate || 'Pending', icon: CheckCircle2 },
                            { label: 'Project Created', value: new Date(project.date).toLocaleDateString(), icon: Star }
                          ].map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="flex items-center gap-3">
                                <item.icon className="h-5 w-5 text-gray-400" />
                                <span className="text-gray-700">{item.label}</span>
                              </div>
                              <span className="font-semibold text-gray-900">{item.value}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-6 p-4 rounded-lg border-2 border-dashed border-green-200 bg-green-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                {statusConfig[project.status].icon}
                              </div>
                              <span className="font-medium text-gray-700">Current Status</span>
                            </div>
                            <Badge className={`${statusConfig[project.status].color} border font-semibold`}>
                              {statusConfig[project.status].label}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            {/* Documents Tab */}
            
        <TabsContent value="documents">
  <Card className="hover:shadow-lg transition-shadow border-primary/10">
    <CardHeader className="bg-gray-50 rounded-t-lg">
      <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
        <FileText className="h-5 w-5 text-primary" />
        Project Documents
      </CardTitle>
    </CardHeader>
    <CardContent className="p-4 md:p-6">
      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {project.documents && Object.entries(project.documents).map(([key, value], index) => (
          <motion.div 
            key={key}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 hover:shadow-md transition-all duration-200 hover:border-primary/30"
            whileHover={{ y: -2 }}
          >
            {/* Document Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-tight mb-1">
                  {documentLabels[key as keyof typeof documentLabels] || key.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <div className="flex items-center gap-2">
                  {value ? (
                    <Badge className="bg-green-100 text-green-800 border-green-200 text-xs px-2 py-1">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Uploaded
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs px-2 py-1">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Document Actions */}
            {value ? (
              <div className="space-y-3">
                {/* Primary Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <a 
                    href={value.webViewLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button 
                      size="sm" 
                      className="w-full h-9 text-xs md:text-sm bg-blue-100 hover:bg-blue-50 border border-blue-300 text-blue-700 hover:text-blue-800"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </a>
                  <a 
                    href={`/api/download/${value.fileId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button 
                      size="sm" 
                      className="w-full h-9 text-xs md:text-sm bg-primary hover:bg-primary/90"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </a>
                </div>

                {/* Secondary Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => openUploadDialog(key)}
                    className="w-full h-9 text-xs md:text-sm hover:bg-green-50 bg-green-100 border border-green-300 text-green-700 hover:text-green-800"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Update
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        size="sm" 
                        className="w-full h-9 text-xs md:text-sm bg-red-100 hover:bg-red-50 border border-red-300 text-red-600 hover:text-red-700"
                        disabled={deletingDocument === key}
                      >
                        {deletingDocument === key ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </>
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="w-[95vw] max-w-md">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg font-semibold">
                          Delete Document
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-gray-600">
                          Are you sure you want to delete <span className="font-medium">{documentLabels[key as keyof typeof documentLabels]}</span>? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
                        <AlertDialogCancel className="w-full sm:w-auto">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteDocument(key)}
                          className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
                        >
                          Delete Document
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs md:text-sm text-gray-600 mb-3">
                    No document uploaded
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => openUploadDialog(key)}
                    className="w-full h-9 text-xs md:text-sm hover:bg-primary/5 border-primary/30 text-primary hover:text-primary"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {(!project.documents || Object.keys(project.documents).length === 0) && (
        <div className="text-center py-12 md:py-16">
          <div className="max-w-sm mx-auto">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
              No Documents Found
            </h3>
            <p className="text-sm md:text-base text-gray-500 leading-relaxed">
              Documents will appear here once they are uploaded to the project.
            </p>
          </div>
        </div>
      )}

      {/* Documents Summary */}
      {project.documents && Object.keys(project.documents).length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>
                  {Object.values(project.documents).filter(doc => doc !== null).length} Uploaded
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span>
                  {Object.values(project.documents).filter(doc => doc === null).length} Pending
                </span>
              </div>
            </div>
            <div className="text-xs md:text-sm text-gray-500">
              Total: {Object.keys(project.documents).length} documents
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Document Guidelines:</p>
            <ul className="list-disc list-inside space-y-1 text-xs md:text-sm text-blue-700">
              <li>Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG</li>
              <li>Maximum file size: 10MB per document</li>
              <li>Documents can be viewed online or downloaded</li>
              <li>Use "Update" to replace existing documents</li>
            </ul>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</TabsContent>


            {/* Progress Tab */}
            <TabsContent value="progress">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
                  <CardHeader className="bg-green-50 border-b border-green-100 flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-green-600" />
                      </div>
                      Project Timeline
                    </CardTitle>
                    <Dialog open={isProgressDialogOpen} onOpenChange={setIsProgressDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-green-600 hover:bg-green-700 text-white">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Progress
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <PlusCircle className="h-5 w-5 text-green-600" />
                            Add Progress Update
                          </DialogTitle>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="progress">Progress Status</Label>
                            <Input
                              id="progress"
                              placeholder="e.g., Site survey completed"
                              value={progressStatus}
                              onChange={(e) => setProgressStatus(e.target.value)}
                              className="border-green-200 focus:border-green-500"
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
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {isUpdating ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Adding...
                                </>
                              ) : (
                                <>
                                  <PlusCircle className="mr-2 h-4 w-4" />
                                  Add Progress
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent className="p-6">
                    {project.progress && project.progress.length > 0 ? (
                      <div className="relative">
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-green-200"></div>
                        <div className="space-y-6">
                          {project.progress.map((step, index) => (
                            <motion.div 
                              key={index} 
                              className="relative flex gap-6"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <div className="relative z-10 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
                                  <h3 className="font-semibold text-gray-900 mb-2">{step.status}</h3>
                                  <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(step.date).toLocaleDateString('en-US', { 
                                      weekday: 'long',
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Calendar className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Progress Updates</h3>
                        <p className="text-gray-500 mb-6">Start tracking project progress by adding your first update.</p>
                        <Dialog open={isProgressDialogOpen} onOpenChange={setIsProgressDialogOpen}>
                          <DialogTrigger asChild>
                            <Button className="bg-green-600 hover:bg-green-700 text-white">
                              <PlusCircle className="h-4 w-4 mr-2" />
                              Add First Update
                            </Button>
                          </DialogTrigger>
                        </Dialog>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Completion Status */}
        {project.status === 'completed' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-900">Project Successfully Completed!</h3>
                  <p className="text-green-700">
                    This project was completed on {project.completionDate ? new Date(project.completionDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Document Upload Dialog */}
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-green-600" />
                {project?.documents?.[uploadingDocumentType as keyof typeof project.documents] ? 'Update' : 'Upload'} Document
              </DialogTitle>
              <DialogDescription>
                {uploadingDocumentType && documentLabels[uploadingDocumentType as keyof typeof documentLabels]}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file">Select File</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="border-green-200 focus:border-green-500"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <p className="text-xs text-gray-500">
                  Supported: PDF, DOC, DOCX, JPG, JPEG, PNG (Max: 10MB)
                </p>
              </div>
              {selectedFile && (
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900">{selectedFile.name}</p>
                  <p className="text-xs text-green-700">Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              )}
              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsUploadDialogOpen(false)
                    setSelectedFile(null)
                    setUploadingDocumentType('')
                  }}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleFileUpload}
                  disabled={isUploading || !selectedFile}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      {project?.documents?.[uploadingDocumentType as keyof typeof project.documents] ? 'Update' : 'Upload'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}