"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sun, 
  Search, 
  Filter, 
  Map, 
  Calendar, 
  Users, 
  Home, 
  Building2, 
  Factory, 
  FileDown,
  Zap,
  PanelRight,
  X,
  ArrowRight,
  CheckCircle2,
  Clock,
  Tag,
  Banknote,
  Lightbulb,
  FileCheck,
  List
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { WarpBackground } from "@/components/magicui/warp-background";

// Sample project data - in a real app, this would come from an API
const SAMPLE_PROJECTS: ProjectData[] = [
  {
    _id: "p001",
    projectId: "LUM-RES-2023-001",
    name: "Perera Residence Solar Installation",
    customer: {
      name: "Aruna Perera",
      email: "aruna@example.com",
      contact: "+94 71 234 5678",
      address: "42 Palm Drive, Colombo",
      district: "Colombo"
    },
    status: "completed" as const,
    type: "residential",
    capacity: "5 kW",
    installationDate: "2023-04-15",
    completionDate: "2023-04-18",
    location: "Colombo",
    cost: 1250000,
    description: "A 5kW solar system installation for a modern residence in Colombo, featuring premium panels with battery backup.",
    features: ["Battery Backup", "Smart Monitoring", "Premium Panels"],
    documents: {
      contract: true,
      technicalSpecification: true,
      siteAssessment: true,
      permits: true,
      warranty: true
    },
    images: ["/projects/project1-1.jpg", "/projects/project1-2.jpg", "/projects/project1-3.jpg"]
  },
  {
    _id: "p002",
    projectId: "LUM-COM-2023-002",
    name: "Royal Palm Hotel Solar Power System",
    customer: {
      name: "Royal Palm Hotels",
      email: "operations@royalpalm.com",
      contact: "+94 11 234 5678",
      address: "220 Ocean Road, Negombo",
      district: "Gampaha"
    },
    status: "completed",
    type: "commercial",
    capacity: "50 kW",
    installationDate: "2023-06-10",
    completionDate: "2023-06-30",
    location: "Negombo",
    cost: 12500000,
    description: "Large-scale 50kW installation for a luxury beachfront hotel, providing significant energy cost savings and eco-friendly credentials.",
    features: ["Grid-Tied System", "Energy Monitoring Dashboard", "Premium Efficiency Panels"],
    documents: {
      contract: true,
      technicalSpecification: true,
      siteAssessment: true,
      permits: true,
      warranty: true
    },
    images: ["/projects/project2-1.jpg", "/projects/project2-2.jpg"]
  },
  {
    _id: "p003",
    projectId: "LUM-IND-2023-003",
    name: "Lanka Textiles Factory Solar Solution",
    customer: {
      name: "Lanka Textiles Ltd",
      email: "info@lankatextiles.com",
      contact: "+94 77 876 5432",
      address: "120 Industrial Zone, Katunayake",
      district: "Gampaha"
    },
    status: "in-progress" as const,
    type: "industrial",
    capacity: "200 kW",
    installationDate: "2023-09-01",
    completionDate: null,
    location: "Katunayake",
    cost: 45000000,
    description: "Massive 200kW industrial installation to power manufacturing operations, reducing carbon footprint and operational costs.",
    features: ["Custom Mounting System", "Industrial Inverters", "Production Integration"],
    documents: {
      contract: true,
      technicalSpecification: true,
      siteAssessment: true,
      permits: true,
      warranty: false
    },
    images: ["/projects/project3-1.jpg"]
  },
  {
    _id: "p004",
    projectId: "LUM-RES-2023-004",
    name: "Silva Family Home Solar System",
    customer: {
      name: "Dilshan Silva",
      email: "dilshan@example.com",
      contact: "+94 76 543 2109",
      address: "15 Hill View Road, Kandy",
      district: "Kandy"
    },
    status: "completed",
    type: "residential",
    capacity: "8 kW",
    installationDate: "2023-05-20",
    completionDate: "2023-05-23",
    location: "Kandy",
    cost: 1950000,
    description: "High-capacity residential installation with battery backup for a large family home in the hills of Kandy.",
    features: ["Battery Backup", "Premium Panels", "Expandable System"],
    documents: {
      contract: true,
      technicalSpecification: true,
      siteAssessment: true,
      permits: true,
      warranty: true
    },
    images: ["/projects/project4-1.jpg", "/projects/project4-2.jpg"]
  },
  {
    _id: "p005",
    projectId: "LUM-COM-2023-005",
    name: "Green Valley Shopping Mall",
    customer: {
      name: "Green Valley Developments",
      email: "projects@greenvalley.com",
      contact: "+94 11 987 6543",
      address: "100 Commerce Street, Colombo",
      district: "Colombo"
    },
    status: "planning" as const,
    type: "commercial",
    capacity: "75 kW",
    installationDate: null,
    completionDate: null,
    location: "Colombo",
    cost: 18750000,
    description: "Upcoming project for a new eco-friendly shopping mall, featuring rooftop solar installation with visitor education displays.",
    features: ["Visitor Display System", "High Efficiency Panels", "Public Charging Stations"],
    documents: {
      contract: true,
      technicalSpecification: true,
      siteAssessment: true,
      permits: false,
      warranty: false
    },
    images: ["/projects/project5-1.jpg"]
  },
  {
    _id: "p006",
    projectId: "LUM-RES-2023-006",
    name: "Fernando Estate Solar System",
    customer: {
      name: "Rajitha Fernando",
      email: "rajitha@example.com",
      contact: "+94 70 123 4567",
      address: "8 Estate Road, Nuwara Eliya",
      district: "Nuwara Eliya"
    },
    status: "completed",
    type: "residential",
    capacity: "12 kW",
    installationDate: "2023-03-10",
    completionDate: "2023-03-18",
    location: "Nuwara Eliya",
    cost: 2800000,
    description: "Large estate solar installation with multiple array locations and central battery storage system.",
    features: ["Multi-Array Setup", "Advanced Battery Storage", "Weather-Resistant Design"],
    documents: {
      contract: true,
      technicalSpecification: true,
      siteAssessment: true,
      permits: true,
      warranty: true
    },
    images: ["/projects/project6-1.jpg", "/projects/project6-2.jpg"]
  }
];

