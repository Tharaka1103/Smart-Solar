'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Building,
  CreditCard,
  Plus,
  Clock,
  Edit,
  Save,
  X,
  CheckCircle,
  Circle,
  CalendarDays,
  FileText,
  Download,
  TrendingUp,
  AlertCircle,
  Trash2,
  Upload,
  Eye,
  ExternalLink
} from 'lucide-react';
import { format, getDaysInMonth, startOfMonth, endOfMonth, isSameDay, isToday, isPast, isFuture } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Badge } from "@/components/ui/badge";
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

// Types
type AttendanceEntry = {
  date: string;
  type: 'fullday' | 'halfday' | 'custom' | 'absent';
  customSalary?: number;
  notes?: string;
};

type AttendanceMonth = {
  year: number;
  month: number;
  periodType: 'regular' | 'custom'; // regular: 1st-30th/31st, custom: 25th-25th
  startDate: string;
  endDate: string;
  entries: AttendanceEntry[];
  totalWorkingDays: number;
  totalSalary: number;
  overrideSalary?: number;
  useOverrideSalary?: boolean;
};

type Document = {
  _id: string;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  description?: string;
  driveFileId: string;
  webViewLink: string;
};

type Employee = {
  _id: string;
  name: string;
  email: string;
  role: string;
  contact: string;
  address: string;
  dailyRate: number;
  joiningDate: string;
  attendance: AttendanceMonth[];
  documents?: Document[];
  bankDetails?: {
    accountNumber?: string;
    bankName?: string;
    branch?: string;
    nameOnAccount?: string;
  };
};

type UploadFile = {
  file: File;
  description: string;
  id: string;
};

