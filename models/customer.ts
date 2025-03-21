import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  email: string;
  contact: string;
  address: string;
  district: string;
  service: string;
  electricityAccountNumber: string;
  nic: string;
  createdAt: Date;
  updatedAt: Date;
}

let Customer: mongoose.Model<ICustomer>;

try {
  // Check if the model is already defined
  Customer = mongoose.model<ICustomer>('Customer');
} catch (error) {
  const CustomerSchema = new Schema<ICustomer>(
    {
      name: { 
        type: String, 
        required: [true, 'Name is required'],
        trim: true 
      },
      email: { 
        type: String, 
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'] 
      },
      contact: { 
        type: String, 
        required: [true, 'Contact number is required'],
        trim: true 
      },
      address: { 
        type: String, 
        required: [true, 'Address is required'],
        trim: true 
      },
      district: { 
        type: String, 
        required: [true, 'District is required'],
        trim: true 
      },
      service: { 
        type: String, 
        required: [true, 'Service is required'],
        trim: true 
      },
      electricityAccountNumber: { 
        type: String, 
        required: [true, 'Electricity account number is required'],
        trim: true 
      },
      nic: { 
        type: String, 
        required: [true, 'NIC is required'],
        trim: true 
      }
    },
    { 
      timestamps: true 
    }
  );

  Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);
}

export default Customer;