// Type definition for project data
interface Customer {
  name: string;
  email: string;
  contact: string;
  address: string;
  district: string;
}

interface ProjectData {
  _id: string;
  projectId: string;
  name: string;
  customer: Customer;
  status: 'planning' | 'in-progress' | 'completed';
  type: 'residential' | 'commercial' | 'industrial';
  capacity: string;
  installationDate: string | null;
  completionDate: string | null;
  location: string;
  cost: number;
  description: string;
  features: string[];
  documents: Record<string, boolean>;
  images: string[];
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<ProjectData[]>(SAMPLE_PROJECTS);
  const [filteredProjects, setFilteredProjects] = useState<ProjectData[]>(SAMPLE_PROJECTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    type: "all",
    status: "all",
    location: "all"
  });
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  // Filter projects based on search term and active filters
  useEffect(() => {
    let filtered = projects;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.projectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply type filter
    if (activeFilters.type !== "all") {
      filtered = filtered.filter(project => project.type === activeFilters.type);
    }
    
    // Apply status filter
    if (activeFilters.status !== "all") {
      filtered = filtered.filter(project => project.status === activeFilters.status);
    }
    
    // Apply location filter
    if (activeFilters.location !== "all") {
      filtered = filtered.filter(project => project.location === activeFilters.location);
    }
    
    setFilteredProjects(filtered);
  }, [searchTerm, activeFilters, projects]);

  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };
  
  // Get unique locations for filter
  const locations = Array.from(new Set(projects.map(project => project.location)));

  // Function to get status badge style
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200"><CheckCircle2 className="mr-1 h-3 w-3" /> Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200"><Clock className="mr-1 h-3 w-3" /> In Progress</Badge>;
      case 'planning':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200"><Clock className="mr-1 h-3 w-3" /> Planning</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Function to get project type icon
  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'residential':
        return <Home className="h-5 w-5" />;
      case 'commercial':
        return <Building2 className="h-5 w-5" />;
      case 'industrial':
        return <Factory className="h-5 w-5" />;
      default:
        return <Sun className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <WarpBackground className="py-16 px-4 md:px-8 lg:px-16">
          <div className="max-w-6xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">Our Solar Projects</Badge>
            <SparklesText
              text="Transforming Sri Lanka With Solar Power"
              className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6"
              colors={{ first: "#22c55e", second: "#3b82f6" }}
            />
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Explore our portfolio of successful solar installations across residential, commercial, and industrial sectors.
            </p>
          </div>
        </WarpBackground>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 md:px-8 lg:px-16 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { label: "Total Projects", value: "60+", icon: <Sun className="h-10 w-10 text-primary" /> },
              { label: "Kilowatts Installed", value: "750+", icon: <Zap className="h-10 w-10 text-amber-500" /> },
              { label: "Districts Covered", value: "15", icon: <Map className="h-10 w-10 text-blue-500" /> },
              { label: "CO₂ Reduction", value: "5,000+ Tonnes", icon: <Lightbulb className="h-10 w-10 text-green-500" /> }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-lg p-6 text-center shadow-sm border"
              >
                <div className="mx-auto w-fit mb-3 bg-primary/10 p-3 rounded-full">{stat.icon}</div>
                <h3 className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</h3>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter and Search Section */}
      <section className="py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-xl p-6 border shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search projects by name, ID or location..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap md:flex-nowrap gap-2">
                <div className="w-full md:w-auto">
                  <Select onValueChange={(value) => handleFilterChange("type", value)} defaultValue="all">
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Project Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-auto">
                  <Select onValueChange={(value) => handleFilterChange("status", value)} defaultValue="all">
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-auto">
                  <Select onValueChange={(value) => handleFilterChange("location", value)} defaultValue="all">
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {locations.map(location => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Tabs for different project views */}
            <Tabs defaultValue="grid" className="w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'} {activeFilters.type !== 'all' ? `- ${activeFilters.type}` : ''}
                </h2>
                <TabsList>
                  <TabsTrigger value="grid" className="flex items-center gap-1">
                    <PanelRight className="h-4 w-4" /> Grid
                  </TabsTrigger>
                  <TabsTrigger value="list" className="flex items-center gap-1">
                    <List className="h-4 w-4" /> List
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Grid View */}
              <TabsContent value="grid" className="mt-0">
                {filteredProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                      <motion.div
                        key={project._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="h-full"
                      >
                        <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                          <div className="relative h-48 bg-muted">
                            {/* Placeholder for project image - in production use actual images */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5"></div>
                            <div className="absolute top-3 left-3">
                              {getStatusBadge(project.status)}
                            </div>
                            <div className="absolute top-3 right-3">
                              <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                                {project.capacity}
                              </Badge>
                            </div>
                          </div>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">{project.name}</CardTitle>
                              <div className="bg-primary/10 p-1.5 rounded">
                                {getTypeIcon(project.type)}
                              </div>
                            </div>
                            <CardDescription>{project.projectId}</CardDescription>
                          </CardHeader>
                          <CardContent className="pb-2 flex-grow">
                            <div className="flex items-center text-sm text-muted-foreground mb-2">
                              <Map className="h-4 w-4 mr-1" /> {project.location}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {project.description}
                            </p>
                          </CardContent>
                          <CardFooter className="flex justify-between pt-2 border-t mt-auto">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedProject(project)}
                            >
                              View Details
                            </Button>
                            
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-muted/30 rounded-lg">
                    <div className="mx-auto w-fit mb-4 bg-muted p-4 rounded-full">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No projects found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filters</p>
                  </div>
                )}
              </TabsContent>

              {/* List View */}
              <TabsContent value="list" className="mt-0">
                <div className="border rounded-lg overflow-hidden">
                  {filteredProjects.length > 0 ? (
                    <div className="divide-y">
                      {filteredProjects.map((project) => (
                        <motion.div
                          key={project._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="p-4 hover:bg-muted/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-grow">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="bg-primary/10 p-1 rounded">
                                  {getTypeIcon(project.type)}
                                </div>
                                <h3 className="font-medium">{project.name}</h3>
                                {getStatusBadge(project.status)}
                              </div>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                <span className="flex items-center">
                                  <Tag className="h-3 w-3 mr-1" /> {project.projectId}
                                </span>
                                <span className="flex items-center">
                                  <Map className="h-3 w-3 mr-1" /> {project.location}
                                </span>
                                <span className="flex items-center">
                                  <Zap className="h-3 w-3 mr-1" /> {project.capacity}
                                </span>
                                {project.completionDate && (
                                  <span className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" /> Completed: {new Date(project.completionDate).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 self-end md:self-auto">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setSelectedProject(project)}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="mx-auto w-fit mb-4 bg-muted p-4 rounded-full">
                        <Search className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No projects found</h3>
                      <p className="text-muted-foreground">Try adjusting your search or filters</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-card rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-card border-b">
                <div className="flex items-center">
                  <div className="mr-3 bg-primary/10 p-1.5 rounded">
                    {getTypeIcon(selectedProject.type)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedProject.name}</h2>
                    <p className="text-sm text-muted-foreground">{selectedProject.projectId}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setSelectedProject(null)}
                  className="rounded-full hover:bg-destructive/10"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3">Project Overview</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/30 p-3 rounded-lg">
                          <p className="text-xs text-muted-foreground">Status</p>
                          <div className="mt-1">{getStatusBadge(selectedProject.status)}</div>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-lg">
                          <p className="text-xs text-muted-foreground">Type</p>
                          <p className="font-medium flex items-center mt-1">
                            {selectedProject.type.charAt(0).toUpperCase() + selectedProject.type.slice(1)}
                            <span className="ml-2">{getTypeIcon(selectedProject.type)}</span>
                          </p>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-lg">
                          <p className="text-xs text-muted-foreground">Capacity</p>
                          <p className="font-medium flex items-center mt-1">
                            {selectedProject.capacity}
                            <Zap className="ml-2 h-4 w-4 text-amber-500" />
                          </p>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-lg">
                          <p className="text-xs text-muted-foreground">Location</p>
                          <p className="font-medium flex items-center mt-1">
                            {selectedProject.location}
                            <Map className="ml-2 h-4 w-4 text-blue-500" />
                          </p>
                        </div>
                        {selectedProject.cost && (
                          <div className="bg-muted/30 p-3 rounded-lg col-span-2">
                            <p className="text-xs text-muted-foreground">Project Value</p>
                            <p className="font-medium flex items-center mt-1">
                              LKR {selectedProject.cost.toLocaleString()}
                              <Banknote className="ml-2 h-4 w-4 text-green-500" />
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3">Timeline</h3>
                      <div className="space-y-4">
                        {selectedProject.installationDate && (
                          <div className="flex">
                            <div className="mr-3 h-full">
                              <div className="w-4 h-4 rounded-full bg-primary"></div>
                              <div className="w-0.5 h-full bg-primary/30 ml-2"></div>
                            </div>
                            <div>
                              <p className="font-medium">Installation Started</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(selectedProject.installationDate).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                        )}
                        {selectedProject.completionDate ? (
                          <div className="flex">
                            <div className="mr-3">
                              <div className="w-4 h-4 rounded-full bg-green-500"></div>
                            </div>
                            <div>
                              <p className="font-medium">Project Completed</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(selectedProject.completionDate).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex">
                            <div className="mr-3">
                              <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                            </div>
                            <div>
                              <p className="font-medium">Estimated Completion</p>
                              <p className="text-sm text-muted-foreground">In Progress</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">Client</h3>
                      <Card>
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs text-muted-foreground">Client Name</p>
                              <p className="font-medium">{selectedProject.customer.name}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Location</p>
                              <p className="font-medium">{selectedProject.customer.district}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div>
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3">Project Description</h3>
                      <p className="text-muted-foreground">{selectedProject.description}</p>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3">Key Features</h3>
                      <ul className="space-y-2">
                        {selectedProject.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">Documentation</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(selectedProject.documents).map(([doc, isAvailable]) => (
                          <div 
                            key={doc}
                            className={`p-3 rounded-lg border flex items-center ${
                              isAvailable ? 'bg-primary/10 border-primary/20' : 'bg-muted border-muted-foreground/20'
                            }`}
                          >
                            <div className={`mr-3 p-1.5 rounded-full ${isAvailable ? 'bg-primary/20' : 'bg-muted-foreground/20'}`}>
                              <FileCheck className={`h-4 w-4 ${isAvailable ? 'text-primary' : 'text-muted-foreground'}`} />
                            </div>
                            <div>
                              <p className={`text-sm font-medium ${!isAvailable && 'text-muted-foreground'}`}>
                                {doc.split(/(?=[A-Z])/).join(' ')}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {isAvailable ? 'Available' : 'Pending'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-medium mb-4">Project Gallery</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {/* In production, use actual images here */}
                    {[1, 2, 3].map((img) => (
                      <div key={img} className="aspect-video bg-muted rounded-md relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Featured Projects Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover some of our most impactful solar installations across Sri Lanka
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Featured Project 1 */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-card rounded-xl overflow-hidden border shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="aspect-square md:aspect-auto relative bg-muted">
                  {/* Placeholder for project image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5"></div>
                </div>
                <div className="p-6">
                  <Badge className="mb-2">{SAMPLE_PROJECTS[1].type}</Badge>
                  <h3 className="text-xl font-bold mb-2">{SAMPLE_PROJECTS[1].name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{SAMPLE_PROJECTS[1].description}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm">
                      <Zap className="h-4 w-4 mr-2 text-amber-500" />
                      <span>Capacity: {SAMPLE_PROJECTS[1].capacity}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Map className="h-4 w-4 mr-2 text-blue-500" />
                      <span>Location: {SAMPLE_PROJECTS[1].location}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full">View Project Details</Button>
                </div>
              </div>
            </motion.div>

            {/* Featured Project 2 */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-card rounded-xl overflow-hidden border shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="aspect-square md:aspect-auto relative bg-muted">
                  {/* Placeholder for project image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5"></div>
                </div>
                <div className="p-6">
                  <Badge className="mb-2">{SAMPLE_PROJECTS[2].type}</Badge>
                  <h3 className="text-xl font-bold mb-2">{SAMPLE_PROJECTS[2].name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{SAMPLE_PROJECTS[2].description}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm">
                      <Zap className="h-4 w-4 mr-2 text-amber-500" />
                      <span>Capacity: {SAMPLE_PROJECTS[2].capacity}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Map className="h-4 w-4 mr-2 text-blue-500" />
                      <span>Location: {SAMPLE_PROJECTS[2].location}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full">View Project Details</Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 shadow-lg relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('/solar-pattern.svg')] opacity-10"></div>
            <div className="relative z-10 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Your Solar Project?</h2>
              <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                Whether you're looking for a residential installation or a large-scale commercial solution, our team of experts is ready to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="rounded-full">
                  Request a Free Quote
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
    </div>
  );
};

export default ProjectsPage;
