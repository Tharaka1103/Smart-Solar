'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { InfoIcon, PlusCircle, Clock, Calendar as CalendarIcon, Phone, Mail, Edit, Trash2, Loader2, CheckCircle } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'

interface MaintenanceRecord {
  _id: string;
  projectId: string;
  systemId: string;
  clientName: string;
  email: string;
  contact: string;
  location: string;
  maintenanceDate: string;
  maintenanceTime: string;
  duration: number;
  type: 'routine' | 'repair' | 'cleaning' | 'inspection' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  notes?: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}
type MaintenanceType = 'routine' | 'repair' | 'cleaning' | 'inspection' | 'emergency';
type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';
type MaintenanceStatus = 'pending' | 'completed' | 'cancelled';
export default function MaintenancePage() {
  const [date, setDate] = useState<Date>()
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { successt, errort } = useToast()

  // New maintenance form state
  const [formData, setFormData] = useState({
    clientName: '',
    systemId: '',
    email: '',
    contact: '',
    location: '',
    maintenanceDate: new Date(),
    maintenanceTime: '10:00',
    duration: 2,
    type: 'routine',
    priority: 'medium',
    description: '',
    notes: '',
    projectId: ''
  })

  const fetchMaintenanceRecords = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/maintenance')
      if (!response.ok) {
        throw new Error('Failed to fetch maintenance records')
      }
      const data = await response.json()
      setMaintenanceRecords(data)
    } catch (error) {
      console.error('Error fetching maintenance records:', error)
      errort({
        title: "Error",
        description: "Failed to load maintenance records",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMaintenanceRecords()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSubmit = async (isNew: boolean = true) => {
    setIsSubmitting(true)
    
    try {
      const payload = {
        ...formData,
        maintenanceDate: formData.maintenanceDate.toISOString(),
        projectId: formData.projectId || `MNT-${Date.now().toString().substring(5)}`
      }
      
      const url = isNew ? '/api/maintenance' : `/api/maintenance/${selectedRecord?._id}`
      const method = isNew ? 'POST' : 'PUT'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to ${isNew ? 'create' : 'update'} maintenance record`)
      }
      
      successt({
        title: isNew ? "Maintenance Scheduled" : "Maintenance Updated",
        description: isNew ? 
          "New maintenance record has been scheduled successfully" : 
          "Maintenance record has been updated successfully",
      })
      
      // Reset form for new records
      if (isNew) {
        setFormData({
          clientName: '',
          systemId: '',
          email: '',
          contact: '',
          location: '',
          maintenanceDate: new Date(),
          maintenanceTime: '10:00',
          duration: 2,
          type: 'routine',
          priority: 'medium',
          description: '',
          notes: '',
          projectId: ''
        })
        setDate(undefined)
      } else {
        setIsEditDialogOpen(false)
      }
      
      // Refresh data
      fetchMaintenanceRecords()
    } catch (error) {
      console.error('Error submitting maintenance record:', error)
      successt({
        title: "Error",
        description: `Failed to ${isNew ? 'schedule' : 'update'} maintenance`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedRecord) return
    
    try {
      const response = await fetch(`/api/maintenance/${selectedRecord._id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete maintenance record')
      }
      
      successt({
        title: "Maintenance Deleted",
        description: "Maintenance record has been deleted successfully",
      })
      
      setIsDeleteDialogOpen(false)
      fetchMaintenanceRecords()
    } catch (error) {
      console.error('Error deleting maintenance record:', error)
      errort({
        title: "Error",
        description: "Failed to delete maintenance record",
      })
    }
  }

  const handleStatusChange = async (recordId: string, newStatus: 'pending' | 'completed' | 'cancelled') => {
    try {
      const response = await fetch(`/api/maintenance/${recordId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update maintenance status')
      }
      
      successt({
        title: "Status Updated",
        description: `Maintenance has been marked as ${newStatus}`,
      })
      
      fetchMaintenanceRecords()
    } catch (error) {
      console.error('Error updating maintenance status:', error)
      errort({
        title: "Error",
        description: "Failed to update maintenance status",
      })
    }
  }

  const handleEditClick = (record: MaintenanceRecord) => {
    setSelectedRecord(record)
    
    setFormData({
      clientName: record.clientName,
      systemId: record.systemId,
      email: record.email,
      contact: record.contact,
      location: record.location,
      maintenanceDate: new Date(record.maintenanceDate),
      maintenanceTime: record.maintenanceTime,
      duration: record.duration,
      type: record.type,
      priority: record.priority,
      description: record.description,
      notes: record.notes || '',
      projectId: record.projectId
    })
    
    setDate(new Date(record.maintenanceDate))
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (record: MaintenanceRecord) => {
    setSelectedRecord(record)
    setIsDeleteDialogOpen(true)
  }

  const filteredRecords = maintenanceRecords.filter(record => 
    record.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.systemId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.projectId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Alert className="mb-6 border-l-4 border-l-blue-500 shadow-sm">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Maintenance Schedule</AlertTitle>
          <AlertDescription>
            Track and manage all solar system maintenance activities here. Automatic annual maintenance is scheduled when projects are marked as complete.
          </AlertDescription>
        </Alert>
      </motion.div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Maintenance Records</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Input
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary transition-all duration-200 flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                Schedule Maintenance
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[650px] p-6">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold mb-4">Schedule New Maintenance</DialogTitle>
              </DialogHeader>
              <div className="overflow-y-auto max-h-[70vh] pr-4 custom-scrollbar">
                <div className="grid gap-6 py-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2 transition-all hover:shadow-md p-3 rounded-lg">
                      <Label htmlFor="clientName" className="">Client Name</Label>
                      <Input 
                        id="clientName" 
                        placeholder="Enter client name" 
                        className="focus:ring-2 focus:ring-blue-500" 
                        value={formData.clientName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2 transition-all hover:shadow-md p-3 rounded-lg">
                      <Label htmlFor="systemId" className="">System ID</Label>
                      <Input 
                        id="systemId" 
                        placeholder="Enter system ID" 
                        className="focus:ring-2 focus:ring-blue-500" 
                        value={formData.systemId}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 transition-all hover:shadow-md p-3 rounded-lg">
                    <Label className="">Maintenance Date & Time</Label>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Calendar
                        mode="single"
                        selected={formData.maintenanceDate}
                        onSelect={(date) => date && setFormData(prev => ({ ...prev, maintenanceDate: date }))}
                        className="rounded-md border shadow-sm"
                      />
                      <div className="space-y-2">
                        <Label htmlFor="maintenanceTime" className="">Preferred Time</Label>
                        <Input 
                          type="time" 
                          id="maintenanceTime" 
                          className="focus:ring-2 focus:ring-blue-500" 
                          value={formData.maintenanceTime}
                          onChange={handleInputChange}
                        />
                      
                        <Label htmlFor="duration" className="">Duration (hours)</Label>
                        <Input 
                          type="number" 
                          id="duration" 
                          min="1" 
                          max="8" 
                          value={formData.duration}
                          onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                          className="focus:ring-2 focus:ring-blue-500" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2 transition-all hover:shadow-md p-3 rounded-lg">
                      <Label htmlFor="type" className="">Maintenance Type</Label>
                      <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                        <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="routine">Routine Check</SelectItem>
                          <SelectItem value="repair">Repair</SelectItem>
                          <SelectItem value="cleaning">Panel Cleaning</SelectItem>
                          <SelectItem value="inspection">Annual Inspection</SelectItem>
                          <SelectItem value="emergency">Emergency Service</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 transition-all hover:shadow-md p-3 rounded-lg">
                      <Label htmlFor="priority" className="">Priority Level</Label>
                      <Select value={formData.priority} onValueChange={(value) => handleSelectChange('priority', value)}>
                        <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2 transition-all hover:shadow-md p-3 rounded-lg">
                      <Label htmlFor="contact" className="">Contact Number</Label>
                      <Input 
                        id="contact" 
                        type="tel" 
                        placeholder="Enter contact number" 
                        className="focus:ring-2 focus:ring-blue-500" 
                        value={formData.contact}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2 transition-all hover:shadow-md p-3 rounded-lg">
                      <Label htmlFor="email" className="">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="Enter email address" 
                        className="focus:ring-2 focus:ring-blue-500" 
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 transition-all hover:shadow-md p-3 rounded-lg">
                    <Label htmlFor="location" className="">Location</Label>
                    <Input 
                      id="location" 
                      placeholder="Enter location" 
                      className="focus:ring-2 focus:ring-blue-500" 
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2 transition-all hover:shadow-md p-3 rounded-lg">
                    <Label htmlFor="description" className="">Description of Work</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Please provide detailed description of maintenance work required..."
                      className="min-h-[100px] focus:ring-2 focus:ring-blue-500"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2 transition-all hover:shadow-md p-3 rounded-lg">
                    <Label htmlFor="notes" className="">Additional Notes</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Any special instructions or access requirements..."
                      className="min-h-[80px] focus:ring-2 focus:ring-blue-500"
                      value={formData.notes}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4 border-t mt-4">
                  <Button variant="outline" className="w-[100px] hover:bg-gray-100">Cancel</Button>
                  <Button 
                    className="bg-primary w-[120px] transition-colors duration-200"
                    onClick={() => handleSubmit()}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Schedule'
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Maintenance Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[650px] p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">Edit Maintenance Record</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[70vh] pr-4 custom-scrollbar">
            <div className="grid gap-6 py-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2 transition-all hover:shadow-md p-3 rounded-lg">
                  <Label htmlFor="clientName" className="">Client Name</Label>
                  <Input 
                    id="clientName" 
                    placeholder="Enter client name" 
                    className="focus:ring-2 focus:ring-blue-500" 
                    value={formData.clientName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2 transition-all hover:shadow-md p-3 rounded-lg">
                  <Label htmlFor="systemId" className="">System ID</Label>
                  <Input 
                    id="systemId" 
                    placeholder="Enter system ID" 
                    className="focus:ring-2 focus:ring-blue-500" 
                    value={formData.systemId}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2 transition-all hover:shadow-md p-3 rounded-lg">
                <Label className="">Maintenance Date & Time</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <Calendar
                    mode="single"
                    selected={formData.maintenanceDate}
                    onSelect={(date) => date && setFormData(prev => ({ ...prev, maintenanceDate: date }))}
                    className="rounded-md border shadow-sm"
                  />
                  <div className="space-y-2">
                    <Label htmlFor="maintenanceTime" className="">Preferred Time</Label>
                    <Input 
                      type="time" 
                      id="maintenanceTime" 
                      className="focus:ring-2 focus:ring-blue-500" 
                      value={formData.maintenanceTime}
                      onChange={handleInputChange}
                    />
                  
                    <Label htmlFor="duration" className="">Duration (hours)</Label>
                    <Input 
                      type="number" 
                      id="duration" 
                      min="1" 
                      max="8" 
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      className="focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2 transition-all hover:shadow-md p-3 rounded-lg">
                  <Label htmlFor="type" className="">Maintenance Type</Label>
                  <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                    <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine Check</SelectItem>
                      <SelectItem value="repair">Repair</SelectItem>
                      <SelectItem value="cleaning">Panel Cleaning</SelectItem>
                      <SelectItem value="inspection">Annual Inspection</SelectItem>
                      <SelectItem value="emergency">Emergency Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 transition-all hover:shadow-md p-3 rounded-lg">
                  <Label htmlFor="priority" className="">Priority Level</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleSelectChange('priority', value)}>
                    <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2 transition-all hover:shadow-md p-3 rounded-lg">
                  <Label htmlFor="contact" className="">Contact Number</Label>
                  <Input 
                    id="contact" 
                    type="tel" 
                    placeholder="Enter contact number" 
                    className="focus:ring-2 focus:ring-blue-500" 
                    value={formData.contact}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2 transition-all hover:shadow-md p-3 rounded-lg">
                  <Label htmlFor="email" className="">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter email address" 
                    className="focus:ring-2 focus:ring-blue-500" 
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2 transition-all hover:shadow-md p-3 rounded-lg">
                <Label htmlFor="location" className="">Location</Label>
                <Input 
                  id="location" 
                  placeholder="Enter location" 
                  className="focus:ring-2 focus:ring-blue-500" 
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2 transition-all hover:shadow-md p-3 rounded-lg">
                <Label htmlFor="description" className="">Description of Work</Label>
                <Textarea 
                  id="description" 
                  placeholder="Please provide detailed description of maintenance work required..."
                  className="min-h-[100px] focus:ring-2 focus:ring-blue-500"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2 transition-all hover:shadow-md p-3 rounded-lg">
                <Label htmlFor="notes" className="">Additional Notes</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Any special instructions or access requirements..."
                  className="min-h-[80px] focus:ring-2 focus:ring-blue-500"
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t mt-4">
              <Button 
                variant="outline" 
                className="w-[100px] hover:bg-gray-100"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-primary w-[120px] transition-colors duration-200"
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this maintenance record?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the maintenance record
              for {selectedRecord?.clientName} scheduled on {selectedRecord?.maintenanceDate ? new Date(selectedRecord.maintenanceDate).toLocaleDateString() : ''}.
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
          <p className="text-lg">Loading maintenance records...</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CalendarIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Maintenance Records Found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              {searchQuery ? 
                "No records match your search criteria. Try adjusting your search terms." : 
                "No maintenance records have been scheduled yet. Click 'Schedule Maintenance' to add your first record."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>System ID</TableHead>
                  <TableHead>Maintenance Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record, index) => (
                  <motion.tr 
                    key={record._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">{record.clientName}</TableCell>
                    <TableCell>{record.systemId}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{new Date(record.maintenanceDate).toLocaleDateString()}</span>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {record.maintenanceTime}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {record.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${priorityColors[record.priority]} capitalize`}>
                        {record.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${statusColors[record.status]} capitalize`}>
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {record.status === 'pending' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-green-600"
                            title="Mark as Completed"
                            onClick={() => handleStatusChange(record._id, 'completed')}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          title="Edit Record"
                          onClick={() => handleEditClick(record)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-red-600"
                          title="Delete Record"
                          onClick={() => handleDeleteClick(record)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}
