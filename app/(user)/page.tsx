'use client'
import Image from "next/image";
import { 
  ArrowRight, Phone, Mail, MapPin, Sun, Battery, House, Zap, 
  Sparkles, ChevronRight, Award, Shield, Clock, ShieldCheck, 
  LineChart, BarChart, PiggyBank, Leaf, ThumbsUp, Thermometer,
  CircleCheck, CalendarClock, Users, Settings, FileText, GraduationCap,
  ArrowUp,
  Star,
  User,
  Bot,
  Brain,
  Network,
  Calculator,
  MessageSquare
} from "lucide-react";
import { FaInstagram, FaFacebook, FaTwitter, FaWhatsapp, FaLinkedin, FaYoutube } from "react-icons/fa";
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useTheme } from '@/providers/ThemeProvider';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SparklesText } from "@/components/magicui/sparkles-text";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8 }
};

const fadeInRight = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8 }
};

const fadeInLeft = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8 }
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const services = [
  {
    title: "Solar Panel Installation",
    description: "Professional installation of high-efficiency solar panels for residential and commercial properties, maximizing energy production and savings.",
    icon: <Sun className="w-10 h-10 text-primary" />,
    features: ["Premium Panels", "Expert Installation", "25-Year Warranty"]
  },
  {
    title: "Energy Storage Solutions",
    description: "Advanced battery storage systems to store excess solar power for use during non-sunlight hours or power outages.",
    icon: <Battery className="w-10 h-10 text-primary" />,
    features: ["24/7 Power Access", "Backup Protection", "Efficient Storage"]
  },
  {
    title: "Home Energy Assessment",
    description: "Comprehensive energy audits to optimize your property's energy efficiency and solar potential.",
    icon: <House className="w-10 h-10 text-primary" />,
    features: ["Full Property Analysis", "Energy Reports", "Savings Projection"]
  },
  {
    title: "Smart Grid Integration",
    description: "Connect your solar system to smart grid technology for optimal energy management and utility interaction.",
    icon: <Zap className="w-10 h-10 text-primary" />,
    features: ["Grid Synchronization", "Net Metering", "Smart Controls"]
  }
];

const testimonials = [
  {
    name: "John Parker",
    role: "Homeowner",
    content: "Switching to solar with LUMINEX was the best decision we made. Our electricity bills have been reduced by 85% and the installation team was professional and efficient.",
    rating: 5,
    image: "/testimonials/person1.jpg"
  },
  {
    name: "Sarah Johnson",
    role: "Business Owner",
    content: "As a small business owner, I was concerned about the initial investment, but LUMINEX provided excellent financing options and the ROI has been impressive. Highly recommend!",
    rating: 5,
    image: "/testimonials/person2.jpg"
  },
  {
    name: "Michael Chang",
    role: "Property Manager",
    content: "Managing multiple properties, energy costs were a major expense. The solar solution from LUMINEX has significantly reduced our operational costs across all our buildings.",
    rating: 5,
    image: "/testimonials/person3.jpg"
  }
];

const statsData = [
  { value: "1,200+", label: "Installations", icon: <CircleCheck className="w-6 h-6 text-primary" /> },
  { value: "98%", label: "Customer Satisfaction", icon: <ThumbsUp className="w-6 h-6 text-primary" /> },
  { value: "30%", label: "Average Bill Reduction", icon: <PiggyBank className="w-6 h-6 text-primary" /> },
  { value: "25,000+", label: "Tons of CO₂ Prevented", icon: <Leaf className="w-6 h-6 text-primary" /> }
];

