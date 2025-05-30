import mongoose, { Schema, Document } from 'mongoose';

export interface IInquiry extends Document {
  customerType: 'existing' | 'new';
  customerId?: mongoose.Types.ObjectId;
  customerDetails: {
    name: string;
    email: string;
    contact: string;
    address?: string;
    district?: string;
  };
  subject: string;
  message: string;
  type: string;
  status: 'pending' | 'responded' | 'closed';
  responses: Array<{
    message: string;
    respondedBy: string;
    respondedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

let Inquiry: mongoose.Model<IInquiry>;

try {
  // Check if the model is already defined
  Inquiry = mongoose.model<IInquiry>('Inquiry');
} catch (error) {
  const InquirySchema = new Schema<IInquiry>(
    {
      customerType: { 
        type: String, 
        required: true,
        enum: ['existing', 'new']
      },
      customerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Customer',
        required: false
      },
      customerDetails: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        contact: { type: String, required: true },
        address: { type: String },
        district: { type: String }
      },
      subject: { 
        type: String, 
        required: true,
        trim: true 
      },
      message: { 
        type: String, 
        required: true,
        trim: true 
      },
      type: { 
        type: String, 
        required: true,
        trim: true 
      },
      status: { 
        type: String, 
        required: true,
        enum: ['pending', 'responded', 'closed'],
        default: 'pending'
      },
      responses: [{
        message: { type: String, required: true },
        respondedBy: { type: String, required: true },
        respondedAt: { type: Date, default: Date.now }
      }]
    },
    { 
      timestamps: true 
    }
  );

  Inquiry = mongoose.model<IInquiry>('Inquiry', InquirySchema);
}

export default Inquiry;
