"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  status: 'loading' | 'authenticated' | 'unauthenticated'
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  adminSignOut: () => Promise<void> 
  error: string | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  status: 'loading',
  signIn: async () => {},
  signOut: async () => {},
  adminSignOut: async () => {}, 
  error: null,
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check if we have a token in the cookies
        const token = Cookies.get('auth-token')
        
        if (!token) {
          setUser(null)
          setStatus('unauthenticated')
          return
        }
        
        const response = await fetch('/api/auth/me')
        
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          setStatus('authenticated')
        } else {
          // Clear invalid token
          Cookies.remove('auth-token')
          setUser(null)
          setStatus('unauthenticated')
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setUser(null)
        setStatus('unauthenticated')
      }
    }
    
    checkAuth()
  }, [])

  // Sign in function
const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to sign in')
      }
      
      // Check for token in cookies or response
      let authToken = Cookies.get('auth-token')
      
      // If not in cookies, check response body and set it manually
      if (!authToken && data.token) {
        Cookies.set('auth-token', data.token, { 
          expires: 7, // 7 days
          path: '/',
          secure: process.env.NODE_ENV === 'production'
        })
        authToken = data.token
        console.log("Token set manually from response data")
      }
      
      if (!authToken) {
        console.error('Auth token cookie not set after login')
        throw new Error('Authentication failed - please try again')
      }
      
      // Update state
      setUser(data.user)
      setStatus('authenticated')
      console.log("Authentication successful, user role:", data.user.role)
      
      // Store user data in localStorage as a backup
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('token', JSON.stringify(data.token))

      // IMPORTANT: Use a more direct approach for redirection
      // Delay slightly to ensure state updates have completed
      setTimeout(() => {
        console.log("Attempting redirection based on role:", data.user.role)
        
        // Force hard navigation
        if (data.user.role === 'admin') {
          document.location.href = '/admin'
        } else if (data.user.role === 'manager') {
          document.location.href = '/manager'
        } else {
          document.location.href = '/dashboard'
        }
      }, 300)
      
      return data.user // Return user data for additional handling
    } catch (error: any) {
      console.error('Sign in error:', error)
      setError(error.message || 'Failed to sign in')
      setStatus('unauthenticated')
      throw error // Rethrow to allow caller to handle
    }
  }
  
  // Sign out function
  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
      
      Cookies.remove('auth-token')
      setUser(null)
      setStatus('unauthenticated')
      window.location.href = '/'
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }
  const adminSignOut = async () => {
    try {
      const response = await fetch('/api/auth/admin-logout', {
        method: 'POST',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to sign out');
      }
      
      // Clear all auth data
      Cookies.remove('auth-token');
      localStorage.removeItem('user');
      setUser(null);
      setStatus('unauthenticated');
      
      // Force navigation to login page
      window.location.href = '/signin';
    } catch (error: any) {
      console.error('Admin sign out error:', error);
      // Even if there's an error, we should try to clear the local auth state
      Cookies.remove('auth-token');
      localStorage.removeItem('user');
      setUser(null);
      setStatus('unauthenticated');
      window.location.href = '/signin';
    }
  };

  return (
    <AuthContext.Provider value={{ user, status, signIn, signOut, error, adminSignOut }}>
      {children}
    </AuthContext.Provider>
  )
}
