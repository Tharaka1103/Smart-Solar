'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, Bell, Settings, MessageSquare, Plus, Send, Reply,
  Calendar, Shield, ChevronRight, Edit2, RefreshCw, 
  Check, LogOut, AlertCircle, Clock, Search, Filter,
  Eye, Archive, Trash2, MoreVertical, KeyRound, Sun
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserDetails } from '@/types/user'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Types
interface Inquiry {
  _id: string
  subject: string
  message: string
  type: string
  status: 'pending' | 'responded' | 'closed'
  customerDetails: {
    name: string
    email: string
    contact: string
  }
  responses: Array<{
    message: string
    respondedBy: string
    respondedAt: string
  }>
  createdAt: string
  updatedAt: string
}

export default function Dashboard() {
  const router = useRouter()
  const { user, status, signOut } = useAuth()
  const { toast } = useToast()
  
  // States
  const [userData, setUserData] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [inquiriesLoading, setInquiriesLoading] = useState(true)
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [newInquiryOpen, setNewInquiryOpen] = useState(false)
  const [inquiryDetailOpen, setInquiryDetailOpen] = useState(false)
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [updating, setUpdating] = useState(false)
  
  // Forms
  const [newInquiry, setNewInquiry] = useState({
    subject: '',
    type: '',
    message: ''
  })
  
  const [replyMessage, setReplyMessage] = useState('')
  const [sending, setSending] = useState(false)
  
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    district: '',
    address: '',
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Fetch data
  useEffect(() => {
    if (status === 'authenticated' && user) {
      fetchUserData(user.email)
      fetchInquiries(user.email)
    }
  }, [status, user])

  const fetchUserData = async (email: string) => {
    try {
      const response = await fetch(`/api/users/profile?email=${email}`)
      if (!response.ok) throw new Error('Failed to fetch user data')
      
      const data = await response.json()
      setUserData(data)
      setProfileForm({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || '',
        district: data.district || '',
        address: data.address || '',
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile data",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchInquiries = async (email: string) => {
    try {
      setInquiriesLoading(true)
      const response = await fetch(`/api/inquiries/user?email=${email}`)
      if (!response.ok) throw new Error('Failed to fetch inquiries')
      
      const data = await response.json()
      setInquiries(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load inquiries",
      })
    } finally {
      setInquiriesLoading(false)
    }
  }

  const handleCreateInquiry = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !userData) return

    setSending(true)
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerType: 'existing',
          customerDetails: {
            name: userData.fullName,
            email: userData.email,
            contact: userData.phone || '',
            district: userData.district || '',
            address: userData.address || ''
          },
          subject: newInquiry.subject,
          message: newInquiry.message,
          type: newInquiry.type
        })
      })

      if (!response.ok) throw new Error('Failed to create inquiry')

      toast({
        title: "Inquiry Created",
        description: "Your inquiry has been submitted successfully.",
      })

      setNewInquiry({ subject: '', type: '', message: '' })
      setNewInquiryOpen(false)
      fetchInquiries(user.email)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create inquiry",
      })
    } finally {
      setSending(false)
    }
  }

  const handleSendReply = async () => {
    if (!selectedInquiry || !replyMessage.trim()) return

    setSending(true)
    try {
      const response = await fetch(`/api/inquiries/${selectedInquiry._id}/user-reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyMessage })
      })

      if (!response.ok) throw new Error('Failed to send reply')

      const updatedInquiry = await response.json()
      setSelectedInquiry(updatedInquiry)
      setInquiries(prev => prev.map(inq => 
        inq._id === updatedInquiry._id ? updatedInquiry : inq
      ))
      setReplyMessage('')

      toast({
        title: "Reply Sent",
        description: "Your reply has been sent successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reply",
      })
    } finally {
      setSending(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    
    try {
      const response = await fetch('/api/users/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      })
      
      if (!response.ok) throw new Error('Failed to update profile')
      
      const updatedUser = await response.json()
      setUserData(updatedUser)
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })
      
      setEditProfileOpen(false)
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile",
      })
    } finally {
      setUpdating(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "New password and confirmation must match.",
      })
      return
    }
    
    setUpdating(true)
    
    try {
      const response = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData?.email,
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to change password')
      }
      
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      })
      
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setChangePasswordOpen(false)
    } catch (error: any) {
      toast({
        title: "Change Failed",
        description: error.message || "Failed to change password",
      })
    } finally {
      setUpdating(false)
    }
  }

  // Filter inquiries
  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Dashboard</h3>
          <p className="text-gray-600">Please wait...</p>
        </motion.div>
      </div>
    )
  }

  if (status !== 'authenticated') {
    router.push('/signin')
    return null
  }

  const statusColors = {
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    responded: 'bg-blue-100 text-blue-800 border-blue-200',
    closed: 'bg-green-100 text-green-800 border-green-200'
  }

  const statusIcons = {
    pending: <Clock className="h-3 w-3" />,
    responded: <Reply className="h-3 w-3" />,
    closed: <Check className="h-3 w-3" />
  }

  return (
    <div className="min-h-screen bg-background mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-green-200 p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-green-200">
                <AvatarFallback className="bg-green-100 text-green-700 text-xl font-semibold">
                  {userData?.fullName?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {userData?.fullName?.split(' ')[0]}!
                </h1>
                <h5 className="text-gray-600 flex items-center gap-2 mt-1">
                  <User className="h-4 w-4" />
                  {userData?.email}
                  <Badge className="bg-green-100 text-green-700 text-xs">
                    {userData?.role?.toUpperCase() || 'USER'}
                  </Badge>
                </h5>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-green-200">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setEditProfileOpen(true)}>
                    <User className="h-4 w-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setChangePasswordOpen(true)}>
                    <KeyRound className="h-4 w-4 mr-2" />
                    Change Password
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white rounded-xl shadow-sm border border-green-200 p-1">
              <TabsTrigger 
                value="dashboard" 
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-lg transition-all flex items-center gap-2"
              >
                <Sun className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="inquiries" 
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-lg transition-all flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Inquiries
                {inquiries.filter(i => i.status === 'pending').length > 0 && (
                  <Badge className="bg-red-500 text-white text-xs h-5 w-5 p-0 flex items-center justify-center">
                    {inquiries.filter(i => i.status === 'pending').length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-lg transition-all flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Stats Cards */}
                <Card className="bg-white border-green-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
                        <p className="text-3xl font-bold text-green-600">{inquiries.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <MessageSquare className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-green-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Pending</p>
                        <p className="text-3xl font-bold text-amber-600">
                          {inquiries.filter(i => i.status === 'pending').length}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Clock className="h-6 w-6 text-amber-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-green-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Responded</p>
                        <p className="text-3xl font-bold text-blue-600">
                          {inquiries.filter(i => i.status === 'responded').length}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Reply className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-green-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Closed</p>
                        <p className="text-3xl font-bold text-green-600">
                          {inquiries.filter(i => i.status === 'closed').length}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Check className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Welcome Section */}
              <Card className="bg-white border-green-200">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Welcome to Luminex Engineering Dashboard</CardTitle>
                  <CardDescription>
                    Manage your solar energy projects and stay connected with our support team
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h3 className="font-semibold text-green-800 mb-2">Quick Actions</h3>
                      <div className="space-y-2">
                        <Button 
                          onClick={() => setNewInquiryOpen(true)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white justify-start"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create New Inquiry
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full border-green-200 text-green-700 hover:bg-green-50 justify-start"
                          onClick={() => setEditProfileOpen(true)}
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Update Profile
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h3 className="font-semibold text-blue-800 mb-2">Recent Activity</h3>
                      {inquiries.slice(0, 3).map((inquiry) => (
                        <div key={inquiry._id} className="text-sm text-blue-700 mb-1">
                          • {inquiry.subject}
                        </div>
                      ))}
                      {inquiries.length === 0 && (
                        <p className="text-sm text-blue-700">No recent activity</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Inquiries Tab */}
            <TabsContent value="inquiries" className="space-y-6">
              <Card className="bg-white border-green-200">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl font-semibold">My Inquiries</CardTitle>
                      <CardDescription>Track and manage your support requests</CardDescription>
                    </div>
                    <Button 
                      onClick={() => setNewInquiryOpen(true)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Inquiry
                    </Button>
                  </div>
                  
                  {/* Search and Filter */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search inquiries..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-green-200 focus:border-green-500"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-48 border-green-200">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="responded">Responded</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {inquiriesLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <RefreshCw className="h-8 w-8 animate-spin text-green-500" />
                    </div>
                  ) : filteredInquiries.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {searchTerm || statusFilter !== 'all' ? 'No inquiries found' : 'No inquiries yet'}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {searchTerm || statusFilter !== 'all' 
                          ? 'Try adjusting your search or filter criteria' 
                          : 'Create your first inquiry to get started'
                        }
                      </p>
                      {!searchTerm && statusFilter === 'all' && (
                        <Button 
                          onClick={() => setNewInquiryOpen(true)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create First Inquiry
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredInquiries.map((inquiry) => (
                        <motion.div
                          key={inquiry._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border border-green-200 rounded-lg p-4 hover:bg-green-50/50 transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedInquiry(inquiry)
                            setInquiryDetailOpen(true)
                          }}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-gray-900 truncate">
                                  {inquiry.subject}
                                </h3>
                                <Badge className={`${statusColors[inquiry.status]} text-xs flex items-center gap-1`}>
                                  {statusIcons[inquiry.status]}
                                  {inquiry.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                {inquiry.message}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(inquiry.createdAt).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Shield className="h-3 w-3" />
                                  {inquiry.type}
                                </span>
                                {inquiry.responses.length > 0 && (
                                  <span className="flex items-center gap-1">
                                    <Reply className="h-3 w-3" />
                                    {inquiry.responses.length} replies
                                  </span>
                                )}
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Settings */}
                <Card className="bg-white border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-green-600" />
                      Profile Settings
                    </CardTitle>
                    <CardDescription>
                      Manage your personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Full Name</Label>
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        {userData?.fullName}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Email</Label>
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        {userData?.email}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Phone</Label>
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        {userData?.phone || 'Not provided'}
                      </div>
                    </div>
                    <Button 
                      onClick={() => setEditProfileOpen(true)}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </CardContent>
                </Card>

                {/* Security Settings */}
                <Card className="bg-white border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      Security Settings
                    </CardTitle>
                    <CardDescription>
                      Manage your account security
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex items-center gap-2 mb-2">
                        <KeyRound className="h-4 w-4 text-amber-600" />
                        <span className="font-medium text-amber-800">Password Security</span>
                      </div>
                      <p className="text-sm text-amber-700">
                        Keep your account secure by using a strong password
                      </p>
                    </div>
                    <Button 
                      onClick={() => setChangePasswordOpen(true)}
                      variant="outline"
                      className="w-full border-red-200 text-red-700 hover:bg-red-50"
                    >
                      <KeyRound className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* New Inquiry Dialog */}
        <Dialog open={newInquiryOpen} onOpenChange={setNewInquiryOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-green-600" />
                Create New Inquiry
              </DialogTitle>
              <DialogDescription>
                Submit a new support request or inquiry
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateInquiry}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={newInquiry.subject}
                    onChange={(e) => setNewInquiry({...newInquiry, subject: e.target.value})}
                    placeholder="Brief description of your inquiry"
                    className="border-green-200 focus:border-green-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Category</Label>
                  <Select 
                    value={newInquiry.type} 
                    onValueChange={(value) => setNewInquiry({...newInquiry, type: value})}
                  >
                    <SelectTrigger className="border-green-200">
                      <SelectValue placeholder="Select inquiry type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="billing">Billing & Payments</SelectItem>
                      <SelectItem value="general">General Question</SelectItem>
                      <SelectItem value="installation">Installation</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="complaint">Complaint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={newInquiry.message}
                    onChange={(e) => setNewInquiry({...newInquiry, message: e.target.value})}
                    placeholder="Describe your inquiry in detail..."
                    className="border-green-200 focus:border-green-500 min-h-[100px]"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setNewInquiryOpen(false)}
                  disabled={sending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={sending || !newInquiry.subject || !newInquiry.type || !newInquiry.message}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {sending ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Inquiry
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Inquiry Detail Dialog */}
        <Dialog open={inquiryDetailOpen} onOpenChange={setInquiryDetailOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            {selectedInquiry && (
              <>
                <DialogHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <DialogTitle className="text-xl">{selectedInquiry.subject}</DialogTitle>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge className={`${statusColors[selectedInquiry.status]} flex items-center gap-1`}>
                          {statusIcons[selectedInquiry.status]}
                          {selectedInquiry.status}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {selectedInquiry.type}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(selectedInquiry.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Original Message */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-green-100 text-green-700 text-sm">
                          {selectedInquiry.customerDetails.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">You</p>
                        <p className="text-xs text-gray-500">
                          {new Date(selectedInquiry.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700">{selectedInquiry.message}</p>
                  </div>

                  {/* Responses */}
                  {selectedInquiry.responses.map((response, index) => (
                    <div key={index} className={`rounded-lg p-4 ${
                      response.respondedBy === 'Customer' 
                        ? 'bg-green-50 ml-8' 
                        : 'bg-blue-50 mr-8'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className={`text-sm ${
                            response.respondedBy === 'Customer'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {response.respondedBy === 'Customer' 
                              ? selectedInquiry.customerDetails.name.charAt(0)
                              : 'A'
                            }
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {response.respondedBy === 'Customer' ? 'You' : 'Support Team'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(response.respondedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700">{response.message}</p>
                    </div>
                  ))}

                  {/* Reply Form */}
                  {selectedInquiry.status !== 'closed' && (
                    <div className="border-t pt-4">
                      <div className="space-y-3">
                        <Label htmlFor="reply">Send Reply</Label>
                        <Textarea
                          id="reply"
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          placeholder="Type your reply..."
                          className="border-green-200 focus:border-green-500"
                          rows={3}
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={handleSendReply}
                            disabled={sending || !replyMessage.trim()}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {sending ? (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send className="mr-2 h-4 w-4" />
                                Send Reply
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Profile Dialog */}
        <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit2 className="h-5 w-5 text-green-600" />
                Edit Profile
              </DialogTitle>
              <DialogDescription>
                Update your personal information
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateProfile}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})}
                    className="border-green-200 focus:border-green-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={profileForm.email}
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                    className="border-green-200 focus:border-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    value={profileForm.district}
                    onChange={(e) => setProfileForm({...profileForm, district: e.target.value})}
                    className="border-green-200 focus:border-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                    className="border-green-200 focus:border-green-500"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditProfileOpen(false)}
                  disabled={updating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updating}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {updating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Change Password Dialog */}
        <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-red-600" />
                Change Password
              </DialogTitle>
              <DialogDescription>
                Update your password to keep your account secure
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleChangePassword}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    className="border-green-200 focus:border-green-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    className="border-green-200 focus:border-green-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    className="border-green-200 focus:border-green-500"
                    required
                  />
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <p className="font-medium mb-1">Password requirements:</p>
                  <ul className="text-gray-600 space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• Include uppercase and lowercase letters</li>
                    <li>• Include at least one number</li>
                    <li>• Include at least one special character</li>
                  </ul>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setChangePasswordOpen(false)}
                  disabled={updating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updating}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {updating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}