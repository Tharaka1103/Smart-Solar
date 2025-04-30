'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/lib/auth-context'
import { 
  User, Search, Send, AlertCircle, CheckCircle, Loader2, 
  Building, Home, Phone, Mail, MapPin, FileText
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface CustomerDetails {
  _id: string
  name: string
  email: string
  contact: string
  address: string
  district: string
  service: string
  electricityAccountNumber: string
  nic: string
}

const inquiryTypes = [
  { value: 'technical', label: 'Technical Support' },
  { value: 'billing', label: 'Billing Inquiry' },
  { value: 'installation', label: 'Installation Query' },
  { value: 'maintenance', label: 'Maintenance Request' },
  { value: 'general', label: 'General Information' },
  { value: 'complaint', label: 'Complaint' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'other', label: 'Other' }
]

export default function InquiriesPage() {
  const router = useRouter()
  const { user } = useAuth()  
  const [activeTab, setActiveTab] = useState('existing')
  const [identifier, setIdentifier] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { successt, errort, warningt, infot, dismissAll } = useToast()

  // Form data for existing customer
  const [existingCustomerForm, setExistingCustomerForm] = useState({
    inquiryType: '',
    subject: '',
    message: ''
  })
  
  // Form data for strat new customer
  const [newCustomerForm, setNewCustomerForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    contact: '',
    district: '',
    address: '',
    inquiryType: '',
    subject: '',
    message: ''
  })
  
  // Pre-fill form with user data if available
  useEffect(() => {
    if (user) {
      setNewCustomerForm(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email
      }))
    }
  }, [user])
  
  // Handle customer lookup.
  const handleCustomerLookup = async () => {
    if (!identifier.trim()) {
      errort({
        title: "Input Required",
        description: "Please enter your NIC or electricity account number",
      })
      return
    }
    
    setIsSearching(true)
    
    try {
      const response = await fetch('/api/inquiries/customer-lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ identifier })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Customer not found')
      }
      
      const customer = await response.json()
      setCustomerDetails(customer)
      
      // Pre-fill form with customer data
      if (customer.email) {
        setExistingCustomerForm(prev => ({
          ...prev,
          email: customer.email
        }))
      }
      
      successt({
        title: "Customer Found",
        description: "Your details have been retrieved successfully",
      })
    } catch (error: any) {
      errort({
        title: "Customer Not Found",
        description: error.message || "We couldn't find your details. Please try again or submit as a new inquiry.",
      })
      setCustomerDetails(null)
    } finally {
      setIsSearching(false)
    }
  }
  
  // Handle existing customer form submission.
  const handleExistingCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!customerDetails) {
      errort({
        title: "Customer Details Required",
        description: "Please search for your customer details first",
      })
      return
    }
    
    if (!existingCustomerForm.inquiryType || !existingCustomerForm.subject || !existingCustomerForm.message) {
      errort({
        title: "Missing Information",
        description: "Please fill in all required fields",
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerType: 'existing',
          customerId: customerDetails._id,
          customerDetails: {
            name: customerDetails.name,
            email: customerDetails.email,
            contact: customerDetails.contact,
            address: customerDetails.address,
            district: customerDetails.district
          },
          type: existingCustomerForm.inquiryType,
          subject: existingCustomerForm.subject,
          message: existingCustomerForm.message
        })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to submit inquiry')
      }
      
      // Reset form
      setExistingCustomerForm({
        inquiryType: '',
        subject: '',
        message: ''
      })
      setIdentifier('')
      setCustomerDetails(null)
      
      // Show success message
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
      }, 5000)
      
      successt({
        title: "Inquiry Submitted",
        description: "Your inquiry has been submitted successfully. We'll get back to you soon.",
      })
    } catch (error: any) {
      errort({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your inquiry. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Handle new customer form submission
  const handleNewCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (
      !newCustomerForm.name || 
      !newCustomerForm.email || 
      !newCustomerForm.contact || 
      !newCustomerForm.inquiryType || 
      !newCustomerForm.subject || 
      !newCustomerForm.message
    ) {
      errort({
        title: "Missing Information",
        description: "Please fill in all required fields",
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerType: 'new',
          customerDetails: {
            name: newCustomerForm.name,
            email: newCustomerForm.email,
            contact: newCustomerForm.contact,
            address: newCustomerForm.address,
            district: newCustomerForm.district
          },
          type: newCustomerForm.inquiryType,
          subject: newCustomerForm.subject,
          message: newCustomerForm.message
        })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to submit inquiry')
      }
      
      // Reset form
      setNewCustomerForm({
        name: user?.name || '',
        email: user?.email || '',
        contact: '',
        district: '',
        address: '',
        inquiryType: '',
        subject: '',
        message: ''
      })
      
      // Show success message
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
      }, 5000)
      
      successt({
        title: "Inquiry Submitted",
        description: "Your inquiry has been submitted successfully. We'll get back to you soon.",
      })
    } catch (error: any) {
      error({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your inquiry. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl mt-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Customer Inquiries</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a question or need assistance? Submit your inquiry and our team will get back to you as soon as possible.
          </p>
        </div>
        
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8"
          >
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-green-800">Inquiry Submitted Successfully!</AlertTitle>
              <AlertDescription className="text-green-700">
                Thank you for your inquiry. Our team will review it and respond to you shortly. You can track the status of your inquiry in your dashboard.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
        
        <Card className="shadow-lg border-primary/10">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-background">
            <CardTitle className="text-2xl">Submit an Inquiry</CardTitle>
            <CardDescription>
              Please select the appropriate option below to submit your inquiry
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs 
              defaultValue="existing" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger value="existing" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span>Existing Customer</span>
                </TabsTrigger>
                <TabsTrigger value="new" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>New Inquiry</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="existing" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="identifier" className="text-base">
                      Enter your NIC or Electricity Account Number
                    </Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="identifier"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="e.g., 982760183V or 4019283746"
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleCustomerLookup} 
                        disabled={isSearching}
                        className="flex items-center gap-2"
                      >
                        {isSearching ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Searching...</span>
                          </>
                        ) : (
                          <>
                            <Search className="h-4 w-4" />
                            <span>Look up</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {customerDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="bg-primary/5 border-primary/10">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            Customer Details
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-0">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium">{customerDetails.name}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{customerDetails.email}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Contact</p>
                            <p className="font-medium">{customerDetails.contact}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">District</p>
                            <p className="font-medium">{customerDetails.district}</p>
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <p className="text-sm text-muted-foreground">Address</p>
                            <p className="font-medium">{customerDetails.address}</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <form onSubmit={handleExistingCustomerSubmit} className="space-y-6 mt-6">
                        <div className="space-y-2">
                          <Label htmlFor="inquiryType">Inquiry Type</Label>
                          <Select 
                            value={existingCustomerForm.inquiryType} 
                            onValueChange={(value) => setExistingCustomerForm({...existingCustomerForm, inquiryType: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select inquiry type" />
                            </SelectTrigger>
                            <SelectContent>
                              {inquiryTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject</Label>
                          <Input
                            id="subject"
                            value={existingCustomerForm.subject}
                            onChange={(e) => setExistingCustomerForm({...existingCustomerForm, subject: e.target.value})}
                            placeholder="Brief description of your inquiry"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            value={existingCustomerForm.message}
                            onChange={(e) => setExistingCustomerForm({...existingCustomerForm, message: e.target.value})}
                            placeholder="Please provide details about your inquiry"
                            rows={5}
                          />
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Submit Inquiry
                            </>
                          )}
                        </Button>
                      </form>
                    </motion.div>
                  )}
                  
                  {!customerDetails && !isSearching && (
                    <Alert variant="default" className="bg-muted/50">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Customer Lookup</AlertTitle>
                      <AlertDescription>
                        Enter your NIC or electricity account number to retrieve your details. This helps us provide faster and more accurate assistance.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="new" className="space-y-6">
                <form onSubmit={handleNewCustomerSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={newCustomerForm.name}
                        onChange={(e) => setNewCustomerForm({...newCustomerForm, name: e.target.value})}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newCustomerForm.email}
                        onChange={(e) => setNewCustomerForm({...newCustomerForm, email: e.target.value})}
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contact">Contact Number</Label>
                      <Input
                        id="contact"
                        value={newCustomerForm.contact}
                        onChange={(e) => setNewCustomerForm({...newCustomerForm, contact: e.target.value})}
                        placeholder="Enter your contact number"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="district">District</Label>
                      <Input
                        id="district"
                        value={newCustomerForm.district}
                        onChange={(e) => setNewCustomerForm({...newCustomerForm, district: e.target.value})}
                        placeholder="Enter your district"
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={newCustomerForm.address}
                        onChange={(e) => setNewCustomerForm({...newCustomerForm, address: e.target.value})}
                        placeholder="Enter your address"
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="inquiryType">Inquiry Type</Label>
                      <Select 
                        value={newCustomerForm.inquiryType} 
                        onValueChange={(value) => setNewCustomerForm({...newCustomerForm, inquiryType: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          {inquiryTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={newCustomerForm.subject}
                        onChange={(e) => setNewCustomerForm({...newCustomerForm, subject: e.target.value})}
                        placeholder="Brief description of your inquiry"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={newCustomerForm.message}
                        onChange={(e) => setNewCustomerForm({...newCustomerForm, message: e.target.value})}
                        placeholder="Please provide details about your inquiry"
                        rows={5}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit Inquiry
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="mt-10 text-center">
          <p className="text-muted-foreground">
            Already submitted an inquiry? <Button variant="link" className="p-0 h-auto" onClick={() => router.push('/dashboard')}>Check status in your dashboard</Button>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
