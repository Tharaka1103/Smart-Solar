'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SearchIcon, 
  PlusCircle, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  FileDown, 
  AlertTriangle,
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  X, 
  Check,
  ArrowLeft,
} from 'lucide-react';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Alert,
  AlertDescription,
  AlertTitle
} from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FinanceReportGenerator } from '@/components/finance/FinanceReportGenerator';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from 'next/link';

const financeFormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  amount: z.coerce.number().positive({ message: "Amount must be a positive number." }),
  category: z.enum(["income", "expense"], { required_error: "Please select a category." }),
  date: z.date({ required_error: "Date is required." }),
  description: z.string().min(5, { message: "Description must be at least 5 characters." }),
  paymentMethod: z.string().min(2, { message: "Payment method is required." }),
  reference: z.string().min(2, { message: "Reference information is required." }),
  attachmentUrl: z.string().optional(),
});

type Finance = {
  _id: string;
  title: string;
  amount: number;
  category: 'income' | 'expense';
  date: string;
  description: string;
  paymentMethod: string;
  reference: string;
  attachmentUrl?: string;
  createdAt: string;
  updatedAt: string;
};

type FinanceFormValues = z.infer<typeof financeFormSchema>;

export default function FinanceManagement() {
  const [finances, setFinances] = useState<Finance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    monthlyData: []
  });
  const [selectedFinance, setSelectedFinance] = useState<Finance | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);


  const form = useForm<FinanceFormValues>({
    resolver: zodResolver(financeFormSchema),
    defaultValues: {
      title: '',
      amount: 0,
      category: 'income',
      date: new Date(),
      description: '',
      paymentMethod: '',
      reference: '',
      attachmentUrl: '',
    },
  });

  // Function to fetch finances
  const fetchFinances = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/finance?category=${activeTab !== 'all' ? activeTab : ''}&search=${searchQuery}`);
      if (!res.ok) throw new Error('Failed to fetch finances');
      const data = await res.json();
      setFinances(data);
    } catch (error) {
      console.error('Error fetching finances:', error);

    } finally {
      setLoading(false);
    }
  };

  // Function to fetch summary data
  const fetchSummary = async () => {
    try {
      const res = await fetch('/api/finance/summary');
      if (!res.ok) throw new Error('Failed to fetch summary');
      const data = await res.json();
      setSummary(data);
    } catch (error) {
      console.error('Error fetching summary:', error);

    }
  };

  // Handle form submission for new finance
  const onSubmit = async (values: FinanceFormValues) => {
    try {
      const res = await fetch('/api/finance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error('Failed to create finance record');


      // Reset form and refresh data
      form.reset();
      setIsViewOpen(false);
      fetchFinances();
      fetchSummary();
    } catch (error) {
      console.error('Error creating finance:', error);

    }
  };

  // Handle update finance
  const handleUpdateFinance = async (values: FinanceFormValues) => {
    if (!selectedFinance) return;

    try {
      const res = await fetch(`/api/finance/${selectedFinance._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error('Failed to update finance record');



      setIsEditOpen(false);
      fetchFinances();
      fetchSummary();
    } catch (error) {
      console.error('Error updating finance:', error);
 
    }
  };

  // Handle delete finance
  const handleDeleteFinance = async () => {
    if (!selectedFinance) return;

    try {
      const res = await fetch(`/api/finance/${selectedFinance._id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete finance record');



      setIsDeleteDialogOpen(false);
      fetchFinances();
      fetchSummary();
    } catch (error) {
      console.error('Error deleting finance:', error);

    }
  };

  // Set up edit form when a finance is selected for editing
  useEffect(() => {
    if (selectedFinance && isEditOpen) {
      form.reset({
        title: selectedFinance.title,
        amount: selectedFinance.amount,
        category: selectedFinance.category,
        date: new Date(selectedFinance.date),
        description: selectedFinance.description,
        paymentMethod: selectedFinance.paymentMethod,
        reference: selectedFinance.reference,
        attachmentUrl: selectedFinance.attachmentUrl || '',
      });
    }
  }, [selectedFinance, isEditOpen, form]);

  // Fetch finances when component mounts or search/tab changes
  useEffect(() => {
    fetchFinances();
    fetchSummary();
  }, [activeTab, searchQuery]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Button variant="ghost" size="icon" asChild className='mr-10'>
                <Link href="/admin">
                  <ArrowLeft className="h-5 w-5" />Back
                </Link>
              </Button>
              <h1 className="text-3xl font-bold text-primary">Finance Management</h1>
            </div>
            <p className="text-muted-foreground">Manage your company's financial records</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search finances..."
                className="pl-10 w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 w-full md:w-auto">
                  <PlusCircle className="h-4 w-4" />
                  Add Finance
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] h-[90vh] overflow-y-auto">
                <DialogHeader className="sticky top-0 bg-background z-10 pb-4 border-b">
                  <DialogTitle className="text-2xl">Add New Finance Record</DialogTitle>
                  <DialogDescription className="text-base">
                    Add a new income or expense record to your financial database.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem className="transition-all duration-200 hover:shadow-sm">
                            <FormLabel className="text-base">Title</FormLabel>
                            <FormControl>
                              <Input className="h-11" placeholder="e.g., Solar Panel Installation" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem className="transition-all duration-200 hover:shadow-sm">
                            <FormLabel className="text-base">Amount</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2">LKR</span>
                                <Input type="number" step="1" className="pl-12 h-11" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem className="transition-all duration-200 hover:shadow-sm">
                            <FormLabel className="text-base">Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11">
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="income">Income</SelectItem>
                                <SelectItem value="expense">Expense</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col transition-all duration-200 hover:shadow-sm">
                            <FormLabel className="text-base">Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className="h-11 pl-3 text-left font-normal flex justify-between items-center"
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <Calendar className="h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem className="transition-all duration-200 hover:shadow-sm">
                            <FormLabel className="text-base">Payment Method</FormLabel>
                            <FormControl>
                              <Input className="h-11" placeholder="e.g., Bank Transfer, Cash" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="reference"
                        render={({ field }) => (
                          <FormItem className="transition-all duration-200 hover:shadow-sm">
                            <FormLabel className="text-base">Reference</FormLabel>
                            <FormControl>
                              <Input className="h-11" placeholder="e.g., Invoice #123" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="transition-all duration-200 hover:shadow-sm">
                          <FormLabel className="text-base">Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Provide details about this transaction" 
                              className="resize-none min-h-[100px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="attachmentUrl"
                      render={({ field }) => (
                        <FormItem className="transition-all duration-200 hover:shadow-sm">
                          <FormLabel className="text-base">Attachment URL (Optional)</FormLabel>
                          <FormControl>
                            <Input className="h-11" placeholder="URL to receipt or invoice" {...field} />
                          </FormControl>
                          <FormDescription className="text-sm mt-2">
                            Provide a link to any relevant document or receipt.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
                      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <DialogClose asChild>
                          <Button type="button" variant="outline" className="w-full sm:w-auto">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" className="w-full sm:w-auto">Save Record</Button>
                      </div>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-green-700 dark:text-green-400">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Total Income
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-700 dark:text-green-400">
                  {loading ? (
                    <Skeleton className="h-8 w-32" />
                  ) : (
                    formatCurrency(summary.totalIncome)
                  )}
                </div>
              </CardContent>
            </Card>
            </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-red-700 dark:text-red-400">
                  <TrendingDown className="mr-2 h-5 w-5" />
                  Total Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-700 dark:text-red-400">
                  {loading ? (
                    <Skeleton className="h-8 w-32" />
                  ) : (
                    formatCurrency(summary.totalExpenses)
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className={`${summary.balance >= 0 ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`flex items-center ${summary.balance >= 0 ? 'text-blue-700 dark:text-blue-400' : 'text-amber-700 dark:text-amber-400'}`}>
                  <DollarSign className="mr-2 h-5 w-5" />
                  Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${summary.balance >= 0 ? 'text-blue-700 dark:text-blue-400' : 'text-amber-700 dark:text-amber-400'}`}>
                  {loading ? (
                    <Skeleton className="h-8 w-32" />
                  ) : (
                    formatCurrency(summary.balance)
                  )}
                </div>
                {summary.balance < 0 && (
                  <div className="mt-2">
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Warning</AlertTitle>
                      <AlertDescription>
                        Your expenses are exceeding income. Consider reviewing your financial strategy.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* Tabs and Finance Records */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                All Records
              </TabsTrigger>
              <TabsTrigger value="income" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Income
              </TabsTrigger>
              <TabsTrigger value="expense" className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Expenses
              </TabsTrigger>
            </TabsList>
            
            <FinanceReportGenerator finances={finances} category={activeTab} />
          </div>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="border border-border">
                    <CardHeader className="pb-2">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-16 w-full" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))
              ) : finances.length === 0 ? (
                <div className="col-span-full py-20 text-center">
                  <p className="text-muted-foreground text-lg">No finance records found</p>
                  <Button className="mt-4">Add Your First Record</Button>
                </div>
              ) : (
                <AnimatePresence>
                  {finances.map((finance) => (
                    <motion.div
                      key={finance._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      layout
                    >
                      <Card className={`border ${finance.category === 'income' ? 'border-green-200 dark:border-green-800' : 'border-red-200 dark:border-red-800'} hover:shadow-md transition-all`}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg font-medium line-clamp-1">{finance.title}</CardTitle>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${finance.category === 'income' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
                              {finance.category === 'income' ? 'Income' : 'Expense'}
                            </span>
                          </div>
                          <CardDescription className="flex items-center gap-1 text-xs">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(finance.date), 'PPP')}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className={`text-2xl font-bold ${finance.category === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {formatCurrency(finance.amount)}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{finance.description}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => {
                              setSelectedFinance(finance);
                              setIsViewOpen(true);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => {
                              setSelectedFinance(finance);
                              setIsEditOpen(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => {
                              setSelectedFinance(finance);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="income" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="border border-border">
                    <CardHeader className="pb-2">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-16 w-full" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))
              ) : finances.length === 0 ? (
                <div className="col-span-full py-20 text-center">
                  <p className="text-muted-foreground text-lg">No income records found</p>
                </div>
              ) : (
                <AnimatePresence>
                  {finances.map((finance) => (
                    <motion.div
                      key={finance._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      layout
                    >
                      <Card className="border border-green-200 dark:border-green-800 hover:shadow-md transition-all">
                        {/* Same card content as above, but only for income */}
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg font-medium line-clamp-1">{finance.title}</CardTitle>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                              Income
                            </span>
                          </div>
                          <CardDescription className="flex items-center gap-1 text-xs">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(finance.date), 'PPP')}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {formatCurrency(finance.amount)}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{finance.description}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => {
                              setSelectedFinance(finance);
                              setIsViewOpen(true);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => {
                              setSelectedFinance(finance);
                              setIsEditOpen(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => {
                              setSelectedFinance(finance);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="expense" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="border border-border">
                    <CardHeader className="pb-2">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-16 w-full" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))
              ) : finances.length === 0 ? (
                <div className="col-span-full py-20 text-center">
                  <p className="text-muted-foreground text-lg">No expense records found</p>
                </div>
              ) : (
                <AnimatePresence>
                  {finances.map((finance) => (
                    <motion.div
                      key={finance._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      layout
                    >
                      <Card className="border border-red-200 dark:border-red-800 hover:shadow-md transition-all">
                        {/* Same card content as above, but only for expenses */}
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg font-medium line-clamp-1">{finance.title}</CardTitle>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                              Expense
                            </span>
                          </div>
                          <CardDescription className="flex items-center gap-1 text-xs">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(finance.date), 'PPP')}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                            {formatCurrency(finance.amount)}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{finance.description}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => {
                              setSelectedFinance(finance);
                              setIsViewOpen(true);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => {
                              setSelectedFinance(finance);
                              setIsEditOpen(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => {
                              setSelectedFinance(finance);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* View Finance Dialog */}
        {selectedFinance && (
          <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedFinance.category === 'income' ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                  {selectedFinance.title}
                </DialogTitle>
                <DialogDescription>
                  Finance record details
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Category</Label>
                  <div className={`text-sm font-medium ${selectedFinance.category === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedFinance.category === 'income' ? 'Income' : 'Expense'}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Amount</Label>
                  <div className={`text-lg font-bold ${selectedFinance.category === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(selectedFinance.amount)}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Date</Label>
                  <div className="text-sm">{format(new Date(selectedFinance.date), 'PPP')}</div>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Payment Method</Label>
                  <div className="text-sm">{selectedFinance.paymentMethod}</div>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Reference</Label>
                  <div className="text-sm">{selectedFinance.reference}</div>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Created</Label>
                  <div className="text-sm">{format(new Date(selectedFinance.createdAt), 'PPP')}</div>
                </div>
              </div>
              
              <div className="space-y-1 mt-4">
                <Label className="text-muted-foreground">Description</Label>
                <div className="text-sm p-3 bg-muted rounded-md">{selectedFinance.description}</div>
              </div>
              
              {selectedFinance.attachmentUrl && (
                <div className="space-y-1 mt-4">
                  <Label className="text-muted-foreground">Attachment</Label>
                  <div className="text-sm">
                    <a 
                      href={selectedFinance.attachmentUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary hover:underline flex items-center gap-2"
                    >
                      <FileDown className="h-4 w-4" />
                      View Attachment
                    </a>
                  </div>
                </div>
              )}
              
              <DialogFooter className="mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsViewOpen(false);
                    setIsEditOpen(true);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    setIsViewOpen(false);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        
        {/* Edit Finance Dialog */}
        {selectedFinance && (
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Finance Record</DialogTitle>
                <DialogDescription>
                  Make changes to the existing finance record.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleUpdateFinance)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input type="number" step="0.01" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="income">Income</SelectItem>
                              <SelectItem value="expense">Expense</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className="pl-3 text-left font-normal flex justify-between items-center"
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <Calendar className="h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Method</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="reference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reference</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            className="resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="attachmentUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Attachment URL (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Provide a link to any relevant document or receipt.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Save Changes</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
        
        {/* Delete Confirmation Dialog */}
        {selectedFinance && (
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the finance record
                  <span className="font-medium"> {selectedFinance.title}</span> and remove it from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteFinance}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </motion.div>
    </div>
  );
}

