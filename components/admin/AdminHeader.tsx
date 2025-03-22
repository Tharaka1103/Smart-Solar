'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bell, Settings, LogOut, Menu, X, Search, AlertTriangle, Info, Check, TrendingDown } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { ThemeSwitch } from '../ThemeSwitch'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { format, formatDistanceToNow } from 'date-fns'

interface Notification {
  _id: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export function AdminHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      console.log("Attempting to sign out...");
      await signOut();
      console.log("Sign out successful");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/notifications');
      if (!res.ok) throw new Error('Failed to fetch notifications');
      const data = await res.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark notifications as read
  const markAsRead = async (ids: string[]) => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
      });
      
      if (!res.ok) throw new Error('Failed to update notifications');
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          ids.includes(notification._id) 
            ? { ...notification, read: true } 
            : notification
        )
      );
    } catch (error) {
      console.error('Error updating notifications:', error);
    }
  };

  // Get unread notification count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'error':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'success':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  // Fetch notifications when component mounts
  useEffect(() => {
    fetchNotifications();
    
    // Set up polling for new notifications (every 30 seconds)
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 border-b border-border backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2">
            <Link href="/admin" className="text-xl font-bold transition-colors hover:text-primary">
              <span className="text-primary">LUMINEX</span>
              <span className="hidden sm:inline"> Admin</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-full bg-background border border-primary w-64 focus:outline-none focus:ring-2 focus:ring-primary focus:w-96 transition-all duration-300"
              />
            </div>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative p-2 rounded-full hover:bg-background/80 transition-colors">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 bg-card border border-border p-4 rounded-xl mt-2 shadow-lg max-h-[70vh] overflow-auto">
                <DropdownMenuLabel className="flex justify-between items-center">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={() => markAsRead(notifications.filter(n => !n.read).map(n => n._id))}
                      className="text-xs text-primary hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {loading ? (
                  <div className="py-4 text-center text-muted-foreground">
                    Loading notifications...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <Bell className="w-10 h-10 mx-auto mb-2 opacity-20" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification._id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`my-2 p-3 rounded-lg text-sm ${
                          notification.read 
                            ? 'bg-background/50' 
                            : 'bg-background border-l-4 border-primary'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{notification.title}</div>
                            <p className="text-muted-foreground text-xs mt-1">
                              {notification.description}
                            </p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                              </span>
                              {!notification.read && (
                                <button 
                                  onClick={() => markAsRead([notification._id])}
                                  className="text-xs text-primary hover:underline"
                                >
                                  Mark as read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
                
                <DropdownMenuSeparator className="mt-2" />
                <DropdownMenuItem className="cursor-pointer hover:bg-background/80 rounded-lg transition-colors mt-2 justify-center">
                  <Link href="/admin/notifications" className="w-full text-center text-primary text-sm">
                    View all notifications
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-full hover:bg-background/80 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-card border border-border p-4 rounded-xl mt-2 shadow-lg">
                <DropdownMenuLabel>Admin Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer hover:bg-background/80 rounded-lg transition-colors">Profile</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-background/80 rounded-lg transition-colors">Preferences</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-background/80 rounded-lg transition-colors">Security</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Switch */}
            <ThemeSwitch />

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                <span className="text-primary font-semibold">AS</span>
              </div>
              <button onClick={handleLogout} className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-all hover:scale-105 flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button className="relative p-2 hover:bg-background/80 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
            <ThemeSwitch />
            <button 
              className="p-2 hover:bg-background/80 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 animate-slideDown">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-background/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between bg-background/50 p-3 rounded-xl">
                <div className="flex items-center gap-4">
                  <button className="relative p-2 hover:bg-background/80 rounded-lg transition-colors">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <button className="p-2 hover:bg-background/80 rounded-lg transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">AS</span>
                  </div>
                  <button onClick={handleLogout} className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-all hover:scale-105 flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
              
              {/* Mobile notifications */}
              <div className="space-y-2 mt-2">
                <h3 className="font-medium px-2">Recent Notifications</h3>
                {notifications.length === 0 ? (
                  <div className="py-4 text-center text-muted-foreground bg-background/50 rounded-lg">
                    No notifications yet
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notifications.slice(0, 3).map((notification) => (
                      <div
                        key={notification._id}
                        className={`p-3 rounded-lg text-sm ${
                          notification.read 
                            ? 'bg-background/50' 
                            : 'bg-background border-l-4 border-primary'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{notification.title}</div>
                            <p className="text-muted-foreground text-xs mt-1">
                              {notification.description}
                            </p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Link href="/admin/notifications" className="block text-center text-primary text-sm py-2 bg-background/50 rounded-lg">
                      View all notifications
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

