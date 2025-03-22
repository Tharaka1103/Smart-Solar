"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { motion } from "framer-motion"
import { Mail, Lock, AlertCircle, LogIn } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from '@/hooks/use-toast'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import Cookies from 'js-cookie'  // This import fixes the error


const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState("")
  const { user, status, signIn, error: authError } = useAuth()
  const { successt, errort, warningt, infot, dismissAll } = useToast()

  // Get the callback URL but don't show it if it's just /dashboard
  const callbackUrl = searchParams.get("callbackUrl")
  const shouldShowCallback = callbackUrl && callbackUrl !== "/dashboard"
  
  // Check for registration success message
  useEffect(() => {
    const registered = searchParams.get("registered")
    const resetSuccess = searchParams.get("reset")
    const errorParam = searchParams.get("error")
    
    if (registered === "true") {
      setSuccess("Registration successful! Please sign in with your credentials.")
    }
    
    if (resetSuccess === "true") {
      setSuccess("Your password has been reset successfully! Please sign in with your new password.")
    }
    
    if (errorParam) {
      setError(
        errorParam === "CredentialsSignin" 
          ? "Invalid email or password" 
          : "An error occurred during sign in"
      )
    }
  }, [searchParams])
  
  // Set error from auth context if it exists
  useEffect(() => {
    if (authError) {
      setError(authError)
    }
  }, [authError])
  
  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      // If there's a specific callback URL that's not dashboard, use it
      if (shouldShowCallback) {
        router.push(callbackUrl!)
      } else if (user?.role === "admin") {
        router.push("/admin")
      } else if (user?.role === "manager") {
        router.push("/manager")
      } else {
        router.push("/dashboard")
      }
    }
  }, [status, router, callbackUrl, shouldShowCallback, user])

  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Add this to your onSubmit function in the signin page
  // In your onSubmit function in sign-in page
async function onSubmit(values: z.infer<typeof formSchema>) {
  setIsLoading(true)
  setError("")
  
  try {
    console.log("Attempting to sign in with:", values.email)
    const user = await signIn(values.email, values.password)
    
    console.log("Sign-in successful, checking for redirection")
    successt({
      title: "Sign-in successful!",
      description: "You have successfully signed in.",
    })
    // Add a fallback redirection mechanism
    const redirectTimer = setTimeout(() => {
      console.log("Fallback redirection triggered")
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
      const role = storedUser?.role || 'user'
      
      if (role === 'admin') {
        window.location.href = '/admin'
      } else if (role === 'manager') {
        window.location.href = '/manager'
      } else {
        window.location.href = '/dashboard'
      }
    }, 1000) // Wait 1 second before fallback redirection
    
    return () => clearTimeout(redirectTimer)
  } catch (error: any) {
    console.error("Sign in error:", error)
    setError(error.message || "Failed to sign in. Please check your credentials.")
    errort({
      title: "Sign-in failed!",
      description: "Please check your credentials and try again.",
    })
  } finally {
    setIsLoading(false)
  }
}


  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-2 border-primary/10 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="name@example.com" 
                            className="pl-10" 
                            disabled={isLoading || status === "loading"} 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            className="pl-10" 
                            disabled={isLoading || status === "loading"} 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Link 
                    href="/forgot-password" 
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || status === "loading"}
                >
                  {isLoading || status === "loading" ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </div>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
