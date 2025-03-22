import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFinance extends Document {
  title: string;
  amount: number;
  category: 'income' | 'expense';
  date: Date;
  description: string;
  paymentMethod: string;
  reference: string;
  attachmentUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FinanceSchema = new Schema(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, enum: ['income', 'expense'], required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    reference: { type: String, required: true },
    attachmentUrl: { type: String },
  },
  { timestamps: true }
);

// Create or retrieve the model
const Finance: Model<IFinance> = mongoose.models.Finance || mongoose.model<IFinance>('Finance', FinanceSchema);

export default Finance;
