'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
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
import { Search } from 'lucide-react'
import Link from 'next/link'

interface Project {
    id: string
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
      nic: string
      proposal: string
      lightBill: string
      clearanceLetter: string
      cebAgreement: string
      cebApplication: string
      maintenanceAgreement: string
    }
    progress: {
      date: string
      status: string
    }[]
  }

const sampleProjects: Project[] = [
    {
        id: '1',
        title: 'Residential Solar Installation',
        userName: 'John Doe',
        email: 'john@example.com',
        contact: '+94 77 123 4567',
        location: 'No 123, Main Street, Colombo',
        status: 'completed',
        date: '2024-01-15',
        systemSize: '5kW',
        installationDate: '2024-02-01',
        completionDate: '2024-02-15',
        documents: {
          nic: '/docs/nic1.pdf',
          proposal: '/docs/proposal1.pdf',
          lightBill: '/docs/bill1.pdf',
          clearanceLetter: '/docs/clearance1.pdf',
          cebAgreement: '/docs/agreement1.pdf',
          cebApplication: '/docs/application1.pdf',
          maintenanceAgreement: '/docs/maintenance1.pdf',
        },
        progress: [
          { date: '2024-01-15', status: 'Application Submitted' },
          { date: '2024-01-20', status: 'Documents Verified' },
          { date: '2024-01-25', status: 'Site Survey Completed' },
          { date: '2024-02-01', status: 'Installation Started' },
          { date: '2024-02-15', status: 'Project Completed' },
        ]
      },
      {
        id: '2',
        title: 'Commercial Solar Project',
        userName: 'Jane Smith',
        email: 'jane@example.com',
        contact: '+94 77 234 5678',
        location: 'Kandy',
        status: 'approved',
        date: '2024-02-01',
        systemSize: '10kW',
        installationDate: '2024-02-15',
        completionDate: '2024-03-01',
        documents: {
          nic: '/docs/nic2.pdf',
          proposal: '/docs/proposal2.pdf',
          lightBill: '/docs/bill2.pdf',
          clearanceLetter: '/docs/clearance2.pdf',
          cebAgreement: '/docs/agreement2.pdf',
          cebApplication: '/docs/application2.pdf',
          maintenanceAgreement: '/docs/maintenance2.pdf',
        },
        progress: [
          { date: '2024-02-01', status: 'Application Submitted' },
          { date: '2024-02-05', status: 'Documents Verified' },
          { date: '2024-02-10', status: 'Site Survey Completed' },
        ]
      },
      {
        id: '3',
        title: 'Industrial Solar System',
        userName: 'Mike Johnson',
        email: 'mike@example.com',
        contact: '+94 77 345 6789',
        location: 'Galle',
        status: 'pending',
        date: '2024-02-05',
        systemSize: '20kW',
        installationDate: 'Pending',
        completionDate: 'Pending',
        documents: {
          nic: '/docs/nic3.pdf',
          proposal: '/docs/proposal3.pdf',
          lightBill: '/docs/bill3.pdf',
          clearanceLetter: '/docs/clearance3.pdf',
          cebAgreement: '/docs/agreement3.pdf',
          cebApplication: '/docs/application3.pdf',
          maintenanceAgreement: '/docs/maintenance3.pdf',
        },
        progress: [
          { date: '2024-02-05', status: 'Application Submitted' },
        ]
      },
      {
        id: '4',
        title: 'Agricultural Solar Installation',
        userName: 'David Wilson',
        email: 'david@example.com',
        contact: '+94 77 456 7890',
        location: 'Jaffna',
        status: 'pending',
        date: '2024-02-10',
        systemSize: '15kW',
        installationDate: 'Pending',
        completionDate: 'Pending',
        documents: {
          nic: '/docs/nic4.pdf',
          proposal: '/docs/proposal4.pdf',
          lightBill: '/docs/bill4.pdf',
          clearanceLetter: '/docs/clearance4.pdf',
          cebAgreement: '/docs/agreement4.pdf',
          cebApplication: '/docs/application4.pdf',
          maintenanceAgreement: '/docs/maintenance4.pdf',
        },
        progress: [
          { date: '2024-02-10', status: 'Application Submitted' },
        ]
      },
      {
        id: '5',
        title: 'Community Solar Project',
        userName: 'Lisa Brown',
        email: 'lisa@example.com',
        contact: '+94 77 567 8901',
        location: 'Matara',
        status: 'completed',
        date: '2024-01-20',
        systemSize: '25kW',
        installationDate: '2024-02-01',
        completionDate: '2024-02-20',
        documents: {
          nic: '/docs/nic5.pdf',
          proposal: '/docs/proposal5.pdf',
          lightBill: '/docs/bill5.pdf',
          clearanceLetter: '/docs/clearance5.pdf',
          cebAgreement: '/docs/agreement5.pdf',
          cebApplication: '/docs/application5.pdf',
          maintenanceAgreement: '/docs/maintenance5.pdf',
        },
        progress: [
          { date: '2024-01-20', status: 'Application Submitted' },
          { date: '2024-01-25', status: 'Documents Verified' },
          { date: '2024-01-30', status: 'Site Survey Completed' },
          { date: '2024-02-01', status: 'Installation Started' },
          { date: '2024-02-20', status: 'Project Completed' },
        ]
      }  // Add more sample projects here
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(sampleProjects)
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    setIsDialogOpen(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Solar Projects</h1>
        
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search projects..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="whitespace-nowrap">Add New Project</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Project</DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[80vh] px-1">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Project Title</Label>
                      <Input id="title" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userName">User Name</Label>
                      <Input id="userName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact">Contact</Label>
                      <Input id="contact" required />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>NIC Copy</Label>
                      <FileUploader accept=".pdf,.jpg,.png" />
                    </div>
                    <div className="space-y-2">
                      <Label>Proposal</Label>
                      <FileUploader accept=".pdf,.doc,.docx" />
                    </div>
                    <div className="space-y-2">
                      <Label>Light Bill</Label>
                      <FileUploader accept=".pdf,.jpg,.png" />
                    </div>
                    <div className="space-y-2">
                      <Label>Clearance Letter</Label>
                      <FileUploader accept=".pdf" />
                    </div>
                    <div className="space-y-2">
                      <Label>CEB Agreement</Label>
                      <FileUploader accept=".pdf" />
                    </div>
                    <div className="space-y-2">
                      <Label>CEB Application Form</Label>
                      <FileUploader accept=".pdf" />
                    </div>
                    <div className="space-y-2">
                      <Label>Maintenance Agreement</Label>
                      <FileUploader accept=".pdf" />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Submit Project</Button>
                  </div>
                </form>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>

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
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {project.title}
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    project.status === 'completed' ? 'bg-green-100 text-green-800' :
                    project.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status}
                  </span>
                </CardTitle>
                <CardDescription>
                  <div className="flex flex-col space-y-1">
                    <span>{project.userName}</span>
                    <span className="text-sm ">{project.location}</span>
                    <span className="text-sm ">{project.date}</span>
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
                      <Link href={`/admin/projects/${project.id}`}>
                          <Button  className="w-full ">View Details</Button>
                      </Link>
                  </div>
                  <div className="mt-4">
                      <Link href={'/admin/projects'}>
                          <Button variant="outline" className="w-full text-primary border border-primary">Close Project</Button>
                      </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
