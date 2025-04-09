'use client'

import { useState, useEffect } from 'react'
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
import { Search, Loader2, ArrowLeft, Plus, AlertTriangle, MoreVertical, Edit, Trash2, AlertCircle } from 'lucide-react'
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

interface Project {
  _id: string
  title: string
  userName: string
  email: string
  contact: string
  location: string
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
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const { successt, errort, warningt, infot, dismissAll } = useToast()

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

  const fetchProjects = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/projects/')
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
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
      
      // Log the raw response for debugging
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      // Parse the response text to JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing response:', e);
        throw new Error('Invalid response from server');
      }
      
      if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to create project');
      }
      
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

  const handleSubmit = async (e: React.FormEvent) => {
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

  const handleUpdate = async (e: React.FormEvent) => {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 bg-card rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Link href="/admin">
            <Button variant="outline" className="hover:bg-primary transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            </Link>
          <h1 className="text-2xl md:text-3xl font-bold bg-primary bg-clip-text text-transparent">Solar Projects</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 group-hover:text-primary transition-colors" />
            <Input
              placeholder="Search projects..."
              className="pl-10 transition-all border-gray-200 hover:border-primary focus:ring-2 focus:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="whitespace-nowrap bg-primary hover:bg-primary/90 transition-colors">
                <Plus className="mr-2 h-4 w-4" /> Add New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center pb-2">Add New Project</DialogTitle>
                <DialogDescription className="text-center text-gray-600">
                  Fill in the project details and upload required documents
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[80vh] px-2">
                <Form {...form}>
                  <form onSubmit={handleSubmit} className="space-y-8 p-5">
                    <div className="mt-8 space-y-4">

                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
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

                      <h1 className='text-xl'>Project documents</h1>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 p-4 bg-card rounded-lg hover:border-primary/20 transition-all">
                          <Label className="text-sm font-medium">NIC Copy</Label>
                          <FileUploader 
                            accept=".pdf,.jpg,.png" 
                            documentType="nic"
                            onChange={(fileInfo) => handleDocumentChange('nic', fileInfo)}
                          />
                          <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, JPG, PNG</p>
                        </div>
                        <div className="space-y-2 p-4 bg-card rounded-lg  hover:border-primary/20 transition-all">
                          <Label className="text-sm font-medium">Proposal</Label>
                          <FileUploader 
                            accept=".pdf,.doc,.docx" 
                            documentType="proposal"
                            onChange={(fileInfo) => handleDocumentChange('proposal', fileInfo)}
                          />
                          <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX</p>
                        </div>
                        <div className="space-y-2 p-4 bg-card rounded-lg hover:border-primary/20 transition-all">
                        <Label className="text-sm font-medium">Light Bill</Label>
                          <FileUploader 
                            accept=".pdf,.jpg,.png" 
                            documentType="lightBill"
                            onChange={(fileInfo) => handleDocumentChange('lightBill', fileInfo)}
                          />
                          <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, JPG, PNG</p>
                        </div>
                        <div className="space-y-2 p-4 bg-card rounded-lg border hover:border-primary/20 transition-all">
                          <Label className="text-sm font-medium">Clearance Letter</Label>
                          <FileUploader 
                            accept=".pdf" 
                            documentType="clearanceLetter"
                            onChange={(fileInfo) => handleDocumentChange('clearanceLetter', fileInfo)}
                          />
                          <p className="text-xs text-gray-500 mt-1">Accepted format: PDF only</p>
                        </div>
                        <div className="space-y-2 p-4 bg-card rounded-lg hover:border-primary/20 transition-all">
                          <Label className="text-sm font-medium">CEB Agreement</Label>
                          <FileUploader 
                            accept=".pdf" 
                            documentType="cebAgreement"
                            onChange={(fileInfo) => handleDocumentChange('cebAgreement', fileInfo)}
                          />
                          <p className="text-xs text-gray-500 mt-1">Accepted format: PDF only</p>
                        </div>
                        <div className="space-y-2 p-4 bg-card rounde hover:border-primary/20 transition-all">
                          <Label className="text-sm font-medium">CEB Application Form</Label>
                          <FileUploader 
                            accept=".pdf" 
                            documentType="cebApplication"
                            onChange={(fileInfo) => handleDocumentChange('cebApplication', fileInfo)}
                          />
                          <p className="text-xs text-gray-500 mt-1">Accepted format: PDF only</p>
                        </div>
                        <div className="space-y-2 p-4 bg-card rounded-lg  hover:border-primary/20 transition-all">
                          <Label className="text-sm font-medium">Maintenance Agreement</Label>
                          <FileUploader 
                            accept=".pdf" 
                            documentType="maintenanceAgreement"
                            onChange={(fileInfo) => handleDocumentChange('maintenanceAgreement', fileInfo)}
                          />
                          <p className="text-xs text-gray-500 mt-1">Accepted format: PDF only</p>
                        </div>
                      </div>
                    </div>
                    
                    <h1 className='text-xl'>Project details</h1>

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
                                className="transition-all hover:border-primary focus:ring-2 bg-card focus:ring-primary/20"
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
                                className="transition-all bg-card hover:border-primary focus:ring-2 focus:ring-primary/20"
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
                                className="transition-all bg-card hover:border-primary focus:ring-2 focus:ring-primary/20"
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
                                className="transition-all bg-card hover:border-primary focus:ring-2 focus:ring-primary/20"
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
                                className="transition-all bg-card hover:border-primary focus:ring-2 focus:ring-primary/20"
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
                                placeholder='Enter customers system size'
                                className="transition-all bg-card hover:border-primary focus:ring-2 focus:ring-primary/20"
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
                        className="bg-primary hover:bg-primary/90 transition-colors"
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
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center pb-2">Edit Project</DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Update the project details
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh] px-2">
            <Form {...editForm}>
              <form onSubmit={handleUpdate} className="space-y-8 p-5">
                <div className="mt-4 space-y-4">
                  <h1 className='text-xl'>Project details</h1>

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
                              className="transition-all hover:border-primary focus:ring-2 bg-card focus:ring-primary/20"
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
                              className="transition-all bg-card hover:border-primary focus:ring-2 focus:ring-primary/20"
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
                              className="transition-all bg-card hover:border-primary focus:ring-2 focus:ring-primary/20"
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
                              className="transition-all bg-card hover:border-primary focus:ring-2 focus:ring-primary/20"
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
                              className="transition-all bg-card hover:border-primary focus:ring-2 focus:ring-primary/20"
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
                              placeholder='Enter customers system size'
                              className="transition-all bg-card hover:border-primary focus:ring-2 focus:ring-primary/20"
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

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
                    <p className="text-blue-700 text-sm font-medium flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
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
                    className="bg-primary hover:bg-primary/90 transition-colors"
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg">Loading projects...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center min-h-[300px] p-4 sm:p-6 lg:p-8">
              <div className="animate-bounce mb-6">
                  <Search className="w-12 h-12 sm:w-16 sm:h-16 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-gray-800">No Projects Found</h3>
              <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto text-center">
                  We couldn't find any projects matching your search criteria. Please try adjusting your filters or search terms.
              </p>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <Card key={project._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{project.title}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEditDialogOpen(project)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleDeleteClick(project)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardTitle>
                  <CardDescription>
                    <div className="flex flex-col space-y-1">
                      <span>{project.userName}</span>
                      <span className="text-sm ">{project.location}</span>
                      <span className="text-sm ">{new Date(project.date).toLocaleDateString()}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Contact:</span>
                      <span>{project.contact}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Email:</span>
                      <span className="text-blue-600">{project.email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>System Size:</span>
                      <span>{project.systemSize} kW</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditDialogOpen(project)}
                    className="hover:bg-primary/10"
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Link href={`/admin/projects/${project._id}`}>
                    <Button size="sm">View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
