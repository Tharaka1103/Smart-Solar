'use client'
import Image from "next/image";
import { ArrowRight, Phone, Mail, MapPin, Link, Sun, Battery, House, Zap } from "lucide-react";
import { FaInstagram, FaFacebook, FaTwitter, FaWhatsapp, FaLinkedin, FaYoutube } from "react-icons/fa";
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { useTheme } from '@/providers/ThemeProvider'

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1 }
}

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.5
    }
  }
}

const services = [
  {
    title: "Solar Panel Installation",
    description: "Professional installation of high-efficiency solar panels for residential and commercial properties, maximizing energy production and savings.",
    icon: <Sun className="w-6 h-6 text-primary" />
  },
  {
    title: "Energy Storage Solutions",
    description: "Advanced battery storage systems to store excess solar power for use during non-sunlight hours or power outages.",
    icon: <Battery className="w-6 h-6 text-primary" />
  },
  {
    title: "Home Energy Assessment",
    description: "Comprehensive energy audits to optimize your property's energy efficiency and solar potential.",
    icon: <House className="w-6 h-6 text-primary" />
  }
]

export default function Home() {
  const { theme } = useTheme()

  return <>
  {/* Hero Section */}
      <motion.section 
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="min-h-screen flex items-center bg-background relative overflow-hidden"
      >
        <div className="absolute w-full h-full bg-black">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-full opacity-50"
          >
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              variants={fadeInUp}
              className="space-y-4 md:space-y-6 text-center lg:text-left"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight">
                Power Your Future With <span className="text-primary">LUMINEX</span> Engineering
              </h1>
              <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto lg:mx-0">
                Transform your energy consumption with cutting-edge solar solutions. Experience sustainable, cost-effective power generation for your home and business.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <button className="btn btn-primary border border-primary text-primary hover:bg-primary hover:text-white w-full sm:w-auto px-6 py-3 rounded-full flex items-center justify-center gap-2">
                  Get Started <ArrowRight className="w-5 h-5" />
                </button>
                <button className="btn btn-outline text-white w-full sm:w-auto px-6 py-3 rounded-full flex items-center justify-center gap-2">
                  Learn More <Zap className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    <motion.section 
      initial="initial"
      whileInView="animate"
      viewport={{ once: false, amount: 0.3 }}
      variants={staggerContainer}
      id="services" 
      className="py-12 bg-background"
    >
      <div className="container mx-auto px-4">
        <motion.h2 
          variants={fadeInUp}
          className="text-3xl font-bold text-center mb-12"
        >
          Solar Solutions
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={{
                initial: { opacity: 0, x: -50 },
                animate: { opacity: 1, x: 0 }
              }}
              className="p-6 rounded-xl bg-card border border-border hover:border-primary transition-colors"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>

    <motion.section 
      initial="initial"
      whileInView="animate"
      viewport={{ once: false, amount: 0.3 }}
      className="py-16 bg-card"
    >
      <motion.div 
        variants={{
          initial: { opacity: 0 },
          animate: { opacity: 1, transition: { duration: 0.5 } }
        }}
        className="container mx-auto px-4"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose Solar Energy?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Environmental Impact</h3>
            <p>Reduce your carbon footprint and contribute to a sustainable future with clean, renewable energy.</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Cost Savings</h3>
            <p>Significantly reduce your electricity bills and enjoy long-term energy independence.</p>
          </div>
        </div>
      </motion.div>
    </motion.section>

    <motion.section
      initial="initial"
      whileInView="animate"
      viewport={{ once: false, amount: 0.3 }}
      className="py-16 bg-background"
    >
      <motion.div 
        variants={{
          initial: { opacity: 0, y: 100 },
          animate: { opacity: 1, y: 0 }
        }}
        className="container mx-auto px-4"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Our Technology</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-card rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Advanced Panels</h3>
            <p>Latest generation solar panels with maximum efficiency ratings.</p>
          </div>
          <div className="p-6 bg-card rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Smart Monitoring</h3>
            <p>Real-time energy production monitoring through our mobile app.</p>
          </div>
          <div className="p-6 bg-card rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Battery Storage</h3>
            <p>High-capacity storage solutions for 24/7 energy availability.</p>
          </div>
        </div>
      </motion.div>
    </motion.section>

    <motion.section
      initial="initial"
      whileInView="animate"
      viewport={{ once: false }}
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.8 } }
      }}
      id="contact" 
      className="bg-card py-12"
    >
      <motion.div
        variants={staggerContainer}
        className="container mx-auto px-4"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Contact Us</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span>1-800-SOLAR-POWER</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              <span>contact@solarcompany.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>123 Solar Street, Sunshine City</span>
            </div>
          </div>
          <div className="flex gap-4 justify-center items-center">
            <FaFacebook className="w-6 h-6" />
            <FaInstagram className="w-6 h-6" />
            <FaTwitter className="w-6 h-6" />
            <FaLinkedin className="w-6 h-6" />
          </div>
        </div>
      </motion.div>
    </motion.section>

    <motion.section
      initial="initial"
      whileInView="animate"
      viewport={{ once: false }}
      className="py-16 bg-background"
    >
      <motion.div
        variants={{
          initial: { opacity: 0, y: 50 },
          animate: { opacity: 1, y: 0 }
        }}
        className="container mx-auto px-4"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Financing Options</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-card rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Solar Loans</h3>
            <p>Flexible financing options with competitive interest rates.</p>
          </div>
          <div className="p-6 bg-card rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Lease Options</h3>
            <p>Low monthly payments with no upfront costs.</p>
          </div>
          <div className="p-6 bg-card rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Power Purchase Agreement</h3>
            <p>Pay only for the power you use at a reduced rate.</p>
          </div>
        </div>
      </motion.div>
    </motion.section>

    <motion.section
      initial="initial"
      whileInView="animate"
      viewport={{ once: false }}
      className="py-16 bg-card"
    >
      <motion.div
        variants={{
          initial: { opacity: 0, x: -50 },
          animate: { opacity: 1, x: 0 }
        }}
        className="container mx-auto px-4"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Maintenance Services</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 bg-background rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Regular Maintenance</h3>
            <p>Scheduled cleaning and inspection services to ensure optimal performance.</p>
          </div>
          <div className="p-6 bg-background rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Emergency Repairs</h3>
            <p>24/7 emergency support for any system issues.</p>
          </div>
        </div>
      </motion.div>
    </motion.section>

    <motion.section
      initial="initial"
      whileInView="animate"
      viewport={{ once: false }}
      className="py-16 bg-background"
    >
      <motion.div
        variants={{
          initial: { opacity: 0, y: 50 },
          animate: { opacity: 1, y: 0 }
        }}
        className="container mx-auto px-4"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Solar Education</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-card rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Workshops</h3>
            <p>Free educational sessions about solar technology and benefits.</p>
          </div>
          <div className="p-6 bg-card rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Resources</h3>
            <p>Comprehensive guides and materials about solar energy.</p>
          </div>
          <div className="p-6 bg-card rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Consultation</h3>
            <p>One-on-one sessions with our solar experts.</p>
          </div>
        </div>
      </motion.div>
    </motion.section>

    <motion.section
      initial="initial"
      whileInView="animate"
      viewport={{ once: false }}
      className="py-16 bg-card"
    >
      <motion.div
        variants={{
          initial: { opacity: 0, x: 50 },
          animate: { opacity: 1, x: 0 }
        }}
        className="container mx-auto px-4"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Government Incentives</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 bg-background rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Tax Credits</h3>
            <p>Information about federal and state tax incentives for solar installation.</p>
          </div>
          <div className="p-6 bg-background rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Rebates</h3>
            <p>Local utility and government rebate programs for solar adoption.</p>
          </div>
        </div>
      </motion.div>
    </motion.section>
  </>
}
