import mongoose, { Document, Schema } from 'mongoose';

export interface IOtpVerification extends Document {
  email: string;
  otp: string;
  createdAt: Date;
  expiresAt: Date;
}

const OtpVerificationSchema = new Schema(
  {
    email: { 
      type: String, 
      required: true 
    },
    otp: { 
      type: String, 
      required: true 
    },
    createdAt: { 
      type: Date, 
      default: Date.now, 
      expires: '10m' // OTP expires after 10 minutes
    },
    expiresAt: { 
      type: Date, 
      required: true 
    }
  }
);

export default mongoose.models.OtpVerification || 
  mongoose.model<IOtpVerification>('OtpVerification', OtpVerificationSchema);
