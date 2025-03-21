  'use client'

  import { useState } from 'react'
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
  } from "@/components/ui/dialog"
  import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
  import { Calendar } from "@/components/ui/calendar"
  import { Textarea } from "@/components/ui/textarea"
  import { InfoIcon, PlusCircle, Clock, Settings2, Phone, Mail } from 'lucide-react'
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

  export default function MaintenancePage() {
    const [date, setDate] = useState<Date>()

    return (
      <div className="container mx-auto p-6 space-y-6">
        <Alert className="mb-6">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Maintenance Schedule</AlertTitle>
          <AlertDescription>
            Track and manage all solar system maintenance activities here.
          </AlertDescription>
        </Alert>

        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Maintenance Records</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                Schedule Maintenance
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[650px] p-6">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-blue-600">Schedule New Maintenance</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="client">Client Name</Label>
                    <Input id="client" placeholder="Enter client name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="system">System ID</Label>
                    <Input id="system" placeholder="Enter system ID" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Maintenance Date & Time</Label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border bg-white"
                    />
                    <div className="space-y-2">
                      <Label htmlFor="time">Preferred Time</Label>
                      <Input type="time" id="time" />
                    
                      <Label htmlFor="duration">Duration (hours)</Label>
                      <Input type="number" id="duration" min="1" max="8" placeholder="2" />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="type">Maintenance Type</Label>
                    <Select>
                      <SelectTrigger>
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
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select>
                      <SelectTrigger>
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
                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact Number</Label>
                    <Input id="contact" type="tel" placeholder="Enter contact number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="Enter email address" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description of Work</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Please provide detailed description of maintenance work required..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Any special instructions or access requirements..."
                    className="min-h-[80px]"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" className="w-[100px]">Cancel</Button>
                <Button className="bg-blue-600 hover:bg-blue-700 w-[100px]">Schedule</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>System ID</TableHead>
                <TableHead>Maintenance Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>John Doe</TableCell>
                <TableCell>SYS-001</TableCell>
                <TableCell>2024-01-15</TableCell>
                <TableCell>Routine Check</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800">
                    Completed
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="mr-2">
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Jane Smith</TableCell>
                <TableCell>SYS-002</TableCell>
                <TableCell>2024-01-20</TableCell>
                <TableCell>Panel Cleaning</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-sm font-medium text-yellow-800">
                    Pending
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="mr-2">
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }
