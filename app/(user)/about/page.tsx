"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sun, 
  Users, 
  History, 
  Target, 
  Award, 
  Lightbulb,
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  Folder,
  FileText,
  X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { WarpBackground } from "@/components/magicui/warp-background";

const AboutPage = () => {
  const [activeFolder, setActiveFolder] = useState<string | null>(null);

  const folderContent = {
    mission: {
      title: "Our Mission",
      icon: <Target className="h-8 w-8 text-primary" />,
      content: "To revolutionize energy consumption in Sri Lanka by providing sustainable, efficient, and affordable solar solutions that reduce carbon footprints and promote a greener future for generations to come."
    },
    vision: {
      title: "Our Vision",
      icon: <Lightbulb className="h-8 w-8 text-amber-500" />,
      content: "To be the leading solar energy provider in Sri Lanka, pioneering innovation in renewable energy technology and contributing significantly to the country's transition to clean energy."
    },
    history: {
      title: "Our History",
      icon: <History className="h-8 w-8 text-indigo-500" />,
      content: "Founded in 2018, Luminex Engineering began as a small team of passionate engineers dedicated to making solar energy accessible to everyone. Over the years, we've grown to become one of the most trusted names in renewable energy solutions in Sri Lanka, having completed over 500 installations nationwide."
    },
    values: {
      title: "Our Values",
      icon: <Award className="h-8 w-8 text-emerald-500" />,
      content: "Integrity, Innovation, Sustainability, and Customer Satisfaction form the cornerstones of our business philosophy. We believe in transparent dealings, cutting-edge solutions, environmentally responsible practices, and exceeding customer expectations."
    },
    team: {
      title: "Our Team",
      icon: <Users className="h-8 w-8 text-blue-500" />,
      content: "Our diverse team comprises highly skilled engineers, technicians, designers, and customer support specialists who collaborate seamlessly to deliver exceptional solar solutions. Each member brings unique expertise and shares a common passion for renewable energy."
    }
  };

  const toggleFolder = (key: string) => {
    if (activeFolder === key) {
      setActiveFolder(null);
    } else {
      setActiveFolder(key);
    }
  };

  const achievements = [
    { number: "500+", label: "Installations" },
    { number: "98%", label: "Customer Satisfaction" },
    { number: "5000+", label: "Tonnes of CO₂ Saved" },
    { number: "25+", label: "Industry Awards" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <WarpBackground className="py-20 px-4 md:px-8 lg:px-16">
          <div className="max-w-6xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">About Luminex Engineering</Badge>
            <SparklesText
              text="Powering Sri Lanka's Solar Future"
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
              colors={{ first: "#22c55e", second: "#3b82f6" }}
            />
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Sri Lanka's premier solar solutions provider committed to sustainable energy and environmental stewardship.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="rounded-full">
                Contact Us
              </Button>
              <Button size="lg" variant="outline" className="rounded-full">
                Our Projects
              </Button>
            </div>
          </div>
        </WarpBackground>
      </section>

      {/* Company Overview Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Pioneering Solar Excellence Since 2018</h2>
              <p className="text-lg text-muted-foreground mb-6">
                At Luminex Engineering, we believe in harnessing the power of the sun to create a sustainable future. Our team of expert engineers and technicians specialize in designing and implementing customized solar solutions for residential, commercial, and industrial needs.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                We pride ourselves on quality workmanship, cutting-edge technology, and exceptional customer service. Our mission is to make renewable energy accessible and affordable for everyone in Sri Lanka.
              </p>
              <div className="grid grid-cols-2 gap-6 mt-10">
                {achievements.map((item, index) => (
                  <div key={index} className="text-center p-4 rounded-lg border bg-card shadow-sm">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <h3 className="text-3xl font-bold text-primary mb-2">{item.number}</h3>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl"
            >
              <Image
                src="/images/solar-installation.jpg"
                alt="Solar installation by Luminex Engineering"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Folder Cards Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Discover Our Story</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Click on each folder to learn more about different aspects of Luminex Engineering
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(folderContent).map(([key, { title, icon }]) => (
              <motion.div 
                key={key}
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative"
              >
                <Card 
                  className={`h-full cursor-pointer transition-all duration-300 transform ${activeFolder === key ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => toggleFolder(key)}
                >
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-primary/10 p-3">
                        {icon}
                      </div>
                      <CardTitle>{title}</CardTitle>
                    </div>
                    <Folder className={`h-6 w-6 transition-colors ${activeFolder === key ? 'text-primary' : 'text-muted-foreground'}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Click to {activeFolder === key ? 'close' : 'open'}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${activeFolder === key ? 'rotate-180' : ''}`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Expanded Folder View */}
          <AnimatePresence>
            {activeFolder && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  className="bg-card rounded-xl shadow-2xl max-w-2xl w-full relative overflow-hidden border"
                >
                  <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center space-x-4">
                      {folderContent[activeFolder as keyof typeof folderContent].icon}
                      <h3 className="text-2xl font-bold">{folderContent[activeFolder as keyof typeof folderContent].title}</h3>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setActiveFolder(null)}
                      className="rounded-full hover:bg-destructive/10"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start space-x-4 mb-6">
                      <FileText className="h-6 w-6 text-muted-foreground mt-1" />
                      <p className="text-lg leading-relaxed">
                        {folderContent[activeFolder as keyof typeof folderContent].content}
                      </p>
                    </div>
                    {activeFolder === 'team' && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
                        {[1, 2, 3, 4, 5, 6].map((member) => (
                          <div key={member} className="text-center">
                            <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-3"></div>
                            <h4 className="font-medium">Team Member {member}</h4>
                            <p className="text-sm text-muted-foreground">Position</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-muted/30 border-t flex justify-end">
                    <Button onClick={() => setActiveFolder(null)}>Close</Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive solar solutions tailored to your specific needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Residential Solar",
                description: "Custom solar panel installations for homes of all sizes",
                icon: <Sun className="h-10 w-10 text-primary" />
              },
              {
                title: "Commercial Solutions",
                description: "Large-scale solar installations for businesses and organizations",
                icon: <Sun className="h-10 w-10 text-primary" />
              },
              {
                title: "Maintenance & Support",
                description: "Ongoing maintenance and technical support for all installations",
                icon: <Sun className="h-10 w-10 text-primary" />
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mb-4">{service.icon}</div>
                    <CardTitle>{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{service.description}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Learn More</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
            </div>
          </div>
        </section>
  
        {/* Timeline Section */}
        <section className="py-20 px-4 md:px-8 lg:px-16 bg-primary/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From humble beginnings to industry leadership
              </p>
            </div>
  
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/30 rounded-full" />
              
              {/* Timeline Items */}
              {[
                {
                  year: "2018",
                  title: "Founding",
                  description: "Luminex Engineering was established with a vision to revolutionize solar energy in Sri Lanka."
                },
                {
                  year: "2019",
                  title: "First Major Project",
                  description: "Completed our first large-scale commercial installation for a leading manufacturing facility."
                },
                {
                  year: "2020",
                  title: "Expansion",
                  description: "Expanded our team and opened a new office in Colombo to better serve our growing customer base."
                },
                {
                  year: "2021",
                  title: "Innovation Award",
                  description: "Received the National Renewable Energy Innovation Award for our custom solar solutions."
                },
                {
                  year: "2022",
                  title: "500th Installation",
                  description: "Celebrated our 500th successful solar installation across Sri Lanka."
                },
                {
                  year: "2023",
                  title: "Today",
                  description: "Continuing to lead the solar revolution with cutting-edge technology and unwavering commitment."
                }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center justify-between mb-12 ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  } md:flex-row`}
                >
                  <div className={`hidden md:block w-5/12 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    {index % 2 === 0 ? (
                      <>
                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </>
                    ) : (
                      <div className="font-bold text-4xl text-primary/80">{item.year}</div>
                    )}
                  </div>
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-background" />
                    </div>
                  </div>
                  
                  <div className={`hidden md:block w-5/12 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                    {index % 2 === 0 ? (
                      <div className="font-bold text-4xl text-primary/80">{item.year}</div>
                    ) : (
                      <>
                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </>
                    )}
                  </div>
                  
                  {/* Mobile view */}
                  <div className="md:hidden flex flex-col w-full ml-8">
                    <div className="font-bold text-2xl text-primary/80 mb-1">{item.year}</div>
                    <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
  
        {/* Testimonials Section */}
        <section className="py-20 px-4 md:px-8 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Hear from homeowners and businesses who have made the switch to solar with Luminex
              </p>
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Aruna Perera",
                  role: "Homeowner",
                  image: "/testimonials/person1.jpg",
                  quote: "The team at Luminex Engineering made the entire process of installing solar panels on my home incredibly simple. From initial consultation to final installation, everything was handled professionally."
                },
                {
                  name: "Royal Palm Hotels",
                  role: "Business Client",
                  image: "/testimonials/company1.jpg",
                  quote: "Switching to solar with Luminex has significantly reduced our energy costs while aligning with our sustainability goals. The ROI has been impressive, and the system performs flawlessly."
                },
                {
                  name: "Dilshan Fernando",
                  role: "Estate Owner",
                  image: "/testimonials/person2.jpg",
                  quote: "After researching several solar companies, I chose Luminex for their reputation and expertise. They delivered a custom solution for my estate that has exceeded my expectations in every way."
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full">
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-muted overflow-hidden relative">
                          {/* This would be an actual image in production */}
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10" />
                        </div>
                        <div>
                          <h4 className="font-medium">{testimonial.name}</h4>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                      <p className="italic text-muted-foreground">"{testimonial.quote}"</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
  
        {/* Values and Benefits Section */}
        <section className="py-20 px-4 md:px-8 lg:px-16 bg-card">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Why Choose Luminex?</h2>
                <ul className="space-y-6">
                  {[
                    {
                      title: "Expert Engineering",
                      description: "Our team consists of certified engineers with extensive experience in solar technology",
                      icon: <Award className="h-6 w-6 text-primary" />
                    },
                    {
                      title: "Quality Materials",
                      description: "We use only high-grade, durable components from trusted manufacturers",
                      icon: <Award className="h-6 w-6 text-primary" />
                    },
                    {
                      title: "Customized Solutions",
                      description: "Each installation is tailored to the specific needs and conditions of your property",
                      icon: <Award className="h-6 w-6 text-primary" />
                    },
                    {
                      title: "Ongoing Support",
                      description: "We provide maintenance, monitoring, and support long after installation is complete",
                      icon: <Award className="h-6 w-6 text-primary" />
                    }
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex"
                    >
                      <div className="mr-4 mt-1">{item.icon}</div>
                      <div>
                        <h3 className="text-lg font-medium">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-background rounded-xl p-8 shadow-lg border"
              >
                <h3 className="text-2xl font-bold mb-6 text-center">Benefits of Solar Energy</h3>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    {
                      title: "Reduce Bills",
                      description: "Lower your electricity bills significantly",
                      icon: <Sun className="h-8 w-8 text-amber-500" />
                    },
                    {
                      title: "Clean Energy",
                      description: "Zero emissions and environmentally friendly",
                      icon: <Sun className="h-8 w-8 text-green-500" />
                    },
                    {
                      title: "Energy Independence",
                      description: "Reduce dependency on the power grid",
                      icon: <Sun className="h-8 w-8 text-blue-500" />
                    },
                    {
                      title: "Increase Property Value",
                      description: "Solar installations add value to your property",
                      icon: <Sun className="h-8 w-8 text-purple-500" />
                    }
                  ].map((benefit, index) => (
                    <div key={index} className="text-center p-4">
                      <div className="mx-auto mb-4 bg-primary/10 rounded-full p-3 w-fit">
                        {benefit.icon}
                      </div>
                      <h4 className="font-medium mb-2">{benefit.title}</h4>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
  
        {/* CTA Section */}
        <section className="py-20 px-4 md:px-8 lg:px-16 bg-primary/5">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 md:p-12 shadow-lg border text-center"
            >
              <h2 className="text-3xl font-bold mb-4">Ready to Make the Switch to Solar?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Contact us today for a free consultation and estimate. Our team is ready to design the perfect solar solution for your needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="rounded-full">
                  Get a Free Quote
                </Button>
                <Button size="lg" variant="outline" className="rounded-full">
                  View Our Projects
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
  
        {/* Contact Info Section */}
        <section className="py-20 px-4 md:px-8 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-primary" />
                    Visit Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    123 Solar Avenue<br />
                    Colombo 00700<br />
                    Sri Lanka
                  </p>
                </CardContent>
              </Card>
              
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-primary" />
                    Call Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    +94 11 234 5678<br />
                    Mon-Fri: 8:30AM - 5:30PM<br />
                    Sat: 9:00AM - 1:00PM
                  </p>
                </CardContent>
              </Card>
              
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-primary" />
                    Email Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    info@luminexengineering.com<br />
                    support@luminexengineering.com<br />
                    sales@luminexengineering.com
                  </p>
                </CardContent>
              </Card>
              </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-primary/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">
              Get answers to common questions about solar energy and our services
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "How much does a solar installation cost?",
                answer: "The cost of solar installation varies based on the size of your property, energy requirements, and the type of system. We provide a free consultation and detailed quote to give you an accurate estimate for your specific needs."
              },
              {
                question: "How long does installation take?",
                answer: "A typical residential installation can be completed in 2-3 days, while commercial projects may take 1-2 weeks depending on size and complexity. We ensure minimal disruption to your daily activities during the installation process."
              },
              {
                question: "What maintenance do solar panels require?",
                answer: "Solar panels require minimal maintenance. Regular cleaning to remove dust and debris, and occasional professional inspection is recommended. We offer maintenance packages to ensure your system continues to operate at peak efficiency."
              },
              {
                question: "What happens during power outages?",
                answer: "Standard grid-tied systems will shut down during a power outage for safety reasons. If you want backup power during outages, we can include battery storage in your system design."
              },
              {
                question: "How long do solar panels last?",
                answer: "Our solar panels come with a 25-year performance warranty and typically last 30+ years. The inverter may need replacement after 15-20 years, but overall, solar systems are very durable and long-lasting."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground"
          >
            <div className="absolute inset-0 bg-[url('/solar-pattern.svg')] opacity-10" />
            <div className="relative z-10 p-12 md:p-16 lg:p-20 flex flex-col items-center text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Your Solar Journey Today</h2>
              <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mb-8">
                Join thousands of satisfied customers who have made the switch to clean, renewable solar energy with Luminex Engineering.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="secondary" className="rounded-full">
                  Schedule a Free Consultation
                </Button>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground rounded-full">
                    Contact Our Team
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-10 px-4 md:px-8 lg:px-16 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="mb-2 flex justify-center">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm font-medium">ISO Certified</p>
            </div>
            <div className="text-center">
              <div className="mb-2 flex justify-center">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm font-medium">5-Star Rated</p>
            </div>
            <div className="text-center">
              <div className="mb-2 flex justify-center">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm font-medium">Licensed & Insured</p>
            </div>
            <div className="text-center">
              <div className="mb-2 flex justify-center">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm font-medium">10+ Years Experience</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
  