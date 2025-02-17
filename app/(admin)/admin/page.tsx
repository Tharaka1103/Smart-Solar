'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  Users,
  Package,
  BarChart3,
  Settings,
  Calendar,
  MessageSquare,
  Bell,
  ShoppingCart,
  Sun,
  Boxes,
  FileText,
  TrendingUp,
  AlertCircle,
  UserCog, 
  PenTool, 
  FileSpreadsheet, 
  Megaphone,
  LogOut
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
}

export default function AdminDashboard() {
  const [notifications] = useState(5)

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
      icon: <Package />,
      link: "/admin/projects",
      color: "bg-blue-500"
    },
    {
      title: "Customer Management",
      description: "View and manage customer information",
      icon: <Users />,
      link: "/admin/customers",
      color: "bg-green-500"
    },
    {
        title: "Employee Management",
        description: "Manage staff, installers, and permissions",
        icon: <UserCog />,
        link: "/admin/employees",
        color: "bg-cyan-500"
      },
    {
      title: "Analytics",
      description: "View sales and performance metrics",
      icon: <BarChart3 />,
      link: "/admin/analytics",
      color: "bg-red-500"
    },
    {
      title: "Reports",
      description: "Generate and view business reports",
      icon: <FileText />,
      link: "/admin/reports",
      color: "bg-yellow-500"
    },
    {
      title: "Support Tickets",
      description: "Manage customer support requests",
      icon: <MessageSquare />,
      link: "/admin/support",
      color: "bg-pink-500"
    },
      {
        title: "Maintenance Tracking",
        description: "Monitor and schedule system maintenance",
        icon: <PenTool />,
        link: "/admin/maintenance",
        color: "bg-emerald-500"
      },
      {
        title: "Quote Generator",
        description: "Create and manage customer quotes",
        icon: <FileSpreadsheet />,
        link: "/admin/quotes",
        color: "bg-violet-500"
      }  
  ]

  // Inside your component:
  const handleLogout = () => {
    // Add your logout logic here
    // Example: clear auth tokens, redirect to login page
    window.location.href = '/login'
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Stats */}
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

        {/* Admin Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminFeatures.map((feature, index) => (
            <Link 
              href={feature.link} 
              key={index}
              className="group bg-card p-6 rounded-xl border border-border hover:border-primary transition-all duration-300"
            >
              <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Link>
          ))}
        </div>

        {/* Recent Activity Section */}
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
