import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import mongoose from 'mongoose'

// Define the inquiry schema if it doesn't exist
let Inquiry: any
try {
  Inquiry = mongoose.model('Inquiry')
} catch {
  const InquirySchema = new mongoose.Schema(
    {
      customerType: {
        type: String,
        enum: ['existing', 'new'],
        required: true
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
        required: true 
      },
      message: { 
        type: String, 
        required: true 
      },
      type: { 
        type: String, 
        required: true 
      },
      status: {
        type: String,
        enum: ['pending', 'responded', 'closed'],
        default: 'pending'
      },
      responses: [{
        message: { type: String, required: true },
        respondedBy: { type: String, required: true },
        respondedAt: { type: Date, default: Date.now }
      }]
    },
    { timestamps: true }
  )

  Inquiry = mongoose.model('Inquiry', InquirySchema)
}

// GET handler to fetch inquiries by user email
export async function GET(req: NextRequest) {
  try {
    // Extract email from query params
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { message: 'Email parameter is required' },
        { status: 400 }
      )
    }

    // Connect to the database
    await connectToDatabase()

    // Find inquiries that match the email
    const inquiries = await Inquiry.find({
      'customerDetails.email': email
    }).sort({ updatedAt: -1 }) // Sort by latest first

    return NextResponse.json(inquiries)
  } catch (error: any) {
    console.error('Error fetching user inquiries:', error)
    return NextResponse.json(
      { message: 'Error fetching inquiries', error: error.message },
      { status: 500 }
    )
  }
}
