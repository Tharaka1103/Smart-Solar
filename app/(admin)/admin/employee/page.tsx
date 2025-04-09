'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  FileText, 
  Mail, 
  Clock, 
  Download,
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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
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
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast'
import { Badge } from "@/components/ui/badge";

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Skeleton } from '@/components/ui/skeleton';

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
  contact: z.string().regex(/^[+-\d]+$/, { message: "Contact number can only contain numbers and + or - symbols" }).min(10, { message: "Contact number must be at least 10 digits" }).max(10, { message: "Contact number must not exceed 10 digits" }),
  address: z.string().min(5, { message: "Address is required" }),  hourlyRate: z.coerce.number().min(1, { message: "Hourly rate must be at least 1" })
});

// Attendance form schema
const attendanceSchema = z.object({
  entries: z.array(
    z.object({
      date: z.date(),
      hoursWorked: z.coerce.number().min(0).max(24),
      isLeave: z.boolean().default(false)
    })
  )
});

export default function EmployeePage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const { successt, errort, warningt, infot, dismissAll } = useToast()  
  // Employee form
  const employeeForm = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: '',
      email: '',
      role: '',
      contact: '',
      address: '',
      hourlyRate: 0
    }
  });
  
  // Attendance form
  const attendanceForm = useForm<z.infer<typeof attendanceSchema>>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      entries: []
    }
  });
  
  // Load employees
  useEffect(() => {
    fetchEmployees();
  }, []);
  
  // Filter employees when search query or tab changes
  useEffect(() => {
    if (employees.length > 0) {
      let filtered = [...employees];
      
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
  }, [employees, searchQuery, activeTab]);
  
  // Prepare attendance form when an employee is selected
  useEffect(() => {
    if (selectedEmployee && openDialog === 'attendance') {
      prepareAttendanceForm();
    }
  }, [selectedEmployee, openDialog]);
  
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
      errort({
        title: "Error",
        description: "Failed to load employees. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create calendar entries for the current month
  const prepareAttendanceForm = async () => {
    try {
      // Check if attendance data exists for this month
      const response = await fetch(`/api/employees/${selectedEmployee._id}/attendance?year=${currentYear}&month=${currentMonth}`);
      const attendanceData = await response.json();
      
      // Get days in the current month
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      
      // Create entries for each day of the month
      let entries = [];
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        
        // Skip future dates
        if (date > new Date()) continue;
        
        // Find existing entry
        const existingEntry = attendanceData.entries?.find((entry: any) => 
          new Date(entry.date).getDate() === day
        );
        
        if (existingEntry) {
          entries.push({
            date: new Date(existingEntry.date),
            hoursWorked: existingEntry.hoursWorked,
            isLeave: existingEntry.isLeave
          });
        } else {
          entries.push({
            date,
            hoursWorked: 0,
            isLeave: false
          });
        }
      }
      
      // Set form values
      attendanceForm.reset({ entries });
      
    } catch (error) {
      console.error('Error preparing attendance form:', error);
      errort({
        title: "Error",
        description: "Failed to load attendance data.",
      });
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
      
      successt({
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
      
    } catch (error: any) {
      console.error('Error saving employee:', error);
      errort({
        title: "Error",
        description: error.message || "Failed to save employee information",
      });
    }
  };
  
  // Handle attendance form submission
  const onAttendanceSubmit = async (data: z.infer<typeof attendanceSchema>) => {
    try {
      const payload = {
        year: currentYear,
        month: currentMonth,
        entries: data.entries
      };
      
      const response = await fetch(`/api/employees/${selectedEmployee._id}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save attendance');
      }
      
      successt({
        title: "Success",
        description: "Attendance updated successfully",
      });
      
      setOpenDialog(null);
      
    } catch (error: any) {
      console.error('Error saving attendance:', error);
      errort({
        title: "Error",
        description: error.message || "Failed to save attendance information",
      });
    }
  };
  
  // Handle deletion of an employee
  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;
    
    try {
      const response = await fetch(`/api/employees/${selectedEmployee._id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete employee');
      }
      
      successt({
        title: "Success",
        description: "Employee deleted successfully",
      });
      
      // Refresh employee list
      fetchEmployees();
      setOpenDialog(null);
      setSelectedEmployee(null);
      
    } catch (error: any) {
      console.error('Error deleting employee:', error);
      errort({
        title: "Error",
        description: error.message || "Failed to delete employee",
      });
    }
  };
  
  // Generate and download employee list report
  const generateEmployeeReport = async () => {
    try {
      let url = '/api/employees/employee-report';
      
      if (activeTab !== 'all') {
        url += `?role=${activeTab}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to generate report');
      }
      
      // Convert the response to a blob and create a download link
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'employees-report.pdf';
      a.style.display = 'none'; // Hide the element
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a); // Remove the element after click
      window.URL.revokeObjectURL(downloadUrl);
      
      successt({
        title: "Success",
        description: "Employee report generated successfully",
      });
      
    } catch (error: any) {
      console.error('Error generating report:', error);
      errort({
        title: "Error",
        description: error.message || "Failed to generate employee report",
      });
    }
  };  
  // Generate and download/email salary report
  const generateSalaryReport = async (sendEmail = false) => {
    if (!selectedEmployee) return;
    
    try {
      const payload = {
        employeeId: selectedEmployee._id,
        year: currentYear,
        month: currentMonth,
        sendEmail
      };
      
      if (sendEmail) {
        // Send report via email
        const response = await fetch('/api/employees/reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to send salary report');
        }
        
        successt({
          title: "Success",
          description: "Salary report sent to employee's email",
        });
        
      } else {
        // Download report
        const queryParams = new URLSearchParams({
          employeeId: selectedEmployee._id,
          year: currentYear.toString(),
          month: currentMonth.toString()
        }).toString();
        
        const response = await fetch(`/api/employees/reports?${queryParams}`, {
          method: 'GET'
        });
        
        if (!response.ok) {
          throw new Error('Failed to generate salary report');
        }
        
        // Convert the response to a blob and create a download link
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `salary-report-${selectedEmployee.name.replace(/\s+/g, '-')}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        
        successt({
          title: "Success",
          description: "Salary report generated successfully!",
        });
      }
      
      setOpenDialog(null);
      
    } catch (error: any) {
      console.error('Error with salary report:', error);
      errort({
        title: "Error",
        description: error.message || "Failed to process salary report",
      });
    }
  };
  
  // Edit an employee (prepare form)
  const handleEditEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    employeeForm.reset({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      contact: employee.contact,
      address: employee.address,
      hourlyRate: employee.hourlyRate
    });
    setOpenDialog('edit');
  };
  
  // Get unique roles from employees data
  const getUniqueRoles = () => {
    const roles = employees.map(emp => emp.role).filter((v, i, a) => a.indexOf(v) === i);
    return roles;
  };
  
  // Get month name from month number
  const getMonthName = (month: number) => {
    return [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ][month];
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
            variant="outline" 
            onClick={generateEmployeeReport}
          >
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
          
          <Button 
            onClick={() => {
              setSelectedEmployee(null);
              employeeForm.reset();
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
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle>{employee.name}</CardTitle>
                          <Badge>{employee.role}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-sm">
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <span>Email:</span>
                            <span>{employee.email}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <span>Contact:</span>
                            <span>{employee.contact}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <span>Rate:</span>
                            <span>LKR: {employee.hourlyRate} /hour</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between pt-2">
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditEmployee(employee)}
                            >
                              <Pencil className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setOpenDialog('delete');
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setOpenDialog('attendance');
                            }}
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            Attendance
                          </Button>
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
        if (!open) setOpenDialog(null);
      }}>
        <DialogContent className="sm:max-w-md mx-auto p-6 max-h-[90vh] overflow-y-auto">
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
                        <Input className="w-full" placeholder="0771234567" {...field} />
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
                name="hourlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Hourly Rate (LKR)</FormLabel>
                    <FormControl>
                      <Input className="w-full" type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormDescription className="text-sm mt-1">
                      The amount paid per hour of work
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-8">
                <Button type="submit" className="w-full sm:w-auto">
                  {openDialog === 'add' ? 'Add Employee' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Attendance Dialog */}
      <Dialog open={openDialog === 'attendance'} onOpenChange={(open) => {
        if (!open) setOpenDialog(null);
      }}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Attendance Record</DialogTitle>
            <DialogDescription>
              {selectedEmployee && (
                <div className="flex flex-col space-y-1 mt-2">
                  <div>Employee: <span className="font-medium">{selectedEmployee.name}</span></div>
                  <div className="flex items-center space-x-4">
                    <Select 
                      value={currentMonth.toString()} 
                      onValueChange={(v) => {
                        setCurrentMonth(parseInt(v));
                        if (selectedEmployee) prepareAttendanceForm();
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {getMonthName(i)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      value={currentYear.toString()} 
                      onValueChange={(v) => {
                        setCurrentYear(parseInt(v));
                        if (selectedEmployee) prepareAttendanceForm();
                      }}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 5 }, (_, i) => {
                          const year = new Date().getFullYear() - i;
                          return (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...attendanceForm}>
            <form onSubmit={attendanceForm.handleSubmit(onAttendanceSubmit)} className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Hours</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Leave</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {attendanceForm.watch('entries')?.map((entry, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">
                            {format(new Date(entry.date), 'MMM dd, yyyy')}
                          </td>
                          <td className="px-4 py-2 w-32">
                            <FormField
                              control={attendanceForm.control}
                              name={`entries.${index}.hoursWorked`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      min="0" 
                                      max="24" 
                                      step="0.5" 
                                      disabled={attendanceForm.watch(`entries.${index}.isLeave`)}
                                      {...field} 
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </td>
                          <td className="px-4 py-2 w-24 text-center">
                            <FormField
                              control={attendanceForm.control}
                              name={`entries.${index}.isLeave`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Checkbox 
                                      checked={field.value}
                                      onCheckedChange={(checked) => {
                                        field.onChange(checked);
                                        if (checked) {
                                          attendanceForm.setValue(`entries.${index}.hoursWorked`, 0);
                                        }
                                      }}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <DialogFooter className="flex justify-between">
                <div className="flex space-x-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setOpenDialog('salary')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Salary Report
                  </Button>
                </div>
                <Button type="submit">Save Attendance</Button>
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
              Are you sure you want to delete this employee? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedEmployee && (
            <div className="border rounded-md p-4 my-4">
              <div><strong>Name:</strong> {selectedEmployee.name}</div>
              <div><strong>Email:</strong> {selectedEmployee.email}</div>
              <div><strong>Role:</strong> {selectedEmployee.role}</div>
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
      
      {/* Salary Report Dialog */}
      <Dialog open={openDialog === 'salary'} onOpenChange={(open) => {
        if (!open) setOpenDialog(null);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Salary Report</DialogTitle>
            <DialogDescription>
              Generate and download salary report or send it via email.
            </DialogDescription>
          </DialogHeader>
          
          {selectedEmployee && (
            <div className="space-y-4 my-4">
              <div className="border rounded-md p-4">
                <div><strong>Employee:</strong> {selectedEmployee.name}</div>
                <div><strong>Period:</strong> {getMonthName(currentMonth)} {currentYear}</div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Button 
                  onClick={() => generateSalaryReport(false)}
                  className="flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => generateSalaryReport(true)}
                  className="flex items-center justify-center"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email to Employee
                </Button>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="secondary"
              onClick={() => setOpenDialog('attendance')}
            >
              Back to Attendance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

