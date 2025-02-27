'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  Users,
  Package,
  BarChart3,
  MessageSquare,
  ShoppingCart,
  Sun,
  FileText,
  TrendingUp,
  AlertCircle,
  UserCog, 
  PenTool, 
  FileSpreadsheet, 
  Megaphone,
  LogOut,
  Coins,
  Bell
} from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@radix-ui/react-dropdown-menu'

interface DashboardCard {
  title: string
  value: string
  change: number
  icon: React.ReactNode
  color: string
}

interface AdminFeatureCard {
  title: string
  description: string
  icon: React.ReactNode
  link: string
  color: string
  details: {
    stats: string
    usage: string
    lastUpdated: string
    features: string[]
  }
}

export default function AdminDashboard() {
  const [notifications] = useState(5)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const dashboardStats: DashboardCard[] = [
    {
      title: "Total Revenue",
      value: "$124,563",
      change: 12.5,
      icon: <TrendingUp />,
      color: "bg-green-500"
    },
    {
      title: "Active Orders",
      value: "45",
      change: 8.2,
      icon: <ShoppingCart />,
      color: "bg-blue-500"
    },
    {
      title: "Total Customers",
      value: "1,240",
      change: 15.8,
      icon: <Users />,
      color: "bg-purple-500"
    },
    {
      title: "Pending Installations",
      value: "28",
      change: -4.3,
      icon: <Sun />,
      color: "bg-orange-500"
    },
  ]

  const adminFeatures: AdminFeatureCard[] = [
    {
      title: "Projects Management",
      description: "Manage projects",
      icon: <Package className='animate-bounce' />,
      link: "/admin/projects",
      color: "bg-blue-500",
      details: {
        stats: "156 Active Projects",
        usage: "85% Completion Rate",
        lastUpdated: "2 hours ago",
        features: ["Project Timeline", "Resource Allocation", "Budget Tracking", "Team Management"]
      }
    },
    {
      title: "Finance Management",
      description: "View and manage financial information",
      icon: <Coins className='animate-bounce' />,
      link: "/admin/finance",
      color: "bg-green-500",
      details: {
        stats: "$2.4M Monthly Revenue",
        usage: "92% Payment Success",
        lastUpdated: "5 mins ago",
        features: ["Invoice Generation", "Expense Tracking", "Financial Reports", "Budget Planning"]
      }
    },
    {
      title: "Employee Management",
      description: "Manage employees salary and performance",
      icon: <UserCog className='animate-bounce' />,
      link: "/admin/employee",
      color: "bg-cyan-500",
      details: {
        stats: "245 Active Employees",
        usage: "78% Performance Rate",
        lastUpdated: "1 hour ago",
        features: ["Payroll Management", "Performance Reviews", "Leave Management", "Training Tracking"]
      }
    },
    {
      title: "Customer Database",
      description: "Store and manage customer information",
      icon: <FileText className='animate-bounce' />,
      link: "/admin/reports",
      color: "bg-yellow-500",
      details: {
        stats: "5,678 Customers",
        usage: "95% Data Accuracy",
        lastUpdated: "30 mins ago",
        features: ["Customer Profiles", "Interaction History", "Data Analytics", "Segmentation"]
      }
    },
    {
      title: "Notifications",
      description: "View and manage notifications",
      icon: <Bell className='animate-bounce'/>,
      link: "/admin/analytics",
      color: "bg-red-500",
      details: {
        stats: "126 New Alerts",
        usage: "98% Delivery Rate",
        lastUpdated: "1 min ago",
        features: ["Alert Management", "Custom Triggers", "Notification History", "Priority Settings"]
      }
    },
    {
      title: "Maintenance Tracking",
      description: "Monitor and schedule system maintenance",
      icon: <PenTool className='animate-bounce' />,
      link: "/admin/maintenance",
      color: "bg-emerald-500",
      details: {
        stats: "45 Scheduled Tasks",
        usage: "89% On-time Completion",
        lastUpdated: "15 mins ago",
        features: ["Schedule Planning", "Task Assignment", "Progress Tracking", "Maintenance Logs"]
      }
    },
    {
      title: "Quote Generator",
      description: "Create and manage customer quotes",
      icon: <FileSpreadsheet className='animate-bounce' />,
      link: "/admin/quotes",
      color: "bg-violet-500",
      details: {
        stats: "234 Quotes Generated",
        usage: "76% Conversion Rate",
        lastUpdated: "45 mins ago",
        features: ["Quote Templates", "Price Calculator", "Proposal Builder", "Quote History"]
      }
    },
    {
      title: "Support Tickets",
      description: "Manage customer support requests",
      icon: <MessageSquare className='animate-bounce' />,
      link: "/admin/support",
      color: "bg-pink-500",
      details: {
        stats: "89 Open Tickets",
        usage: "94% Resolution Rate",
        lastUpdated: "10 mins ago",
        features: ["Ticket Management", "Response Templates", "Priority Queue", "Performance Metrics"]
      }
    }
  ]

  const handleLogout = () => {
    alert('Logout clicked')
    window.location.href = '/login'
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <div key={index} className="bg-card p-6 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  {stat.icon}
                </div>
                <span className={`text-sm ${stat.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change >= 0 ? '+' : ''}{stat.change}%
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-muted-foreground">{stat.title}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminFeatures.map((feature, index) => (
            <div key={index} className="relative" onMouseEnter={() => setHoveredCard(index)} onMouseLeave={() => setHoveredCard(null)}>
              <Link 
                href={feature.link}
                className="group bg-card p-6 rounded-xl h-full border border-border hover:border-primary transition-all duration-300 block"
              >
                <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Link>
              {hoveredCard === index && (
                <div className="absolute z-10 top-full left-0 right-0 mt-2 p-4 bg-card rounded-xl shadow-xl border border-border transform transition-all duration-300 ease-in-out opacity-100 scale-100 origin-top">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-primary">{feature.details.stats}</span>
                      <span className="text-sm text-muted-foreground">Updated: {feature.details.lastUpdated}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className={`h-full rounded-full ${feature.color}`} style={{width: feature.details.usage.split('%')[0] + '%'}}></div>
                    </div>
                    <p className="text-sm font-medium">{feature.details.usage}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {feature.details.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <span className={`w-2 h-2 rounded-full ${feature.color}`}></span>
                          {feat}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-card rounded-xl border border-border p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-background">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">New order received</p>
                  <p className="text-sm text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
