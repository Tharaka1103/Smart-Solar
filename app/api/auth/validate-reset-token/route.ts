import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import mongoose from 'mongoose'

let PasswordReset: any
try {
  PasswordReset = mongoose.model('PasswordReset')
} catch {
  const PasswordResetSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600, // Token expires after 1 hour
    },
  })
  
  PasswordReset = mongoose.model('PasswordReset', PasswordResetSchema)
}

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json(
        { message: 'Token is required' },
        { status: 400 }
      )
    }

    // Connect to the database
    await connectToDatabase()

    // Find the reset token
    const resetToken = await PasswordReset.findOne({ token })
    
    if (!resetToken) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 400 }
      )
    }

    return NextResponse.json({ valid: true })
  } catch (error: any) {
    console.error('Token validation error:', error)
    return NextResponse.json(
      { message: 'Error validating token', error: error.message },
      { status: 500 }
    )
  }
}
