import mongoose, { Schema, Document, Model } from 'mongoose';

export interface MaintenanceDocument extends Document {
  projectId: string;
  systemId: string;
  clientName: string;
  email: string;
  contact: string;
  location: string;
  maintenanceDate: Date;
  maintenanceTime: string;
  duration: number;
  type: 'routine' | 'repair' | 'cleaning' | 'inspection' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  notes?: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const MaintenanceSchema = new Schema<MaintenanceDocument>(
  {
    projectId: { type: String, required: true },
    systemId: { type: String, required: true },
    clientName: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    location: { type: String, required: true },
    maintenanceDate: { type: Date, required: true },
    maintenanceTime: { type: String, required: true },
    duration: { type: Number, required: true, default: 2 },
    type: { 
      type: String, 
      enum: ['routine', 'repair', 'cleaning', 'inspection', 'emergency'], 
      default: 'routine' 
    },
    priority: { 
      type: String, 
      enum: ['low', 'medium', 'high', 'urgent'], 
      default: 'medium' 
    },
    description: { type: String, required: true },
    notes: { type: String },
    status: { 
      type: String, 
      enum: ['pending', 'completed', 'cancelled'], 
      default: 'pending' 
    }
  },
  { timestamps: true }
);

const Maintenance: Model<MaintenanceDocument> = 
  mongoose.models.Maintenance || 
  mongoose.model<MaintenanceDocument>('Maintenance', MaintenanceSchema);

export default Maintenance;
