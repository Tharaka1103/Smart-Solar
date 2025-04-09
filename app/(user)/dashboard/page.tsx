"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Tabs, TabsContent, TabsList, TabsTrigger
} from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { 
  User, Home, Settings, FileText, MessageSquare, HelpCircle, 
  Bell, ChevronRight, Edit3, Trash2, Save, X, Phone, Mail, 
  MapPin, ShieldCheck, Calendar, Check, RefreshCw, Lock,
  Clock, CheckCircle, XCircle, Send, Loader2, AlertCircle,
  ChevronLeft, ChevronDown, ChevronUp, Filter, Search
} from 'lucide-react'

// Interface for inquiries
interface InquiryResponse {
  message: string
  respondedBy: string
  respondedAt: string
}

interface Inquiry {
  _id: string
  customerType: 'existing' | 'new'
  customerId?: string
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

// Interface for quote requests
interface QuoteRequest {
  id: string
  date: string
  roofArea: number
  monthlyBill: number
  systemSize: number
  totalCost: number
  status: 'pending' | 'approved' | 'rejected'
}

export default function DashboardPage() {
  const { user, status, signOut } = useAuth()
  const { successt, errort, warningt, infot, dismissAll } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    district: '',
    address: '',
  })
  
  // Inquiries state
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false)
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [isInquiryDialogOpen, setIsInquiryDialogOpen] = useState(false)
  const [newReplyText, setNewReplyText] = useState('')
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)
  const [inquiryFilter, setInquiryFilter] = useState<'all' | 'pending' | 'responded' | 'closed'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Quote requests
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([])
  
  // Initialize profile data from user
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: localStorage.getItem('userPhone') || '',
        district: localStorage.getItem('userDistrict') || '',
        address: localStorage.getItem('userAddress') || '',
      })
      
      // Fetch user's inquiries and quote requests
      fetchUserInquiries()
      fetchMockQuoteRequests() // This would be replaced with actual API call
    }
  }, [user])
  
  // Fetch user inquiries from API
  const fetchUserInquiries = async () => {
    if (!user?.email) return
    
    setIsLoadingInquiries(true)
    try {
      const response = await fetch(`/api/inquiries/user?email=${user.email}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch inquiries')
      }
      
      const data = await response.json()
      setInquiries(data)
    } catch (error) {
      console.error('Error fetching inquiries:', error)
      errort({
        title: "Error",
        description: "Failed to load your inquiries. Please try again.",
      })
    } finally {
      setIsLoadingInquiries(false)
    }
  }
  
  // Mock data fetching function for quote requests
  const fetchMockQuoteRequests = () => {
    // Mock quote requests data
    setQuoteRequests([
      {
        id: 'quote-001',
        date: '2023-10-20',
        roofArea: 85,
        monthlyBill: 15000,
        systemSize: 5.5,
        totalCost: 1250000,
        status: 'approved'
      },
      {
        id: 'quote-002',
        date: '2023-12-05',
        roofArea: 120,
        monthlyBill: 22000,
        systemSize: 8.2,
        totalCost: 1850000,
        status: 'pending'
      }
    ])
  }
  
  // Submit a new reply to an inquiry
  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedInquiry || !newReplyText.trim()) {
      errort({
        title: "Error",
        description: "Please enter a reply message",
      })
      return
    }
    
    setIsSubmittingReply(true)
    
    try {
      const response = await fetch(`/api/inquiries/${selectedInquiry._id}/user-reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: newReplyText })
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit reply')
      }
      
      const updatedInquiry = await response.json()
      
      // Update inquiries list
      setInquiries(prev => 
        prev.map(inq => inq._id === updatedInquiry._id ? updatedInquiry : inq)
      )
      
      // Update selected inquiry
      setSelectedInquiry(updatedInquiry)
      
      // Clear reply text
      setNewReplyText('')
      
      successt({
        title: "Reply Sent",
        description: "Your reply has been sent successfully",
      })
    } catch (error) {
      console.error('Error submitting reply:', error)
      errort({
        title: "Error",
        description: "Failed to send your reply. Please try again.",
      })
    } finally {
      setIsSubmittingReply(false)
    }
  }
  
  // Handle form submission for profile update
  const handleProfileUpdate = async () => {
    setIsLoading(true)
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Store some data in localStorage for demo purposes
      localStorage.setItem('userPhone', profileData.phone)
      localStorage.setItem('userDistrict', profileData.district)
      localStorage.setItem('userAddress', profileData.address)
      
      setIsEditing(false)
      successt({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      errort({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle account deletion
  const handleDeleteAccount = async () => {
    setIsLoading(true)
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      signOut()
    } catch (error) {
      console.error("Error deleting account:", error)
      errort({
        title: "Action Failed",
        description: "There was an error deleting your account. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Filter inquiries based on status and search query
  const getFilteredInquiries = () => {
    return inquiries.filter(inquiry => {
      // Apply status filter
      if (inquiryFilter !== 'all' && inquiry.status !== inquiryFilter) {
        return false
      }
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          inquiry.subject.toLowerCase().includes(query) ||
          inquiry.message.toLowerCase().includes(query) ||
          inquiry.type.toLowerCase().includes(query)
        )
      }
      
      return true
    })
  }
  
  // View inquiry details
  const handleViewInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry)
    setIsInquiryDialogOpen(true)
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }
  
  // Get status badge
  const getStatusBadge = (status: 'pending' | 'responded' | 'closed') => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case 'responded':
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Responded
          </Badge>
        )
      case 'closed':
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-600 border-gray-500/20">
            <XCircle className="h-3 w-3 mr-1" />
            Closed
          </Badge>
        )
    }
  }
  
  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  // Unauthenticated state
  if (status === 'unauthenticated') {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You need to be signed in to view this page</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <a href="/signin">Sign In</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }
  
  const filteredInquiries = getFilteredInquiries()
  
  return (
    <div className="min-h-screen bg-background mt-10">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Bell size={16} />
                <span className="hidden sm:inline">Notifications</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Settings size={16} />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dashboard Content */}
      <div className="container mx-auto py-8 px-4">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Home size={16} />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User size={16} />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="flex items-center gap-2">
              <MessageSquare size={16} />
              <span>Inquiries</span>
            </TabsTrigger>
            <TabsTrigger value="quotes" className="flex items-center gap-2">
              <FileText size={16} />
              <span>Quotes</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Welcome Card */}
              <Card className="col-span-full bg-gradient-to-r from-primary/10 to-background border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                    <span>Welcome to Smart Solar</span>
                  </CardTitle>
                  <CardDescription>
                    Your one-stop dashboard for all solar-related services and information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Track your inquiries, manage your account, and stay updated with the latest information about your solar system.
                  </p>
                </CardContent>
              </Card>
              
              {/* Quick Stats */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Inquiries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{inquiries.length}</div>
                  <p className="text-sm text-muted-foreground">Total inquiries made</p>
                  <div className="mt-4 flex gap-2">
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                      {inquiries.filter(i => i.status === 'pending').length} Pending
                    </Badge>
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                      {inquiries.filter(i => i.status === 'responded').length} Responded
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Quote Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{quoteRequests.length}</div>
                  <p className="text-sm text-muted-foreground">System quotes requested</p>
                  <div className="mt-4 flex gap-2">
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                      {quoteRequests.filter(q => q.status === 'approved').length} Approved
                    </Badge>
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                      {quoteRequests.filter(q => q.status === 'pending').length} In Progress
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Account Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-500">Active</div>
                  <p className="text-sm text-muted-foreground">Your account is in good standing</p>
                  <div className="mt-4">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Verified User
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Your latest interactions with Smart Solar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Activity Items - Generated dynamically based on actual activities */}
                  {inquiries.length > 0 && (
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <MessageSquare size={18} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <p className="font-medium">
                            {inquiries[0].responses.length > 0 
                              ? "New inquiry response received" 
                              : "New inquiry submitted"}
                          </p>
                          <Badge variant="outline" className="w-fit">
                            {new Date(inquiries[0].updatedAt).toLocaleDateString()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {inquiries[0].responses.length > 0 
                            ? `Response received for your inquiry about ${inquiries[0].subject.toLowerCase()}.`
                            : `You submitted a new inquiry about ${inquiries[0].subject.toLowerCase()}.`}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {quoteRequests.length > 0 && (
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <FileText size={18} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <p className="font-medium">Quote request submitted</p>
                          <Badge variant="outline" className="w-fit">
                            {new Date(quoteRequests[0].date).toLocaleDateString()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          You requested a quote for a {quoteRequests[0].systemSize}kW solar system installation.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <User size={18} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <p className="font-medium">Profile updated</p>
                        <Badge variant="outline" className="w-fit">Recent</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        You updated your account profile information.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  View All Activities
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            {/* Profile tab content remains the same as in the original code */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User Profile Card */}
              <Card className="lg:col-span-1">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="" alt={user?.name} />
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle>{user?.name}</CardTitle>
                  <CardDescription>{user?.email}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Mail size={18} className="text-muted-foreground" />
                    <span className="text-sm">{user?.email}</span>
                  </div>
                  {profileData.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={18} className="text-muted-foreground" />
                      <span className="text-sm">{profileData.phone}</span>
                    </div>
                  )}
                  {profileData.address && (
                    <div className="flex items-center gap-2">
                      <MapPin size={18} className="text-muted-foreground" />
                      <span className="text-sm">{profileData.address}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-muted-foreground" />
                    <span className="text-sm">Member since {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex-col space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 size={16} />
                    Edit Profile
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        className="w-full flex items-center gap-2"
                      >
                        <Trash2 size={16} />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your
                          account and all associated data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-destructive text-destructive-foreground"
                        >
                          {isLoading ? 
                            <RefreshCw className="h-4 w-4 animate-spin" /> : 
                            'Delete Account'
                          }
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
              
              {/* Profile Edit Form and Account Info Card */}
              <AnimatePresence>
                {isEditing ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="lg:col-span-2"
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Edit Profile</CardTitle>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setIsEditing(false)}
                          >
                            <X size={18} />
                          </Button>
                        </div>
                        <CardDescription>Update your personal information</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input 
                              id="name" 
                              value={profileData.name} 
                              onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email" 
                              value={profileData.email} 
                              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                              disabled
                            />
                            <p className="text-xs text-muted-foreground">
                              Contact support to change your email address
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input 
                              id="phone" 
                              value={profileData.phone} 
                              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="district">District</Label>
                            <Input 
                              id="district" 
                              value={profileData.district} 
                              onChange={(e) => setProfileData({...profileData, district: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address">Address</Label>
                            <Input 
                              id="address" 
                              value={profileData.address} 
                              onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                            />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleProfileUpdate}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ) : (
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Account Information</CardTitle>
                      <CardDescription>View your account details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium">Account Security</h3>
                        <div className="mt-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="rounded-full bg-green-500/10 p-2">
                                <Check size={16} className="text-green-500" />
                              </div>
                              <div>
                                <p className="font-medium">Email Verification</p>
                                <p className="text-sm text-muted-foreground">Your email is verified</p>
                              </div>
                            </div>
                            <Badge className="bg-green-500 hover:bg-green-600">Verified</Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="rounded-full bg-primary/10 p-2">
                                <Lock size={16} className="text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">Password</p>
                                <p className="text-sm text-muted-foreground">Last updated 30 days ago</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">Change</Button>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-medium">Connected Services</h3>
                        <div className="mt-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="rounded-full bg-blue-500/10 p-2">
                                <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                              </div>
                              <div>
                                <p className="font-medium">Twitter</p>
                                <p className="text-sm text-muted-foreground">Not connected</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">Connect</Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="rounded-full bg-blue-600/10 p-2">
                                <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                              </div>
                              <div>
                                <p className="font-medium">Facebook</p>
                                <p className="text-sm text-muted-foreground">Not connected</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">Connect</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </AnimatePresence>
            </div>
          </TabsContent>
          
          {/* Inquiries Tab - Updated with real API integration */}
          <TabsContent value="inquiries" className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Your Inquiries</h2>
                <p className="text-muted-foreground">View and track all your inquiries with Smart Solar</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={fetchUserInquiries}
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
                <Button className="flex items-center gap-2" asChild>
                  <a href="/inquiries">
                    <MessageSquare className="h-4 w-4" />
                    New Inquiry
                  </a>
                </Button>
              </div>
            </div>
            
            {/* Inquiry Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="inquirySearch" className="mb-2 block">Search Inquiries</Label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="inquirySearch" 
                        placeholder="Search by subject or content..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="statusFilter" className="mb-2 block">Filter by Status</Label>
                    <div className="flex gap-2">
                      <Button 
                        variant={inquiryFilter === 'all' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setInquiryFilter('all')}
                        className="flex items-center gap-1"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        All
                      </Button>
                      <Button 
                        variant={inquiryFilter === 'pending' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setInquiryFilter('pending')}
                        className="flex items-center gap-1"
                      >
                        <Clock className="h-3.5 w-3.5" />
                        Pending
                      </Button>
                      <Button 
                        variant={inquiryFilter === 'responded' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setInquiryFilter('responded')}
                        className="flex items-center gap-1"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Responded
                      </Button>
                      <Button 
                        variant={inquiryFilter === 'closed' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setInquiryFilter('closed')}
                        className="flex items-center gap-1"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Closed
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Inquiries List */}
            {isLoadingInquiries ? (
              <Card>
                <CardContent className="flex items-center justify-center p-8">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading your inquiries...</p>
                  </div>
                </CardContent>
              </Card>
            ) : filteredInquiries.length > 0 ? (
              <div className="space-y-4">
                {filteredInquiries.map((inquiry) => (
                  <Card key={inquiry._id} className="overflow-hidden">
                    <div 
                      className={`h-1.5 ${
                        inquiry.status === 'pending' 
                          ? 'bg-yellow-500' 
                          : inquiry.status === 'responded'
                          ? 'bg-green-500' 
                          : 'bg-gray-500'
                      }`} 
                    />
                    <CardHeader className="pb-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <CardTitle className="text-lg">{inquiry.subject}</CardTitle>
                        {getStatusBadge(inquiry.status)}
                      </div>
                      <CardDescription>
                        <div className="flex items-center gap-2">
                          <span>{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <Badge variant="outline">{inquiry.type}</Badge>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {inquiry.message}
                      </p>
                      {inquiry.responses.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm font-medium flex items-center gap-1">
                            <MessageSquare className="h-3.5 w-3.5 text-primary" />
                            Latest Response:
                          </p>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {inquiry.responses[inquiry.responses.length - 1].message}
                          </p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="ml-auto"
                        onClick={() => handleViewInquiry(inquiry)}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <MessageSquare className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No inquiries found</h3>
                  <p className="text-muted-foreground max-w-md mb-6">
                    {searchQuery || inquiryFilter !== 'all'
                      ? "No inquiries match your current filters. Try adjusting your search criteria."
                      : "You haven't submitted any inquiries yet. Create a new inquiry to get started."}
                  </p>
                  {(searchQuery || inquiryFilter !== 'all') ? (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchQuery('');
                        setInquiryFilter('all');
                      }}
                    >
                      Clear Filters
                    </Button>
                  ) : (
                    <Button asChild>
                      <a href="/inquiries">Create an Inquiry</a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* Create New Inquiry Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>Submit a new inquiry to get assistance from our team</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Whether you need technical support, have questions about your solar system, or want to provide feedback,
                  our support team is ready to assist you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 p-4 border rounded-lg">
                    <h4 className="text-base font-medium mb-2 flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-primary" />
                      Technical Support
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Get help with system performance, maintenance, or troubleshooting issues.
                    </p>
                  </div>
                  <div className="flex-1 p-4 border rounded-lg">
                    <h4 className="text-base font-medium mb-2 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      General Inquiries
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Questions about billing, services, or other general information.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full sm:w-auto" asChild>
                  <a href="/inquiries">Create New Inquiry</a>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Quotes Tab */}
          <TabsContent value="quotes" className="space-y-6">
            {/* Keep the existing quotes tab content */}
            <div className="flex items-center justify-between">
              <div>
              <h2 className="text-2xl font-bold">Your Quote Requests</h2>
                <p className="text-muted-foreground">Track all your solar system quote requests</p>
              </div>
              <Button className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Request New Quote
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quoteRequests.map((quote) => (
                <Card key={quote.id} className="overflow-hidden">
                  <div className={`h-2 ${
                    quote.status === 'approved' 
                      ? 'bg-green-500' 
                      : quote.status === 'rejected'
                      ? 'bg-red-500'
                      : 'bg-yellow-500'
                  }`} />
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{quote.systemSize} kW System</CardTitle>
                      <Badge 
                        variant="outline" 
                        className={
                          quote.status === 'pending' 
                            ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" 
                            : quote.status === 'approved'
                            ? "bg-green-500/10 text-green-600 border-green-500/20"
                            : "bg-red-500/10 text-red-600 border-red-500/20"
                        }
                      >
                        {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                      </Badge>
                    </div>
                    <CardDescription>
                      Quote ID: {quote.id} • {new Date(quote.date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Roof Area</p>
                        <p className="font-medium">{quote.roofArea} m²</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Monthly Bill</p>
                        <p className="font-medium">Rs. {quote.monthlyBill.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">System Size</p>
                        <p className="font-medium">{quote.systemSize} kW</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Cost</p>
                        <p className="font-medium">Rs. {quote.totalCost.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="rounded-md bg-muted p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Estimated monthly savings:</span>
                        <span className="font-medium text-green-600">
                          Rs. {Math.round(quote.monthlyBill * 0.7).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">View Details</Button>
                    {quote.status === 'approved' && (
                      <Button size="sm">Proceed to Order</Button>
                    )}
                    {quote.status === 'pending' && (
                      <Button size="sm" variant="secondary">Check Status</Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
              
              {quoteRequests.length === 0 && (
                <Card className="col-span-full">
                  <CardHeader>
                    <CardTitle>No Quote Requests</CardTitle>
                    <CardDescription>
                      You haven't requested any quotes yet.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Get started by requesting a quote for your solar system installation.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button>Request a Quote</Button>
                  </CardFooter>
                </Card>
              )}
            </div>
            
            {/* Quote Request Form */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Request a New Quote</CardTitle>
                <CardDescription>
                  Fill in the details below to get a customized solar system quote
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="roofArea">Roof Area (m²)</Label>
                    <Input id="roofArea" type="number" placeholder="e.g., 100" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyBill">Average Monthly Electricity Bill (Rs.)</Label>
                    <Input id="monthlyBill" type="number" placeholder="e.g., 15000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="propertyType">Property Type</Label>
                    <select 
                      id="propertyType" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select property type</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="industrial">Industrial</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="installationTimeframe">Preferred Installation Timeframe</Label>
                    <select 
                      id="installationTimeframe" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select timeframe</option>
                      <option value="asap">As soon as possible</option>
                      <option value="1-3months">1-3 months</option>
                      <option value="3-6months">3-6 months</option>
                      <option value="6+months">6+ months</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="additionalInfo">Additional Information</Label>
                    <textarea 
                      id="additionalInfo" 
                      rows={4}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Any specific requirements or questions..."
                    ></textarea>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="ml-auto">Submit Quote Request</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Inquiry Detail Dialog */}
      <Dialog open={isInquiryDialogOpen} onOpenChange={setIsInquiryDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedInquiry && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between mb-1">
                  <DialogTitle className="text-xl">{selectedInquiry.subject}</DialogTitle>
                  {getStatusBadge(selectedInquiry.status)}
                </div>
                <DialogDescription>
                  Inquiry ID: {selectedInquiry._id} • Created: {formatDate(selectedInquiry.createdAt)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                <div className="md:col-span-1 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Inquiry Information</h3>
                    <Card>
                      <CardContent className="p-4 space-y-3">
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Type</p>
                            <Badge variant="outline" className="mt-1">
                              {selectedInquiry.type}
                            </Badge>
                          </div>
                          
                          <div>
                            <p className="text-xs text-muted-foreground">Status</p>
                            <div className="mt-1">
                              {getStatusBadge(selectedInquiry.status)}
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs text-muted-foreground">Date Submitted</p>
                            <p className="text-sm font-medium">{formatDate(selectedInquiry.createdAt)}</p>
                          </div>
                          
                          <div>
                            <p className="text-xs text-muted-foreground">Last Updated</p>
                            <p className="text-sm font-medium">{formatDate(selectedInquiry.updatedAt)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Your Contact Details</h3>
                    <Card>
                      <CardContent className="p-4 space-y-3">
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
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Your Original Message</h3>
                    <Card>
                      <CardContent className="p-4">
                        <div className="p-3 bg-muted/30 rounded-md text-sm whitespace-pre-wrap">
                          {selectedInquiry.message}
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
                        <CardContent className="p-6 text-center">
                          <div className="mb-4 flex justify-center">
                            <div className="rounded-full bg-yellow-500/10 p-3">
                              <Clock className="h-5 w-5 text-yellow-600" />
                            </div>
                          </div>
                          <h4 className="text-sm font-medium mb-2">Awaiting Response</h4>
                          <p className="text-sm text-muted-foreground">
                            Our team is reviewing your inquiry and will respond soon.
                            Typical response time is 1-2 business days.
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-3">
                        {selectedInquiry.responses.map((response, index) => (
                          <Card key={index} className="overflow-hidden">
                            <div className="h-1 bg-primary/20" />
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="rounded-full bg-primary/10 p-1.5">
                                    <MessageSquare className="h-3.5 w-3.5 text-primary" />
                                  </div>
                                  <span className="text-sm font-medium">
                                    Response from {response.respondedBy}
                                  </span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(response.respondedAt)}
                                </span>
                              </div>
                              <div className="whitespace-pre-wrap text-sm">
                                {response.message}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {selectedInquiry.status !== 'closed' && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Send a Reply</h3>
                      <Card>
                        <CardContent className="p-4">
                          <form onSubmit={handleSubmitReply} className="space-y-4">
                            <div>
                              <Label htmlFor="replyMessage">Your Message</Label>
                              <Textarea 
                                id="replyMessage" 
                                rows={4}
                                value={newReplyText}
                                onChange={(e) => setNewReplyText(e.target.value)}
                                placeholder="Type your reply here..."
                                className="mt-1"
                                required
                              />
                            </div>
                            <div className="flex justify-end">
                              <Button 
                                type="submit" 
                                disabled={isSubmittingReply}
                                className="flex items-center gap-2"
                              >
                                {isSubmittingReply ? (
                                  <>
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                    Sending...
                                  </>
                                ) : (
                                  <>
                                    <Send className="h-4 w-4" />
                                    Send Reply
                                  </>
                                )}
                              </Button>
                            </div>
                          </form>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
              
              <DialogFooter>
                <div className="flex gap-2 w-full justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsInquiryDialogOpen(false)}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back to List
                  </Button>
                  
                  {selectedInquiry.status !== 'closed' && (
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={async () => {
                        try {
                          const response = await fetch(`/api/inquiries/${selectedInquiry._id}/status`, {
                            method: 'PATCH',
                            headers: {
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ status: 'closed' })
                          });
                          
                          if (!response.ok) {
                            throw new Error('Failed to close inquiry');
                          }
                          
                          const updatedInquiry = await response.json();
                          
                          // Update inquiries list
                          setInquiries(prev => 
                            prev.map(inq => inq._id === updatedInquiry._id ? updatedInquiry : inq)
                          );
                          
                          // Update selected inquiry
                          setSelectedInquiry(updatedInquiry);
                          
                          successt({
                            title: "Inquiry Closed",
                            description: "The inquiry has been marked as closed",
                          });
                        } catch (error) {
                          console.error('Error closing inquiry:', error);
                          errort({
                            title: "Error",
                            description: "Failed to close the inquiry. Please try again.",
                          });
                        }
                      }}
                    >
                      <XCircle className="h-4 w-4" />
                      Close Inquiry
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}