// Attendance form schema
const attendanceSchema = z.object({
  year: z.number(),
  month: z.number(),
  periodType: z.enum(['regular', 'custom']),
  entries: z.array(
    z.object({
      date: z.string(),
      type: z.enum(['fullday', 'halfday', 'custom', 'absent']),
      customSalary: z.number().optional(),
      notes: z.string().optional()
    })
  ),
  overrideSalary: z.number().optional(),
  useOverrideSalary: z.boolean().default(false)
});

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { successt, errort } = useToast();
  
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Dialog states
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
  
  // Document states
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  
  // Form states
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [periodType, setPeriodType] = useState<'regular' | 'custom'>('regular');
  const [editingAttendance, setEditingAttendance] = useState<AttendanceMonth | null>(null);
  const [deleteAttendance, setDeleteAttendance] = useState<AttendanceMonth | null>(null);
  
  // Loading states
  const [isCheckingExisting, setIsCheckingExisting] = useState(false);
  const [existingAttendanceFound, setExistingAttendanceFound] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add Attendance form
  const addAttendanceForm = useForm<z.infer<typeof attendanceSchema>>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      year: selectedYear,
      month: selectedMonth,
      periodType: 'regular',
      entries: [],
      overrideSalary: 0,
      useOverrideSalary: false
    }
  });

  // Edit Attendance form
  const editAttendanceForm = useForm<z.infer<typeof attendanceSchema>>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      year: selectedYear,
      month: selectedMonth,
      periodType: 'regular',
      entries: [],
      overrideSalary: 0,
      useOverrideSalary: false
    }
  });

  // Load employee data
  useEffect(() => {
    if (params?.id) {
      fetchEmployee();
    }
  }, [params?.id]);

  // Check for existing attendance when add dialog parameters change
  useEffect(() => {
    if (employee && openAddDialog) {
      checkExistingAttendance();
    }
  }, [selectedYear, selectedMonth, periodType, employee, openAddDialog]);

  // Prepare edit form when editing attendance changes
  useEffect(() => {
    if (editingAttendance && openEditDialog) {
      prepareEditForm();
    }
  }, [editingAttendance, openEditDialog]);

  const fetchEmployee = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/employees/${params?.id}`);
      if (!response.ok) throw new Error('Failed to fetch employee');
      
      const data = await response.json();
      setEmployee(data);
    } catch (error) {
      console.error('Error fetching employee:', error);
      errort({
        title: "Error",
        description: "Failed to load employee details.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Document management functions
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        errort({
          title: "File too large",
          description: `${file.name} exceeds 10MB limit`,
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

  const removeUploadFile = (id: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id));
  };

  const updateFileDescription = (id: string, description: string) => {
    setUploadFiles(prev => prev.map(f => 
      f.id === id ? { ...f, description } : f
    ));
  };

  const uploadDocuments = async () => {
    if (!employee || uploadFiles.length === 0) return;

    setIsUploading(true);
    const uploadPromises = uploadFiles.map(async (uploadFile) => {
      const formData = new FormData();
      formData.append('file', uploadFile.file);
      formData.append('description', uploadFile.description);

      const response = await fetch(`/api/employees/${employee._id}/documents`, {
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
      successt({
        title: "Success",
        description: `${uploadFiles.length} document(s) uploaded successfully`,
      });
      setUploadFiles([]);
      setOpenDocumentDialog(false);
      await fetchEmployee(); // Refresh employee data
    } catch (error: any) {
      console.error('Error uploading documents:', error);
      errort({
        title: "Upload Error",
        description: error.message || "Failed to upload some documents",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async () => {
    if (!documentToDelete || !employee) return;

    try {
      const response = await fetch(`/api/employees/${employee._id}/documents/${documentToDelete._id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete document');
      }

      successt({
        title: "Success",
        description: "Document deleted successfully",
      });

      await fetchEmployee(); // Refresh employee data
      setDocumentToDelete(null);
    } catch (error: any) {
      console.error('Error deleting document:', error);
      errort({
        title: "Error",
        description: error.message || "Failed to delete document",
      });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    return '📎';
  };

  const checkExistingAttendance = async () => {
    if (!employee) return;
    
    setIsCheckingExisting(true);
    try {
      const response = await fetch(
        `/api/employees/${employee._id}/attendance/check?year=${selectedYear}&month=${selectedMonth}&periodType=${periodType}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setExistingAttendanceFound(data.exists);
        
        if (data.exists && data.attendance) {
          // Pre-populate form with existing data
          prepareAddFormWithExisting(data.attendance);
        } else {
          // Generate new form
          prepareAddForm();
        }
      }
    } catch (error) {
      console.error('Error checking existing attendance:', error);
      prepareAddForm(); // Fallback to new form
    } finally {
      setIsCheckingExisting(false);
    }
  };

  const getDateRange = (year: number, month: number, type: 'regular' | 'custom') => {
    if (type === 'regular') {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 0); // Last day of month
      return { start, end };
    } else {
      // Custom: 25th of current month to 25th of next month
      const start = new Date(year, month, 25);
      const end = new Date(year, month + 1, 25);
      return { start, end };
    }
  };

  const prepareAddForm = () => {
    if (!employee) return;

    // Generate date entries based on period type
    const { start, end } = getDateRange(selectedYear, selectedMonth, periodType);
    const entries: AttendanceEntry[] = [];
    const today = new Date();
    
    // Create entries for each day in the period
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      // Only include dates up to today
      if (date <= today) {
        entries.push({
          date: format(date, 'yyyy-MM-dd'),
          type: 'absent',
          customSalary: 0,
          notes: ''
        });
      }
    }

    addAttendanceForm.reset({
      year: selectedYear,
      month: selectedMonth,
      periodType: periodType,
      entries,
      overrideSalary: 0,
      useOverrideSalary: false
    });
  };

const prepareAddFormWithExisting = (existingAttendance: AttendanceMonth) => {
    addAttendanceForm.reset({
      year: selectedYear,
      month: selectedMonth,
      periodType: periodType,
      entries: existingAttendance.entries,
      overrideSalary: existingAttendance.overrideSalary || 0,
      useOverrideSalary: existingAttendance.useOverrideSalary || false
    });
  };

  const prepareEditForm = () => {
    if (!editingAttendance) return;

    editAttendanceForm.reset({
      year: editingAttendance.year,
      month: editingAttendance.month,
      periodType: editingAttendance.periodType,
      entries: editingAttendance.entries,
      overrideSalary: editingAttendance.overrideSalary || 0,
      useOverrideSalary: editingAttendance.useOverrideSalary || false
    });
  };

  const calculateSalary = (entries: AttendanceEntry[], dailyRate: number, overrideSalary?: number, useOverride?: boolean) => {
    if (useOverride && overrideSalary) {
      return { totalSalary: overrideSalary, workingDays: 0 };
    }

    let totalSalary = 0;
    let workingDays = 0;

    entries.forEach(entry => {
      switch (entry.type) {
        case 'fullday':
          totalSalary += dailyRate;
          workingDays += 1;
          break;
        case 'halfday':
          totalSalary += dailyRate / 2;
          workingDays += 0.5;
          break;
        case 'custom':
          totalSalary += entry.customSalary || 0;
          workingDays += 1;
          break;
        case 'absent':
        default:
          // No salary for absent days
          break;
      }
    });

    return { totalSalary, workingDays };
  };

  const onAddAttendanceSubmit = async (data: z.infer<typeof attendanceSchema>) => {
    if (!employee) return;

    try {
      const { start, end } = getDateRange(data.year, data.month, data.periodType);
      
      const payload = {
        ...data,
        startDate: format(start, 'yyyy-MM-dd'),
        endDate: format(end, 'yyyy-MM-dd')
      };

      const response = await fetch(`/api/employees/${employee._id}/attendance`, {
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
        description: "Attendance saved successfully",
      });

      // Refresh employee data
      await fetchEmployee();
      setOpenAddDialog(false);
      setExistingAttendanceFound(false);
      
    } catch (error: any) {
      console.error('Error saving attendance:', error);
      errort({
        title: "Error",
        description: error.message || "Failed to save attendance",
      });
    }
  };

  const onEditAttendanceSubmit = async (data: z.infer<typeof attendanceSchema>) => {
    if (!employee || !editingAttendance) return;

    try {
      const { start, end } = getDateRange(data.year, data.month, data.periodType);
      
      const payload = {
        ...data,
        startDate: format(start, 'yyyy-MM-dd'),
        endDate: format(end, 'yyyy-MM-dd')
      };

      const response = await fetch(`/api/employees/${employee._id}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update attendance');
      }

      successt({
        title: "Success",
        description: "Attendance updated successfully",
      });

      // Refresh employee data
      await fetchEmployee();
      setOpenEditDialog(false);
      setEditingAttendance(null);
      
    } catch (error: any) {
      console.error('Error updating attendance:', error);
      errort({
        title: "Error",
        description: error.message || "Failed to update attendance",
      });
    }
  };

  const handleDeleteAttendance = async () => {
    if (!employee || !deleteAttendance) return;

    try {
      const response = await fetch(`/api/employees/${employee._id}/attendance`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: deleteAttendance.year,
          month: deleteAttendance.month,
          periodType: deleteAttendance.periodType
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete attendance');
      }

      successt({
        title: "Success",
        description: "Attendance deleted successfully",
      });

      // Refresh employee data
      await fetchEmployee();
      setOpenDeleteDialog(false);
      setDeleteAttendance(null);
      
    } catch (error: any) {
      console.error('Error deleting attendance:', error);
      errort({
        title: "Error",
        description: error.message || "Failed to delete attendance",
      });
    }
  };


  const handleAddAttendanceTypeChange = (index: number, type: 'fullday' | 'halfday') => {
    const currentType = addAttendanceForm.watch(`entries.${index}.type`);
    
    if (currentType === type) {
      // If clicking the same type, toggle to absent
      addAttendanceForm.setValue(`entries.${index}.type`, 'absent');
      addAttendanceForm.setValue(`entries.${index}.customSalary`, 0);
    } else {
      // Set new type
      addAttendanceForm.setValue(`entries.${index}.type`, type);
      addAttendanceForm.setValue(`entries.${index}.customSalary`, 0);
    }
  };

  const handleEditAttendanceTypeChange = (index: number, type: 'fullday' | 'halfday') => {
    const currentType = editAttendanceForm.watch(`entries.${index}.type`);
    
    if (currentType === type) {
      // If clicking the same type, toggle to absent
      editAttendanceForm.setValue(`entries.${index}.type`, 'absent');
      editAttendanceForm.setValue(`entries.${index}.customSalary`, 0);
    } else {
      // Set new type
      editAttendanceForm.setValue(`entries.${index}.type`, type);
      editAttendanceForm.setValue(`entries.${index}.customSalary`, 0);
    }
  };

  const getMonthName = (month: number) => {
    return [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ][month];
  };

  const getPeriodLabel = (attendance: AttendanceMonth) => {
    if (attendance.periodType === 'regular') {
      return `${getMonthName(attendance.month)} ${attendance.year}`;
    } else {
      const prevMonth = attendance.month === 0 ? 11 : attendance.month - 1;
      const prevYear = attendance.month === 0 ? attendance.year - 1 : attendance.year;
      return `${getMonthName(prevMonth)} 25 - ${getMonthName(attendance.month)} 25, ${attendance.year}`;
    }
  };

  const getAttendanceStats = (attendance: AttendanceMonth) => {
    const stats = attendance.entries.reduce((acc, entry) => {
      switch (entry.type) {
        case 'fullday':
          acc.fullDays += 1;
          break;
        case 'halfday':
          acc.halfDays += 1;
          break;
        case 'custom':
          acc.customDays += 1;
          break;
        case 'absent':
          acc.absentDays += 1;
          break;
      }
      return acc;
    }, { fullDays: 0, halfDays: 0, customDays: 0, absentDays: 0 });

    return stats;
  };

  const handleEditAttendance = (attendance: AttendanceMonth) => {
    setEditingAttendance(attendance);
    setOpenEditDialog(true);
  };

  const handleDeleteAttendanceClick = (attendance: AttendanceMonth) => {
    setDeleteAttendance(attendance);
    setOpenDeleteDialog(true);
  };

  const openAddAttendanceDialog = () => {
    setSelectedYear(new Date().getFullYear());
    setSelectedMonth(new Date().getMonth());
    setPeriodType('regular');
    setExistingAttendanceFound(false);
    setOpenAddDialog(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Employee Not Found</h2>
          <p className="text-muted-foreground mb-4">The employee you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/admin/employee')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Employees
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => router.push('/admin/employee')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{employee.name}</h1>
            <p className="text-muted-foreground">{employee.role}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => setOpenDocumentDialog(true)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Documents
          </Button>
          <Button onClick={openAddAttendanceDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Attendance
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Employee Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Employee Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{employee.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Contact</p>
                        <p className="font-medium">{employee.contact}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium">{employee.address}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Building className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Role</p>
                        <Badge variant="secondary">{employee.role}</Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Daily Rate</p>
                        <p className="font-medium">LKR {employee.dailyRate?.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Joining Date</p>
                        <p className="font-medium">{format(new Date(employee.joiningDate), 'PPP')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Documents Section */}
          {employee.documents && employee.documents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-5 w-5" />
                      Documents
                    </div>
                    <Badge variant="outline">
                      {employee.documents.length} file(s)
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {employee.documents.map((doc) => (
                      <div key={doc._id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <span className="text-2xl">{getFileIcon(doc.fileType)}</span>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium truncate">{doc.originalName}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatFileSize(doc.fileSize)} • {format(new Date(doc.uploadedAt), 'MMM dd, yyyy')}
                              </p>
                              {doc.description && (
                                <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(doc.webViewLink, '_blank')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(doc.webViewLink, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setDocumentToDelete(doc)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Attendance Records */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    Attendance Records
                  </div>
                  <Badge variant="outline">
                    {employee.attendance?.length || 0} Records
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {employee.attendance && employee.attendance.length > 0 ? (
                  <div className="space-y-6">
                    {employee.attendance
                      .sort((a, b) => b.year - a.year || b.month - a.month)
                      .map((attendance, index) => {
                        const stats = getAttendanceStats(attendance);
                        const periodLabel = getPeriodLabel(attendance);
                        
                        return (
                          <div key={index} className="border rounded-lg p-4 space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold text-lg">{periodLabel}</h3>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                                  <span className="flex items-center">
                                    <CalendarDays className="mr-1 h-4 w-4" />
                                    {attendance.periodType === 'custom' ? 'Custom Period' : 'Regular Month'}
                                  </span>
                                  <span>•</span>
                                  <span>{attendance.entries.length} Days</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-semibold">
                                  LKR {attendance.totalSalary?.toLocaleString()}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {attendance.totalWorkingDays} working days
                                </div>
                              </div>
                            </div>

                            {/* Attendance Statistics */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="text-center p-3 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">{stats.fullDays}</div>
                                <div className="text-sm text-green-700">Full Days</div>
                              </div>
                              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                <div className="text-2xl font-bold text-yellow-600">{stats.halfDays}</div>
                                <div className="text-sm text-yellow-700">Half Days</div>
                              </div>
                              <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">{stats.customDays}</div>
                                <div className="text-sm text-blue-700">Custom</div>
                              </div>
                              <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-600">{stats.absentDays}</div>
                                <div className="text-sm text-gray-700">Absent</div>
                              </div>
                            </div>

                            {/* Attendance Calendar View */}
                            <div className="border rounded-lg p-4 bg-gray-50">
                                <h4 className="font-medium mb-3">Daily Attendance</h4>
                                <div className="grid grid-cols-7 gap-1 text-xs">
                                    {/* Days header */}
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <div key={day} className="text-center font-medium p-2 text-muted-foreground">
                                        {day}
                                    </div>
                                    ))}
                                    
                                    {/* Calendar grid */}
                                    {(() => {
                                    const startDate = new Date(attendance.startDate);
                                    const endDate = new Date(attendance.endDate);
                                    const firstDayOfWeek = startDate.getDay();
                                    
                                    const cells = [];
                                    
                                    // Empty cells for start
                                    for (let i = 0; i < firstDayOfWeek; i++) {
                                        cells.push(<div key={`empty-start-${i}`} className="p-2"></div>);
                                    }
                                    
                                    // Date cells
                                    const currentDate = new Date(startDate);
                                    while (currentDate <= endDate) {
                                        const dateStr = format(currentDate, 'yyyy-MM-dd');
                                        const day = currentDate.getDate();
                                        
                                        // Find entry with better date matching
                                        const entry = attendance.entries.find(e => {
                                        // Handle both string and Date object formats
                                        const entryDateStr = typeof e.date === 'object' // && e.date instanceof Date
                                            ? format(e.date, 'yyyy-MM-dd')
                                            : typeof e.date === 'string' 
                                            ? e.date.split('T')[0] // Remove time part if present
                                            : format(new Date(e.date), 'yyyy-MM-dd');
                                        
                                        return entryDateStr === dateStr;
                                        });                                        
                                        // Apply colors based on attendance type
                                        const getCellClass = () => {
                                        if (!entry) return 'bg-white border-gray-200 text-gray-400';
                                        
                                        switch (entry.type) {
                                            case 'fullday':
                                            return 'bg-green-100 text-green-800 border-green-200';
                                            case 'halfday':
                                            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
                                            case 'custom':
                                            return 'bg-blue-100 text-blue-800 border-blue-200';
                                            case 'absent':
                                            return 'bg-red-50 text-red-600 border-red-200';
                                            default:
                                            return 'bg-gray-100 text-gray-600 border-gray-200';
                                        }
                                        };
                                        
                                        const cellClass = getCellClass();
                                        
                                        // Create tooltip text
                                        const getTooltipText = () => {
                                        if (!entry) return `${day}: No data`;
                                        
                                        let tooltip = `${day}: ${entry.type}`;
                                        if (entry.type === 'custom' && entry.customSalary) {
                                            tooltip += ` (LKR ${entry.customSalary})`;
                                        }
                                        if (entry.notes) {
                                            tooltip += ` - ${entry.notes}`;
                                        }
                                        return tooltip;
                                        };
                                        
                                        cells.push(
                                        <div
                                            key={dateStr}
                                            className={`text-center p-2 rounded border text-xs font-medium cursor-default ${cellClass}`}
                                            title={getTooltipText()}
                                        >
                                            {day}
                                        </div>
                                        );
                                        
                                        currentDate.setDate(currentDate.getDate() + 1);
                                    }
                                    
                                    return cells;
                                    })()}
                                </div>
                                
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-4 text-xs">
                                    <div className="flex items-center space-x-1">
                                        <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                                        <span>Full Day</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
                                        <span>Half Day</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
                                        <span>Custom</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <div className="w-3 h-3 bg-red-50 border border-red-200 rounded"></div>
                                        <span>Absent</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <div className="w-3 h-3 bg-white border border-gray-200 rounded"></div>
                                        <span>No Data</span>
                                    </div>
                                    </div>
                                    
                                    <div className="flex space-x-2">
                                    {attendance.useOverrideSalary && (
                                        <Badge variant="outline" className="text-xs">
                                        <AlertCircle className="mr-1 h-3 w-3" />
                                        Override Applied
                                        </Badge>
                                    )}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEditAttendance(attendance)}
                                    >
                                        <Edit className="h-4 w-4 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDeleteAttendanceClick(attendance)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                    </Button>
                                    </div>
                                </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Attendance Records</h3>
                    <p className="text-muted-foreground mb-4">
                      Start by adding attendance for this employee.
                    </p>
                    <Button onClick={openAddAttendanceDialog}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Record
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Records</span>
                  <span className="font-semibold">{employee.attendance?.length || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Documents</span>
                  <span className="font-semibold">{employee.documents?.length || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">This Month Salary</span>
                  <span className="font-semibold text-green-600">
                    LKR {employee.attendance?.find(att => 
                      att.year === new Date().getFullYear() && 
                      att.month === new Date().getMonth()
                    )?.totalSalary?.toLocaleString() || '0'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Daily Rate</span>
                  <span className="font-semibold">LKR {employee.dailyRate.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Average Monthly</span>
                  <span className="font-semibold">
                    LKR {employee.attendance?.length > 0 
                      ? Math.round(employee.attendance.reduce((sum, att) => sum + att.totalSalary, 0) / employee.attendance.length)?.toLocaleString()
                      : '0'
                    }
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bank Details */}
          {employee.bankDetails && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Bank Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {employee.bankDetails.nameOnAccount && (
                    <div>
                      <span className="text-sm text-muted-foreground">Account Holder</span>
                      <p className="font-medium">{employee.bankDetails.nameOnAccount}</p>
                    </div>
                  )}
                  {employee.bankDetails.bankName && (
                    <div>
                      <span className="text-sm text-muted-foreground">Bank</span>
                      <p className="font-medium">{employee.bankDetails.bankName}</p>
                    </div>
                  )}
                  {employee.bankDetails.branch && (
                    <div>
                      <span className="text-sm text-muted-foreground">Branch</span>
                      <p className="font-medium">{employee.bankDetails.branch}</p>
                    </div>
                  )}
                  {employee.bankDetails.accountNumber && (
                    <div>
                      <span className="text-sm text-muted-foreground">Account Number</span>
                      <p className="font-medium font-mono">{employee.bankDetails.accountNumber}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={openAddAttendanceDialog}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Attendance
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setOpenDocumentDialog(true)}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Documents
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => {
                    // Generate employee report
                    window.open(`/api/employees/reports?employeeId=${employee._id}`, '_blank');
                  }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Document Upload Dialog */}
      <Dialog open={openDocumentDialog} onOpenChange={setOpenDocumentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Upload className="mr-2 h-5 w-5" />
              Upload Documents
            </DialogTitle>
            <DialogDescription>
              Upload documents for {employee.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG (MAX. 10MB)</p>
                </div>
                <input
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                />
              </label>
            </div>

            {uploadFiles.length > 0 && (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {uploadFiles.map((uploadFile) => (
                  <div key={uploadFile.id} className="flex items-start space-x-3 p-3 border rounded-lg bg-muted/20">
                    <FileText className="h-5 w-5 text-muted-foreground mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">
                          {uploadFile.file.name}
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeUploadFile(uploadFile.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(uploadFile.file.size)}
                      </p>
                      <Textarea
                        placeholder="Add description (optional)"
                        value={uploadFile.description}
                        onChange={(e) => updateFileDescription(uploadFile.id, e.target.value)}
                        className="mt-2 h-16 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setOpenDocumentDialog(false);
                setUploadFiles([]);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={uploadDocuments}
              disabled={uploadFiles.length === 0 || isUploading}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload {uploadFiles.length} file(s)
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Delete Confirmation */}
      <AlertDialog open={!!documentToDelete} onOpenChange={() => setDocumentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{documentToDelete?.originalName}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDocument}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Attendance Dialog */}
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CalendarDays className="mr-2 h-5 w-5" />
              Add Attendance Record
            </DialogTitle>
            <DialogDescription>
              Add attendance record for {employee.name}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6 py-4">
            {/* Period Selection */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/20">
              <div>
                <Label className="text-sm font-medium">Year</Label>
                <Select 
                  value={selectedYear.toString()} 
                  onValueChange={(value) => setSelectedYear(parseInt(value))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
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
              
              <div>
                <Label className="text-sm font-medium">Month</Label>
                <Select 
                  value={selectedMonth.toString()} 
                  onValueChange={(value) => setSelectedMonth(parseInt(value))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {getMonthName(i)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2">
                <Label className="text-sm font-medium">Period Type</Label>
                <div className="mt-1 flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="period-type"
                      checked={periodType === 'custom'}
                      onCheckedChange={(checked) => setPeriodType(checked ? 'custom' : 'regular')}
                    />
                    <Label htmlFor="period-type" className="text-sm">
                      {periodType === 'custom' ? 'Custom Period (25th-25th)' : 'Regular Month (1st-Last)'}
                    </Label>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {periodType === 'custom' 
                    ? `${getMonthName(selectedMonth === 0 ? 11 : selectedMonth - 1)} 25 to ${getMonthName(selectedMonth)} 25`
                    : `${getMonthName(selectedMonth)} 1 to ${getMonthName(selectedMonth)} ${new Date(selectedYear, selectedMonth + 1, 0).getDate()}`
                  }
                </p>
              </div>
            </div>

            {/* Existing Attendance Warning */}
            {isCheckingExisting && (
              <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <p className="text-sm text-blue-800">Checking for existing attendance...</p>
                </div>
              </div>
            )}

            {existingAttendanceFound && !isCheckingExisting && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  Attendance already exists for this period. You can modify the existing data below or use the Edit option from the records list.
                </AlertDescription>
              </Alert>
            )}

            <Form {...addAttendanceForm}>
              <form onSubmit={addAttendanceForm.handleSubmit(onAddAttendanceSubmit)} className="space-y-6">
                {/* Attendance Table */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted/50 px-4 py-3 border-b">
                    <h3 className="font-medium">Daily Attendance</h3>
                    <p className="text-sm text-muted-foreground">
                      Mark attendance for each day. Today ({format(new Date(), 'PPP')}) is the last available day.
                    </p>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-background">
                        <TableRow>
                          <TableHead className="w-32">Date</TableHead>
                          <TableHead className="w-20 text-center">Full Day</TableHead>
                          <TableHead className="w-20 text-center">Half Day</TableHead>
                          <TableHead className="w-32">Custom Salary</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {addAttendanceForm.watch('entries')?.map((entry, index) => {
                          const entryDate = new Date(entry.date);
                          const dayName = format(entryDate, 'EEE');
                          const dateDisplay = format(entryDate, 'MMM dd');
                          const isEntryToday = isToday(entryDate);
                          
                          return (
                            <TableRow 
                              key={index} 
                              className={`${isEntryToday ? 'bg-blue-50 border-blue-200' : ''} ${
                                entry.type !== 'absent' ? 'bg-green-50' : ''
                              }`}
                            >
                              <TableCell>
                                <div className="font-medium">
                                  {dateDisplay}
                                  {isEntryToday && (
                                    <Badge variant="secondary" className="ml-2 text-xs">Today</Badge>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">{dayName}</div>
                              </TableCell>
                              
                              <TableCell className="text-center">
                                <Checkbox
                                  checked={entry.type === 'fullday'}
                                  onCheckedChange={() => handleAddAttendanceTypeChange(index, 'fullday')}
                                />
                              </TableCell>
                              
                              <TableCell className="text-center">
                                <Checkbox
                                  checked={entry.type === 'halfday'}
                                  onCheckedChange={() => handleAddAttendanceTypeChange(index, 'halfday')}
                                />
                              </TableCell>
                              
                              <TableCell>
                                <FormField
                                  control={addAttendanceForm.control}
                                  name={`entries.${index}.customSalary`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          placeholder="0"
                                          min="0"
                                          step="0.01"
                                          className="w-28"
                                          {...field}
                                          onChange={(e) => {
                                            const value = parseFloat(e.target.value) || 0;
                                            field.onChange(value);
                                            if (value > 0) {
                                              addAttendanceForm.setValue(`entries.${index}.type`, 'custom');
                                            } else if (entry.type === 'custom') {
                                              addAttendanceForm.setValue(`entries.${index}.type`, 'absent');
                                            }
                                          }}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </TableCell>
                              
                              <TableCell>
                                <FormField
                                  control={addAttendanceForm.control}
                                  name={`entries.${index}.notes`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          placeholder="Optional notes"
                                          className="w-full"
                                          {...field}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Summary Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Calculated Summary */}
                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-medium">Attendance Summary</h3>
                    
                    {(() => {
                      const entries = addAttendanceForm.watch('entries') || [];
                      const salaryData = calculateSalary(
                        entries,
                        employee.dailyRate,
                        addAttendanceForm.watch('overrideSalary'),
                        addAttendanceForm.watch('useOverrideSalary')
                      );
                      
                      const stats = entries.reduce((acc, entry) => {
                        switch (entry.type) {
                          case 'fullday': acc.fullDays += 1; break;
                          case 'halfday': acc.halfDays += 1; break;
                          case 'custom': acc.customDays += 1; break;
                          case 'absent': acc.absentDays += 1; break;
                        }
                        return acc;
                      }, { fullDays: 0, halfDays: 0, customDays: 0, absentDays: 0 });
                      
                      return (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Full Days:</span>
                            <span className="ml-2 font-medium text-green-600">{stats.fullDays}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Half Days:</span>
                            <span className="ml-2 font-medium text-yellow-600">{stats.halfDays}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Custom Days:</span>
                            <span className="ml-2 font-medium text-blue-600">{stats.customDays}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Absent Days:</span>
                            <span className="ml-2 font-medium text-gray-600">{stats.absentDays}</span>
                          </div>
                          <div className="col-span-2 pt-2 border-t">
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Working Days:</span>
                              <span className="font-medium">{salaryData.workingDays}</span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-muted-foreground">Total Salary:</span>
                              <span className="font-semibold text-lg">LKR {salaryData.totalSalary?.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Override Section */}
                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-medium">Salary Override</h3>
                    
                    <FormField
                      control={addAttendanceForm.control}
                      name="useOverrideSalary"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-medium cursor-pointer">
                            Override calculated salary
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    {addAttendanceForm.watch('useOverrideSalary') && (
                      <FormField
                        control={addAttendanceForm.control}
                        name="overrideSalary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Custom Salary Amount (LKR)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Enter custom salary amount"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {addAttendanceForm.watch('useOverrideSalary') && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          Override will replace the calculated salary. This action should be used for special cases only.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>

                <DialogFooter className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {addAttendanceForm.watch('entries')?.length || 0} days to be recorded
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setOpenAddDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      {existingAttendanceFound ? 'Update Attendance' : 'Save Attendance'}
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Attendance Dialog */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Edit className="mr-2 h-5 w-5" />
              Edit Attendance Record
            </DialogTitle>
            <DialogDescription>
              {editingAttendance && 
                `Editing attendance for ${getPeriodLabel(editingAttendance)}`
              }
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6 py-4">
            {/* Period Info (Read-only) */}
            {editingAttendance && (
              <div className="p-4 border rounded-lg bg-muted/20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Period</Label>
                    <p className="font-medium">{getPeriodLabel(editingAttendance)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                    <p className="font-medium">
                      {editingAttendance.periodType === 'custom' ? 'Custom Period (25th-25th)' : 'Regular Month'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Date Range</Label>
                    <p className="text-sm">
                      {format(new Date(editingAttendance.startDate), 'MMM dd')} - {format(new Date(editingAttendance.endDate), 'MMM dd')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Form {...editAttendanceForm}>
              <form onSubmit={editAttendanceForm.handleSubmit(onEditAttendanceSubmit)} className="space-y-6">
                {/* Attendance Table */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted/50 px-4 py-3 border-b">
                    <h3 className="font-medium">Daily Attendance</h3>
                    <p className="text-sm text-muted-foreground">
                      Modify attendance for each day as needed.
                    </p>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-background">
                        <TableRow>
                          <TableHead className="w-32">Date</TableHead>
                          <TableHead className="w-20 text-center">Full Day</TableHead>
                          <TableHead className="w-20 text-center">Half Day</TableHead>
                          <TableHead className="w-32">Custom Salary</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {editAttendanceForm.watch('entries')?.map((entry, index) => {
                          const entryDate = new Date(entry.date);
                          const dayName = format(entryDate, 'EEE');
                          const dateDisplay = format(entryDate, 'MMM dd');
                          const isEntryToday = isToday(entryDate);
                          
                          return (
                            <TableRow 
                              key={index} 
                              className={`${isEntryToday ? 'bg-blue-50 border-blue-200' : ''} ${
                                entry.type !== 'absent' ? 'bg-green-50' : ''
                              }`}
                            >
                              <TableCell>
                                <div className="font-medium">
                                  {dateDisplay}
                                  {isEntryToday && (
                                    <Badge variant="secondary" className="ml-2 text-xs">Today</Badge>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">{dayName}</div>
                              </TableCell>
                              
                              <TableCell className="text-center">
                                <Checkbox
                                  checked={entry.type === 'fullday'}
                                  onCheckedChange={() => handleEditAttendanceTypeChange(index, 'fullday')}
                                />
                              </TableCell>
                              
                              <TableCell className="text-center">
                                <Checkbox
                                  checked={entry.type === 'halfday'}
                                  onCheckedChange={() => handleEditAttendanceTypeChange(index, 'halfday')}
                                />
                              </TableCell>
                              
                              <TableCell>
                                <FormField
                                  control={editAttendanceForm.control}
                                  name={`entries.${index}.customSalary`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          placeholder="0"
                                          min="0"
                                          step="0.01"
                                          className="w-28"
                                          {...field}
                                          onChange={(e) => {
                                            const value = parseFloat(e.target.value) || 0;
                                            field.onChange(value);
                                            if (value > 0) {
                                              editAttendanceForm.setValue(`entries.${index}.type`, 'custom');
                                            } else if (entry.type === 'custom') {
                                              editAttendanceForm.setValue(`entries.${index}.type`, 'absent');
                                            }
                                          }}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </TableCell>
                              
                              <TableCell>
                                <FormField
                                  control={editAttendanceForm.control}
                                  name={`entries.${index}.notes`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          placeholder="Optional notes"
                                          className="w-full"
                                          {...field}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Summary Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Calculated Summary */}
                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-medium">Attendance Summary</h3>
                    
                    {(() => {
                      const entries = editAttendanceForm.watch('entries') || [];
                      const salaryData = calculateSalary(
                        entries,
                        employee.dailyRate,
                        editAttendanceForm.watch('overrideSalary'),
                        editAttendanceForm.watch('useOverrideSalary')
                      );
                      
                      const stats = entries.reduce((acc, entry) => {
                        switch (entry.type) {
                          case 'fullday': acc.fullDays += 1; break;
                          case 'halfday': acc.halfDays += 1; break;
                          case 'custom': acc.customDays += 1; break;
                          case 'absent': acc.absentDays += 1; break;
                        }
                        return acc;
                      }, { fullDays: 0, halfDays: 0, customDays: 0, absentDays: 0 });
                      
                      return (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Full Days:</span>
                            <span className="ml-2 font-medium text-green-600">{stats.fullDays}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Half Days:</span>
                            <span className="ml-2 font-medium text-yellow-600">{stats.halfDays}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Custom Days:</span>
                            <span className="ml-2 font-medium text-blue-600">{stats.customDays}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Absent Days:</span>
                            <span className="ml-2 font-medium text-gray-600">{stats.absentDays}</span>
                          </div>
                          <div className="col-span-2 pt-2 border-t">
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Working Days:</span>
                              <span className="font-medium">{salaryData.workingDays}</span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-muted-foreground">Total Salary:</span>
                              <span className="font-semibold text-lg">LKR {salaryData.totalSalary?.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Override Section */}
                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-medium">Salary Override</h3>
                    
                    <FormField
                      control={editAttendanceForm.control}
                      name="useOverrideSalary"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-medium cursor-pointer">
                            Override calculated salary
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    {editAttendanceForm.watch('useOverrideSalary') && (
                      <FormField
                        control={editAttendanceForm.control}
                        name="overrideSalary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Custom Salary Amount (LKR)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Enter custom salary amount"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {editAttendanceForm.watch('useOverrideSalary') && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          Override will replace the calculated salary. This action should be used for special cases only.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>

                <DialogFooter className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {editAttendanceForm.watch('entries')?.length || 0} days recorded
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setOpenEditDialog(false);
                        setEditingAttendance(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Update Attendance
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <Trash2 className="mr-2 h-5 w-5 text-destructive" />
              Delete Attendance Record
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteAttendance && (
                <>
                  Are you sure you want to delete the attendance record for <strong>{getPeriodLabel(deleteAttendance)}</strong>?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {/* Separate content outside of AlertDialogDescription */}
          {deleteAttendance && (
            <div className="px-6 pb-6">
              <div className="text-sm text-muted-foreground space-y-3">
                <p>This action cannot be undone. The following data will be permanently deleted:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>{deleteAttendance.entries.length} daily attendance entries</li>
                  <li>Total salary: LKR {deleteAttendance.totalSalary?.toLocaleString()}</li>
                  <li>Working days: {deleteAttendance.totalWorkingDays}</li>
                </ul>
              </div>
            </div>
          )}
          
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setOpenDeleteDialog(false);
              setDeleteAttendance(null);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAttendance}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Attendance
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
