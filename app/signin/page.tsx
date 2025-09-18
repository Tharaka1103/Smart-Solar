"use client"
import { Suspense } from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Mail, 
  Lock, 
  AlertCircle, 
  LogIn, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Sun,
  Shield,
  ArrowRight,
  Leaf,
  Battery,
  Zap
} from "lucide-react"
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
import { Badge } from "@/components/ui/badge"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

// Floating background elements
const FloatingElement = ({ children, className, delay = 0 }: { children: React.ReactNode, className: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ 
      opacity: [0.2, 0.4, 0.2],
      y: [0, -15, 0],
      rotate: [0, 3, -3, 0]
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
    className={className}
  >
    {children}
  </motion.div>
)

const BackgroundPattern = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Floating icons */}
    <FloatingElement className="absolute top-20 left-10" delay={0}>
      <Sun className="w-8 h-8 text-green-300/30" />
    </FloatingElement>
    <FloatingElement className="absolute top-32 right-16" delay={1}>
      <Leaf className="w-6 h-6 text-green-400/30" />
    </FloatingElement>
    <FloatingElement className="absolute bottom-32 left-20" delay={2}>
      <Battery className="w-7 h-7 text-green-500/30" />
    </FloatingElement>
    <FloatingElement className="absolute bottom-20 right-12" delay={3}>
      <Zap className="w-5 h-5 text-green-300/30" />
    </FloatingElement>
    
    {/* Gradient background */}
    <motion.div
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.1, 0.2, 0.1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-green-200/20 via-green-300/10 to-green-400/20 rounded-full blur-3xl"
    />
    <motion.div
      animate={{
        scale: [1.1, 1, 1.1],
        opacity: [0.15, 0.05, 0.15],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-green-300/20 via-green-400/10 to-green-500/20 rounded-full blur-3xl"
    />
  </div>
)

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { user, status, signIn, error: authError } = useAuth()
  const { toast } = useToast()

  const callbackUrl = searchParams?.get("callbackUrl")
  const shouldShowCallback = callbackUrl && callbackUrl !== "/dashboard"
  
  useEffect(() => {
    const registered = searchParams?.get("registered")
    const resetSuccess = searchParams?.get("reset")
    const errorParam = searchParams?.get("error")
    
    if (registered === "true") {
      setSuccess("Registration successful! Please sign in with your credentials.")
    }
    
    if (resetSuccess === "true") {
      setSuccess("Your password has been reset successfully!")
    }
    
    if (errorParam) {
      setError(
        errorParam === "CredentialsSignin" 
          ? "Invalid email or password" 
          : "An error occurred during sign in"
      )
    }
  }, [searchParams])
  
  useEffect(() => {
    if (authError) {
      setError(authError)
    }
  }, [authError])
  
  useEffect(() => {
    if (status === "authenticated") {
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError("")
    
    try {
      const user = await signIn(values.email, values.password)
      
      toast({
        title: "Welcome back! 🌱",
        description: "You have successfully signed in to your solar dashboard.",
      })
      
      const redirectTimer = setTimeout(() => {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
        const role = storedUser?.role || 'user'
        
        if (role === 'admin') {
          window.location.href = '/admin'
        } else if (role === 'manager') {
          window.location.href = '/manager'
        } else {
          window.location.href = '/dashboard'
        }
      }, 1000)
      
      return () => clearTimeout(redirectTimer)
    } catch (error: any) {
      setError(error.message || "Failed to sign in. Please check your credentials.")
      toast({
        title: "Sign-in failed",
        description: "Please check your credentials and try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-green-50 via-white to-green-50/50">
      <BackgroundPattern />
      
      <div className="relative z-10 container flex items-center justify-center min-h-screen py-8 px-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hidden lg:block space-y-8"
          >
            <div className="space-y-6">
              {/* Logo and title */}
              <motion.div 
                className="flex items-center space-x-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="relative p-3 bg-green-500 rounded-2xl shadow-lg"
                  animate={{ 
                    boxShadow: [
                      "0 0 0 0 rgba(34, 197, 94, 0.4)",
                      "0 0 20px 10px rgba(34, 197, 94, 0.1)",
                      "0 0 0 0 rgba(34, 197, 94, 0.4)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sun className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-4xl font-bold text-green-700">
                    Luminex Engineering
                  </h1>
                  <p className="text-green-600 text-lg font-medium">Powering Tomorrow, Today</p>
                </div>
              </motion.div>

              {/* Welcome message */}
              <div className="space-y-4">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-gray-800"
                >
                  Welcome back to your solar dashboard
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-gray-600 leading-relaxed"
                >
                  Manage your renewable energy projects, monitor real-time performance, 
                  and drive sustainable energy solutions for a greener future.
                </motion.p>
              </div>

              {/* Features grid */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  { icon: Sun, text: "Solar Monitoring", color: "text-green-600" },
                  { icon: Shield, text: "Secure Platform", color: "text-green-500" },
                  { icon: Battery, text: "Energy Storage", color: "text-green-700" },
                  { icon: Leaf, text: "Eco Analytics", color: "text-green-400" },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-center space-x-3 p-4 rounded-xl bg-white shadow-sm border border-green-100 hover:shadow-md transition-all duration-200"
                  >
                    <feature.icon className={`w-5 h-5 ${feature.color}`} />
                    <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Right side - Login form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-md mx-auto lg:mx-0"
          >
            <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
              <CardHeader className="space-y-4 pb-8">
                {/* Mobile logo */}
                <div className="lg:hidden flex items-center justify-center space-x-3 mb-4">
                  <div className="p-2 bg-green-500 rounded-xl">
                    <Sun className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-green-700">
                    SolarTech Pro
                  </span>
                </div>
                
                <CardTitle className="text-2xl lg:text-3xl font-bold text-center text-gray-800">
                  Sign In
                </CardTitle>
                <CardDescription className="text-center text-base text-gray-600">
                  Access your solar energy dashboard
                </CardDescription>
                
                {shouldShowCallback && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center"
                  >
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                      Redirecting to: {callbackUrl}
                    </Badge>
                  </motion.div>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Alert variant="destructive" className="border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="font-medium">{error}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                  
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="font-medium text-green-800">
                          {success}
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700">Email Address</FormLabel>
                          <FormControl>
                            <motion.div 
                              className="relative"
                              whileFocus={{ scale: 1.01 }}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                              <Input 
                                placeholder="your@email.com" 
                                className="pl-10 h-12 border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200" 
                                disabled={isLoading || status === "loading"} 
                                {...field} 
                              />
                            </motion.div>
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
                          <FormLabel className="text-sm font-semibold text-gray-700">Password</FormLabel>
                          <FormControl>
                            <motion.div 
                              className="relative"
                              whileFocus={{ scale: 1.01 }}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                              <Input 
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••" 
                                className="pl-10 pr-12 h-12 border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200" 
                                disabled={isLoading || status === "loading"} 
                                {...field} 
                              />
                              <motion.button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-green-600 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </motion.button>
                            </motion.div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="remember"
                          className="rounded border-green-300 text-green-500 focus:ring-green-500"
                        />
                        <label htmlFor="remember" className="text-sm text-gray-600">
                          Remember me
                        </label>
                      </div>
                      <Link 
                        href="/forgot-password" 
                        className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200" 
                        disabled={isLoading || status === "loading"}
                      >
                        {isLoading || status === "loading" ? (
                          <motion.div 
                            className="flex items-center justify-center"
                          >
                            <motion.div 
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            />
                            <span className="ml-3">Signing in...</span>
                          </motion.div>
                        ) : (
                          <div className="flex items-center justify-center group">
                            <LogIn className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                            <span>Sign In</span>
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </Form>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4 pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link 
                      href="/signup" 
                      className="text-green-600 font-semibold hover:text-green-700 transition-colors"
                    >
                      Create account
                    </Link>
                  </p>
                </div>
                
                {/* Trust indicators */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="flex items-center justify-center space-x-6 text-xs text-gray-500"
                >
                  <div className="flex items-center space-x-1">
                    <Shield className="w-3 h-3 text-green-500" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Leaf className="w-3 h-3 text-green-500" />
                    <span>Eco-Friendly</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Sun className="w-3 h-3 text-green-500" />
                    <span>Renewable</span>
                  </div>
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50/50">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center space-y-4"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="p-4 bg-green-500 rounded-full shadow-lg"
      >
        <Sun className="w-8 h-8 text-white" />
      </motion.div>
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-lg font-medium text-green-700"
      >
        Loading SolarTech Pro...
      </motion.p>
    </motion.div>
  </div>
)

export default function SignInPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SignInContent />
    </Suspense>
  )
}