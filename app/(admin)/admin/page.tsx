'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Package,
  BarChart3,
  SunMedium,
  ShoppingCart,
  Calendar,
  FileText,
  TrendingUp,
  Calculator,
  CircleDollarSign,
  Building2,
  Wrench,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Moon,
  Sun,
  UserCog,
  Settings,
  LogOut,
  CheckCircle2,
  Clock,
  AlertTriangle,
  PanelRight,
  Banknote,
  Sparkles,
  Wallet,
  User,
  Activity,
  PieChart,
  LayoutDashboard,
  PlusSquare,
  Search,
  RefreshCw,
  CloudCog,
  Gauge,
  PanelTop
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DashboardStats {
  totalCustomers: number
  totalProjects: number
  totalMaintenanceTasks: number
  totalIncome: number
  totalExpenses: number
  balance: number
  recentMaintenance: MaintenanceTask[]
  recentProjects: Project[]
  monthlyFinances: MonthlyFinance[]
  customerGrowth: number
  projectGrowth: number
  maintenanceGrowth: number
  incomeGrowth: number
  projectsStatus: {
    pending: number
    inProgress: number
    completed: number
    cancelled: number
  }
}

interface MaintenanceTask {
  _id: string
  projectId: string
  systemId: string
  clientName: string
  maintenanceDate: string
  maintenanceTime: string
  type: string
  priority: string
  status: string
}

interface Project {
  _id: string
  projectId: string
  title: string
  client: string
  status: string
  budget: number
  startDate: string
  completionDate?: string
}

interface MonthlyFinance {
  month: number
  income: number
  expense: number
  balance: number
}

