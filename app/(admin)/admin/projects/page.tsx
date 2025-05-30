'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FileUploader } from '@/components/FileUploader'
import { 
  Search, 
  Loader2, 
  ArrowLeft, 
  Plus, 
  AlertTriangle, 
  MoreVertical, 
  Edit, 
  Trash2, 
  AlertCircle,
  CheckCircle2,
  Clock,
  ClipboardCheck,
  BarChart3,
  Filter,
  Mail,
  Phone,
  MapPin,
  Tag,
  FileText,
  FileDown
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from '@/lib/utils'
import ProjectPdfGenerator from '@/components/projects/ProjectPdfGenerator'

interface Project {
  _id: string
  projectId: string
  title: string
  userName: string
  email: string
  contact: string
  location: string
  date: string
  systemSize: string
  installationDate: string
  completionDate: string
  status: 'pending' | 'approved' | 'completed'
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

interface FormData {
  title: string;
  userName: string;
  email: string;
  contact: string;
  location: string;
  systemSize: string;
  documents: {
    nic: { fileId: string; webViewLink: string } | null;
    proposal: { fileId: string; webViewLink: string } | null;
    lightBill: { fileId: string; webViewLink: string } | null;
    clearanceLetter: { fileId: string; webViewLink: string } | null;
    cebAgreement: { fileId: string; webViewLink: string } | null;
    cebApplication: { fileId: string; webViewLink: string } | null;
    maintenanceAgreement: { fileId: string; webViewLink: string } | null;
  }
}

// Define Zod schema for form validation
const projectSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }).max(100, { message: "Title must be less than 100 characters" }),
  userName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  contact: z.string().regex(/^[0-9+\-\s]{10,15}$/, { message: "Please enter a valid phone number" }),
  location: z.string().min(5, { message: "Location must be at least 5 characters" }),
  systemSize: z.string().regex(/^\d+(\.\d+)?$/, { message: "System size must be a valid number" }),
  documents: z.object({
    nic: z.nullable(z.object({
      fileId: z.string(),
      webViewLink: z.string()
    })),
    proposal: z.nullable(z.object({
      fileId: z.string(),
      webViewLink: z.string()
    })),
    lightBill: z.nullable(z.object({
      fileId: z.string(),
      webViewLink: z.string()
    })),
    clearanceLetter: z.nullable(z.object({
      fileId: z.string(),
      webViewLink: z.string()
    })),
    cebAgreement: z.nullable(z.object({
      fileId: z.string(),
      webViewLink: z.string()
    })),
    cebApplication: z.nullable(z.object({
      fileId: z.string(),
      webViewLink: z.string()
    })),
    maintenanceAgreement: z.nullable(z.object({
      fileId: z.string(),
      webViewLink: z.string()
    }))
  })
})

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false)
  const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const { successt, errort } = useToast()

  const [formData, setFormData] = useState<FormData>({
    title: '',
    userName: '',
    email: '',
    contact: '',
    location: '',
    systemSize: '',
    documents: {
      nic: null,
      proposal: null,
      lightBill: null,
      clearanceLetter: null,
      cebAgreement: null,
      cebApplication: null,
      maintenanceAgreement: null
    }
  })

  // Initialize React Hook Form with Zod validation
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      userName: '',
      email: '',
      contact: '',
      location: '',
      systemSize: '',
      documents: {
        nic: null,
        proposal: null,
        lightBill: null,
        clearanceLetter: null,
        cebAgreement: null,
        cebApplication: null,
        maintenanceAgreement: null
      }
    }
  })

  // Form for editing projects
  const editForm = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      userName: '',
      email: '',
      contact: '',
      location: '',
      systemSize: '',
      documents: {
        nic: null,
        proposal: null,
        lightBill: null,
        clearanceLetter: null,
        cebAgreement: null,
        cebApplication: null,
        maintenanceAgreement: null
      }
    }
  })

  // Use useCallback to memoize the fetchProjects function to prevent unnecessary re-renders
  const fetchProjects = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/projects/', {
        // Add cache: 'no-store' to prevent caching issues
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
      errort({
        title: "Error",
        description: "Failed to load projects",
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
    
    // Cleanup function to prevent memory leaks
    return () => {
      // Cancel any pending requests or timers here if needed
    }
  }, [fetchProjects])

  const filteredProjects = projects.filter(project => {
    // First apply text search
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.projectId.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Then apply status filter if not set to 'all'
    if (statusFilter !== 'all') {
      return matchesSearch && project.status === statusFilter;
    }
    
    return matchesSearch;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleDocumentChange = (documentType: string, fileInfo: { fileId: string; webViewLink: string } | null) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: fileInfo
      }
    }))
    
    // Update form state for validation
    form.setValue(`documents.${documentType}` as any, fileInfo);
  }

  const handleFormSubmit = async (values: z.infer<typeof projectSchema>) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Failed to create project');
      }
      
      const result = await response.json();
      
      // Reset form
      form.reset();
      setFormData({
        title: '',
        userName: '',
        email: '',
        contact: '',
        location: '',
        systemSize: '',
        documents: {
          nic: null,
          proposal: null,
          lightBill: null,
          clearanceLetter: null,
          cebAgreement: null,
          cebApplication: null,
          maintenanceAgreement: null
        }
      });
      
      // Close dialog and show success message
      setIsDialogOpen(false);
      
      successt({
        title: "Success",
        description: "Project created successfully",
      });
      
      // Refresh the projects list
      fetchProjects();
    } catch (error: any) {
      console.error('Project creation error:', error);
      errort({
        title: "Error",
        description: error.message || "Failed to create project",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit(handleFormSubmit)();
  };

  const handleEditDialogOpen = (project: Project) => {
    setSelectedProject(project);
    
    // Populate the form with the selected project data
    setFormData({
      title: project.title,
      userName: project.userName,
      email: project.email,
      contact: project.contact,
      location: project.location,
      systemSize: project.systemSize,
      documents: {
        ...project.documents
      }
    });
    
    // Update the edit form with the project data
    editForm.reset({
      title: project.title,
      userName: project.userName,
      email: project.email,
      contact: project.contact,
      location: project.location,
      systemSize: project.systemSize,
      documents: {
        ...project.documents
      }
    });
    
    setIsEditDialogOpen(true);
  };

  const handleEditFormSubmit = async (values: z.infer<typeof projectSchema>) => {
    if (!selectedProject) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/projects/${selectedProject._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update project');
      }
      
      // Close dialog and show success message
      setIsEditDialogOpen(false);
      successt({
        title: "Success",
        description: "Project updated successfully",
      });
      
      // Refresh the projects list
      fetchProjects();
    } catch (error: any) {
      console.error('Project update error:', error);
      errort({
        title: "Error",
        description: error.message || "Failed to update project",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    editForm.handleSubmit(handleEditFormSubmit)();
  };

  const handleDeleteClick = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedProject) return;
    
    try {
      const response = await fetch(`/api/projects/${selectedProject._id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete project');
      }
      
      // Close dialog and show success message
      setIsDeleteDialogOpen(false);
      successt({
        title: "Success",
        description: "Project deleted successfully",
      });
      
      // Refresh the projects list
      fetchProjects();
    } catch (error: any) {
      console.error('Project deletion error:', error);
      errort({
        title: "Error",
        description: error.message || "Failed to delete project",
      });
    }
  };

  const handleCompleteClick = (project: Project) => {
    setSelectedProject(project);
    setIsCompleteDialogOpen(true);
  };

  const handlePdfClick = (project: Project) => {
    setSelectedProject(project);
    setIsPdfDialogOpen(true);
  };

  const handleMarkAsComplete = async () => {
    if (!selectedProject) return;
    
    setIsCompleting(true);
    
    try {
      const response = await fetch(`/api/projects/${selectedProject._id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark project as complete');
      }
      
      const result = await response.json();
      
      // Close dialog and show success message
      setIsCompleteDialogOpen(false);
      successt({
        title: "Project Completed",
        description: "Project has been marked as complete and maintenance has been scheduled",
      });
      
      // Show a success notification with the maintenance info
      setTimeout(() => {
        successt({
          title: "Maintenance Scheduled",
          description: `Annual maintenance scheduled for ${new Date(result.maintenanceRecord.maintenanceDate).toLocaleDateString()}`,
        });
      }, 1000);
      
      // Refresh the projects list
      fetchProjects();
    } catch (error: any) {
      console.error('Error marking project as complete:', error);
      errort({
        title: "Error",
        description: error.message || "Failed to mark project as complete",
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

  // Reset all dialogs - this helps prevent the UI from becoming unresponsive
  const resetAllDialogs = () => {
    setIsDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setIsCompleteDialogOpen(false);
    setIsPdfDialogOpen(false);
    setIsSubmitting(false);
    setIsCompleting(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 bg-background rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Link href="/admin">
            <Button variant="outline" className="hover:bg-primary/10 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </Link>
          <motion.h1 
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="text-2xl md:text-3xl font-bold text-primary"
          >
            Solar Projects
          </motion.h1>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2  group-hover:text-primary transition-colors" />
            <Input
              placeholder="Search projects..."
              className="pl-10 transition-all border-gray-200 hover:border-primary focus:ring-2 focus:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="w-full sm:w-auto">
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="border-gray-200 hover:border-primary focus:ring-2 focus:ring-primary/20 w-full sm:w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 " />
                  <SelectValue placeholder="Filter by status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="pending">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                    Pending
                  </div>
                </SelectItem>
                <SelectItem value="approved">
                  <div className="flex items-center">
                    <ClipboardCheck className="h-4 w-4 mr-2 text-blue-600" />
                    Approved
                  </div>
                </SelectItem>
                <SelectItem value="completed">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                    Completed
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetAllDialogs();
          }}>
            <DialogTrigger asChild>
              <Button className="whitespace-nowrap bg-primary hover:bg-primary/90 transition-colors shadow-md">
                <Plus className="mr-2 h-4 w-4" /> Add New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center pb-2">Add New Project</DialogTitle>
                <DialogDescription className="text-center ">
                  Fill in the project details and upload required documents
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[80vh] px-2">
                <Form {...form}>
                  <form onSubmit={handleSubmit} className="space-y-8 p-5">
                    <div className="mt-8 space-y-4">

                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 shadow-sm">
                        <p className="text-amber-700 text-sm font-medium flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Important: Please follow these steps carefully:
                        </p>
                        <ol className="mt-2 text-amber-700 text-sm list-decimal list-inside space-y-1">
                          <li>Upload all required documents one by one in their respective sections</li>
                          <li>Ensure each document is correct before uploading as they cannot be modified later</li>
                          <li>After uploading all documents, fill in the customer information form below</li>
                          <li>Review all information before clicking the "Submit Project" button</li>
                        </ol>
                      </div>

                      <h1 className='text-xl font-semibold '>Project documents</h1>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:border-primary/20 transition-all">
                          <Label className="text-sm font-medium">NIC Copy</Label>
                          <FileUploader 
                            accept=".pdf,.jpg,.png" 
                            documentType="nic"
                            onChange={(fileInfo) => handleDocumentChange('nic', fileInfo)}
                          />
                          <p className="text-xs  mt-1">Accepted formats: PDF, JPG, PNG</p>
                        </div>
                        <div className="space-y-2 p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:border-primary/20 transition-all">
                          <Label className="text-sm font-medium">Proposal</Label>
                          <FileUploader 
                            accept=".pdf,.doc,.docx" 
                            documentType="proposal"
                            onChange={(fileInfo) => handleDocumentChange('proposal', fileInfo)}
                          />
                          <p className="text-xs  mt-1">Accepted formats: PDF, DOC, DOCX</p>
                        </div>
                        <div className="space-y-2 p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:border-primary/20 transition-all">
                        <Label className="text-sm font-medium">Light Bill</Label>
                          <FileUploader 
                            accept=".pdf,.jpg,.png" 
                            documentType="lightBill"
                            onChange={(fileInfo) => handleDocumentChange('lightBill', fileInfo)}
                          />
                          <p className="text-xs  mt-1">Accepted formats: PDF, JPG, PNG</p>
                        </div>
                        <div className="space-y-2 p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:border-primary/20 transition-all">
                          <Label className="text-sm font-medium">Clearance Letter</Label>
                          <FileUploader 
                            accept=".pdf" 
                            documentType="clearanceLetter"
                            onChange={(fileInfo) => handleDocumentChange('clearanceLetter', fileInfo)}
                          />
                          <p className="text-xs  mt-1">Accepted format: PDF only</p>
                        </div>
                        <div className="space-y-2 p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:border-primary/20 transition-all">
                          <Label className="text-sm font-medium">CEB Agreement</Label>
                          <FileUploader 
                            accept=".pdf" 
                            documentType="cebAgreement"
                            onChange={(fileInfo) => handleDocumentChange('cebAgreement', fileInfo)}
                          />
                          <p className="text-xs  mt-1">Accepted format: PDF only</p>
                        </div>
                        <div className="space-y-2 p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:border-primary/20 transition-all">
                          <Label className="text-sm font-medium">CEB Application Form</Label>
                          <FileUploader 
                            accept=".pdf" 
                            documentType="cebApplication"
                            onChange={(fileInfo) => handleDocumentChange('cebApplication', fileInfo)}
                          />
                          <p className="text-xs  mt-1">Accepted format: PDF only</p>
                        </div>
                        <div className="space-y-2 p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:border-primary/20 transition-all">
                          <Label className="text-sm font-medium">Maintenance Agreement</Label>
                          <FileUploader 
                            accept=".pdf" 
                            documentType="maintenanceAgreement"
                            onChange={(fileInfo) => handleDocumentChange('maintenanceAgreement', fileInfo)}
                          />
                          <p className="text-xs  mt-1">Accepted format: PDF only</p>
                        </div>
                      </div>
                    </div>
                    
                    <h1 className='text-xl font-semibold '>Project details</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-sm font-medium">Project Title</FormLabel>
                            <FormControl>
                              <Input 
                                {...field}
                                id="title" 
                                placeholder='Enter project title'
                                className="transition-all hover:border-primary focus:ring-2 focus:ring-primary/20"
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleInputChange(e);
                                }}
                              />
                            </FormControl>
                            <FormMessage className="text-xs text-red-500 flex items-center mt-1">
                              {form.formState.errors.title && (
                                <AlertCircle className="h-3 w-3 mr-1 text-red-500" />
                              )}
                              {form.formState.errors.title?.message}
                            </FormMessage>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="userName"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-sm font-medium">User Name</FormLabel>
                            <FormControl>
                              <Input 
                                {...field}
                                id="userName" 
                                placeholder='Enter customer name'
                                className="transition-all hover:border-primary focus:ring-2 focus:ring-primary/20"
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleInputChange(e);
                                }}
                              />
                            </FormControl>
                            <FormMessage className="text-xs text-red-500 flex items-center mt-1">
                              {form.formState.errors.userName && (
                                <AlertCircle className="h-3 w-3 mr-1 text-red-500" />
                              )}
                              {form.formState.errors.userName?.message}
                            </FormMessage>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-sm font-medium">Email</FormLabel>
                            <FormControl>
                              <Input 
                                {...field}
                                id="email" 
                                type="email" 
                                placeholder='Enter customer email'
                                className="transition-all hover:border-primary focus:ring-2 focus:ring-primary/20"
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleInputChange(e);
                                }}
                                />
                                </FormControl>
                                <FormMessage className="text-xs text-red-500 flex items-center mt-1">
                                  {form.formState.errors.email && (
                                    <AlertCircle className="h-3 w-3 mr-1 text-red-500" />
                                  )}
                                  {form.formState.errors.email?.message}
                                </FormMessage>
                              </FormItem>
                            )}
                          />
    
                          <FormField
                            control={form.control}
                            name="contact"
                            render={({ field }) => (
                              <FormItem className="space-y-2">
                                <FormLabel className="text-sm font-medium">Contact</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field}
                                    id="contact" 
                                    placeholder='Enter customer contact number'
                                    className="transition-all hover:border-primary focus:ring-2 focus:ring-primary/20"
                                    onChange={(e) => {
                                      field.onChange(e);
                                      handleInputChange(e);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs text-red-500 flex items-center mt-1">
                                  {form.formState.errors.contact && (
                                    <AlertCircle className="h-3 w-3 mr-1 text-red-500" />
                                  )}
                                  {form.formState.errors.contact?.message}
                                </FormMessage>
                              </FormItem>
                            )}
                          />
    
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem className="space-y-2 md:col-span-2">
                                <FormLabel className="text-sm font-medium">Location</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field}
                                    id="location" 
                                    placeholder='Enter customer address'
                                    className="transition-all hover:border-primary focus:ring-2 focus:ring-primary/20"
                                    onChange={(e) => {
                                      field.onChange(e);
                                      handleInputChange(e);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs text-red-500 flex items-center mt-1">
                                  {form.formState.errors.location && (
                                    <AlertCircle className="h-3 w-3 mr-1 text-red-500" />
                                  )}
                                  {form.formState.errors.location?.message}
                                </FormMessage>
                              </FormItem>
                            )}
                          />
    
                          <FormField
                            control={form.control}
                            name="systemSize"
                            render={({ field }) => (
                              <FormItem className="space-y-2">
                                <FormLabel className="text-sm font-medium">System Size (kW)</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field}
                                    id="systemSize" 
                                    placeholder='Enter system size in kW'
                                    className="transition-all hover:border-primary focus:ring-2 focus:ring-primary/20"
                                    onChange={(e) => {
                                      field.onChange(e);
                                      handleInputChange(e);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs text-red-500 flex items-center mt-1">
                                  {form.formState.errors.systemSize && (
                                    <AlertCircle className="h-3 w-3 mr-1 text-red-500" />
                                  )}
                                  {form.formState.errors.systemSize?.message}
                                </FormMessage>
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex justify-end gap-4 pt-4 border-t">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsDialogOpen(false)}
                            disabled={isSubmitting}
                            className="hover:bg-gray-100 transition-colors"
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-primary hover:bg-primary/90 transition-colors shadow-sm"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              'Submit Project'
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
          </div>
    
          {/* Edit Project Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) resetAllDialogs();
          }}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center pb-2">Edit Project</DialogTitle>
                <DialogDescription className="text-center ">
                  Update the project details
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[80vh] px-2">
                <Form {...editForm}>
                  <form onSubmit={handleUpdate} className="space-y-8 p-5">
                    <div className="mt-4 space-y-4">
                      <h1 className='text-xl font-semibold '>Project details</h1>
    
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={editForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="text-sm font-medium">Project Title</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field}
                                  id="title" 
                                  placeholder='Enter project title'
                                  className="transition-all hover:border-primary focus:ring-2 focus:ring-primary/20"
                                  onChange={(e) => {
                                    field.onChange(e);
                                    handleInputChange(e);
                                  }}
                                />
                              </FormControl>
                              <FormMessage className="text-xs text-red-500 flex items-center mt-1">
                                {editForm.formState.errors.title && (
                                  <AlertCircle className="h-3 w-3 mr-1 text-red-500" />
                                )}
                                {editForm.formState.errors.title?.message}
                              </FormMessage>
                            </FormItem>
                          )}
                        />
    
                        <FormField
                          control={editForm.control}
                          name="userName"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="text-sm font-medium">User Name</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field}
                                  id="userName" 
                                  placeholder='Enter customer name'
                                  className="transition-all hover:border-primary focus:ring-2 focus:ring-primary/20"
                                  onChange={(e) => {
                                    field.onChange(e);
                                    handleInputChange(e);
                                  }}
                                />
                              </FormControl>
                              <FormMessage className="text-xs text-red-500 flex items-center mt-1">
                                {editForm.formState.errors.userName && (
                                  <AlertCircle className="h-3 w-3 mr-1 text-red-500" />
                                )}
                                {editForm.formState.errors.userName?.message}
                              </FormMessage>
                            </FormItem>
                          )}
                        />
    
                        <FormField
                          control={editForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="text-sm font-medium">Email</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field}
                                  id="email" 
                                  type="email" 
                                  placeholder='Enter customer email'
                                  className="transition-all hover:border-primary focus:ring-2 focus:ring-primary/20"
                                  onChange={(e) => {
                                    field.onChange(e);
                                    handleInputChange(e);
                                  }}
                                />
                              </FormControl>
                              <FormMessage className="text-xs text-red-500 flex items-center mt-1">
                                {editForm.formState.errors.email && (
                                  <AlertCircle className="h-3 w-3 mr-1 text-red-500" />
                                )}
                                {editForm.formState.errors.email?.message}
                              </FormMessage>
                            </FormItem>
                          )}
                        />
    
                        <FormField
                          control={editForm.control}
                          name="contact"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="text-sm font-medium">Contact</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field}
                                  id="contact" 
                                  placeholder='Enter customer contact number'
                                  className="transition-all hover:border-primary focus:ring-2 focus:ring-primary/20"
                                  onChange={(e) => {
                                    field.onChange(e);
                                    handleInputChange(e);
                                  }}
                                />
                              </FormControl>
                              <FormMessage className="text-xs text-red-500 flex items-center mt-1">
                                {editForm.formState.errors.contact && (
                                  <AlertCircle className="h-3 w-3 mr-1 text-red-500" />
                                )}
                                {editForm.formState.errors.contact?.message}
                              </FormMessage>
                            </FormItem>
                          )}
                        />
    
                        <FormField
                          control={editForm.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem className="space-y-2 md:col-span-2">
                              <FormLabel className="text-sm font-medium">Location</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field}
                                  id="location" 
                                  placeholder='Enter customer address'
                                  className="transition-all hover:border-primary focus:ring-2 focus:ring-primary/20"
                                  onChange={(e) => {
                                    field.onChange(e);
                                    handleInputChange(e);
                                  }}
                                />
                              </FormControl>
                              <FormMessage className="text-xs text-red-500 flex items-center mt-1">
                                {editForm.formState.errors.location && (
                                  <AlertCircle className="h-3 w-3 mr-1 text-red-500" />
                                )}
                                {editForm.formState.errors.location?.message}
                              </FormMessage>
                            </FormItem>
                          )}
                        />
    
                        <FormField
                          control={editForm.control}
                          name="systemSize"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="text-sm font-medium">System Size (kW)</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field}
                                  id="systemSize" 
                                  placeholder='Enter system size in kW'
                                  className="transition-all hover:border-primary focus:ring-2 focus:ring-primary/20"
                                  onChange={(e) => {
                                    field.onChange(e);
                                    handleInputChange(e);
                                  }}
                                />
                              </FormControl>
                              <FormMessage className="text-xs text-red-500 flex items-center mt-1">
                                {editForm.formState.errors.systemSize && (
                                  <AlertCircle className="h-3 w-3 mr-1 text-red-500" />
                                )}
                                {editForm.formState.errors.systemSize?.message}
                              </FormMessage>
                            </FormItem>
                          )}
                        />
                      </div>
    
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4 shadow-sm">
                        <p className="text-blue-700 text-sm font-medium flex items-center">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Note: Documents cannot be modified after project creation.
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4 border-t">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsEditDialogOpen(false)}
                        disabled={isSubmitting}
                        className="hover:bg-gray-100 transition-colors"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-primary hover:bg-primary/90 transition-colors shadow-sm"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          'Update Project'
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </ScrollArea>
            </DialogContent>
          </Dialog>
    
          {/* Mark as Complete Dialog */}
          <Dialog open={isCompleteDialogOpen} onOpenChange={(open) => {
            setIsCompleteDialogOpen(open);
            if (!open) resetAllDialogs();
          }}>
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
              className="bg-green-600 hover:bg-green-700 shadow-sm"
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

      {/* PDF Generator Dialog */}
      <Dialog open={isPdfDialogOpen} onOpenChange={(open) => {
        setIsPdfDialogOpen(open);
        if (!open) resetAllDialogs();
      }}>
        <DialogContent className="sm:max-w-xl max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Generate Project Report</DialogTitle>
            <DialogDescription>
              Generate a professional PDF report for this project
            </DialogDescription>
          </DialogHeader>
          
          {selectedProject && (
            <div className="py-4">
              <ProjectPdfGenerator project={selectedProject} />
            </div>
          )}
          
          <div className="flex justify-end mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsPdfDialogOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={(open) => {
        setIsDeleteDialogOpen(open);
        if (!open) resetAllDialogs();
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project
              "{selectedProject?.title}" and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Project count summary */}
      {!isLoading && filteredProjects.length > 0 && (
        <div className="mb-8 flex flex-wrap justify-center gap-4">
          <div className="bg-card rounded-lg shadow-sm border px-5 py-3 flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm ">Total Projects</p>
              <p className="text-lg font-semibold">{projects.length}</p>
            </div>
          </div>
          
          <div className="bg-card rounded-lg shadow-sm border  px-5 py-3 flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-full">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm ">Pending</p>
              <p className="text-lg font-semibold">{projects.filter(p => p.status === 'pending').length}</p>
            </div>
          </div>
          
          <div className="bg-card rounded-lg shadow-sm border px-5 py-3 flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <ClipboardCheck className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm ">Approved</p>
              <p className="text-lg font-semibold">{projects.filter(p => p.status === 'approved').length}</p>
            </div>
          </div>
          
          <div className="bg-card rounded-lg shadow-sm border  px-5 py-3 flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm ">Completed</p>
              <p className="text-lg font-semibold">{projects.filter(p => p.status === 'completed').length}</p>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg">Loading projects...</p>
        </div>
      ) : (
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center min-h-[300px] p-4 sm:p-6 lg:p-8 bg-card rounded-lg shadow-sm">
              <div className="animate-bounce mb-6">
                  <Search className="w-12 h-12 sm:w-16 sm:h-16 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 ">No Projects Found</h3>
              <p className=" text-sm sm:text-base max-w-md mx-auto text-center">
                  We couldn't find any projects matching your search criteria. Please try adjusting your filters or search terms.
              </p>
            </div>
          ) : (
            <>
              {statusFilter !== 'all' && (
                <div className="col-span-full mb-2">
                  <Badge className={cn(
                    "text-sm px-4 py-2 border-2 font-medium",
                    statusFilter === 'pending' && 'bg-yellow-100 text-yellow-800 border-yellow-300',
                    statusFilter === 'approved' && 'bg-blue-100 text-blue-800 border-blue-300',
                    statusFilter === 'completed' && 'bg-green-100 text-green-800 border-green-300'
                  )}>
                    {statusIcons[statusFilter as keyof typeof statusIcons]}
                    Showing {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Projects ({filteredProjects.length})
                  </Badge>
                </div>
              )}
              
              <AnimatePresence>
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    <Card className="hover:shadow-lg transition-shadow border overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <CardTitle className="text-lg">{project.title}</CardTitle>
                            <CardDescription className="flex flex-col space-y-1">
                              <div className="flex flex-col sm:flex-row gap-2 mb-1">
                                <Badge className="bg-lime-100 text-lime-800 border-2 border-green-600 px-2 py-1 text-xs font-medium max-w-fit">
                                  <Tag className="h-3 w-3 mr-1" />
                                  {project.projectId}
                                </Badge>
                                <Badge className={cn(
                                  "flex items-center max-w-fit text-xs font-medium px-2 py-1",
                                  statusColors[project.status]
                                )}>
                                  {statusIcons[project.status]}
                                  {project.status.toUpperCase()}
                                </Badge>
                              </div>
                            </CardDescription>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="flex items-center cursor-pointer"
                                onClick={() => handleEditDialogOpen(project)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Project
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center cursor-pointer"
                                onClick={() => handlePdfClick(project)}
                              >
                                <FileDown className="mr-2 h-4 w-4" />
                                Generate PDF
                              </DropdownMenuItem>
                              {project.status !== 'completed' && (
                                <DropdownMenuItem
                                  className="flex items-center text-green-600 cursor-pointer focus:text-green-700"
                                  onClick={() => handleCompleteClick(project)}
                                >
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Mark as Complete
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                className="flex items-center text-red-600 cursor-pointer focus:text-red-700"
                                onClick={() => handleDeleteClick(project)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Project
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="flex items-center gap-1 ">
                              <FileText className="h-4 w-4 " />
                              {project.userName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="flex items-center gap-1 ">
                              <MapPin className="h-4 w-4 " />
                              {project.location}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <div className="flex justify-between items-center p-2 bg-background rounded text-sm">
                              <span className="">System:</span>
                              <span className="font-medium">{project.systemSize} kW</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-background rounded text-sm">
                              <span className="">Created:</span>
                              <span className="font-medium">{new Date(project.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center space-x-4 text-sm">
                            <div className="flex items-center gap-1 ">
                              <Mail className="h-4 w-4 " />
                              <span className="text-blue-600 truncate max-w-[150px]">{project.email}</span>
                            </div>
                            <div className="flex items-center gap-1 ">
                              <Phone className="h-4 w-4 " />
                              <span>{project.contact}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-3 border-t">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handlePdfClick(project)}
                          className="hover:bg-primary/10"
                        >
                          <FileDown className="mr-2 h-4 w-4" /> PDF
                        </Button>
                        <div className="flex gap-2">
                          {project.status !== 'completed' && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleCompleteClick(project)}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" /> Complete
                            </Button>
                          )}
                          <Link href={`/admin/projects/${project._id}`}>
                            <Button size="sm" className="bg-primary hover:bg-primary/90">View Details</Button>
                          </Link>
                        </div>
                      </CardFooter>
                      {project.status === 'completed' && (
                        <div className="px-4 py-2 bg-green-200 border-t-2 border-green-500 text-sm flex items-center gap-2 text-black">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span>Completed on {project.completionDate || 'N/A'}</span>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </>
          )}
        </div>
      )}
    </motion.div>
  )
}
    
