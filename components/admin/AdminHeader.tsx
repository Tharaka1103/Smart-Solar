'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Bell, Settings, LogOut, Menu, X, Search } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { ThemeSwitch } from '../ThemeSwitch'

export function AdminHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [notifications] = useState(5)

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
                  {notifications > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center animate-pulse">
                      {notifications}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 bg-card border border-border p-4 rounded-xl mt-2 shadow-lg">
                <DropdownMenuLabel>Recent Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* Add notification items here */}
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
              <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-all hover:scale-105 flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
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
                    {notifications > 0 && (
                      <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center animate-pulse">
                        {notifications}
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
                  <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-all hover:scale-105 flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
