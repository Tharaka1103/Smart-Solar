"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  AlertCircle, 
  UserPlus, 
  Sun,
  Shield,
  ArrowRight,
  Leaf,
  Battery,
  Zap,
  Eye,
  EyeOff,
  CheckCircle2
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from '@/hooks/use-toast'
import Image from "next/image"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { districts } from "@/lib/districts"

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  district: z.string().min(1, { message: "Please select your district" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
  confirmPassword: z.string(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Floating elements for the image side
const FloatingElement = ({ children, className, delay = 0 }: { children: React.ReactNode, className: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ 
      opacity: [0.3, 0.6, 0.3],
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

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { status } = useAuth()
  const { toast } = useToast()

  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      district: "",
      address: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError("")
    
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          district: values.district,
          address: values.address,
          password: values.password,
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to register")
      }
      
      toast({
        title: "Welcome to Luminex Engineering! 🌱",
        description: "Your account has been created successfully. Please sign in to continue.",
      })
      
      // Redirect to sign in page with success message
      router.push("/signin?registered=true")
    } catch (error: any) {
      console.error("Registration error:", error)
      setError(error.message || "Failed to register. Please try again.")
      toast({
        title: "Registration failed",
        description: "Please check your information and try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-green-50/50 via-white to-green-50/30">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg"
        >
          {/* Logo section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
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
                <Sun className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-green-700">
                  Luminex Engineering
                </h1>
                <p className="text-green-600 text-sm font-medium">Powering Tomorrow, Today</p>
              </div>
            </div>
          </motion.div>

          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardHeader className="space-y-3 pb-6">
              <CardTitle className="text-2xl font-bold text-center text-gray-800">
                Create Your Account
              </CardTitle>
              <CardDescription className="text-center text-sm text-gray-600">
                Join the renewable energy revolution
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
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
                      <AlertDescription className="font-medium text-sm">{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-gray-700">Full Name</FormLabel>
                          <FormControl>
                            <motion.div 
                              className="relative"
                              whileFocus={{ scale: 1.01 }}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                              <Input 
                                placeholder="John Doe" 
                                className="pl-10 h-10 border-green-200 focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition-all duration-200" 
                                disabled={isLoading} 
                                {...field} 
                              />
                            </motion.div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-gray-700">Email Address</FormLabel>
                          <FormControl>
                            <motion.div 
                              className="relative"
                              whileFocus={{ scale: 1.01 }}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                              <Input 
                                placeholder="your@email.com" 
                                className="pl-10 h-10 border-green-200 focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition-all duration-200" 
                                disabled={isLoading} 
                                {...field} 
                              />
                            </motion.div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-gray-700">Phone</FormLabel>
                            <FormControl>
                              <motion.div 
                                className="relative"
                                whileFocus={{ scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                              >
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                                <Input 
                                  placeholder="07XXXXXXXX" 
                                  className="pl-10 h-10 border-green-200 focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition-all duration-200" 
                                  disabled={isLoading} 
                                  {...field} 
                                />
                              </motion.div>
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="district"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-gray-700">District</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              disabled={isLoading}
                            >
                              <FormControl>
                                <motion.div
                                  whileFocus={{ scale: 1.01 }}
                                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                >
                                  <SelectTrigger className="h-10 border-green-200 focus:border-green-500 focus:ring-1 focus:ring-green-500/20">
                                    <div className="flex items-center">
                                      <MapPin className="h-4 w-4 text-green-500 mr-2" />
                                      <SelectValue placeholder="Select district" />
                                    </div>
                                  </SelectTrigger>
                                </motion.div>
                              </FormControl>
                              <SelectContent>
                                {districts.map((district) => (
                                  <SelectItem key={district} value={district}>
                                    {district}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-gray-700">Address</FormLabel>
                          <FormControl>
                            <motion.div 
                              className="relative"
                              whileFocus={{ scale: 1.01 }}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                              <Input 
                                placeholder="Your complete address" 
                                className="pl-10 h-10 border-green-200 focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition-all duration-200" 
                                disabled={isLoading} 
                                {...field} 
                              />
                            </motion.div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-gray-700">Password</FormLabel>
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
                                  className="pl-10 pr-10 h-10 border-green-200 focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition-all duration-200" 
                                  disabled={isLoading} 
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
                                    <EyeOff className="h-3 w-3" />
                                  ) : (
                                    <Eye className="h-3 w-3" />
                                  )}
                                </motion.button>
                              </motion.div>
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-gray-700">Confirm Password</FormLabel>
                            <FormControl>
                              <motion.div 
                                className="relative"
                                whileFocus={{ scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                              >
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                                <Input 
                                  type={showConfirmPassword ? "text" : "password"} 
                                  placeholder="••••••••" 
                                  className="pl-10 pr-10 h-10 border-green-200 focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition-all duration-200" 
                                  disabled={isLoading} 
                                  {...field} 
                                />
                                <motion.button
                                  type="button"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-green-600 transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff className="h-3 w-3" />
                                  ) : (
                                    <Eye className="h-3 w-3" />
                                  )}
                                </motion.button>
                              </motion.div>
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="termsAccepted"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-green-200 p-3 bg-green-50/50">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                            className="border-green-300 text-green-500 focus:ring-green-500 mt-0.5"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-xs text-gray-700">
                            I agree to the{" "}
                            <Link href="/terms" className="text-green-600 hover:text-green-700 font-medium underline">
                              terms of service
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="text-green-600 hover:text-green-700 font-medium underline">
                              privacy policy
                            </Link>
                          </FormLabel>
                          <FormMessage className="text-xs" />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <Button 
                      type="submit" 
                      className="w-full h-11 bg-green-500 hover:bg-green-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200" 
                      disabled={isLoading || status === "loading"}
                    >
                      {isLoading || status === "loading" ? (
                        <motion.div 
                          className="flex items-center justify-center"
                        >
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          />
                          <span className="ml-3 text-sm">Creating account...</span>
                        </motion.div>
                      ) : (
                        <div className="flex items-center justify-center group">
                          <UserPlus className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                          <span>Create Account</span>
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </Form>
            </CardContent>
            
            <CardFooter className="flex justify-center pt-4">
              <p className="text-xs text-gray-600">
                Already have an account?{" "}
                <Link href="/signin" className="text-green-600 font-semibold hover:text-green-700 transition-colors">
                  Sign in here
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      <div className="hidden lg:flex flex-1 relative overflow-hidden">
  {/* Background Image */}
  <div className="absolute inset-0">
    <Image
      src="/regbg.jpg" // Replace with your actual image path
      alt="Solar panels field with green energy"
      fill
      className="object-cover"
      priority
      quality={90}
    />
    
    {/* Green overlay to maintain theme */}
    <div className="absolute inset-0 bg-black/30" />
  </div>

  {/* Floating elements overlay */}
  <div className="absolute inset-0 pointer-events-none">
    <FloatingElement className="absolute top-20 left-20" delay={0}>
      <Sun className="w-12 h-12 text-white/40" />
    </FloatingElement>
    <FloatingElement className="absolute top-40 right-32" delay={1}>
      <Leaf className="w-8 h-8 text-white/30" />
    </FloatingElement>
    <FloatingElement className="absolute bottom-40 left-32" delay={2}>
      <Battery className="w-10 h-10 text-white/35" />
    </FloatingElement>
    <FloatingElement className="absolute bottom-20 right-20" delay={3}>
      <Zap className="w-6 h-6 text-white/40" />
    </FloatingElement>
    <FloatingElement className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" delay={4}>
      <Shield className="w-14 h-14 text-white/20" />
    </FloatingElement>
  </div>

  {/* Content overlay */}
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, delay: 0.3 }}
    className="relative z-10 flex flex-col justify-center items-center text-center p-12 text-white"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="max-w-md space-y-6"
    >
      {/* Company logo/icon */}
      <motion.div
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
        className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30"
      >
        <Sun className="w-12 h-12 text-white" />
      </motion.div>

      {/* Main heading */}
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-4xl font-bold drop-shadow-lg"
      >
        Join the Solar Revolution
      </motion.h2>
      
      {/* Description */}
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-lg text-white/90 leading-relaxed drop-shadow-md"
      >
        Transform your energy future with cutting-edge solar technology. 
        Monitor, manage, and maximize your renewable energy potential.
      </motion.p>

      {/* Features list */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-3 text-left"
      >
        {[
          { icon: Sun, text: "Advanced Solar Monitoring" },
          { icon: Battery, text: "Smart Energy Storage" },
          { icon: Leaf, text: "Environmental Impact Tracking" },
          { icon: Shield, text: "24/7 System Protection" },
        ].map((feature, index) => (
          <motion.div
            key={feature.text}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 + index * 0.1 }}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/20">
              <feature.icon className="w-4 h-4 text-white" />
            </div>
            <span className="text-white/90 drop-shadow-sm">{feature.text}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="grid grid-cols-3 gap-4 pt-6 border-t border-white/30"
      >
        <div className="text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
            className="text-2xl font-bold drop-shadow-lg"
          >
            500+
          </motion.div>
          <div className="text-xs text-white/80 drop-shadow-sm">Projects Completed</div>
        </div>
        <div className="text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
            className="text-2xl font-bold drop-shadow-lg"
          >
            50MW
          </motion.div>
          <div className="text-xs text-white/80 drop-shadow-sm">Energy Installed</div>
        </div>
        <div className="text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.6, type: "spring", stiffness: 200 }}
            className="text-2xl font-bold drop-shadow-lg"
          >
            24/7
          </motion.div>
          <div className="text-xs text-white/80 drop-shadow-sm">Support Available</div>
        </div>
      </motion.div>

      {/* Trust badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7 }}
        className="flex items-center justify-center space-x-6 pt-4"
      >
        <div className="flex items-center space-x-2 text-white/80">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-xs">Certified</span>
        </div>
        <div className="flex items-center space-x-2 text-white/80">
          <Shield className="w-4 h-4" />
          <span className="text-xs">Secure</span>
        </div>
        <div className="flex items-center space-x-2 text-white/80">
          <Leaf className="w-4 h-4" />
          <span className="text-xs">Sustainable</span>
        </div>
      </motion.div>
    </motion.div>
  </motion.div>
</div>
    </div>
  )
}