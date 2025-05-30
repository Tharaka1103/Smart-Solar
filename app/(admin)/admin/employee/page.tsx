'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  Eye,
  DollarSign,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Undo2,
  Upload,
  FileText,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast-undo';
import { Badge } from "@/components/ui/badge";
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

// Define employee roles
const employeeRoles = [
  'Manager', 
  'Engineer', 
  'Technician', 
  'Sales Representative', 
  'Customer Support', 
  'Administrative Staff',
  'Accountant'
];

// Employee form schema
const employeeSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  role: z.string({ required_error: "Please select a role" }),
  contact: z.string().regex(/^[+\d-]+$/, { message: "Contact number can only contain numbers and + or - symbols" }).min(10, { message: "Contact number must be at least 10 digits" }),
  address: z.string().min(5, { message: "Address is required" }),
  dailyRate: z.coerce.number().min(1, { message: "Daily rate must be at least 1" }),
  bankDetails: z.object({
    accountNumber: z.string().optional(),
    bankName: z.string().optional(),
    branch: z.string().optional(),
    nameOnAccount: z.string().optional()
  }).optional()
});

type Employee = {
  _id: string;
  name: string;
  email: string;
  role: string;
  contact: string;
  address: string;
  dailyRate: number;
  joiningDate: string;
  bankDetails?: {
    accountNumber?: string;
    bankName?: string;
    branch?: string;
    nameOnAccount?: string;
  };
  documents?: Array<{
    _id: string;
    fileName: string;
    originalName: string;
    fileType: string;
    fileSize: number;
    uploadedAt: string;
    description?: string;
  }>;
  isDeleted?: boolean;
  deletedAt?: string;
};