export default function AdminDashboard() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'analytics'>('grid')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Fetch all required data for the dashboard
  const fetchDashboardData = async () => {
    try {
      setIsRefreshing(true)
      
      // Fetch customers
      const customersRes = await fetch('/api/customers')
      const customersData = await customersRes.json()
      
      // Fetch projects
      const projectsRes = await fetch('/api/projects')
      const projectsData = await projectsRes.json()
      
      // Fetch maintenance tasks
      const maintenanceRes = await fetch('/api/maintenance')
      const maintenanceData = await maintenanceRes.json()
      
      // Fetch finance summary
      const financeRes = await fetch('/api/finance/summary')
      const financeData = await financeRes.json()
      
      // Process project status counts
      const projectStatusCounts = {
        pending: projectsData.filter((p: any) => p.status === 'pending').length,
        inProgress: projectsData.filter((p: any) => p.status === 'in-progress').length,
        completed: projectsData.filter((p: any) => p.status === 'completed').length,
        cancelled: projectsData.filter((p: any) => p.status === 'cancelled').length
      }

      // Calculate growth rates (could be replaced with actual historical data)
      const customerGrowth = calculateGrowthRate(customersData.length)
      const projectGrowth = calculateGrowthRate(projectsData.length)
      const maintenanceGrowth = calculateGrowthRate(maintenanceData.length)
      const incomeGrowth = calculateGrowthRate(financeData.totalIncome)
      
      setDashboardStats({
        totalCustomers: customersData.total || customersData.length || 0,
        totalProjects: projectsData.length || 0,
        totalMaintenanceTasks: maintenanceData.length || 0,
        totalIncome: financeData.totalIncome || 0,
        totalExpenses: financeData.totalExpenses || 0,
        balance: financeData.balance || 0,
        recentMaintenance: maintenanceData.slice(0, 5) || [],
        recentProjects: projectsData.slice(0, 5) || [],
        monthlyFinances: financeData.monthlyData || [],
        customerGrowth,
        projectGrowth,
        maintenanceGrowth,
        incomeGrowth,
        projectsStatus: projectStatusCounts
      })
      
      setLoading(false)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsRefreshing(false)
    }
  }
  
  // Simple function to calculate a growth rate (for demo - replace with actual historical data)
  const calculateGrowthRate = (value: number): number => {
    // This is a placeholder function that generates a random growth rate
    // In a real application, you would compare with historical data
    return Math.round((Math.random() * 30) - 5)
  }
  
  useEffect(() => {
    fetchDashboardData()
    
    // Update current time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    
    return () => clearInterval(timeInterval)
  }, [])
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0
    }).format(amount)
  }
  
  // Get current date string
  const getCurrentDateString = () => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  useEffect
  // Get current time string
  const getCurrentTimeString = () => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }  
  // Get color for status badges
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'complete':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'in-progress':
      case 'in progress':
      case 'pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'cancelled':
      case 'canceled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'high':
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  // Admin features list for grid view
  const adminFeatures = [
    {
      title: "Projects",
      description: "Manage all your solar installation projects",
      icon: <Package className="h-5 w-5" />,
      link: "/admin/projects",
      stats: dashboardStats?.totalProjects || 0,
      statLabel: "Active Projects",
      color: "from-blue-600 to-indigo-600",
      growth: dashboardStats?.projectGrowth || 0
    },
    {
      title: "Customers",
      description: "Manage your customer database",
      icon: <Users className="h-5 w-5" />,
      link: "/admin/customers",
      stats: dashboardStats?.totalCustomers || 0,
      statLabel: "Registered Customers",
      color: "from-emerald-600 to-teal-600",
      growth: dashboardStats?.customerGrowth || 0
    },
    {
      title: "Finance",
      description: "Track income, expenses and budgets",
      icon: <CircleDollarSign className="h-5 w-5" />,
      link: "/admin/finance",
      stats: formatCurrency(dashboardStats?.totalIncome || 0),
      statLabel: "Total Revenue",
      color: "from-violet-600 to-purple-600",
      growth: dashboardStats?.incomeGrowth || 0
    },
    {
      title: "Maintenance",
      description: "Schedule and manage maintenance tasks",
      icon: <Wrench className="h-5 w-5" />,
      link: "/admin/maintenance",
      stats: dashboardStats?.totalMaintenanceTasks || 0,
      statLabel: "Scheduled Tasks",
      color: "from-amber-600 to-orange-600",
      growth: dashboardStats?.maintenanceGrowth || 0
    },
    {
      title: "Quotes",
      description: "Create and manage customer quotes",
      icon: <Calculator className="h-5 w-5" />,
      link: "/admin/quotes",
      color: "from-pink-600 to-rose-600"
    },
    {
      title: "Support",
      description: "Handle customer inquiries and issues",
      icon: <FileText className="h-5 w-5" />,
      link: "/admin/support",
      color: "from-sky-600 to-cyan-600"
    },
    {
      title: "Employees",
      description: "Manage your team and assignments",
      icon: <UserCog className="h-5 w-5" />,
      link: "/admin/employee",
      color: "from-lime-600 to-green-600"
    },
    {
      title: "Notifications",
      description: "View and manage system notifications",
      icon: <Bell className="h-5 w-5" />,
      link: "/admin/notifications",
      color: "from-red-600 to-rose-600"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 lg:p-6 space-y-8">
        {/* Header section with date, time, welcome and quick actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <motion.h1 
              className="text-3xl font-bold text-primary flex items-center gap-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <LayoutDashboard className="h-8 w-8" />
              <span>Admin Dashboard</span>
            </motion.h1>
            <motion.div 
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{getCurrentDateString()}</span>
                <span className="mx-2">•</span>
                <Clock className="h-4 w-4" />
                <span>{getCurrentTimeString()}</span>
              </div>
            </motion.div>
          </div>
          
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => fetchDashboardData()}
                    disabled={isRefreshing}
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span className="sr-only">Refresh data</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p suppressHydrationWarning>Refresh dashboard data</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setViewMode(viewMode === 'grid' ? 'analytics' : 'grid')}
                  >
                    {viewMode === 'grid' ? 
                      <PieChart className="h-4 w-4" /> : 
                      <PanelTop className="h-4 w-4" />
                    }
                    <span className="sr-only">Toggle view mode</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p suppressHydrationWarning>{viewMode === 'grid' ? 'Switch to analytics view' : 'Switch to grid view'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <div className="hidden md:flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 hover:bg-primary/10 transition-colors"
                  >
                    <span className="hidden sm:inline-block">Quick Actions</span>
                    <PlusSquare className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Create New</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/admin/projects" className="flex items-center gap-2 w-full">
                      <Package className="h-4 w-4" />
                      <span>New Project</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/admin/customers" className="flex items-center gap-2 w-full">
                      <Users className="h-4 w-4" />
                      <span>Add Customer</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/admin/maintenance" className="flex items-center gap-2 w-full">
                      <Wrench className="h-4 w-4" />
                      <span>Schedule Maintenance</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/admin/finance" className="flex items-center gap-2 w-full">
                      <Banknote className="h-4 w-4" />
                      <span>Record Transaction</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Main dashboard content */}
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            /* Grid View Mode */
            <motion.div
              key="grid-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Top stats row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                {/* Total Customers Card */}
                <Card className="overflow-hidden border-l-4 border-l-emerald-500 hover:shadow-md transition-all duration-200">
                  <CardHeader className="pb-2 pt-4">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3">
                    {loading ? (
                      <Skeleton className="h-7 w-20" />
                    ) : (
                      <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold">{dashboardStats?.totalCustomers || 0}</div>
                        <div className="flex items-center gap-1 text-sm font-medium">
                          {(dashboardStats?.customerGrowth || 0) >= 0 ? (
                            <span className="text-emerald-600 dark:text-emerald-400 flex items-center">
                              <ArrowUpRight className="h-4 w-4" />
                              {dashboardStats?.customerGrowth || 0}%
                            </span>
                          ) : (
                            <span className="text-red-600 dark:text-red-400 flex items-center">
                              <ArrowDownRight className="h-4 w-4" />
                              {Math.abs(dashboardStats?.customerGrowth || 0)}%
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0 pb-3">
                    <Link 
                      href="/admin/customers" 
                      className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                    >
                      View Customers
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </CardFooter>
                </Card>

                {/* Total Projects Card */}
                <Card className="overflow-hidden border-l-4 border-l-blue-500 hover:shadow-md transition-all duration-200">
                  <CardHeader className="pb-2 pt-4">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3">
                    {loading ? (
                      <Skeleton className="h-7 w-20" />
                    ) : (
                      <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold">{dashboardStats?.totalProjects || 0}</div>
                        <div className="flex items-center gap-1 text-sm font-medium">
                          {(dashboardStats?.projectGrowth || 0) >= 0 ? (
                            <span className="text-emerald-600 dark:text-emerald-400 flex items-center">
                              <ArrowUpRight className="h-4 w-4" />
                              {dashboardStats?.projectGrowth || 0}%
                            </span>
                          ) : (
                            <span className="text-red-600 dark:text-red-400 flex items-center">
                              <ArrowDownRight className="h-4 w-4" />
                              {Math.abs(dashboardStats?.projectGrowth || 0)}%
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0 pb-3">
                    <Link 
                      href="/admin/projects" 
                      className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                    >
                      View Projects
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </CardFooter>
                </Card>

                {/* Total Income Card */}
                <Card className="overflow-hidden border-l-4 border-l-violet-500 hover:shadow-md transition-all duration-200">
                  <CardHeader className="pb-2 pt-4">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3">
                    {loading ? (
                      <Skeleton className="h-7 w-24" />
                    ) : (
                      <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold">{formatCurrency(dashboardStats?.totalIncome || 0)}</div>
                        <div className="flex items-center gap-1 text-sm font-medium">
                          {(dashboardStats?.incomeGrowth || 0) >= 0 ? (
                            <span className="text-emerald-600 dark:text-emerald-400 flex items-center">
                              <ArrowUpRight className="h-4 w-4" />
                              {dashboardStats?.incomeGrowth || 0}%
                            </span>
                          ) : (
                            <span className="text-red-600 dark:text-red-400 flex items-center">
                              <ArrowDownRight className="h-4 w-4" />
                              {Math.abs(dashboardStats?.incomeGrowth || 0)}%
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0 pb-3">
                    <Link 
                      href="/admin/finance" 
                      className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                    >
                      View Finances
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </CardFooter>
                </Card>

                {/* Total Maintenance Card */}
                <Card className="overflow-hidden border-l-4 border-l-amber-500 hover:shadow-md transition-all duration-200">
                  <CardHeader className="pb-2 pt-4">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Maintenance Tasks</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3">
                    {loading ? (
                      <Skeleton className="h-7 w-20" />
                    ) : (
                      <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold">{dashboardStats?.totalMaintenanceTasks || 0}</div>
                        <div className="flex items-center gap-1 text-sm font-medium">
                          {(dashboardStats?.maintenanceGrowth || 0) >= 0 ? (
                            <span className="text-emerald-600 dark:text-emerald-400 flex items-center">
                              <ArrowUpRight className="h-4 w-4" />
                              {dashboardStats?.maintenanceGrowth || 0}%
                            </span>
                          ) : (
                            <span className="text-red-600 dark:text-red-400 flex items-center">
                              <ArrowDownRight className="h-4 w-4" />
                              {Math.abs(dashboardStats?.maintenanceGrowth || 0)}%
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0 pb-3">
                    <Link 
                      href="/admin/maintenance" 
                      className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                    >
                      View Maintenance
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </CardFooter>
                </Card>
              </div>

              {/* Middle section with project status and finance data */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
                {/* Projects Status Card */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Package className="h-5 w-5 text-blue-500" />
                      Projects Status
                    </CardTitle>
                    <CardDescription>Current status of all projects</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-1">
                    {loading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Pending</span>
                            <span className="font-medium">{dashboardStats?.projectsStatus.pending || 0}</span>
                          </div>
                          <Progress 
                            value={
                              dashboardStats?.totalProjects 
                                ? (dashboardStats.projectsStatus.pending / dashboardStats.totalProjects) * 100 
                                : 0
                            } 
                            className="h-2 bg-blue-100" 
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">In Progress</span>
                            <span className="font-medium">{dashboardStats?.projectsStatus.inProgress || 0}</span>
                          </div>
                          <Progress 
                            value={
                              dashboardStats?.totalProjects 
                                ? (dashboardStats.projectsStatus.inProgress / dashboardStats.totalProjects) * 100 
                                : 0
                            } 
                            className="h-2 bg-amber-100" 
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Completed</span>
                            <span className="font-medium">{dashboardStats?.projectsStatus.completed || 0}</span>
                          </div>
                          <Progress 
                            value={
                              dashboardStats?.totalProjects 
                                ? (dashboardStats.projectsStatus.completed / dashboardStats.totalProjects) * 100 
                                : 0
                            } 
                            className="h-2 bg-green-100" 
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Cancelled</span>
                            <span className="font-medium">{dashboardStats?.projectsStatus.cancelled || 0}</span>
                          </div>
                          <Progress 
                            value={
                              dashboardStats?.totalProjects 
                                ? (dashboardStats.projectsStatus.cancelled / dashboardStats.totalProjects) * 100 
                                : 0
                            } 
                            className="h-2 bg-red-100" 
                          />
                        </div>
                        </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href="/admin/projects">
                        View All Projects
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                {/* Finance Summary Card */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CircleDollarSign className="h-5 w-5 text-violet-500" />
                      Finance Summary
                    </CardTitle>
                    <CardDescription>Revenue, expenses and balance</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-1">
                    {loading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                    ) : (
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="bg-background rounded-lg p-4">
                            <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                              <TrendingUp className="h-3.5 w-3.5 text-violet-500" />
                              Total Income
                            </div>
                            <div className="text-xl font-bold text-violet-600 dark:text-violet-400">
                              {formatCurrency(dashboardStats?.totalIncome || 0)}
                            </div>
                          </div>
                          <div className="bg-background rounded-lg p-4">
                            <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                              <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
                              Total Expenses
                            </div>
                            <div className="text-xl font-bold text-red-600 dark:text-red-400">
                              {formatCurrency(dashboardStats?.totalExpenses || 0)}
                            </div>
                          </div>
                          <div className="bg-background rounded-lg p-4">
                            <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                              <Wallet className="h-3.5 w-3.5 text-blue-500" />
                              Current Balance
                            </div>
                            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                              {formatCurrency(dashboardStats?.balance || 0)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <div className="text-sm font-medium mb-2">Monthly Revenue vs Expenses</div>
                          <div className="h-[120px] flex items-end gap-1">
                            {dashboardStats?.monthlyFinances.map((monthData, index) => (
                              <div key={index} className="flex-1 flex flex-col items-center gap-1">
                                <div className="w-full flex flex-col items-center">
                                  <div 
                                    className="w-full bg-violet-500/20 rounded-t"
                                    style={{ 
                                      height: `${monthData.income > 0 ? (monthData.income / Math.max(...dashboardStats.monthlyFinances.map(m => m.income))) * 80 : 0}px` 
                                    }}
                                  ></div>
                                  <div 
                                    className="w-full bg-red-500/20 rounded-t mt-0.5"
                                    style={{ 
                                      height: `${monthData.expense > 0 ? (monthData.expense / Math.max(...dashboardStats.monthlyFinances.map(m => m.expense))) * 80 : 0}px` 
                                    }}
                                  ></div>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(2023, monthData.month - 1).toLocaleString('default', { month: 'short' })}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href="/admin/finance">
                        View Detailed Finance
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              {/* Admin Features Grid */}
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-5">Management Tools</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {adminFeatures.map((feature, index) => (
                    <Link href={feature.link} key={index}>
                      <Card className="h-full overflow-hidden hover:shadow-md hover:border-primary/50 transition-all duration-300">
                        <div className={`h-1.5 w-full bg-gradient-to-r ${feature.color}`}></div>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <div className={`flex items-center justify-center p-1.5 rounded-md bg-gradient-to-br ${feature.color} text-white`}>
                              {feature.icon}
                            </div>
                            {feature.title}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {feature.description}
                          </CardDescription>
                        </CardHeader>
                        {feature.stats && (
                          <CardContent className="pb-3 pt-0">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="text-xl font-semibold">{feature.stats}</div>
                                <div className="text-xs text-muted-foreground">{feature.statLabel}</div>
                              </div>
                              {feature.growth !== undefined && (
                                <div>
                                  <Badge 
                                    variant="outline" 
                                    className={feature.growth >= 0 ? 'text-green-600 bg-green-50 dark:bg-green-950/30' : 'text-red-600 bg-red-50 dark:bg-red-950/30'}
                                  >
                                    {feature.growth >= 0 ? (
                                      <ArrowUpRight className="h-3 w-3 mr-1" />
                                    ) : (
                                      <ArrowDownRight className="h-3 w-3 mr-1" />
                                    )}
                                    {Math.abs(feature.growth)}%
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        )}
                        <CardFooter className="pt-0">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full justify-between hover:bg-transparent hover:text-primary"
                          >
                            <span>Access</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
                </div>
                </div>
            </motion.div>
          ) : (
            /* Analytics View Mode */
            <motion.div
              key="analytics-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Financial Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      Financial Performance
                    </CardTitle>
                    <CardDescription>Overview of your company's financial health</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-[300px] w-full" />
                    ) : (
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-card border rounded-lg p-4 space-y-2">
                            <div className="text-sm text-muted-foreground">Revenue</div>
                            <div className="text-2xl font-bold text-primary">
                              {formatCurrency(dashboardStats?.totalIncome || 0)}
                            </div>
                            <div className="flex items-center text-xs">
                              {(dashboardStats?.incomeGrowth || 0) >= 0 ? (
                                <span className="text-emerald-600 dark:text-emerald-400 flex items-center">
                                  <ArrowUpRight className="h-3 w-3 mr-1" />
                                  Up {dashboardStats?.incomeGrowth || 0}% from last period
                                </span>
                              ) : (
                                <span className="text-red-600 dark:text-red-400 flex items-center">
                                  <ArrowDownRight className="h-3 w-3 mr-1" />
                                  Down {Math.abs(dashboardStats?.incomeGrowth || 0)}% from last period
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="bg-card border rounded-lg p-4 space-y-2">
                            <div className="text-sm text-muted-foreground">Expenses</div>
                            <div className="text-2xl font-bold text-destructive">
                              {formatCurrency(dashboardStats?.totalExpenses || 0)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {((dashboardStats?.totalExpenses || 0) / (dashboardStats?.totalIncome || 1) * 100).toFixed(1)}% of total revenue
                            </div>
                          </div>
                          <div className="bg-card border rounded-lg p-4 space-y-2">
                            <div className="text-sm text-muted-foreground">Net Balance</div>
                            <div className={`text-2xl font-bold ${(dashboardStats?.balance || 0) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                              {formatCurrency(dashboardStats?.balance || 0)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Profit margin: {((dashboardStats?.balance || 0) / (dashboardStats?.totalIncome || 1) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium">Monthly Financial Trends</h3>
                            <Badge variant="outline">Current Year</Badge>
                          </div>
                          <div className="h-[200px] mt-4">
                            <div className="h-full flex items-end space-x-2">
                              {dashboardStats?.monthlyFinances.map((month, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center">
                                  <div className="w-full space-y-1">
                                    <div 
                                      className="w-full bg-emerald-500/60 rounded-t"
                                      style={{ 
                                        height: `${month.income > 0 ? (month.income / Math.max(...(dashboardStats?.monthlyFinances || []).map(m => Math.max(m.income, m.expense)))) * 150 : 0}px` 
                                      }}
                                    ></div>
                                    <div 
                                      className="w-full bg-red-500/60 rounded-t"
                                      style={{ 
                                        height: `${month.expense > 0 ? (month.expense / Math.max(...(dashboardStats?.monthlyFinances || []).map(m => Math.max(m.income, m.expense)))) * 150 : 0}px` 
                                      }}
                                    ></div>
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-2">
                                    {new Date(2023, month.month - 1).toLocaleString('default', { month: 'short' })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-center mt-4 gap-6">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-emerald-500/60"></div>
                              <span className="text-xs">Income</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
                              <span className="text-xs">Expenses</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Projects and Customers Analytics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Package className="h-5 w-5 text-blue-500" />
                      Projects Analytics
                    </CardTitle>
                    <CardDescription>Project distribution by status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-[200px] w-full" />
                    ) : (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between text-sm font-medium">
                          <div className="space-y-1">
                            <div>Total Projects</div>
                            <div className="text-2xl font-bold">{dashboardStats?.totalProjects || 0}</div>
                          </div>
                          <div>
                            {(dashboardStats?.projectGrowth || 0) >= 0 ? (
                              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                <ArrowUpRight className="h-4 w-4" />
                                <span>{dashboardStats?.projectGrowth || 0}%</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                                <ArrowDownRight className="h-4 w-4" />
                                <span>{Math.abs(dashboardStats?.projectGrowth || 0)}%</span>
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground">vs last period</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-background rounded-lg px-4 py-3 flex flex-col">
                            <span className="text-xs text-muted-foreground">Pending</span>
                            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                              {dashboardStats?.projectsStatus.pending || 0}
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">
                              {dashboardStats?.totalProjects ? 
                                ((dashboardStats.projectsStatus.pending / dashboardStats.totalProjects) * 100).toFixed(1) : 
                                '0'}%
                            </span>
                          </div>
                          <div className="bg-background rounded-lg px-4 py-3 flex flex-col">
                            <span className="text-xs text-muted-foreground">In Progress</span>
                            <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                              {dashboardStats?.projectsStatus.inProgress || 0}
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">
                              {dashboardStats?.totalProjects ? 
                                ((dashboardStats.projectsStatus.inProgress / dashboardStats.totalProjects) * 100).toFixed(1) : 
                                '0'}%
                            </span>
                          </div>
                          <div className="bg-background rounded-lg px-4 py-3 flex flex-col">
                            <span className="text-xs text-muted-foreground">Completed</span>
                            <span className="text-lg font-bold text-green-600 dark:text-green-400">
                              {dashboardStats?.projectsStatus.completed || 0}
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">
                              {dashboardStats?.totalProjects ? 
                                ((dashboardStats.projectsStatus.completed / dashboardStats.totalProjects) * 100).toFixed(1) : 
                                '0'}%
                            </span>
                          </div>
                          <div className="bg-background rounded-lg px-4 py-3 flex flex-col">
                            <span className="text-xs text-muted-foreground">Cancelled</span>
                            <span className="text-lg font-bold text-red-600 dark:text-red-400">
                              {dashboardStats?.projectsStatus.cancelled || 0}
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">
                              {dashboardStats?.totalProjects ? 
                                ((dashboardStats.projectsStatus.cancelled / dashboardStats.totalProjects) * 100).toFixed(1) : 
                                '0'}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5 text-emerald-500" />
                      Customers Analytics
                    </CardTitle>
                    <CardDescription>Customer base and growth metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-[200px] w-full" />
                    ) : (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between text-sm font-medium">
                          <div className="space-y-1">
                            <div>Total Customers</div>
                            <div className="text-2xl font-bold">{dashboardStats?.totalCustomers || 0}</div>
                          </div>
                          <div>
                            {(dashboardStats?.customerGrowth || 0) >= 0 ? (
                              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                <ArrowUpRight className="h-4 w-4" />
                                <span>{dashboardStats?.customerGrowth || 0}%</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                                <ArrowDownRight className="h-4 w-4" />
                                <span>{Math.abs(dashboardStats?.customerGrowth || 0)}%</span>
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground">vs last period</div>
                          </div>
                        </div>

                        <div className="rounded-lg border p-4">
                          <div className="text-sm font-medium mb-4">Customer Satisfaction</div>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Very Satisfied</span>
                                <span>65%</span>
                              </div>
                              <Progress value={65} className="h-2 bg-emerald-100" />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Satisfied</span>
                                <span>25%</span>
                              </div>
                              <Progress value={25} className="h-2 bg-blue-100" />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Neutral</span>
                                <span>7%</span>
                              </div>
                              <Progress value={7} className="h-2 bg-yellow-100" />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Unsatisfied</span>
                                <span>3%</span>
                              </div>
                              <Progress value={3} className="h-2 bg-red-100" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Maintenance and Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-amber-500" />
                      Maintenance Analytics
                    </CardTitle>
                    <CardDescription>Overview of maintenance activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-[200px] w-full" />
                    ) : (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between text-sm font-medium">
                          <div className="space-y-1">
                            <div>Total Maintenance Tasks</div>
                            <div className="text-2xl font-bold">{dashboardStats?.totalMaintenanceTasks || 0}</div>
                          </div>
                          <div>
                            {(dashboardStats?.maintenanceGrowth || 0) >= 0 ? (
                              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                <ArrowUpRight className="h-4 w-4" />
                                <span>{dashboardStats?.maintenanceGrowth || 0}%</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                                <ArrowDownRight className="h-4 w-4" />
                                <span>{Math.abs(dashboardStats?.maintenanceGrowth || 0)}%</span>
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground">vs last period</div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-3">
                            <div className="bg-background rounded-lg p-3 text-center">
                              <div className="text-xs text-muted-foreground mb-1">Pending</div>
                              <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                                {dashboardStats?.recentMaintenance?.filter(m => m.status === 'pending').length || 0}
                              </div>
                            </div>
                            <div className="bg-background rounded-lg p-3 text-center">
                              <div className="text-xs text-muted-foreground mb-1">Completed</div>
                              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                                {dashboardStats?.recentMaintenance?.filter(m => m.status === 'completed').length || 0}
                              </div>
                            </div>
                            <div className="bg-background rounded-lg p-3 text-center">
                              <div className="text-xs text-muted-foreground mb-1">Cancelled</div>
                              <div className="text-lg font-bold text-red-600 dark:text-red-400">
                                {dashboardStats?.recentMaintenance?.filter(m => m.status === 'cancelled').length || 0}
                              </div>
                            </div>
                          </div>

                          <div className="rounded-lg border p-4">
                            <div className="text-sm font-medium mb-3">Maintenance by Type</div>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                  <span className="text-xs">Routine</span>
                                </div>
                                <span className="text-xs font-medium">
                                  {dashboardStats?.recentMaintenance?.filter(m => m.type === 'routine').length || 0}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                  <span className="text-xs">Repair</span>
                                </div>
                                <span className="text-xs font-medium">
                                  {dashboardStats?.recentMaintenance?.filter(m => m.type === 'repair').length || 0}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                  <span className="text-xs">Cleaning</span>
                                </div>
                                <span className="text-xs font-medium">
                                  {dashboardStats?.recentMaintenance?.filter(m => m.type === 'cleaning').length || 0}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                  <span className="text-xs">Inspection</span>
                                </div>
                                <span className="text-xs font-medium">
                                  {dashboardStats?.recentMaintenance?.filter(m => m.type === 'inspection').length || 0}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                  <span className="text-xs">Emergency</span>
                                </div>
                                <span className="text-xs font-medium">
                                  {dashboardStats?.recentMaintenance?.filter(m => m.type === 'emergency').length || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Gauge className="h-5 w-5 text-cyan-500" />
                      Performance Metrics
                    </CardTitle>
                    <CardDescription>Key performance indicators for your solar business</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-[200px] w-full" />
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="text-xs text-muted-foreground">Average Project Completion</div>
                            <div className="flex items-center gap-2">
                              <Progress value={78} className="h-2 flex-1" />
                              <span className="text-sm font-medium">78%</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-xs text-muted-foreground">Project Success Rate</div>
                            <div className="flex items-center gap-2">
                              <Progress value={92} className="h-2 flex-1" />
                              <span className="text-sm font-medium">92%</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-xs text-muted-foreground">Customer Retention</div>
                            <div className="flex items-center gap-2">
                              <Progress value={85} className="h-2 flex-1" />
                              <span className="text-sm font-medium">85%</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-xs text-muted-foreground">Revenue Growth</div>
                            <div className="flex items-center gap-2">
                              <Progress value={67} className="h-2 flex-1" />
                              <span className="text-sm font-medium">67%</span>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-lg border p-4">
                          <div className="text-sm font-medium mb-3">System Performance</div>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <SunMedium className="h-4 w-4 text-amber-500" />
                                <span className="text-xs">Energy Production</span>
                              </div>
                              <Badge className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                98.3%
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <CloudCog className="h-4 w-4 text-blue-500" />
                                <span className="text-xs">System Efficiency</span>
                              </div>
                              <Badge className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                94.7%
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-purple-500" />
                                <span className="text-xs">Panel Performance</span>
                              </div>
                              <Badge className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                                96.2%
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-green-500" />
                                <span className="text-xs">Return on Investment</span>
                              </div>
                              <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                16.5%
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <Button variant="outline" className="flex flex-col items-center h-auto py-4 gap-2" asChild>
                    <Link href="/admin/projects">
                      <Package className="h-5 w-5 text-blue-500" />
                      <span className="text-xs">New Project</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center h-auto py-4 gap-2" asChild>
                    <Link href="/admin/customers">
                      <User className="h-5 w-5 text-emerald-500" />
                      <span className="text-xs">Add Customer</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center h-auto py-4 gap-2" asChild>
                    <Link href="/admin/finance">
                      <Banknote className="h-5 w-5 text-violet-500" />
                      <span className="text-xs">Record Finance</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center h-auto py-4 gap-2" asChild>
                    <Link href="/admin/maintenance">
                      <Wrench className="h-5 w-5 text-amber-500" />
                      <span className="text-xs">Schedule Maintenance</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center h-auto py-4 gap-2" asChild>
                    <Link href="/admin/quotes">
                      <Calculator className="h-5 w-5 text-pink-500" />
                      <span className="text-xs">Create Quote</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center h-auto py-4 gap-2" asChild>
                    <Link href="/admin/reports">
                      <FileText className="h-5 w-5 text-cyan-500" />
                      <span className="text-xs">View Reports</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
          {/* Recent activities section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
                {/* Recent Maintenance Tasks */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-amber-500" />
                      Recent Maintenance
                    </CardTitle>
                    <CardDescription>Recently scheduled maintenance tasks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-14 w-full" />
                        <Skeleton className="h-14 w-full" />
                        <Skeleton className="h-14 w-full" />
                      </div>
                    ) : dashboardStats?.recentMaintenance && dashboardStats.recentMaintenance.length > 0 ? (
                      <ScrollArea className="h-[240px] pr-4">
                        <div className="space-y-4">
                          {dashboardStats.recentMaintenance.map((task) => (
                            <div 
                              key={task._id} 
                              className="flex items-start justify-between p-3 rounded-lg border bg-card hover:bg-accent/10 transition-colors"
                            >
                              <div className="flex items-start gap-3">
                                <div 
                                  className={`w-2 h-2 mt-2 rounded-full ${
                                    task.status === 'completed' 
                                      ? 'bg-green-500' 
                                      : task.status === 'cancelled' 
                                        ? 'bg-red-500' 
                                        : 'bg-amber-500'
                                  }`}
                                ></div>
                                <div>
                                  <h4 className="text-sm font-medium">{task.clientName}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge 
                                      variant="secondary"
                                      className={getStatusColor(task.priority)}
                                    >
                                      {task.priority}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(task.maintenanceDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <Badge variant="outline" className="capitalize">
                                {task.type}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[240px] text-center p-4">
                        <Wrench className="h-10 w-10 text-muted-foreground/40 mb-3" />
                        <h3 className="text-lg font-medium">No maintenance tasks</h3>
                        <p className="text-muted-foreground text-sm mt-1">Schedule your first maintenance task</p>
                        <Button className="mt-4" asChild>
                          <Link href="/admin/maintenance">Schedule Maintenance</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href="/admin/maintenance">
                        View All Maintenance Tasks
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                {/* Recent Projects */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Package className="h-5 w-5 text-blue-500" />
                      Recent Projects
                    </CardTitle>
                    <CardDescription>Recently added solar projects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-14 w-full" />
                        <Skeleton className="h-14 w-full" />
                        <Skeleton className="h-14 w-full" />
                      </div>
                    ) : dashboardStats?.recentProjects && dashboardStats.recentProjects.length > 0 ? (
                      <ScrollArea className="h-[240px] pr-4">
                        <div className="space-y-4">
                          {dashboardStats.recentProjects.map((project) => (
                            <div 
                              key={project._id} 
                              className="flex items-start justify-between p-3 rounded-lg border bg-card hover:bg-accent/10 transition-colors"
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex flex-col items-center justify-center w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                                  <SunMedium className="h-5 w-5" />
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium">{project.title}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-muted-foreground">
                                      {project.client}
                                    </span>
                                    <span className="text-xs text-muted-foreground">•</span>
                                    <span className="text-xs text-muted-foreground">
                                      ID: {project.projectId}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <Badge 
                                variant="secondary"
                                className={getStatusColor(project.status)}
                              >
                                {project.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[240px] text-center p-4">
                        <Package className="h-10 w-10 text-muted-foreground/40 mb-3" />
                        <h3 className="text-lg font-medium">No projects created</h3>
                        <p className="text-muted-foreground text-sm mt-1">Start by creating your first project</p>
                        <Button className="mt-4" asChild>
                          <Link href="/admin/projects">Create Project</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href="/admin/projects">
                        View All Projects
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>

        </AnimatePresence>
      </div>
    </div>
  )
}
