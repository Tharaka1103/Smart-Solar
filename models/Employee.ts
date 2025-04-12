import { Schema, model, Document, models, Model } from 'mongoose';

export interface AttendanceEntry {
  date: Date;
  hoursWorked: number;
  isLeave: boolean;
}

export interface AttendanceMonth {
  year: number;
  month: number;  // 0-11 representing Jan-Dec
  entries: AttendanceEntry[];
  totalHours: number;
  totalSalary: number;
  manualSalaryAdjustment?: boolean;
}

export interface EmployeeDocument extends Document {
  name: string;
  email: string;
  role: string;
  contact: string;
  address: string;
  hourlyRate: number;
  joiningDate: Date;
  attendance: AttendanceMonth[];
  bankDetails?: {
    accountNumber?: string;
    bankName?: string;
    branch?: string;
  };
}

const AttendanceEntrySchema = new Schema({
  date: { type: Date, required: true },
  hoursWorked: { type: Number, default: 0 },
  isLeave: { type: Boolean, default: false }
});

const AttendanceMonthSchema = new Schema({
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  entries: [AttendanceEntrySchema],
  totalHours: { type: Number, default: 0 },
  totalSalary: { type: Number, default: 0 },
  manualSalaryAdjustment: { type: Boolean, default: false }
});

const EmployeeSchema = new Schema<EmployeeDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    hourlyRate: { type: Number, required: true, default: 0 },
    joiningDate: { type: Date, default: Date.now },
    attendance: [AttendanceMonthSchema],
    bankDetails: {
      accountNumber: { type: String },
      bankName: { type: String },
      branch: { type: String }
    }
  },
  { timestamps: true }
);

export default models.Employee || model<EmployeeDocument>('Employee', EmployeeSchema);
