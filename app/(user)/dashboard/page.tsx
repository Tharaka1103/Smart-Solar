"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, KeyRound, Bell, Settings, Home, MessageSquare, FileText, 
  BarChart2, Calendar, Shield, ExternalLink, ChevronRight, Edit2,
  Sun, Moon, Laptop, X, RefreshCw, Check, LogOut, CreditCard, AlertCircle
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { GlassPanel } from '@/components/ui/glass-panel'
import { UserDetails } from '@/types/user'
import { Checkbox } from '@/components/ui/checkbox'

// Type for notifications
interface Notification {
  id: string
  title: string
  message: string
  timestamp: string
  read: boolean
  type: 'info' | 'warning' | 'success' | 'error'
}

export default function Dashboard() {
  const router = useRouter()
  const { user, status, signOut } = useAuth()
  const { successt, errort } = useToast()
  
  // States for user data
  const [userData, setUserData] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  
  // States for dialogs
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  
  // Form states
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
  
  // Settings states
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [appNotifications, setAppNotifications] = useState(true)
  
  // Mock notifications - would come from an API in a real app
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'System update completed',
      message: 'Your solar system data has been updated successfully.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      read: false,
      type: 'success'
    },
    {
      id: '2',
      title: 'Monthly report available',
      message: 'Your solar performance report for last month is now ready to view.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      read: false,
      type: 'info'
    },
    {
      id: '3',
      title: 'Maintenance reminder',
      message: 'Schedule your bi-annual solar panel cleaning for optimal performance.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      read: true,
      type: 'warning'
    }
  ])
  
  // Fetch user data
  useEffect(() => {
    if (status === 'authenticated' && user) {
      fetchUserData(user.email)
    }
  }, [status, user])
  
  const fetchUserData = async (email: string) => {
    try {
      setLoading(true)
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
      
      setLoading(false)
    } catch (error) {
      console.error('Error fetching user data:', error)
      errort({
        title: "Error",
        description: "Failed to load your profile data. Please try again.",
      })
      setLoading(false)
    }
  }
  
  // Handle profile update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    
    try {
      const response = await fetch('/api/users/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: profileForm.email,
          fullName: profileForm.fullName,
          phone: profileForm.phone,
          district: profileForm.district,
          address: profileForm.address,
        }),
      })
      
      if (!response.ok) throw new Error('Failed to update profile')
      
      const updatedUser = await response.json()
      setUserData(updatedUser)
      
      successt({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })
      
      setEditProfileOpen(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      errort({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
      })
    } finally {
      setUpdating(false)
    }
  }
  
  // Handle password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errort({
        title: "Passwords Don't Match",
        description: "New password and confirmation must match.",
      })
      return
    }
    
    setUpdating(true)
    
    try {
      const response = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData?.email,
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to change password')
      }
      
      successt({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      })
      
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      
      setChangePasswordOpen(false)
    } catch (error: any) {
      console.error('Error changing password:', error)
      errort({
        title: "Change Failed",
        description: error.message || "There was an error changing your password. Please try again.",
      })
    } finally {
      setUpdating(false)
    }
  }
  
  // Handle notification mark as read
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    )
  }
  
  // Handle mark all notifications as read
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
    
    successt({
      title: "Notifications Cleared",
      description: "All notifications marked as read.",
    })
  }
  
  // Handle theme change
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)   
    successt({
      title: "Theme Updated",
      description: `Theme changed to ${newTheme}.`,
    })
    window.location.reload()
  }
  
  // Handle save settings
  const handleSaveSettings = () => {
    // In a real app, you would save these settings to the server
    successt({
      title: "Settings Saved",
      description: "Your preferences have been updated.",
    })
    setSettingsOpen(false)
  }
  
  // Loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center mt-10">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw size={40} className="text-primary" />
          </motion.div>
          <p className="text-lg text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }
  
  // If not authenticated
  if (status !== 'authenticated') {
    router.push('/signin')
    return null
  }
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 mt-20 pb-10">
      {/* Top User Profile Section */}
      <div className="w-full backdrop-blur-md bg-background/80 border-b sticky top-10 z-10">
        <div className="container mx-auto py-4 px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Avatar className="h-16 w-16 border-2 border-primary/20">
                <AvatarImage src="" alt={userData?.fullName} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {userData?.fullName?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  {userData?.fullName}
                  <Badge variant="outline" className="ml-2 bg-primary/10 text-primary text-xs">
                    {userData?.role?.toUpperCase() || 'USER'}
                  </Badge>
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-muted-foreground text-sm">
                  <span className="flex items-center gap-1">
                    <User size={12} className="text-primary" /> 
                    {userData?.email}
                  </span>
                  {userData?.phone && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <span>{userData?.phone}</span>
                    </>
                  )}
                  {userData?.district && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <span>{userData?.district}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="relative">
                    <Bell size={16} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[320px]">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    Notifications
                    {unreadCount > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs" 
                        onClick={markAllNotificationsAsRead}
                      >
                        Mark all as read
                      </Button>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {notifications.length > 0 ? (
                    <div className="max-h-[300px] overflow-y-auto">
                      {notifications.map(notification => (
                        <DropdownMenuItem 
                          key={notification.id}
                          className={`p-0 focus:bg-transparent ${notification.read ? 'opacity-70' : ''}`}
                        >
                          <div 
                            className="p-3 w-full cursor-pointer hover:bg-muted rounded-md"
                            onClick={() => markNotificationAsRead(notification                          .id)}
                            >
                              <div className="flex items-start gap-2">
                                <div className={`mt-0.5 rounded-full p-1 ${
                                  notification.type === 'success' ? 'bg-green-500/10 text-green-500' :
                                  notification.type === 'warning' ? 'bg-yellow-500/10 text-yellow-500' :
                                  notification.type === 'error' ? 'bg-red-500/10 text-red-500' :
                                  'bg-blue-500/10 text-blue-500'
                                }`}>
                                  {notification.type === 'success' ? <Check size={14} /> :
                                  notification.type === 'warning' ? <AlertCircle size={14} /> :
                                  notification.type === 'error' ? <X size={14} /> :
                                  <Bell size={14} />}
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm font-medium">{notification.title}</p>
                                  <p className="text-xs text-muted-foreground">{notification.message}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(notification.timestamp).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    ) : (
                      <div className="py-6 text-center">
                        <Bell className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No notifications yet</p>
                      </div>
                    )}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <div onClick={() => setNotificationsOpen(true)} className="flex justify-center text-center w-full text-sm">
                        View all notifications
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setEditProfileOpen(true)} className="cursor-pointer">
                      <User size={14} className="mr-2" />
                      Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setChangePasswordOpen(true)} className="cursor-pointer ">
                      <KeyRound size={14} className="mr-2" />
                      Change Password
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSettingsOpen(true)} className="cursor-pointer">
                      <Settings size={14} className="mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-500 hover:text-red-600">
                      <LogOut size={14} className="mr-2" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="container mx-auto mt-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Quick Actions Section */}
            <section className="mb-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Quick Actions</h2>
                  <p className="text-muted-foreground">Manage your account and settings</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="mt-2 md:mt-0">
                      <Settings size={14} className="mr-2" />
                      Options
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push('/inquiries')}>
                      <MessageSquare size={14} className="mr-2" />
                      Inquiries
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/quotes')}>
                      <FileText size={14} className="mr-2" />
                      Quote Requests
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/support')}>
                      <ExternalLink size={14} className="mr-2" />
                      Get Support
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
                {/* Profile Card */}
                <GlassPanel onClick={() => setEditProfileOpen(true)} className="cursor-pointer transform hover:scale-105 transition-transform duration-200">
                  <div className="flex items-start space-x-4">
                    <div className="rounded-full bg-primary/10 p-2 h-12 w-12 flex items-center justify-center flex-shrink-0">
                      <User size={24} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold mb-1">Edit Profile</h3>
                      <p className="text-xs text-muted-foreground mb-3">Update your personal information</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          Up to date
                        </Badge>
                        <ChevronRight size={16} className="text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </GlassPanel>
                
                {/* Password Card */}
                <GlassPanel onClick={() => setChangePasswordOpen(true)} className="cursor-pointer transform hover:scale-105 transition-transform duration-200">
                  <div className="flex items-start space-x-4">
                    <div className="rounded-full bg-primary/10 p-2 h-12 w-12 flex items-center justify-center flex-shrink-0">
                      <KeyRound size={24} className="text-red-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold mb-1">Change Password</h3>
                      <p className="text-xs text-muted-foreground mb-3">Update your security credentials</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                          Last changed 30 days ago
                        </Badge>
                        <ChevronRight size={16} className="text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </GlassPanel>
                
                {/* Notifications Card */}
                <GlassPanel onClick={() => setNotificationsOpen(true)} className="cursor-pointer transform hover:scale-105 transition-transform duration-200">
                  <div className="flex items-start space-x-4">
                    <div className="rounded-full bg-primary/10 p-2 h-12 w-12 flex items-center justify-center flex-shrink-0">
                      <Bell size={24} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold mb-1">Notifications</h3>
                      <p className="text-xs text-muted-foreground mb-3">View and manage alerts</p>
                      <div className="flex items-center justify-between">
                        {unreadCount > 0 ? (
                          <Badge className="bg-primary text-primary-foreground">
                            {unreadCount} unread
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                            No new notifications
                          </Badge>
                        )}
                        <ChevronRight size={16} className="text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </GlassPanel>
                
                {/* Settings Card */}
                <GlassPanel onClick={() => setSettingsOpen(true)} className="cursor-pointer transform hover:scale-105 transition-transform duration-200">
                  <div className="flex items-start space-x-4">
                    <div className="rounded-full bg-primary/10 p-2 h-12 w-12 flex items-center justify-center flex-shrink-0">
                      <Settings size={24} className="text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold mb-1">App Settings</h3>
                      <p className="text-xs text-muted-foreground mb-3">Customize your preferences</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                          {theme.charAt(0).toUpperCase() + theme.slice(1)} theme
                        </Badge>
                        <ChevronRight size={16} className="text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </GlassPanel>
              </div>            </section>
            
            {/* Activity & Options Section */}
            <section className="mb-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Main Menu</h2>
                  <p className="text-muted-foreground">Access key features and services</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Inquiries Card */}
                <Card onClick={() => router.push('/inquiries')} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="rounded-full bg-blue-500/10 p-2 h-10 w-10 flex items-center justify-center mb-2">
                      <MessageSquare size={20} className="text-blue-500" />
                    </div>
                    <CardTitle>Inquiries</CardTitle>
                    <CardDescription>Submit and track your inquiries</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Get help with technical issues or request information about our services.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="flex items-center gap-2 text-blue-500 hover:text-blue-600 ml-auto">
                      <span>View Inquiries</span>
                      <ChevronRight size={16} />
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Quotes Card */}
                <Card onClick={() => router.push('/quotes')} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="rounded-full bg-green-500/10 p-2 h-10 w-10 flex items-center justify-center mb-2">
                      <FileText size={20} className="text-green-500" />
                    </div>
                    <CardTitle>Quote Requests</CardTitle>
                    <CardDescription>Manage solar system quotes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Request quotes for new solar installations or system upgrades.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="flex items-center gap-2 text-green-500 hover:text-green-600 ml-auto">
                      <span>View Quotes</span>
                      <ChevronRight size={16} />
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Reports Card */}
                <Card onClick={() => router.push('/reports')} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="rounded-full bg-purple-500/10 p-2 h-10 w-10 flex items-center justify-center mb-2">
                      <BarChart2 size={20} className="text-purple-500" />
                    </div>
                    <CardTitle>Reports & Analytics</CardTitle>
                    <CardDescription>View solar performance data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Track your solar system's performance and view detailed analytics.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="flex items-center gap-2 text-purple-500 hover:text-purple-600 ml-auto">
                      <span>View Reports</span>
                      <ChevronRight size={16} />
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Maintenance Card */}
                <Card onClick={() => router.push('/maintenance')} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="rounded-full bg-orange-500/10 p-2 h-10 w-10 flex items-center justify-center mb-2">
                      <Calendar size={20} className="text-orange-500" />
                    </div>
                    <CardTitle>Maintenance Schedule</CardTitle>
                    <CardDescription>Track system maintenance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Schedule maintenance visits and view service history.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="flex items-center gap-2 text-orange-500 hover:text-orange-600 ml-auto">
                      <span>View Schedule</span>
                      <ChevronRight size={16} />
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Billing Card */}
                <Card onClick={() => router.push('/billing')} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="rounded-full bg-cyan-500/10 p-2 h-10 w-10 flex items-center justify-center mb-2">
                    <CreditCard size={20} className="text-cyan-500" />
                  </div>
                  <CardTitle>Billing & Payments</CardTitle>
                  <CardDescription>Manage your billing information</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    View invoices, payment history, and manage payment methods.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="flex items-center gap-2 text-cyan-500 hover:text-cyan-600 ml-auto">
                    <span>View Billing</span>
                    <ChevronRight size={16} />
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Support Card */}
              <Card onClick={() => router.push('/support')} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="rounded-full bg-red-500/10 p-2 h-10 w-10 flex items-center justify-center mb-2">
                    <Shield size={20} className="text-red-500" />
                  </div>
                  <CardTitle>Support & Help</CardTitle>
                  <CardDescription>Get assistance when needed</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Contact our support team or browse FAQ resources.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="flex items-center gap-2 text-red-500 hover:text-red-600 ml-auto">
                    <span>Get Support</span>
                    <ChevronRight size={16} />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </section>
        </motion.div>
      </div>
      
      {/* Edit Profile Dialog */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your personal information and contact details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateProfile}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profileForm.email}
                  disabled
                  className="bg-muted/50"
                />
                <p className="text-xs text-red-600">
                  Email cannot be changed. Contact support for assistance.
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={profileForm.district}
                  onChange={(e) => setProfileForm({...profileForm, district: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setEditProfileOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updating}>
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
        <DialogContent className="sm:max-w-[500px] border-red-600">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Update your password to keep your account secure.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-1 text-sm">
                <p className="font-medium">Password requirements:</p>
                <ul className="list-disc pl-4 text-muted-foreground">
                  <li>At least 8 characters long</li>
                  <li>Include at least one uppercase letter</li>
                  <li>Include at least one number</li>
                  <li>Include at least one special character</li>
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setChangePasswordOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updating} className='bg-red-600'>
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
      
      {/* Notifications Dialog */}
      <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
            <DialogDescription>
              View and manage your notifications.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-between items-center py-2">
            <p className="text-sm">
              You have <span className="font-medium">{unreadCount}</span> unread notifications.
            </p>
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={markAllNotificationsAsRead}
              >
                Mark all as read
              </Button>
            )}
          </div>
          <div className="space-y-4 mt-2 max-h-[400px] overflow-y-auto pr-1">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 border rounded-lg ${notification.read ? 'bg-background' : 'bg-muted/30'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`rounded-full p-2 ${
                      notification.type === 'success' ? 'bg-green-500/10 text-green-500' :
                      notification.type === 'warning' ? 'bg-yellow-500/10 text-yellow-500' :
                      notification.type === 'error' ? 'bg-red-500/10 text-red-500' :
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                      {notification.type === 'success' ? <Check size={16} /> :
                      notification.type === 'warning' ? <AlertCircle size={16} /> :
                      notification.type === 'error' ? <X size={16} /> :
                      <Bell size={16} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-base">{notification.title}</h4>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 text-xs"
                          onClick={() => markNotificationAsRead(notification.id)}
                          disabled={notification.read}
                        >
                          {notification.read ? 'Read' : 'Mark as read'}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                <p className="text-muted-foreground">No notifications to display.</p>
              </div>
            )}
          </div>
          
          <DialogFooter className="mt-4">
            <Button onClick={() => setNotificationsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Customize your app preferences and notification settings.
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="appearance">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="appearance" className="space-y-4 py-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Theme</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={theme === 'light' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleThemeChange('light')}
                    className="flex items-center justify-center gap-2"
                  >
                    <Sun size={16} />
                    Light
                  </Button>
                  <Button 
                    variant={theme === 'dark' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleThemeChange('dark')}
                    className="flex items-center justify-center gap-2"
                  >
                    <Moon size={16} />
                    Dark
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Interface Density</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="justify-start"
                  >
                    Comfortable
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    className="justify-start"
                  >
                    Compact
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4 py-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive updates via email
                    </p>
                  </div>
                  <Switch 
                    checked={emailNotifications} 
                    onCheckedChange={setEmailNotifications} 
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">SMS Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive updates via text message
                    </p>
                  </div>
                  <Switch 
                    checked={smsNotifications} 
                    onCheckedChange={setSmsNotifications} 
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">App Notifications                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Receive in-app notifications
                    </p>
                  </div>
                  <Switch 
                    checked={appNotifications} 
                    onCheckedChange={setAppNotifications} 
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Notification Types</h4>
                  <p className="text-sm text-muted-foreground">
                    Select which types of notifications you want to receive
                  </p>
                  
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notif-account" defaultChecked />
                      <Label htmlFor="notif-account">Account updates</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notif-system" defaultChecked />
                      <Label htmlFor="notif-system">System performance</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notif-maintenance" defaultChecked />
                      <Label htmlFor="notif-maintenance">Maintenance alerts</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notif-billing" defaultChecked />
                      <Label htmlFor="notif-billing">Billing and payments</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notif-marketing" />
                      <Label htmlFor="notif-marketing">Marketing and promotions</Label>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSettings}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}