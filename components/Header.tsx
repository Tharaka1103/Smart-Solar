"use client"

import { useState, useEffect, useCallback  } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ThemeSwitch } from './ThemeSwitch'
import { motion, useScroll } from 'framer-motion'
import { FiHome, FiInfo, FiBriefcase, FiMail, FiBox, FiUsers, FiUser, FiLogOut } from 'react-icons/fi'
import { usePathname, useRouter } from 'next/navigation'

interface User {
  name: string;
  email: string;
}

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter()
  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setIsScrolled(latest > 20)
    })
    return () => unsubscribe()
  }, [scrollY])
  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/user-login/check', {
        credentials: 'include',
        cache: 'no-store'
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    }
  }, [])

  useEffect(() => {
    checkAuthStatus()
    
    // Add event listener for custom login event
    window.addEventListener('user-logged-in', checkAuthStatus)
    
    return () => {
      window.removeEventListener('user-logged-in', checkAuthStatus)
    }
  }, [checkAuthStatus])

  const handleLogout = async () => {
    await fetch('/api/auth/user-login/logout', {
      method: 'POST',
      credentials: 'include'
    })
    setUser(null)
    router.refresh()
    router.push('/')
  }
  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/10 backdrop-blur-md shadow-sm h-12'
          : 'bg-background/10 h-16'
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
          <nav className="hidden md:flex rounded-lg p-1 items-center space-x-4 bg-footer">
            {[
              { href: '/', icon: FiHome, label: 'Home' },
              { href: '/about', icon: FiInfo, label: 'About' },
              { href: '/products', icon: FiBriefcase, label: 'Products' },
              { href: '/services', icon: FiUsers, label: 'Services' },
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
            {/* Login Link */}
            <div className="hidden md:block rounded-lg p-1 items-center space-x-4 bg-footer">
            {!user ? (
              <Link 
                href="/login" 
                className="flex items-center space-x-1 transition-colors group p-1.5 rounded-lg"
              >
                <FiUser className="w-4 h-4" />
                <span className="text-sm font-medium">Login</span>
              </Link>
            ) : (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-muted">
                  <span className="text-sm font-medium">Hello, {user.name}</span>
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 py-2 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link 
                    href="/profile" 
                    className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-muted"
                  >
                    <FiUser className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  <button 
                    onClick={async () => {
                      await fetch('/api/auth/user-login/logout', { method: 'POST' });
                      setUser(null);
                      window.location.reload();
                    }}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-red-500 hover:bg-muted w-full text-left"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>            
            )}
            </div>
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
            { href: '/products', icon: FiBriefcase, label: 'Products' },
            { href: '/services', icon: FiUsers, label: 'Services' },
            { href: '/contact', icon: FiMail, label: 'Contact' },
            { href: '/login', icon: FiUser, label: 'Login' },
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
        </div>
      </motion.div>
    </motion.header>
  )
}
