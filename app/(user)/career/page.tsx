'use client'

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { 
  Sun, 
  Users, 
  Leaf, 
  GraduationCap, 
  HeartHandshake, 
  Zap, 
  Globe, 
  Shield, 
  ArrowRight, 
  Search, 
  BarChart3,
  Calendar, 
  MapPin, 
  BriefcaseBusiness,
  Rocket,
  Sparkles,
  Lightbulb,
  Award,
  Check,
  ArrowUpRight,
  Phone
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Job listings data
const jobOpenings = [
  {
    id: "solar-installer",
    title: "Solar Installation Technician",
    department: "Operations",
    location: "Colombo, Sri Lanka",
    type: "Full-time",
    experience: "2+ years",
    posted: "2 weeks ago",
    description: "Join our installation team to implement residential and commercial solar systems with precision and safety.",
    responsibilities: [
      "Install solar panels and mounting systems according to design specifications",
      "Perform electrical wiring and connections following safety protocols",
      "Test solar systems for proper functionality and troubleshoot issues",
      "Maintain accurate documentation of installations and system data",
      "Ensure all work complies with safety standards and local regulations"
    ],
    requirements: [
      "2+ years experience in solar installation or related electrical work",
      "Knowledge of electrical systems and solar PV technology",
      "Physical ability to perform installation work at heights and lift 50+ pounds",
      "Valid driver's license and clean driving record",
      "NABCEP certification preferred"
    ]
  },
  {
    id: "solar-engineer",
    title: "Solar Design Engineer",
    department: "Engineering",
    location: "Colombo, Sri Lanka",
    type: "Full-time",
    experience: "3+ years",
    posted: "1 week ago",
    description: "Design optimal solar energy systems for residential and commercial properties based on energy needs and site specifications.",
    responsibilities: [
      "Create detailed solar system designs using CAD and simulation software",
      "Conduct site assessments and energy analyses",
      "Calculate energy production, system sizing, and ROI projections",
      "Collaborate with installation teams to ensure proper implementation",
      "Stay current with solar technology advancements and industry standards"
    ],
    requirements: [
      "Bachelor's degree in Electrical Engineering, Renewable Energy, or related field",
      "3+ years experience in solar PV system design",
      "Proficiency in AutoCAD, PVsyst, or similar design software",
      "Strong understanding of electrical systems and NEC requirements",
      "Excellent analytical and problem-solving skills"
    ]
  },
  {
    id: "solar-sales",
    title: "Solar Energy Consultant",
    department: "Sales",
    location: "Remote (Sri Lanka)",
    type: "Full-time",
    experience: "2+ years",
    posted: "3 days ago",
    description: "Drive solar adoption by educating potential customers and guiding them through the solar energy journey.",
    responsibilities: [
      "Generate and qualify leads for residential and commercial solar installations",
      "Conduct energy consultations and prepare customized solar proposals",
      "Explain technical information, financing options, and ROI in clear terms",
      "Guide customers through the sales process from initial contact to contract signing",
      "Maintain accurate CRM records and follow up with prospects consistently"
    ],
    requirements: [
      "2+ years experience in sales, preferably in solar or related industries",
      "Strong communication and interpersonal skills",
      "Basic understanding of solar technology and energy concepts",
      "Self-motivated with ability to work independently",
      "Experience with CRM software and sales automation tools"
    ]
  },
  {
    id: "project-manager",
    title: "Solar Project Manager",
    department: "Operations",
    location: "Colombo, Sri Lanka",
    type: "Full-time",
    experience: "4+ years",
    posted: "5 days ago",
    description: "Oversee solar installation projects from planning to completion, ensuring quality, timeliness, and customer satisfaction.",
    responsibilities: [
      "Manage project schedules, resources, and budgets for multiple solar installations",
      "Coordinate with engineering, installation, and permitting teams",
      "Conduct regular project status meetings and provide updates to stakeholders",
      "Identify and mitigate project risks and resolve issues promptly",
      "Ensure quality control and compliance with safety standards"
    ],
    requirements: [
      "4+ years experience in project management, preferably in solar or construction",
      "PMP certification or equivalent project management training",
      "Strong leadership, communication, and organizational skills",
      "Experience with project management software and MS Office suite",
      "Knowledge of solar energy systems and installation processes"
    ]
  },
  {
    id: "marketing-specialist",
    title: "Digital Marketing Specialist",
    department: "Marketing",
    location: "Remote (Sri Lanka)",
    type: "Full-time",
    experience: "3+ years",
    posted: "1 week ago",
    description: "Drive brand awareness and lead generation through innovative digital marketing strategies focused on sustainable energy solutions.",
    responsibilities: [
      "Develop and execute digital marketing campaigns across multiple channels",
      "Manage SEO/SEM, social media, email marketing, and content strategies",
      "Track and analyze marketing performance metrics",
      "Collaborate with content creators to produce engaging solar energy content",
      "Stay current with digital marketing trends and best practices"
    ],
    requirements: [
      "3+ years experience in digital marketing",
      "Proficiency in marketing automation, analytics, and CRM platforms",
      "Experience with SEO, SEM, social media, and email marketing",
      "Strong analytical skills and data-driven approach",
      "Excellent written and verbal communication skills"
    ]
  },
  {
    id: "customer-success",
    title: "Customer Success Manager",
    department: "Customer Support",
    location: "Colombo, Sri Lanka",
    type: "Full-time",
    experience: "3+ years",
    posted: "3 days ago",
    description: "Build and maintain strong relationships with solar customers, ensuring long-term satisfaction and system performance.",
    responsibilities: [
      "Serve as the primary point of contact for assigned solar customers",
      "Conduct regular check-ins to ensure system performance and satisfaction",
      "Identify opportunities for system upgrades or additional services",
      "Coordinate with technical teams to resolve customer issues",
      "Maintain detailed customer records and track key satisfaction metrics"
    ],
    requirements: [
      "3+ years experience in customer success, account management, or related role",
      "Strong interpersonal and communication skills",
      "Basic understanding of solar energy systems and customer pain points",
      "Experience with CRM platforms and customer service tools",
      "Problem-solving mindset and ability to work cross-functionally"
    ]
  }
]

// Company benefits data
const benefits = [
  {
    title: "Health & Wellness",
    description: "Comprehensive medical, dental, and vision insurance for you and your family.",
    icon: <Shield className="w-6 h-6 text-primary" />
  },
  {
    title: "Work-Life Balance",
    description: "Flexible working hours, remote work options, and generous paid time off.",
    icon: <Calendar className="w-6 h-6 text-primary" />
  },
  {
    title: "Career Growth",
    description: "Regular training, education stipends, and clear paths for advancement.",
    icon: <GraduationCap className="w-6 h-6 text-primary" />
  },
  {
    title: "Retirement Planning",
    description: "Employer-matched retirement plans to help secure your financial future.",
    icon: <Sparkles className="w-6 h-6 text-primary" />
  },
  {
    title: "Green Commuting",
    description: "Incentives for public transport, carpooling, and electric vehicle charging.",
    icon: <Leaf className="w-6 h-6 text-primary" />
  },
  {
    title: "Team Building",
    description: "Regular team outings, celebrations, and community volunteering opportunities.",
    icon: <Users className="w-6 h-6 text-primary" />
  }
]

// Company values data
const values = [
  {
    title: "Sustainability First",
    description: "We place environmental responsibility at the core of every decision and action.",
    icon: <Leaf className="w-10 h-10 text-primary" />
  },
  {
    title: "Innovation",
    description: "We constantly seek new technologies and approaches to advance clean energy solutions.",
    icon: <Lightbulb className="w-10 h-10 text-primary" />
  },
  {
    title: "Integrity",
    description: "We operate with honesty, transparency, and ethical standards in all our relationships.",
    icon: <Shield className="w-10 h-10 text-primary" />
  },
  {
    title: "Customer Success",
    description: "We measure our success by the positive impact we create for our customers.",
    icon: <HeartHandshake className="w-10 h-10 text-primary" />
  },
  {
    title: "Collaboration",
    description: "We believe in the power of teamwork and diverse perspectives to solve complex problems.",
    icon: <Users className="w-10 h-10 text-primary" />
  },
  {
    title: "Community Impact",
    description: "We're committed to creating positive change in the communities we serve.",
    icon: <Globe className="w-10 h-10 text-primary" />
  }
]

// FAQ data
const faqs = [
  {
    question: "What is the application process like?",
    answer: "Our hiring process typically involves an initial application review, a phone screening, 1-2 interviews (virtual or in-person), and for technical roles, a skills assessment. The entire process usually takes 2-3 weeks."
  },
  {
    question: "Do you offer internships or entry-level positions?",
    answer: "Yes! We believe in developing new talent. We offer internships year-round and have dedicated entry-level positions with training programs to help kickstart your career in renewable energy."
  },
  {
    question: "Is remote work available for all positions?",
    answer: "We offer remote work options for many roles, particularly in design, sales, and administrative functions. Field positions like installation technicians require on-site presence. Each job posting specifies the work arrangement."
  },
  {
    question: "What growth opportunities exist within the company?",
    answer: "We prioritize internal advancement and provide clear career paths. Regular performance reviews, mentorship programs, and educational opportunities support your professional development and advancement within LUMINEX."
  },
  {
    question: "I don't see a position that matches my skills. Can I still apply?",
    answer: "Absolutely! We welcome general applications from talented individuals passionate about renewable energy. Submit your resume to careers@luminex.com with a cover letter explaining your interest and how you could contribute."
  },
  {
    question: "What makes LUMINEX different from other solar companies?",
    answer: "Our innovative technology, commitment to quality, and focus on employee development set us apart. We're not just installing solar panels—we're building a movement toward energy independence while creating fulfilling careers for our team."
  }
]

// Team testimonials
const testimonials = [
  {
    name: "Anjali Perera",
    position: "Solar Design Engineer",
    years: "3 years at LUMINEX",
    quote: "Working at LUMINEX has given me the opportunity to apply my engineering skills to create real environmental impact. The collaborative culture and focus on innovation keeps me excited to come to work every day.",
    image: "/team-member1.jpg"
  },
  {
    name: "Dinesh Kumar",
    position: "Installation Team Lead",
    years: "5 years at LUMINEX",
    quote: "I've grown from an entry-level installer to leading my own team. LUMINEX invested in my technical training and leadership development, and I'm proud of the quality work we deliver to our customers.",
    image: "/team-member2.jpg"
  },
  {
    name: "Sarah Zhang",
    position: "Project Manager",
    years: "2 years at LUMINEX",
    quote: "The work-life balance at LUMINEX is exceptional. We're encouraged to take ownership of our projects while still having flexibility for our personal lives. It's a fast-paced environment with supportive leadership.",
    image: "/team-member3.jpg"
  }
]

export default function CareersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])
  
  // Filter jobs based on search and filters
  const filteredJobs = jobOpenings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.department.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = departmentFilter === "all" || job.department === departmentFilter
    const matchesLocation = locationFilter === "all" || job.location.includes(locationFilter)
    
    return matchesSearch && matchesDepartment && matchesLocation
  })
  
  const getDepartments = () => {
    const departments = new Set(jobOpenings.map(job => job.department))
    return Array.from(departments)
  }
  
  const getLocations = () => {
    const locations = new Set(jobOpenings.map(job => job.location.split(',')[0].trim()))
    return Array.from(locations)
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="relative h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden"
      >
        {/* Background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 to-background z-10" />
          <Image 
            src="/careers-hero.jpg" 
            alt="Team working together on solar solutions" 
            fill 
            className="object-cover brightness-[0.7]"
            priority
          />
        </div>
        
        <motion.div 
          className="container mx-auto px-4 text-center relative z-20"
          style={{ opacity, scale }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Badge className="mb-4 px-4 py-1.5 bg-primary text-white">Join Our Team</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Power Your Career <br className="hidden md:block" /> With Purpose
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
              At LUMINEX Engineering, we're not just building solar energy systems — we're building a sustainable future and meaningful careers.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                View Open Positions
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/20">
                Our Benefits
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <svg 
              width="40" 
              height="40" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="animate-bounce"
            >
              <path 
                d="M12 5V19M12 19L5 12M12 19L19 12" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </motion.div>
      </motion.section>
      
      {/* Company Stats */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <p className="text-4xl font-bold text-primary mb-2">150+</p>
              <p className="text-muted-foreground">Team Members</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <p className="text-4xl font-bold text-primary mb-2">25%</p>
              <p className="text-muted-foreground">Annual Growth</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <p className="text-4xl font-bold text-primary mb-2">4.8/5</p>
              <p className="text-muted-foreground">Employee Rating</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <p className="text-4xl font-bold text-primary mb-2">18%</p>
              <p className="text-muted-foreground">Internal Promotions</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Company Values */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 px-3 py-1.5 border-primary text-primary">Our Culture</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Guided by Purpose</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our values define who we are and how we work together to achieve our mission of accelerating the transition to sustainable energy.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-colors"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Open Positions */}
      <section id="open-positions" className="py-24 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 px-3 py-1.5 border-primary text-primary">Opportunities</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore current openings and find the perfect role to grow your career while making a positive impact on the environment.
            </p>
          </motion.div>
          
          {/* Search and Filters */}
          <div className="mb-12 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search positions..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {getDepartments().map((dept, index) => (
                      <SelectItem key={index} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {getLocations().map((loc, index) => (
                      <SelectItem key={index} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Showing {filteredJobs.length} of {jobOpenings.length} open positions
            </div>
          </div>
          
          {/* Job Listings */}
          <div className="space-y-6 max-w-4xl mx-auto">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden group hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl group-hover:text-primary transition-colors">{job.title}</CardTitle>
                          <CardDescription className="flex flex-wrap gap-2 mt-2">
                            <div className="flex items-center text-xs">
                              <BriefcaseBusiness className="h-3.5 w-3.5 mr-1" />
                              {job.department}
                            </div>
                            <div className="flex items-center text-xs">
                              <MapPin className="h-3.5 w-3.5 mr-1" />
                              {job.location}
                            </div>
                            <div className="flex items-center text-xs">
                              <Badge variant="outline" className="text-xs bg-primary/10 border-primary/20 text-primary">
                                {job.type}
                              </Badge>
                            </div>
                          </CardDescription>
                        </div>
                        <div>
                          <Badge variant="secondary" className="text-xs">
                            {job.posted}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{job.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10">
                          {job.experience}
                        </Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t border-border pt-4">
                      <Link href={`/careers/${job.id}`} className="w-full">
                        <Button className="w-full group" variant="outline">
                          <span>View Details</span>
                          <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="text-center p-12 border border-dashed border-border rounded-lg">
                <div className="flex justify-center mb-4">
                  <Search className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No positions found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("")
                    setDepartmentFilter("all")
                    setLocationFilter("all")
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Benefits */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 px-3 py-1.5 border-primary text-primary">Why Join Us</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              We Take Care of Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            At LUMINEX, we believe that our employees deserve the best. We offer competitive benefits that support your health, wealth, and work-life balance.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border rounded-xl p-8 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Application Process */}
      <section className="py-24 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 px-3 py-1.5 border-primary text-primary">How To Apply</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Hiring Process</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We've designed a straightforward process to help us find the right candidates and make your experience as smooth as possible.
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute h-full w-1 bg-primary/20 left-3.5 top-0 hidden sm:block"></div>
              
              {/* Timeline steps */}
              <div className="space-y-12">
                {[
                  {
                    icon: <Search className="w-5 h-5" />,
                    title: "Apply Online",
                    description: "Browse our openings and submit your application through our careers portal with your resume and cover letter."
                  },
                  {
                    icon: <Phone className="w-5 h-5" />,
                    title: "Initial Screening",
                    description: "Our talent team will review your application and conduct a brief phone screening to discuss your experience and expectations."
                  },
                  {
                    icon: <Users className="w-5 h-5" />,
                    title: "Team Interviews",
                    description: "Meet with the hiring manager and potential team members through video or in-person interviews to dive deeper into your qualifications."
                  },
                  {
                    icon: <Zap className="w-5 h-5" />,
                    title: "Skills Assessment",
                    description: "For technical roles, we may include a practical assessment to evaluate your expertise in a real-world context."
                  },
                  {
                    icon: <HeartHandshake className="w-5 h-5" />,
                    title: "Offer & Onboarding",
                    description: "Successful candidates receive a competitive offer and a comprehensive onboarding experience to set you up for success."
                  }
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex gap-6"
                  >
                    <div className="flex-shrink-0 relative">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center z-10 relative">
                        {step.icon}
                      </div>
                    </div>
                    <div className="-mt-1.5">
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 px-3 py-1.5 border-primary text-primary">Our People</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Meet The Team</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Hear directly from our team members about their experience working at LUMINEX Engineering.
            </p>
          </motion.div>
          
          <Tabs defaultValue="testimonial-0" className="max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-3 mb-8">
              {testimonials.map((_, index) => (
                <TabsTrigger key={index} value={`testimonial-${index}`}>
                  Team Member {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {testimonials.map((testimonial, index) => (
              <TabsContent key={index} value={`testimonial-${index}`}>
                <Card className="border-none shadow-lg">
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-5 gap-6">
                      <div className="md:col-span-2 relative h-full min-h-[300px]">
                        <Image 
                          src={testimonial.image || "https://via.placeholder.com/300x400?text=Team+Member"} 
                          alt={testimonial.name}
                          fill
                          className="object-cover md:rounded-l-lg"
                        />
                      </div>
                      <div className="p-8 md:col-span-3 flex flex-col justify-center">
                        <div className="mb-6 text-5xl text-primary">"</div>
                        <p className="text-lg mb-6 italic">
                          {testimonial.quote}
                        </p>
                        <div>
                          <h3 className="text-xl font-semibold">{testimonial.name}</h3>
                          <p className="text-primary">{testimonial.position}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.years}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
      
      {/* FAQs */}
      <section className="py-24 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 px-3 py-1.5 border-primary text-primary">Questions</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Find answers to common questions about working at LUMINEX Engineering.
            </p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <AccordionItem value={`faq-${index}`} className="border rounded-lg px-6">
                    <AccordionTrigger className="text-left py-4 hover:no-underline">
                      <span className="font-medium text-lg">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground pt-2 pb-4">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto bg-card rounded-2xl p-12 border border-border shadow-lg"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Ready to Join Our Mission?</h2>
              <p className="text-xl text-muted-foreground">
                Take the next step in your career and help us build a sustainable energy future.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                <Link href="#open-positions" className="flex items-center">
                  Browse Open Positions
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              
              <Button size="lg" variant="outline">
                <Link href="mailto:careers@luminex.com" className="flex items-center">
                  Contact Recruiting Team
                </Link>
              </Button>
            </div>
            
            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>Don't see the perfect fit? Send your resume to <span className="text-primary">careers@luminex.com</span></p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
