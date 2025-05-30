import { Schema, model, Document, models, Model } from 'mongoose';

export interface AttendanceEntry {
  date: Date;
  type: 'fullday' | 'halfday' | 'custom' | 'absent';
  customSalary?: number;
  notes?: string;
}

export interface AttendanceMonth {
  year: number;
  month: number;  // 0-11 representing Jan-Dec
  periodType: 'regular' | 'custom'; // regular: 1st-30th/31st, custom: 25th-25th
  startDate: Date;
  endDate: Date;
  entries: AttendanceEntry[];
  totalWorkingDays: number;
  totalSalary: number;
  overrideSalary?: number;
  useOverrideSalary?: boolean;
}

export interface EmployeeDocument extends Document {
  name: string;
  email: string;
  role: string;
  contact: string;
  address: string;
  dailyRate: number;
  joiningDate: Date;
  attendance: AttendanceMonth[];
  bankDetails?: {
    accountNumber?: string;
    bankName?: string;
    branch?: string;
    nameOnAccount?: string;
  };
  documents?: Array<{
    _id?: string;
    fileName: string;
    originalName: string;
    fileType: string;
    fileSize: number;
    driveFileId: string;
    webViewLink: string;
    uploadedAt: Date;
    uploadedBy?: string;
    description?: string;
  }>;
  isDeleted?: boolean;
  deletedAt?: Date;
}

const AttendanceEntrySchema = new Schema({
  date: { type: Date, required: true },
  type: { 
    type: String, 
    enum: ['fullday', 'halfday', 'custom', 'absent'], 
    default: 'absent' 
  },
  customSalary: { type: Number, default: 0 },
  notes: { type: String, default: '' }
});

const AttendanceMonthSchema = new Schema({
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  periodType: { type: String, enum: ['regular', 'custom'], default: 'regular' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  entries: [AttendanceEntrySchema],
  totalWorkingDays: { type: Number, default: 0 },
  totalSalary: { type: Number, default: 0 },
  overrideSalary: { type: Number },
  useOverrideSalary: { type: Boolean, default: false }
});

const DocumentSchema = new Schema({
  fileName: { type: String, required: true },
  originalName: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  driveFileId: { type: String, required: true },
  webViewLink: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  uploadedBy: { type: String },
  description: { type: String }
});

const EmployeeSchema = new Schema<EmployeeDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    dailyRate: { type: Number, required: true, default: 0 },
    joiningDate: { type: Date, default: Date.now },
    attendance: [AttendanceMonthSchema],
    bankDetails: {
      accountNumber: { type: String },
      bankName: { type: String },
      branch: { type: String },
      nameOnAccount: { type: String }
    },
    documents: [DocumentSchema],
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
  },
  { timestamps: true }
);

// Add indexes for better query performance
EmployeeSchema.index({ email: 1, isDeleted: 1 });
EmployeeSchema.index({ role: 1, isDeleted: 1 });
EmployeeSchema.index({ 'attendance.year': 1, 'attendance.month': 1, 'attendance.periodType': 1 });
EmployeeSchema.index({ 'documents.driveFileId': 1 });

export default models.Employee || model<EmployeeDocument>('Employee', EmployeeSchema);