export default function Home() {
  const { theme } = useTheme();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // References for scroll animations
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const statsRef = useRef(null);
  const processRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const testimonialRef = useRef(null);

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Parallax scrolling effect for hero section
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  const smoothHeroY = useSpring(heroY, { stiffness: 100, damping: 30 });

  return (
    <>
      {/* Hero Section with Parallax Effect */}
      <motion.section 
        ref={heroRef}
        className="min-h-screen flex items-center bg-background relative overflow-hidden"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <motion.div 
          className="absolute w-full h-full bg-black"
          style={{ 
            y: smoothHeroY,
            opacity: heroOpacity
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-full opacity-60"
          >
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
        </motion.div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={fadeInUp}
              className="space-y-6 text-center lg:text-left"
            >
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <Badge variant="outline" className="px-4 py-1 text-primary border-primary mb-4">
                  Sustainable Energy Solutions
                </Badge>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-bold leading-tight tracking-tight">
                Power Your Future With{" "}
                <motion.span 
                  className="text-primary relative inline-block"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <SparklesText 
                    text="LUMINEX" 
                    sparklesCount={15}
                    className="text-primary"
                  />
                </motion.span>
              </h1>

              <p className="text-xl sm:text-2xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Transform your energy consumption with cutting-edge solar solutions for a sustainable tomorrow.
              </p>

              <motion.div 
                className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                <motion.div variants={fadeInUp}>
                  <Link href='/contact'>
                    <Button 
                      size="lg" 
                      className="group bg-primary hover:bg-green-900 px-8 py-6 rounded-full text-lg font-medium"
                    >
                      Get Started
                      <motion.span
                        className="inline-block ml-2"
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 10 }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.span>
                    </Button>
                  </Link>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Link href='/inquiries'>
                    <Button
                      variant="outline"
                      size="lg" 
                      className="rounded-full text-lg font-medium bg-transparent text-primary border-primary hover:bg-primary hover:text-white"
                    >
                      Submit an Inquiry
                      <motion.span
                        className="inline-block ml-2"
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 10 }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.span>
                    </Button>
                  </Link>
                </motion.div>           
              </motion.div>
            </motion.div>

            <motion.div
              variants={fadeInLeft}
              className="hidden lg:block relative"
            >
              <motion.div 
                className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Image 
                  src="/hero-right.png" 
                  alt="Solar Panel Installation" 
                  fill 
                  className="object-cover rounded-2xl" 
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                >
                  <Badge className="bg-primary text-white mb-2">Featured Project</Badge>
                  <h3 className="text-white text-2xl font-bold mb-1">Smart Home Integration</h3>
                </motion.div>
              </motion.div>

              {/* Floating badges */}
            </motion.div>
          </div>
        </div>

        {/* Scrolling indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <motion.div
            className="w-8 h-14 border-2 border-white/30 rounded-full flex justify-center p-2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div 
              className="w-1.5 h-3 bg-white rounded-full"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Luminex Intelligence Section */}
      <motion.section
        className="py-24 bg-gradient-to-b from-background to-card relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          {/* Alert Banner */}
          <motion.div
            className="mb-12 bg-alert border border-primary rounded-2xl p-6 relative overflow-hidden"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              <div>
                <h4 className="text-lg font-semibold text-primary">New AI Technology Released</h4>
                <p className="">Experience the next generation of artificial intelligence solutions</p>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-primary/10 text-primary mb-4 px-4 py-1">Luminex Intelligence</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text">
                Advanced AI Solutions for Tomorrow
              </h2>
              <motion.p className="text-muted-foreground max-w-2xl mx-auto">
                Harness the power of cutting-edge artificial intelligence to transform your business with our innovative solutions and expert guidance.
              </motion.p>
            </motion.div>
          </div>

          {/* Feature Cards Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false }}
          >
            {/* Card 1 */}
            <motion.div
              className="group p-6 bg-card backdrop-blur-sm rounded-2xl border border-primary hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              variants={{
                hidden: { y: 20, opacity: 0 },
                show: { y: 0, opacity: 1 }
              }}
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Luminex Intelligence Chat</h3>
              <p className="text-muted-foreground">Advanced AI-powered chat system for intelligent conversations and support.</p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              className="group p-6 bg-card backdrop-blur-sm rounded-2xl border border-primary hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              variants={{
                hidden: { y: 20, opacity: 0 },
                show: { y: 0, opacity: 1 }
              }}
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Quotation Generator</h3>
              <p className="text-muted-foreground">Automated quotation system powered by AI for accurate and instant pricing.</p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              className="group p-6 bg-card backdrop-blur-sm rounded-2xl border border-primary hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              variants={{
                hidden: { y: 20, opacity: 0 },
                show: { y: 0, opacity: 1 }
              }}
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time Processing</h3>
              <p className="text-muted-foreground">Instant responses and calculations for efficient business operations.</p>
            </motion.div>
          </motion.div>
          {/* CTA Button */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/artificial-intelligence">
              <Button
                size="lg"
                className="bg-alert text-text border border-primary rounded-full px-4 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 w-full sm:w-auto"
              >
                <SparklesText 
                  text="Explore AI Solutions" 
                  sparklesCount={20}
                  className="p-2 sm:p-3 text-md sm:text-lg"
                />
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>            
            </Link>
          </motion.div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-28 h-28 bg-primary/5 rounded-full blur-2xl" />
        </div>
      </motion.section>

      {/* Stats Section with Counter Animation */}
      <motion.section 
        ref={statsRef}
        className="py-16 bg-card"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: false, amount: 0.3 }}
          >
            {statsData.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="flex flex-col items-center p-6 bg-background rounded-xl border border-border hover:border-primary/40 transition-colors shadow-sm hover:shadow-md"
              >
                {stat.icon}
                <motion.h3 
                  className="text-3xl md:text-4xl font-bold mt-4 mb-2 text-primary"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false }}
                  transition={{ duration: 1, delay: 0.2 }}
                >
                  {stat.value}
                </motion.h3>
                <p className="text-center text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Services Section with Animated Card Pack */}
      <motion.section 
        ref={servicesRef}
        id="services" 
        className="py-20 bg-background relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        {/* Background decoration elements */}
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3] 
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1 
          }}
        />

        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="outline" className="px-4 py-1.5 text-primary border-primary mb-4">
                Our Services
              </Badge>
            </motion.div>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Comprehensive Solar Solutions
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              From residential installations to commercial energy systems, we provide end-to-end solar solutions tailored to your needs.
            </motion.p>
          </div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: false, amount: 0.3 }}
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 } 
                }}
                className="relative group"
              >
                <Card className="h-full border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden bg-card">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="p-2 rounded-xl bg-primary/10">
                        {service.icon}
                      </div>
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        Popular
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl mt-6">{service.title}</CardTitle>
                    <CardDescription className="text-base mt-2">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <CircleCheck className="w-5 h-5 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Process Section with Timeline */}
      <motion.section 
        ref={processRef}
        className="py-20 bg-card relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="outline" className="px-4 py-1.5 text-primary border-primary mb-4">
                How It Works
              </Badge>
            </motion.div>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Our Simple Process
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              We make going solar straightforward with our proven 4-step approach
            </motion.p>
          </div>

          <div className="max-w-5xl mx-auto">
            <motion.div 
              className="relative"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: false, amount: 0.2 }}
            >
              {/* Timeline line */}
              <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-border"></div>

              {/* Timeline items */}
              <div className="space-y-12 md:space-y-24 relative">
                {/* Step 1 */}
                <motion.div 
                  variants={fadeInRight}
                  className="relative flex flex-col md:flex-row items-center"
                >
                  <div className="md:w-1/2 md:pr-12 text-center md:text-right order-2 md:order-1">
                    <h3 className="text-2xl font-bold mb-3">Initial Consultation</h3>
                    <p className="text-muted-foreground">We assess your energy needs and discuss solar options tailored to your property and consumption patterns.</p>
                  </div>
                  <div className="order-1 md:order-2 mb-4 md:mb-0 md:w-1/2 flex justify-center md:justify-start md:pl-12 relative">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center border-4 border-background z-10">
                      <span className="text-xl font-bold text-primary">1</span>
                    </div>
                  </div>
                </motion.div>

                {/* Step 2 */}
                <motion.div 
                  variants={fadeInLeft}
                  className="relative flex flex-col md:flex-row items-center"
                >
                  <div className="order-2 md:w-1/2 md:pl-12 text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-3">Custom Design</h3>
                    <p className="text-muted-foreground">Our engineers create a custom solar system design optimized for your property's specifications and energy goals.</p>
                  </div>
                  <div className="order-1 mb-4 md:mb-0 md:w-1/2 flex justify-center md:justify-end md:pr-12 relative">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center border-4 border-background z-10">
                      <span className="text-xl font-bold text-primary">2</span>
                    </div>
                  </div>
                </motion.div>

                {/* Step 3 */}
                <motion.div 
                  variants={fadeInRight}
                  className="relative flex flex-col md:flex-row items-center"
                >
                  <div className="md:w-1/2 md:pr-12 text-center md:text-right order-2 md:order-1">
                    <h3 className="text-2xl font-bold mb-3">Professional Installation</h3>
                    <p className="text-muted-foreground">Our certified technicians install your solar system with minimal disruption to your daily routine.</p>
                  </div>
                  <div className="order-1 md:order-2 mb-4 md:mb-0 md:w-1/2 flex justify-center md:justify-start md:pl-12 relative">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center border-4 border-background z-10">
                      <span className="text-xl font-bold text-primary">3</span>
                    </div>
                  </div>
                </motion.div>

                {/* Step 4 */}
                <motion.div 
                  variants={fadeInLeft}
                  className="relative flex flex-col md:flex-row items-center"
                >
                  <div className="order-2 md:w-1/2 md:pl-12 text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-3">System Activation & Monitoring</h3>
                    <p className="text-muted-foreground">We activate your system and provide tools to monitor performance and energy production in real-time.</p>
                  </div>
                  <div className="order-1 mb-4 md:mb-0 md:w-1/2 flex justify-center md:justify-end md:pr-12 relative">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center border-4 border-background z-10">
                      <span className="text-xl font-bold text-primary">4</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5 }}
          >
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
              Schedule Your Consultation
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Environmental Impact Section */}
      <motion.section
        className="py-20 bg-background relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="outline" className="px-4 py-1.5 text-primary border-primary mb-4">
                Environmental Benefits
              </Badge>
            </motion.div>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Your Positive Impact
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Switching to solar doesn't just save money — it helps save our planet
            </motion.p>
          </div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: false, amount: 0.3 }}
          >
            <motion.div 
              variants={fadeInUp}
              className="relative overflow-hidden group"
            >
              <div className="bg-card border border-border rounded-xl p-8 h-full group-hover:border-primary/50 transition-all duration-300">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <Leaf className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Reduce Carbon Footprint</h3>
                <p className="text-muted-foreground mb-6">
                  The average home solar system offsets about 100,000 pounds of carbon dioxide in its lifetime — equivalent to planting 50 trees annually.
                </p>
                <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary" 
                    initial={{ width: 0 }}
                    whileInView={{ width: '80%' }}
                    viewport={{ once: false }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
                <p className="text-right text-sm mt-2 text-primary font-medium">80% Reduction</p>
              </div>
            </motion.div>
            
            <motion.div 
              variants={fadeInUp}
              className="relative overflow-hidden group"
            >
              <div className="bg-card border border-border rounded-xl p-8 h-full group-hover:border-primary/50 transition-all duration-300">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <Thermometer className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Combat Climate Change</h3>
                <p className="text-muted-foreground mb-6">
                  Solar energy helps reduce greenhouse gas emissions that contribute to global warming and climate change.
                </p>
                <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary" 
                    initial={{ width: 0 }}
                    whileInView={{ width: '65%' }}
                    viewport={{ once: false }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
                <p className="text-right text-sm mt-2 text-primary font-medium">65% Impact</p>
              </div>
            </motion.div>
            
            <motion.div 
              variants={fadeInUp}
              className="relative overflow-hidden group"
            >
              <div className="bg-card border border-border rounded-xl p-8 h-full group-hover:border-primary/50 transition-all duration-300">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Community Impact</h3>
                <p className="text-muted-foreground mb-6">
                  Solar adoption creates local jobs, improves energy infrastructure, and builds community resilience against power outages.
                </p>
                <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary" 
                    initial={{ width: 0 }}
                    whileInView={{ width: '95%' }}
                    viewport={{ once: false }}
                    transition={{ duration: 1, delay: 0.4 }}
                  />
                </div>
                <p className="text-right text-sm mt-2 text-primary font-medium">95% Satisfaction</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section 
        id="contact" 
        className="py-20 bg-card relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/20 to-primary/5"
          initial={{ x: -1000 }}
          whileInView={{ x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="outline" className="px-4 py-1.5 text-primary border-primary mb-4">
                Get In Touch
              </Badge>
            </motion.div>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Contact Us
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Ready to start your solar journey? Contact our team of experts today
            </motion.p>
          </div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: false, amount: 0.3 }}
          >
            <motion.div
              variants={fadeInUp}
              className="bg-background p-8 rounded-xl border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-md text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Call Us</h3>
              <p className="text-muted-foreground mb-4">Speak directly with our solar experts</p>
              <p className="text-lg font-medium">1-800-SOLAR-POWER</p>
              <p className="text-sm text-muted-foreground">Mon-Fri: 8am-7pm, Sat: 9am-5pm</p>
            </motion.div>
            
            <motion.div
              variants={fadeInUp}
              className="bg-background p-8 rounded-xl border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-md text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Email Us</h3>
              <p className="text-muted-foreground mb-4">Send us your questions anytime</p>
              <p className="text-lg font-medium">contact@solarcompany.com</p>
              <p className="text-sm text-muted-foreground">We respond within 24 hours</p>
            </motion.div>
            
            <motion.div
              variants={fadeInUp}
              className="bg-background p-8 rounded-xl border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-md text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Visit Us</h3>
              <p className="text-muted-foreground mb-4">Come to our showroom</p>
              <p className="text-lg font-medium">123 Solar Street, Sunshine City</p>
              <p className="text-sm text-muted-foreground">Open daily: 9am-6pm</p>
            </motion.div>
          </motion.div>

          <motion.div 
            className="mt-12 flex flex-wrap justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <motion.a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-card border border-border hover:border-primary/50 rounded-full flex items-center justify-center transition-colors"
            >
              <FaFacebook className="w-5 h-5 text-primary" />
            </motion.a>
            
            <motion.a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-card border border-border hover:border-primary/50 rounded-full flex items-center justify-center transition-colors"
            >
              <FaInstagram className="w-5 h-5 text-primary" />
            </motion.a>
            
            <motion.a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-card border border-border hover:border-primary/50 rounded-full flex items-center justify-center transition-colors"
            >
              <FaTwitter className="w-5 h-5 text-primary" />
            </motion.a>
            
            <motion.a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-card border border-border hover:border-primary/50 rounded-full flex items-center justify-center transition-colors"
            >
              <FaLinkedin className="w-5 h-5 text-primary" />
            </motion.a>
            
            <motion.a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-card border border-border hover:border-primary/50 rounded-full flex items-center justify-center transition-colors"
            >
              <FaYoutube className="w-5 h-5 text-primary" />
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

      {/* Final CTA Section */}
      <motion.section
        className="py-24 bg-background relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-5xl mx-auto text-center"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.7 }}
          >
            <Badge variant="outline" className="px-4 py-1.5 text-primary border-primary mb-6 inline-block">
              Start Your Solar Journey
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
              Ready to Harness the Power <br className="hidden md:block" /> of the Sun?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Join thousands of satisfied homeowners who have made the switch to clean, renewable solar energy with LUMINEX Engineering.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                  Get Your Free Quote
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  <Phone className="mr-2 w-5 h-5" />
                  Call Us Now
                </Button>
              </motion.div>
            </div>
            
            <motion.div 
              className="mt-12 flex items-center justify-center gap-6 max-w-xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="flex -space-x-4">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                ))}
              </div>
              <div className="text-sm text-center sm:text-left">
                <p className="font-medium">Join over 10,000+ happy customers</p>
                <div className="flex items-center mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                  <span className="ml-2 text-muted-foreground">4.9/5 based on 500+ reviews</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}
