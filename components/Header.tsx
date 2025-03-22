"use client"

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ThemeSwitch } from './ThemeSwitch'
import { motion, useScroll, AnimatePresence } from 'framer-motion'
import { FiHome, FiInfo, FiBriefcase, FiMail, FiUsers, FiUser, FiLogOut, FiChevronDown, FiSettings, FiUserPlus } from 'react-icons/fi'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useToast } from '@/hooks/use-toast'

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const userMenuRef = useRef<HTMLDivElement>(null)
  const { user, status, signOut } = useAuth()
  const { successt, errort, warningt, infot, dismissAll } = useToast()
  
  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setIsScrolled(latest > 20)
    })
    return () => unsubscribe()
  }, [scrollY])
  
  // Close the user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  // Close menus when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsUserMenuOpen(false)
  }, [pathname])

  const handleSignOut = async () => {
    try {
      console.log("Attempting to sign out...");
      await signOut();
      console.log("Sign out successful");
      successt({
        title: "Sign out successful!",
        description: "You have successfully signed out.",
      })
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
      errort({
        title: "Sign out failed!",
        description: "Please try again later.",
      })
    }
  }

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background backdrop-blur-md shadow-sm h-12'
          : 'bg-transparent h-16'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.span 
              className="text-2xl font-bold bg-primary bg-clip-text text-transparent"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 1.2 }}
            >
              <Image 
              src="/logo.png" 
              alt="Logo" 
              width={100} 
              height={100}
              priority />
            </motion.span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex rounded-lg p-1 items-center space-x-4 ">
            {[
              { href: '/', icon: FiHome, label: 'Home' },
              { href: '/about', icon: FiInfo, label: 'About' },
              { href: '/vision', icon: FiBriefcase, label: 'Vision' },
              { href: '/projects', icon: FiUsers, label: 'Projects' },
              { href: '/career', icon: FiUsers, label: 'Careers' },
              { href: '/contact', icon: FiMail, label: 'Contact' },
            ].map(({ href, icon: Icon, label }, index) => (
              <div key={href} className="flex items-center">
                <Link 
                  href={href} 
                  className={`flex items-center space-x-1 transition-colors group p-1.5 rounded-lg ${
                    pathname === href
                      ? 'bg-background text-primary'
                      : 'text-text-foreground hover:text-primary hover:bg-muted'
                  }`}
                >
                  <Icon className="w-4 h-4 transition-transform" />
                  <span className="text-sm font-medium">{label}</span>
                </Link>
                {index < 4 && <span className="text-foreground ml-3 text-sm opacity-100">|</span>}
              </div>
            ))}
          </nav>          
          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Auth Buttons or User Menu */}
            {status === "authenticated" && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-muted transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {user.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
                  </div>
                  <span className="font-medium text-sm hidden sm:inline-block">
                    {user.name || user.email}
                  </span>
                  <FiChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-background rounded-lg shadow-lg border border-border overflow-hidden z-50"
                    >
                      <div className="p-3 border-b border-border">
                        <p className="font-medium text-sm">{user.name || "User"}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors"
                        >
                          <FiUser className="w-4 h-4 mr-2" />
                          Profile
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            href="/admin"
                            className="flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors"
                          >
                            <FiSettings className="w-4 h-4 mr-2" />
                            Admin Dashboard
                          </Link>
                        )}
                        {user.role === 'manager' && (
                          <Link
                            href="/manager"
                            className="flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors"
                          >
                            <FiSettings className="w-4 h-4 mr-2" />
                            Manager Dashboard
                          </Link>
                        )}
                        {user.role === 'user' && (
                          <Link
                            href="/dashboard"
                            className="flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors"
                          >
                            <FiSettings className="w-4 h-4 mr-2" />
                            Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                        >
                          <FiLogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : status !== "loading" && (
              <div className="hidden md:flex items-center space-x-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/signin" 
                    className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-full hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    Sign In
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/signup" 
                    className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </div>
            )}
            
            {/* Theme Switch */}
            <ThemeSwitch />

            {/* Mobile Menu Button */}
            <motion.button 
              className="md:hidden text-text-foreground p-1 rounded-lg hover:bg-muted"
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className={`md:hidden bg-background backdrop-blur-sm border-t border-border ${isMobileMenuOpen ? 'block' : 'hidden'}`}
        initial={false}
        animate={isMobileMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="px-3 py-2 space-y-1">
          {[
            { href: '/', icon: FiHome, label: 'Home' },
            { href: '/about', icon: FiInfo, label: 'About' },
            { href: '/vision', icon: FiBriefcase, label: 'Vision' },
            { href: '/projects', icon: FiUsers, label: 'Projects' },
            { href: '/career', icon: FiUsers, label: 'Careers' },
            { href: '/contact', icon: FiMail, label: 'Contact' },
          ].map(({ href, icon: Icon, label }) => (
            <Link 
              key={href}
              href={href} 
              className={`flex items-center space-x-2 p-1.5 rounded-lg transition-all ${
                pathname === href
                  ? 'bg-card text-primary'
                  : 'text-text-foreground hover:bg-muted hover:text-primary'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
          
          {/* Mobile Auth Links */}
          {status === "authenticated" && user ? (
            <>
              <div className="pt-2 pb-1 border-t border-border mt-2">
                <p className="px-1.5 text-sm font-medium text-muted-foreground">Account</p>
              </div>
              <Link 
                href="/profile" 
                className="flex items-center space-x-2 p-1.5 rounded-lg transition-all text-text-foreground hover:bg-muted hover:text-primary"
              >
                <FiUser className="w-5 h-5" />
                <span className="font-medium">Profile</span>
              </Link>
              
              {user.role === 'admin' && (
                <Link 
                  href="/admin" 
                  className="flex items-center space-x-2 p-1.5 rounded-lg transition-all text-text-foreground hover:bg-muted hover:text-primary"
                >
                  <FiSettings className="w-5 h-5" />
                  <span className="font-medium">Admin Dashboard</span>
                </Link>
              )}
              
              {user.role === 'manager' && (
                <Link 
                  href="/manager" 
                  className="flex items-center space-x-2 p-1.5 rounded-lg transition-all text-text-foreground hover:bg-muted hover:text-primary"
                >
                  <FiSettings className="w-5 h-5" />
                  <span className="font-medium">Manager Dashboard</span>
                </Link>
              )}
              
              {user.role === 'user' && (
                <Link 
                  href="/dashboard" 
                  className="flex items-center space-x-2 p-1.5 rounded-lg transition-all text-text-foreground hover:bg-muted hover:text-primary"
                >
                  <FiSettings className="w-5 h-5" />
                  <span className="font-medium">Dashboard</span>
                </Link>
              )}
              
              <button 
                onClick={handleSignOut}
                className="flex items-center w-full space-x-2 p-1.5 rounded-lg transition-all text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <FiLogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </>
          ) : status !== "loading" && (
            <>
              <div className="pt-2 pb-1 border-t border-border mt-2">
                <p className="px-1.5 text-sm font-medium text-muted-foreground">Account</p>
              </div>
              <Link 
                href="/signin" 
                className="flex items-center space-x-2 p-1.5 rounded-lg transition-all text-text-foreground hover:bg-muted hover:text-primary"
              >
                <FiUser className="w-5 h-5" />
                <span className="font-medium">Sign In</span>
              </Link>
              <Link 
                href="/signup" 
                className="flex items-center space-x-2 p-1.5 rounded-lg transition-all text-text-foreground hover:bg-muted hover:text-primary"
              >
                <FiUserPlus className="w-5 h-5" />
                <span className="font-medium">Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </motion.header>
  )
}
