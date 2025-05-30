'use client'

import Link from "next/link"
import { motion } from "framer-motion"
import { useTheme } from '@/providers/ThemeProvider'
import { 
  Sun, 
  Mail, 
  Phone, 
  MapPin,
  HeartIcon, 
  MessageSquare, 
  ExternalLink, 
  ChevronRight, 
  ArrowRight, 
  Send, 
  BarChart3, 
  Sparkles,
  Leaf,
  Shield,
  ScanHeart,
  Heart
} from "lucide-react"
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaYoutube, FaWhatsapp } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const footerLinks = {
  solutions: [
    { name: "Residential Solar", href: "/residential" },
    { name: "Commercial Systems", href: "/commercial" },
    { name: "Battery Storage", href: "/battery-storage" },
    { name: "Smart Energy Management", href: "/smart-energy" },
    { name: "Off-Grid Solutions", href: "/off-grid" }
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Leadership Team", href: "/team" },
    { name: "Careers", href: "/careers" },
    { name: "News & Press", href: "/news" },
    { name: "Sustainability", href: "/sustainability" }
  ],
  resources: [
    { name: "Solar Calculator", href: "/calculator" },
    { name: "Maintenance Tips", href: "/maintenance-tips" },
    { name: "Case Studies", href: "/case-studies" },
    { name: "Solar Glossary", href: "/glossary" },
    { name: "Blog & Insights", href: "/blog" }
  ],
  support: [
    { name: "Contact Us", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "Submit Inquiry", href: "/inquiries" },
    { name: "Customer Portal", href: "/portal" },
    { name: "Support Center", href: "/support" }
  ]
}

const socialLinks = [
  { name: "Facebook", icon: <FaFacebook />, href: "https://facebook.com", color: "bg-blue-600" },
  { name: "Instagram", icon: <FaInstagram />, href: "https://instagram.com", color: "bg-pink-600" },
  { name: "Twitter", icon: <FaTwitter />, href: "https://twitter.com", color: "bg-sky-500" },
  { name: "LinkedIn", icon: <FaLinkedin />, href: "https://linkedin.com", color: "bg-blue-700" },
  { name: "YouTube", icon: <FaYoutube />, href: "https://youtube.com", color: "bg-red-600" },
  { name: "WhatsApp", icon: <FaWhatsapp />, href: "https://whatsapp.com", color: "bg-green-500" }
]

const statsItems = [
  { label: "Projects Completed", value: "10,000+", icon: <BarChart3 className="w-5 h-5 text-primary" /> },
  { label: "CO₂ Prevented", value: "80M kg", icon: <Leaf className="w-5 h-5 text-primary" /> },
  { label: "Energy Saved", value: "₹120M+", icon: <Sparkles className="w-5 h-5 text-primary" /> },
  { label: "Customer Satisfaction", value: "99%", icon: <Shield className="w-5 h-5 text-primary" /> }
]

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
}

export default function Footer() {
  const { theme } = useTheme()
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-card relative overflow-hidden border-t border-border">
      
      {/* Newsletter section */}
      <div className="relative">
        <div className="container mx-auto px-4 py-8">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative bg-background rounded-2xl p-8 md:p-12 shadow-lg border border-border overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
            
            <div className="relative grid md:grid-cols-5 gap-8 items-center">
              <div className="md:col-span-3">
                <Badge variant="outline" className="mb-4 px-3 py-1.5 border-primary text-primary">
                  Stay Updated
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Join our solar community</h2>
                <p className="text-muted-foreground max-w-xl mb-4">
                  Subscribe to our newsletter for the latest solar technology updates, 
                  energy-saving tips, and exclusive offers.
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>We respect your privacy. Unsubscribe at any time.</span>
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="space-y-4">
                  <div className="relative">
                    <Input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="h-12 pl-4 pr-12 bg-card"
                    />
                    <Button 
                      className="absolute right-1 top-1 h-10 w-10 p-0 bg-primary hover:bg-primary/90"
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-primary hover:bg-primary/90 text-white rounded-md h-12 flex items-center justify-center gap-2 font-medium"
                  >
                    Subscribe Now
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-8 relative">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Company info column */}
          <motion.div 
            className="lg:col-span-2"
            variants={itemVariants}
          >
            <Link href="/" className="inline-block mb-6">
              <div className="flex items-center gap-2">
                <Sun className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">LUMINEX</span>
              </div>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Transforming the way homes and businesses harness energy with innovative solar solutions and smart technology for a sustainable future.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <span>1-800-SOLAR-POWER</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <span>contact@luminex.com</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <span>123 Solar Avenue, Sunshine City</span>
              </div>
            </div>
            
            {/* Social links */}
            <div className="flex flex-wrap gap-3">
              <TooltipProvider>
                {socialLinks.map((social, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <motion.a 
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${social.color}`}
                      >
                        {social.icon}
                      </motion.a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Follow us on {social.name}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </motion.div>
          
          {/* Links columns */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <h3 className="font-semibold text-lg mb-4">Solutions</h3>
            <ul className="space-y-3">
              {footerLinks.solutions.map((link, index) => (
                <motion.li key={index} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3" />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <motion.li key={index} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3" />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <motion.li key={index} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3" />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <motion.li key={index} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3" />
                  {link.name}
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.div>

      {/* Copyright and legal links */}
      <div className="mt-8 pt-8 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.p 
            className="text-sm text-muted-foreground mt-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            © {currentYear} LUMINEX Engineering (Pvt) Ltd. All rights reserved.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap mt-4 gap-6 justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
          >
            <Link href="/privacy-policy" className="text-sm text-primary hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-primary hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-sm text-primary hover:text-primary transition-colors">
              Cookie Policy
            </Link>
          </motion.div>
        </div>
        
        {/* Final note */}
        <motion.p 
          className="text-xs text-center mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          Designed and developed with <Heart className="inline-block w-4 h-4 text-green-500 fill-green-500" /> by <Link href="https://www.trimids.com" className="hover:text-primary transition-colors">TRIMIDS Innovations</Link>.  
        </motion.p>      
      </div>
    </div>
  </footer>
)
}
