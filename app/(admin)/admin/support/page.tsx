'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { 
  User, Building, Search, Send, Filter, Download, MoreVertical, 
  MessageSquare, CheckCircle, XCircle, Clock, Loader2, RefreshCw,
  FileText, Printer, ChevronRight, ChevronLeft
} from 'lucide-react'

interface InquiryResponse {
  message: string
  respondedBy: string
  respondedAt: Date
}

interface Inquiry {
  _id: string
  customerType: 'existing' | 'new'
  customerId?: {
    _id: string
    name: string
    email: string
    contact: string
    address: string
    district: string
  }
  customerDetails: {
    name: string
    email: string
    contact: string
    address?: string
    district?: string
  }
  subject: string
  message: string
  type: string
  status: 'pending' | 'responded' | 'closed'
  responses: InquiryResponse[]
  createdAt: string
  updatedAt: string
}

export default function AdminSupportPage() {
  const router = useRouter()
  const { successt, errort, warningt, infot, dismissAll } = useToast()
  const [activeTab, setActiveTab] = useState('all')
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [responseText, setResponseText] = useState('')
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  
  // Fetch inquiries
  useEffect(() => {
    fetchInquiries()
  }, [])
  
  // Apply filters
  useEffect(() => {
    let filtered = [...inquiries]
    
    // Filter by tab (customer type)
    if (activeTab !== 'all') {
      filtered = filtered.filter(inquiry => inquiry.customerType === activeTab)
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(inquiry => 
        inquiry.customerDetails.name.toLowerCase().includes(query) ||
        inquiry.customerDetails.email.toLowerCase().includes(query) ||
        inquiry.subject.toLowerCase().includes(query) ||
        inquiry.message.toLowerCase().includes(query)
      )
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(inquiry => inquiry.status === statusFilter)
    }
    
    // Apply type filter
    if (typeFilter) {
      filtered = filtered.filter(inquiry => inquiry.type === typeFilter)
    }
    
    setFilteredInquiries(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [inquiries, activeTab, searchQuery, statusFilter, typeFilter])
  
  const fetchInquiries = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/inquiries')
      if (!response.ok) {
        throw new Error('Failed to fetch inquiries')
      }
      
      const data = await response.json()
      setInquiries(data)
      setFilteredInquiries(data)
    } catch (error) {
      console.error('Error fetching inquiries:', error)
      errort({
        title: "Error",
        description: "Failed to load inquiries. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleViewInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry)
    setIsDialogOpen(true)
  }
  
  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedInquiry || !responseText.trim()) {
      errort({
        title: "Error",
        description: "Response message is required",
      })
      return
    }
    
    setIsSubmittingResponse(true)
    
    try {
      const response = await fetch(`/api/inquiries/${selectedInquiry._id}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: responseText })
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit response')
      }
      
      const updatedInquiry = await response.json()
      
      // Update inquiries list
      setInquiries(prev => 
        prev.map(inq => inq._id === updatedInquiry._id ? updatedInquiry : inq)
      )
      
      // Update selected inquiry
      setSelectedInquiry(updatedInquiry)
      
      // Clear response text
      setResponseText('')
      
      successt({
        title: "Success",
        description: "Response submitted successfully",
      })
    } catch (error) {
      console.error('Error submitting response:', error)
      errort({
        title: "Error",
        description: "Failed to submit response. Please try again.",
      })
    } finally {
      setIsSubmittingResponse(false)
    }
  }
  
  const handleUpdateStatus = async (inquiryId: string, status: 'pending' | 'responded' | 'closed') => {
    try {
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update status')
      }
      
      const updatedInquiry = await response.json()
      
      // Update inquiries list
      setInquiries(prev => 
        prev.map(inq => inq._id === updatedInquiry._id ? updatedInquiry : inq)
      )
      
      // Update selected inquiry if open
      if (selectedInquiry && selectedInquiry._id === updatedInquiry._id) {
        setSelectedInquiry(updatedInquiry)
      }
      
      successt({
        title: "Success",
        description: `Inquiry status updated to ${status}`,
      })
    } catch (error) {
        console.error('Error updating status:', error)
        errort({
          title: "Error",
          description: "Failed to update status. Please try again.",
        })
      }
    }
    
    const handleGenerateReport = () => {
      // Generate CSV data
      const headers = ['ID', 'Customer Type', 'Customer Name', 'Email', 'Subject', 'Type', 'Status', 'Created Date']
      const csvData = [
        headers.join(','),
        ...filteredInquiries.map(inquiry => [
          inquiry._id,
          inquiry.customerType,
          inquiry.customerDetails.name,
          inquiry.customerDetails.email,
          `"${inquiry.subject.replace(/"/g, '""')}"`, // Escape quotes in CSV
          inquiry.type,
          inquiry.status,
          new Date(inquiry.createdAt).toLocaleDateString()
        ].join(','))
      ].join('\n')
      
      // Create download link
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `inquiries-report-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      successt({
        title: "Report Generated",
        description: "The inquiries report has been downloaded",
      })
    }
    
    const handlePrintInquiry = () => {
      if (!selectedInquiry) return
      
      // Create a printable version
      const printWindow = window.open('', '_blank')
      if (!printWindow) return
      
      const content = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Inquiry Details - ${selectedInquiry._id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { font-size: 24px; margin-bottom: 10px; }
            h2 { font-size: 18px; margin-top: 20px; margin-bottom: 10px; }
            .info { margin-bottom: 5px; }
            .label { font-weight: bold; }
            .message { border: 1px solid #ddd; padding: 10px; margin: 10px 0; border-radius: 4px; }
            .response { background-color: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 4px; }
            .meta { font-size: 12px; color: #666; margin-top: 5px; }
          </style>
        </head>
        <body>
          <h1>Inquiry Details</h1>
          <div class="info"><span class="label">ID:</span> ${selectedInquiry._id}</div>
          <div class="info"><span class="label">Date:</span> ${new Date(selectedInquiry.createdAt).toLocaleString()}</div>
          <div class="info"><span class="label">Status:</span> ${selectedInquiry.status}</div>
          <div class="info"><span class="label">Type:</span> ${selectedInquiry.type}</div>
          
          <h2>Customer Information</h2>
          <div class="info"><span class="label">Customer Type:</span> ${selectedInquiry.customerType === 'existing' ? 'Existing Customer' : 'New Inquiry'}</div>
          <div class="info"><span class="label">Name:</span> ${selectedInquiry.customerDetails.name}</div>
          <div class="info"><span class="label">Email:</span> ${selectedInquiry.customerDetails.email}</div>
          <div class="info"><span class="label">Contact:</span> ${selectedInquiry.customerDetails.contact}</div>
          ${selectedInquiry.customerDetails.address ? `<div class="info"><span class="label">Address:</span> ${selectedInquiry.customerDetails.address}</div>` : ''}
          ${selectedInquiry.customerDetails.district ? `<div class="info"><span class="label">District:</span> ${selectedInquiry.customerDetails.district}</div>` : ''}
          
          <h2>Inquiry</h2>
          <div class="info"><span class="label">Subject:</span> ${selectedInquiry.subject}</div>
          <div class="message">${selectedInquiry.message}</div>
          
          <h2>Responses (${selectedInquiry.responses.length})</h2>
          ${selectedInquiry.responses.length === 0 ? '<div>No responses yet</div>' : ''}
          ${selectedInquiry.responses.map(response => `
            <div class="response">
              <div>${response.message}</div>
              <div class="meta">By ${response.respondedBy} on ${new Date(response.respondedAt).toLocaleString()}</div>
            </div>
          `).join('')}
          
          <div style="margin-top: 30px; text-align: center; font-size: 12px;">
            Generated on ${new Date().toLocaleString()} by Smart Solar Support System
          </div>
        </body>
        </html>
      `
      
      printWindow.document.open()
      printWindow.document.write(content)
      printWindow.document.close()
      
      // Wait for content to load then print
      setTimeout(() => {
        printWindow.print()
      }, 500)
    }
    
    // Get current items for pagination
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredInquiries.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage)
    
    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)
    
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Support Inquiries</h1>
              <p className="text-muted-foreground">
                Manage and respond to customer inquiries
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={fetchInquiries}
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button 
                className="flex items-center gap-2"
                onClick={handleGenerateReport}
              >
                <Download className="h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </div>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="search" className="sr-only">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name, email, subject..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="statusFilter" className="sr-only">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger id="statusFilter">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="responded">Responded</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="typeFilter" className="sr-only">Type</Label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger id="typeFilter">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="billing">Billing Inquiry</SelectItem>
                      <SelectItem value="installation">Installation Query</SelectItem>
                      <SelectItem value="maintenance">Maintenance Request</SelectItem>
                      <SelectItem value="general">General Information</SelectItem>
                      <SelectItem value="complaint">Complaint</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>All Inquiries</span>
              </TabsTrigger>
              <TabsTrigger value="existing" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span>Existing Customers</span>
              </TabsTrigger>
              <TabsTrigger value="new" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>New Inquiries</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <InquiriesTable 
                inquiries={currentItems}
                isLoading={isLoading}
                onViewInquiry={handleViewInquiry}
                onUpdateStatus={handleUpdateStatus}
              />
            </TabsContent>
            
            <TabsContent value="existing" className="space-y-4">
              <InquiriesTable 
                inquiries={currentItems}
                isLoading={isLoading}
                onViewInquiry={handleViewInquiry}
                onUpdateStatus={handleUpdateStatus}
              />
            </TabsContent>
            
            <TabsContent value="new" className="space-y-4">
              <InquiriesTable 
                inquiries={currentItems}
                isLoading={isLoading}
                onViewInquiry={handleViewInquiry}
                onUpdateStatus={handleUpdateStatus}
              />
            </TabsContent>
          </Tabs>
          
          {/* Pagination */}
          {!isLoading && filteredInquiries.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredInquiries.length)} of {filteredInquiries.length} inquiries
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show pages around current page
                  let pageNum = currentPage - 2 + i
                  if (currentPage < 3) pageNum = i + 1
                  if (currentPage > totalPages - 2) pageNum = totalPages - 4 + i
                  
                  // Ensure page numbers are within range
                  if (pageNum < 1 || pageNum > totalPages) return null
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => paginate(pageNum)}
                      className="w-8 h-8"
                    >
                      {pageNum}
                    </Button>
                  )
                })}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {/* No results */}
          {!isLoading && filteredInquiries.length === 0 && (
            <Card className="mt-6">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <MessageSquare className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No inquiries found</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  {searchQuery || statusFilter || typeFilter
                    ? "No inquiries match your current filters. Try adjusting your search criteria."
                    : "There are no inquiries to display at this time."}
                </p>
                {(searchQuery || statusFilter || typeFilter) && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery('')
                      setStatusFilter('')
                      setTypeFilter('')
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </motion.div>
        
        {/* Inquiry Detail Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedInquiry && (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-xl">{selectedInquiry.subject}</DialogTitle>
                    <Badge 
                    variant="outline" 
                    className={
                      selectedInquiry.status === 'pending' 
                        ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" 
                        : selectedInquiry.status === 'responded'
                        ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                        : "bg-green-500/10 text-green-600 border-green-500/20"
                    }
                  >
                    {selectedInquiry.status.charAt(0).toUpperCase() + selectedInquiry.status.slice(1)}
                  </Badge>
                </div>
                <DialogDescription>
                  Inquiry ID: {selectedInquiry._id} • Created: {new Date(selectedInquiry.createdAt).toLocaleString()}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                <div className="md:col-span-1 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Customer Information</h3>
                    <Card>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          {selectedInquiry.customerType === 'existing' ? (
                            <Building className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <User className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="text-sm font-medium">
                            {selectedInquiry.customerType === 'existing' ? 'Existing Customer' : 'New Inquiry'}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Name</p>
                            <p className="text-sm font-medium">{selectedInquiry.customerDetails.name}</p>
                          </div>
                          
                          <div>
                            <p className="text-xs text-muted-foreground">Email</p>
                            <p className="text-sm font-medium">{selectedInquiry.customerDetails.email}</p>
                          </div>
                          
                          <div>
                            <p className="text-xs text-muted-foreground">Contact</p>
                            <p className="text-sm font-medium">{selectedInquiry.customerDetails.contact}</p>
                          </div>
                          
                          {selectedInquiry.customerDetails.address && (
                            <div>
                              <p className="text-xs text-muted-foreground">Address</p>
                              <p className="text-sm font-medium">{selectedInquiry.customerDetails.address}</p>
                            </div>
                          )}
                          
                          {selectedInquiry.customerDetails.district && (
                            <div>
                              <p className="text-xs text-muted-foreground">District</p>
                              <p className="text-sm font-medium">{selectedInquiry.customerDetails.district}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Actions</h3>
                    <div className="space-y-2">
                      <Select 
                        value={selectedInquiry.status}
                        onValueChange={(value) => handleUpdateStatus(selectedInquiry._id, value as 'pending' | 'responded' | 'closed')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Mark as Pending</SelectItem>
                          <SelectItem value="responded">Mark as Responded</SelectItem>
                          <SelectItem value="closed">Mark as Closed</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button 
                        variant="outline" 
                        className="w-full flex items-center gap-2"
                        onClick={handlePrintInquiry}
                      >
                        <Printer className="h-4 w-4" />
                        Print Inquiry
                      </Button>
                      
                      {selectedInquiry.customerType === 'existing' && selectedInquiry.customerId && (
                        <Button 
                          variant="outline" 
                          className="w-full flex items-center gap-2"
                          onClick={() => selectedInquiry.customerId && router.push(`/admin/customers/${selectedInquiry.customerId._id}`)}
                        >
                          <User className="h-4 w-4" />
                          View Customer
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Inquiry Details</h3>
                    <Card>
                      <CardContent className="p-4 space-y-4">
                        <div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">Type</p>
                            <Badge variant="outline">{selectedInquiry.type}</Badge>
                          </div>
                          <div className="mt-4">
                            <p className="text-xs text-muted-foreground mb-1">Message</p>
                            <div className="p-3 bg-muted/30 rounded-md text-sm whitespace-pre-wrap">
                              {selectedInquiry.message}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Responses ({selectedInquiry.responses.length})
                    </h3>
                    
                    {selectedInquiry.responses.length === 0 ? (
                      <Card>
                        <CardContent className="p-4 text-center text-muted-foreground text-sm">
                          No responses yet
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-3">
                        {selectedInquiry.responses.map((response, index) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <div className="whitespace-pre-wrap text-sm">
                                {response.message}
                              </div>
                              <div className="mt-2 text-xs text-muted-foreground flex items-center justify-between">
                                <span>By {response.respondedBy}</span>
                                <span>{new Date(response.respondedAt).toLocaleString()}</span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Add Response</h3>
                    <form onSubmit={handleSubmitResponse}>
                      <div className="space-y-4">
                        <Textarea
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          placeholder="Type your response here..."
                          rows={4}
                          required
                        />
                        
                        <div className="flex justify-end">
                          <Button 
                            type="submit" 
                            disabled={isSubmittingResponse}
                            className="flex items-center gap-2"
                          >
                            {isSubmittingResponse ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4" />
                                Send Response
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Inquiries Table Component
function InquiriesTable({ 
  inquiries, 
  isLoading, 
  onViewInquiry,
  onUpdateStatus
}: { 
  inquiries: Inquiry[], 
  isLoading: boolean,
  onViewInquiry: (inquiry: Inquiry) => void,
  onUpdateStatus: (id: string, status: 'pending' | 'responded' | 'closed') => void
}) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading inquiries...</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.map((inquiry) => (
              <TableRow key={inquiry._id}>
                <TableCell className="font-medium">
                  {new Date(inquiry.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{inquiry.customerDetails.name}</span>
                    <span className="text-xs text-muted-foreground">{inquiry.customerDetails.email}</span>
                  </div>
                </TableCell>
                <TableCell>{inquiry.subject}</TableCell>
                <TableCell>
                  <Badge variant="outline">{inquiry.type}</Badge>
                </TableCell>
                <TableCell>
                  {inquiry.status === 'pending' && (
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                  {inquiry.status === 'responded' && (
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Responded
                    </Badge>
                  )}
                  {inquiry.status === 'closed' && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Closed
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onViewInquiry(inquiry)}
                    >
                      View
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onUpdateStatus(inquiry._id, 'pending')}>
                          <Clock className="h-4 w-4 mr-2" />
                          Mark as Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onUpdateStatus(inquiry._id, 'responded')}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Responded
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onUpdateStatus(inquiry._id, 'closed')}>
                          <XCircle className="h-4 w-4 mr-2" />
                          Mark as Closed
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
