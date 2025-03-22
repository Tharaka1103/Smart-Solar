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
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FileUploader } from '@/components/FileUploader'
import { Search, Loader2, ArrowLeft, Plus, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
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
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Submitting project with data:', formData);
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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

      
      // Refresh the projects list
      fetchProjects();
    } catch (error: any) {
      console.error('Project creation error:', error);

    } finally {
      setIsSubmitting(false);
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
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium">Project Title</Label>
                      <Input 
                        id="title" 
                        required 
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder='Enter project title'
                        className="transition-all hover:border-primary focus:ring-2 bg-card focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userName" className="text-sm font-medium">User Name</Label>
                      <Input 
                        id="userName" 
                        required 
                        value={formData.userName}
                        placeholder='Enter customer name'
                        onChange={handleInputChange}
                        className="transition-all bg-card hover:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        required 
                        value={formData.email}
                        placeholder='Enter customer email'
                        onChange={handleInputChange}
                        className="transition-all bg-card hover:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact" className="text-sm font-medium">Contact</Label>
                      <Input 
                        id="contact" 
                        required 
                        value={formData.contact}
                        placeholder='Enter customer contact number'
                        onChange={handleInputChange}
                        className="transition-all bg-card hover:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                      <Input 
                        id="location" 
                        required 
                        value={formData.location}
                        placeholder='Enter customer address'
                        onChange={handleInputChange}
                        className="transition-all bg-card hover:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="systemSize" className="text-sm font-medium">System Size (kW)</Label>
                      <Input 
                        id="systemSize" 
                        required 
                        value={formData.systemSize}
                        placeholder='Enter customers system size'
                        onChange={handleInputChange}
                        className="transition-all bg-card hover:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
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
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>

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
                    {project.title}
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
                    <div className="mt-4">
                        <Link href={`/admin/projects/${project._id}`}>
                            <Button className="w-full">View Details</Button>
                        </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}

