'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bell, LogOut } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { ThemeSwitch } from '../ThemeSwitch'
import { useAuth } from '@/lib/auth-context'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { AlertTriangle, Info, Check, TrendingDown } from 'lucide-react'
import { RainbowCard } from "../magicui/rainbow-button";

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
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const { adminSignOut } = useAuth()

  const handleLogout = async () => {
    try {
      await adminSignOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

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

  const markAsRead = async (ids: string[]) => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      
      if (!res.ok) throw new Error('Failed to update notifications');
      
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

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'error': return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'success': return <Check className="w-4 h-4 text-green-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed top-5 p-2 left-1/3 text-xl z-40"
      >
      </motion.div>

      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <RainbowCard className="bg-card backdrop-blur-lg border text-white border-border rounded-xl px-4 py-1 shadow-lg">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-lg font-bold text-primary hover:opacity-80 transition-opacity">
              AdminPortal
            </Link>

            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative p-2 rounded-full hover:bg-background/80 transition-colors">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 w-4 h-4 bg-red-600 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
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
                    <div className="py-4 text-center text-muted-foreground">Loading notifications...</div>
                  ) : notifications.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      <Bell className="w-10 h-10 mx-auto mb-2 opacity-20" />
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    <AnimatePresence>
                      {notifications.slice(0, 6).map((notification) => (
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
                            <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                            <div className="flex-1">
                              <div className="font-medium text-primary">{notification.title}</div>
                              <p className="text-muted-foreground text-xs mt-1">{notification.description}</p>
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

              <ThemeSwitch/>

              <button 
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onClick={handleLogout} 
                className="p-2 rounded-xl hover:bg-background/80 active:scale-95 transition-all flex items-center gap-2 text-red-600 hover:text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-destructive/20"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </RainbowCard>
      </header>
    </>
  );
}
