'use client'

import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Download, Mail, Phone, MapPin, Calendar, FileText } from 'lucide-react'
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
export default function ProjectDetails() {
  const { id } = useParams()

  
  // Sample project data - replace with actual data fetching
  const projects = [
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
    }
  ]

  const currentProject = projects.find(p => p.id === id)
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800'
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
            <h1 className="text-3xl font-bold">{currentProject?.title}</h1>
            <p className="">Project ID: {currentProject?.id}</p>
          </div>
          <Badge className={`${statusColors[currentProject?.status as keyof typeof statusColors]} text-sm px-4 py-1`}>
            {currentProject?.status}
          </Badge>
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
                  <FileText className="h-5 w-5 " />
                  <span className="font-medium">{currentProject?.userName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 " />
                  <span>{currentProject?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 " />
                  <span>{currentProject?.contact}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 " />
                  <span>{currentProject?.location}</span>
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
                <div className="flex justify-between items-center p-2 bg-card rounded">
                  <span className="">System Size</span>
                  <span className="font-medium">{currentProject?.systemSize}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-card rounded">
                  <span className="">Installation Date</span>
                  <span className="font-medium">{currentProject?.installationDate}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-card rounded">
                  <span className="">Completion Date</span>
                  <span className="font-medium">{currentProject?.completionDate}</span>
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
                {currentProject?.documents && Object.entries(currentProject.documents).map(([key, value]) => (
                  <div key={key} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-background transition-colors">
                    <span className="capitalize flex items-center gap-2">
                      <FileText className="h-4 w-4 " />
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <Button variant="outline" size="sm" className="hover:bg-blue-50">
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Project Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {currentProject?.progress.map((step, index) => (
                  <div key={index} className="mb-8 flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-md">
                        {index + 1}
                      </div>
                      {index < (currentProject?.progress.length || 0) - 1 && (
                        <div className="w-0.5 h-full bg-primary/20 mt-2" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="bg-background p-4 rounded-lg">
                        <h3 className="font-medium text-primary">{step.status}</h3>
                        <p className="text-sm  flex items-center mt-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          {step.date}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
