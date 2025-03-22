'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, formatDistanceToNow } from 'date-fns'
import { 
  Bell, 
  CheckCircle2,
  Trash2,
  FilterX,
  RefreshCcw,
  AlertTriangle,
  Info,
  Check,
  TrendingDown,
  ChevronDown,
  Search,
  CheckCheck,
  Filter,
  X
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Notification {
  _id: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isMultiDeleteDialogOpen, setIsMultiDeleteDialogOpen] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [notificationToDelete, setNotificationToDelete] = useState<string | null>(null)

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/notifications')
      if (!res.ok) throw new Error('Failed to fetch notifications')
      const data = await res.json()
      setNotifications(data)
    } catch (error) {
      console.error('Error fetching notifications:', error)

    } finally {
      setLoading(false)
    }
  }

  // Mark notification as read
  const markAsRead = async (ids: string[]) => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
      })
      
      if (!res.ok) throw new Error('Failed to update notifications')
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          ids.includes(notification._id) 
            ? { ...notification, read: true } 
            : notification
        )
      )


    } catch (error) {
      console.error('Error updating notifications:', error)

    }
  }

  // Delete notification
  const deleteNotification = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
      })
      
      if (!res.ok) throw new Error('Failed to delete notification')
      
      // Update local state
      setNotifications(prev => prev.filter(notification => notification._id !== id))
      setSelectedNotifications(prev => prev.filter(notifId => notifId !== id))
      

    } catch (error) {
      console.error('Error deleting notification:', error)

    } finally {
      setNotificationToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  // Delete multiple notifications
  const deleteMultipleNotifications = async () => {
    try {
      const res = await fetch('/api/notifications/bulk', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedNotifications }),
      })
      
      if (!res.ok) throw new Error('Failed to delete notifications')
      
      // Update local state
      setNotifications(prev => 
        prev.filter(notification => !selectedNotifications.includes(notification._id))
      )
      setSelectedNotifications([])
      setSelectAll(false)
      

    } catch (error) {
      console.error('Error deleting notifications:', error)

    } finally {
      setIsMultiDeleteDialogOpen(false)
    }
  }

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'error':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  }

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedNotifications([])
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n._id))
    }
    setSelectAll(!selectAll)
  }

  // Handle notification selection
  const handleSelect = (id: string) => {
    setSelectedNotifications(prev => {
      if (prev.includes(id)) {
        return prev.filter(notifId => notifId !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  // Filter notifications based on active tab and search term
  useEffect(() => {
    let filtered = [...notifications]
    
    // Filter by tab
    if (activeTab === 'unread') {
      filtered = filtered.filter(n => !n.read)
    } else if (activeTab === 'read') {
      filtered = filtered.filter(n => n.read)
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(term) || 
        n.description.toLowerCase().includes(term)
      )
    }
    
    // Sort notifications
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    } else if (sortBy === 'type') {
      filtered.sort((a, b) => a.type.localeCompare(b.type))
    }
    
    setFilteredNotifications(filtered)
    
    // Reset selection when filters change
    setSelectedNotifications([])
    setSelectAll(false)
  }, [notifications, activeTab, searchTerm, sortBy])

  // Reset select all when filtered notifications change
  useEffect(() => {
    if (selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0) {
      setSelectAll(true)
    } else {
      setSelectAll(false)
    }
  }, [selectedNotifications, filteredNotifications])

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications()
    
    // Poll for new notifications every minute
    const interval = setInterval(fetchNotifications, 60000)
    
    return () => clearInterval(interval)
  }, [])

  // Statistics
  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    read: notifications.filter(n => n.read).length,
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">        
        <main className="flex-1  px-4 md:px-6 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                <p className="text-muted-foreground mt-1">
                  Manage and track all system notifications
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchNotifications}
                  className="flex items-center gap-2"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Refresh
                </Button>
                
                {selectedNotifications.length > 0 && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => markAsRead(selectedNotifications)}
                    className="flex items-center gap-2"
                    disabled={selectedNotifications.every(id => 
                      notifications.find(n => n._id === id)?.read
                    )}
                  >
                    <CheckCheck className="h-4 w-4" />
                    Mark Selected as Read
                  </Button>
                )}
                
                {selectedNotifications.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setIsMultiDeleteDialogOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Selected
                  </Button>
                )}
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <motion.div 
                variants={item}
                initial="hidden"
                animate="show"
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
                    <Bell className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loading ? <Skeleton className="h-8 w-12" /> : stats.total}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div 
                variants={item}
                initial="hidden"
                animate="show"
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-card ">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Unread Notifications</CardTitle>
                    <Bell className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                  <div className="text-2xl font-bold">
                      {loading ? <Skeleton className="h-8 w-12" /> : stats.unread}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div 
                variants={item}
                initial="hidden"
                animate="show"
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-card">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium ">Read Notifications</CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loading ? <Skeleton className="h-8 w-12" /> : stats.read}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            {/* Filters Section */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
                {searchTerm && (
                  <button 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setSearchTerm('')}
                  >
                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>
              
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="Sort by" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Sort By</SelectLabel>
                      <SelectItem value="newest">Newest first</SelectItem>
                      <SelectItem value="oldest">Oldest first</SelectItem>
                      <SelectItem value="type">By type</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <FilterX className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem 
                        onClick={() => setActiveTab('all')}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <span>All notifications</span>
                        {activeTab === 'all' && <Check className="h-4 w-4" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setActiveTab('unread')}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <span>Unread only</span>
                        {activeTab === 'unread' && <Check className="h-4 w-4" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setActiveTab('read')}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <span>Read only</span>
                        {activeTab === 'read' && <Check className="h-4 w-4" />}
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Tab navigation */}
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-md">
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  All <Badge variant="outline">{stats.total}</Badge>
                </TabsTrigger>
                <TabsTrigger value="unread" className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Unread <Badge variant="outline">{stats.unread}</Badge>
                </TabsTrigger>
                <TabsTrigger value="read" className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Read <Badge variant="outline">{stats.read}</Badge>
                </TabsTrigger>
              </TabsList>
              
              {/* Notifications List */}
              <TabsContent value={activeTab} className="mt-6">
                <Card>
                  <CardHeader className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <CardTitle>
                        {activeTab === 'all' ? 'All Notifications' : 
                          activeTab === 'unread' ? 'Unread Notifications' : 'Read Notifications'}
                      </CardTitle>
                      
                      {filteredNotifications.length > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <Switch 
                              id="select-all" 
                              checked={selectAll} 
                              onCheckedChange={handleSelectAll} 
                            />
                            <Label htmlFor="select-all">Select All</Label>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <CardDescription>
                      {filteredNotifications.length === 0 && !loading
                        ? 'No notifications found'
                        : `Showing ${filteredNotifications.length} notifications`}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    {loading ? (
                      <div className="space-y-4 p-6">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex gap-4 items-start">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2 flex-1">
                              <Skeleton className="h-4 w-[250px]" />
                              <Skeleton className="h-3 w-full" />
                              <Skeleton className="h-3 w-[70%]" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : filteredNotifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <Bell className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                        <h3 className="text-lg font-medium">No notifications found</h3>
                        <p className="text-muted-foreground mt-1 max-w-md">
                          {searchTerm 
                            ? 'Try adjusting your search or filter criteria'
                            : activeTab === 'unread' 
                              ? 'You have no unread notifications'
                              : activeTab === 'read' 
                                ? 'You have no read notifications'
                                : 'You have no notifications yet'}
                        </p>
                      </div>
                    ) : (
                      <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="divide-y divide-border"
                      >
                        <AnimatePresence>
                          {filteredNotifications.map((notification) => (
                            <motion.div
                              key={notification._id}
                              variants={item}
                              exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                              className={`flex items-start gap-4 p-4 md:p-6 ${
                                notification.read ? 'bg-background dark:bg-background' : 'bg-background'
                              } hover:bg-muted/50 transition-colors`}
                            >
                              <div className="flex items-center h-full pt-1">
                                <Switch 
                                  checked={selectedNotifications.includes(notification._id)} 
                                  onCheckedChange={() => handleSelect(notification._id)}
                                  className="data-[state=checked]:bg-primary"
                                />
                              </div>
                              
                              <div className="min-w-[40px] flex items-center justify-center">
                                {getNotificationIcon(notification.type)}
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                                  <h3 className="font-medium text-sm md:text-base">{notification.title}</h3>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</span>
                                    <Badge 
                                      variant="outline" 
                                      className={`
                                        ${notification.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800' : ''}
                                        ${notification.type === 'warning' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800' : ''}
                                        ${notification.type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800' : ''}
                                        ${notification.type === 'info' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800' : ''}
                                      `}
                                    >
                                      {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                                    </Badge>
                                    {!notification.read && (
                                      <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>
                                    )}
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground">{notification.description}</p>
                                
                                <div className="flex justify-end gap-2 mt-4">
                                  {!notification.read && (
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => markAsRead([notification._id])}
                                      className="h-8"
                                    >
                                      <Check className="mr-2 h-3 w-3" />
                                      Mark as read
                                    </Button>
                                  )}
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      setNotificationToDelete(notification._id)
                                      setIsDeleteDialogOpen(true)
                                    }}
                                    className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                  >
                                    <Trash2 className="mr-2 h-3 w-3" />
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </CardContent>
                  
                  {filteredNotifications.length > 0 && (
                    <CardFooter className="flex justify-between p-6 border-t">
                      <div className="text-sm text-muted-foreground">
                        Showing {filteredNotifications.length} of {stats.total} notifications
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {activeTab === 'unread' && stats.unread > 0 && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => markAsRead(notifications.filter(n => !n.read).map(n => n._id))}
                          >
                            <CheckCheck className="mr-2 h-4 w-4" />
                            Mark all as read
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>
      </div>
      
      {/* Delete Single Notification Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This notification will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => notificationToDelete && deleteNotification(notificationToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete Multiple Notifications Dialog */}
      <AlertDialog
        open={isMultiDeleteDialogOpen}
        onOpenChange={setIsMultiDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete multiple notifications?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedNotifications.length} notifications? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={deleteMultipleNotifications}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete {selectedNotifications.length} notifications
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