type UploadFile = {
  file: File;
  description: string;
  id: string;
};

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [deletedEmployees, setDeletedEmployees] = useState<Set<string>>(new Set());
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Employee form
  const employeeForm = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: '',
      email: '',
      role: '',
      contact: '',
      address: '',
      dailyRate: 0,
      bankDetails: {
        accountNumber: '',
        bankName: '',
        branch: '',
        nameOnAccount: ''
      }
    }
  });
  
  // Load employees
  useEffect(() => {
    fetchEmployees();
  }, []);
  
  // Filter employees when search query or tab changes
  useEffect(() => {
    if (employees.length > 0) {
      let filtered = employees.filter(emp => !deletedEmployees.has(emp._id));
      
      // Apply role filter
      if (activeTab !== 'all') {
        filtered = filtered.filter(emp => emp.role === activeTab);
      }
      
      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(emp => 
          emp.name.toLowerCase().includes(query) || 
          emp.email.toLowerCase().includes(query) ||
          emp.contact.includes(query)
        );
      }
      
      setFilteredEmployees(filtered);
    }
  }, [employees, searchQuery, activeTab, deletedEmployees]);
  
  // Fetch all employees
  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/employees');
      if (!response.ok) throw new Error('Failed to fetch employees');
      
      const data = await response.json();
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: "Error",
        description: "Failed to load employees. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 10MB limit`,
          variant: "destructive"
        });
        return;
      }

      const newUploadFile: UploadFile = {
        file,
        description: '',
        id: Math.random().toString(36).substr(2, 9)
      };

      setUploadFiles(prev => [...prev, newUploadFile]);
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove upload file
  const removeUploadFile = (id: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id));
  };

  // Update file description
  const updateFileDescription = (id: string, description: string) => {
    setUploadFiles(prev => prev.map(f => 
      f.id === id ? { ...f, description } : f
    ));
  };

  // Upload documents for employee
  const uploadDocuments = async (employeeId: string) => {
    if (uploadFiles.length === 0) return;

    setIsUploading(true);
    const uploadPromises = uploadFiles.map(async (uploadFile) => {
      const formData = new FormData();
      formData.append('file', uploadFile.file);
      formData.append('description', uploadFile.description);

      const response = await fetch(`/api/employees/${employeeId}/documents`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to upload ${uploadFile.file.name}`);
      }

      return response.json();
    });

    try {
      await Promise.all(uploadPromises);
      toast({
        title: "Success",
        description: `${uploadFiles.length} document(s) uploaded successfully`,
      });
      setUploadFiles([]);
    } catch (error: any) {
      console.error('Error uploading documents:', error);
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload some documents",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  // Handle employee form submission (create/update)
  const onEmployeeSubmit = async (data: z.infer<typeof employeeSchema>) => {
    try {
      let response;
      
      if (selectedEmployee) {
        // Update existing employee
        response = await fetch(`/api/employees/${selectedEmployee._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } else {
        // Create new employee
        response = await fetch('/api/employees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save employee');
      }

      const savedEmployee = await response.json();
      
      // Upload documents if any
      if (uploadFiles.length > 0) {
        await uploadDocuments(savedEmployee._id);
      }
      
      toast({
        title: "Success",
        description: selectedEmployee 
          ? "Employee updated successfully" 
          : "Employee created successfully",
      });
      
      // Refresh employee list
      fetchEmployees();
      setOpenDialog(null);
      employeeForm.reset();
      setSelectedEmployee(null);
      setUploadFiles([]);
      
    } catch (error: any) {
      console.error('Error saving employee:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save employee information",
        variant: "destructive"
      });
    }
  };
  
  // Handle deletion of an employee (soft delete with undo)
  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;
    
    // Add to deleted set for immediate UI update
    setDeletedEmployees(prev => new Set([...prev, selectedEmployee._id]));
    setOpenDialog(null);
    
    // Show toast with undo option
    const { dismiss } = toast({
      title: "Employee Deleted",
      description: `${selectedEmployee.name} has been deleted.`,
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // Undo delete
            setDeletedEmployees(prev => {
              const newSet = new Set(prev);
              newSet.delete(selectedEmployee._id);
              return newSet;
            });
            dismiss();
            toast({
              title: "Deletion Undone",
              description: `${selectedEmployee.name} has been restored.`,
            });
          }}
        >
          <Undo2 className="h-4 w-4 mr-1" />
          Undo
        </Button>
      ),
      duration: 10000, // 10 seconds to undo
    });
    
    // After toast duration, actually delete from database
    setTimeout(async () => {
      try {
        const response = await fetch(`/api/employees/${selectedEmployee._id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete employee');
        }
        
        // Remove from employees list
        setEmployees(prev => prev.filter(emp => emp._id !== selectedEmployee._id));
        
      } catch (error: any) {
        console.error('Error deleting employee:', error);
        // Restore employee in case of error
        setDeletedEmployees(prev => {
          const newSet = new Set(prev);
          newSet.delete(selectedEmployee._id);
          return newSet;
        });
        
        toast({
          title: "Error",
          description: "Failed to delete employee. Employee has been restored.",
          variant: "destructive"
        });
      }
    }, 10000);
    
    setSelectedEmployee(null);
  };
  
  // Edit an employee (prepare form)
  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    employeeForm.reset({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      contact: employee.contact,
      address: employee.address,
      dailyRate: employee.dailyRate,
      bankDetails: {
        accountNumber: employee.bankDetails?.accountNumber || '',
        bankName: employee.bankDetails?.bankName || '',
        branch: employee.bankDetails?.branch || '',
        nameOnAccount: employee.bankDetails?.nameOnAccount || ''
      }
    });
    setUploadFiles([]);
    setOpenDialog('edit');
  };
  
  // Get unique roles from employees data
  const getUniqueRoles = () => {
    const roles = employees.map(emp => emp.role).filter((v, i, a) => a.indexOf(v) === i);
    return roles;
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <motion.h1 
          className="text-3xl font-bold tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Users className="inline-block mr-2" /> Employee Management
        </motion.h1>
        <motion.div 
          className="flex items-center space-x-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button 
            onClick={() => {
              setSelectedEmployee(null);
              employeeForm.reset();
              setUploadFiles([]);
              setOpenDialog('add');
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </motion.div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search employees..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Employees</TabsTrigger>
            {getUniqueRoles().map(role => (
              <TabsTrigger key={role} value={role}>{role}</TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-4">
            {isLoading ? (
              // Skeleton loading UI
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-8 w-3/4" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredEmployees.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEmployees.map((employee) => (
                  <motion.div
                    key={employee._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className={deletedEmployees.has(employee._id) ? 'opacity-50' : ''}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{employee.name}</CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">{employee.role}</Badge>
                            {employee.documents && employee.documents.length > 0 && (
                              <Badge variant="outline" className="text-xs">
                                <FileText className="h-3 w-3 mr-1" />
                                {employee.documents.length}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span className="truncate">{employee.email}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{employee.contact}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">{employee.address}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            <span>LKR {employee.dailyRate?.toLocaleString()} /day</span>
                          </div>
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Joined {format(new Date(employee.joiningDate), 'MMM dd, yyyy')}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between pt-2 border-t">
                          <div className="flex space-x-1">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditEmployee(employee)}
                              disabled={deletedEmployees.has(employee._id)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => router.push(`/admin/employee/${employee._id}`)}
                              disabled={deletedEmployees.has(employee._id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setOpenDialog('delete');
                              }}
                              disabled={deletedEmployees.has(employee._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Users className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No employees found</h3>
                <div className="text-muted-foreground">
                  {searchQuery 
                    ? "No results match your search criteria." 
                    : "Get started by adding your first employee."
                  }
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
      
      {/* Add/Edit Employee Dialog */}
      <Dialog open={openDialog === 'add' || openDialog === 'edit'} onOpenChange={(open) => {
        if (!open) {
          setOpenDialog(null);
          setUploadFiles([]);
        }
      }}>
        <DialogContent className="sm:max-w-4xl mx-auto p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-center mb-6">
            <DialogTitle className="text-2xl">{openDialog === 'add' ? 'Add New Employee' : 'Edit Employee'}</DialogTitle>
            <DialogDescription className="mt-2">
              Enter the employee details below.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...employeeForm}>
            <form onSubmit={employeeForm.handleSubmit(onEmployeeSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={employeeForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Full Name</FormLabel>
                      <FormControl>
                        <Input className="w-full" placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={employeeForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Email</FormLabel>
                      <FormControl>
                        <Input className="w-full" type="email" placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={employeeForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Role</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {employeeRoles.map(role => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={employeeForm.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Contact Number</FormLabel>
                      <FormControl>
                        <Input className="w-full" placeholder="+94771234567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={employeeForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Address</FormLabel>
                    <FormControl>
                      <Input className="w-full" placeholder="123 Main St, Colombo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={employeeForm.control}
                name="dailyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Daily Rate (LKR)</FormLabel>
                    <FormControl>
                      <Input className="w-full" type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-2 border-t">
                <h4 className="text-sm font-medium mb-3">Bank Details (Optional)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={employeeForm.control}
                    name="bankDetails.nameOnAccount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Name on Account</FormLabel>
                        <FormControl>
                          <Input className="w-full" placeholder="John Doe" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={employeeForm.control}
                    name="bankDetails.bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Bank Name</FormLabel>
                        <FormControl>
                          <Input className="w-full" placeholder="Bank of Ceylon" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <FormField
                    control={employeeForm.control}
                    name="bankDetails.branch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Branch</FormLabel>
                        <FormControl>
                          <Input className="w-full" placeholder="Colombo Main" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={employeeForm.control}
                    name="bankDetails.accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Account Number</FormLabel>
                        <FormControl>
                          <Input className="w-full" placeholder="123456789" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Document Upload Section */}
              <div className="pt-4 border-t">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                  <div>
                    <h4 className="text-sm font-medium">Documents (Optional)</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG, TXT
                    </p>
                  </div>
                  <div className="w-full sm:w-auto">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full sm:w-auto group hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Upload className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                      Add Files
                    </Button>
                  </div>
                </div>

                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                  />
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm font-medium">Drag and drop your files here</p>
                  <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
                </div>

                {uploadFiles.length > 0 && (
                  <div className="space-y-3 mt-6">
                    {uploadFiles.map((uploadFile) => (
                      <div 
                        key={uploadFile.id} 
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-medium truncate">
                                {uploadFile.file.name}
                              </p>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeUploadFile(uploadFile.id)}
                                className="hover:text-destructive"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(uploadFile.file.size)}
                            </p>
                          </div>
                        </div>
                        <div className="w-full sm:flex-1">
                          <Textarea
                            placeholder="Add description (optional)"
                            value={uploadFile.description}
                            onChange={(e) => updateFileDescription(uploadFile.id, e.target.value)}
                            className="mt-2 h-20 text-xs resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {uploadFiles.length > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                      <p className="text-sm text-blue-800">
                        {uploadFiles.length} file(s) ready to upload. Files will be uploaded after saving the employee.
                      </p>
                    </div>
                  </div>
                )}
              </div>              
              <DialogFooter className="mt-8">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setOpenDialog(null);
                    setUploadFiles([]);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    openDialog === 'add' ? 'Add Employee' : 'Save Changes'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog === 'delete'} onOpenChange={(open) => {
        if (!open) setOpenDialog(null);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this employee? You can undo this action from the notification.
            </DialogDescription>
          </DialogHeader>
          
          {selectedEmployee && (
            <div className="border rounded-md p-4 my-4">
              <div><strong>Name:</strong> {selectedEmployee.name}</div>
              <div><strong>Email:</strong> {selectedEmployee.email}</div>
              <div><strong>Role:</strong> {selectedEmployee.role}</div>
              {selectedEmployee.documents && selectedEmployee.documents.length > 0 && (
                <div className="mt-2">
                  <strong>Documents:</strong> {selectedEmployee.documents.length} file(s) will be deleted
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setOpenDialog(null)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteEmployee}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
