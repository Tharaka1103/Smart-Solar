import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import User from '@/models/User'
import { hashPassword } from '@/lib/password'
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
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json(
        { message: 'Token and password are required' },
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

    // Find the user
    const user = await User.findById(resetToken.userId)
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    // Hash the password
    const hashedPassword = await hashPassword(password)

    // Update the user's password
    user.password = hashedPassword
    await user.save()

    // Delete the reset token
    await PasswordReset.deleteOne({ _id: resetToken._id })

    return NextResponse.json({ message: 'Password reset successful' })
  } catch (error: any) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { message: 'Error resetting password', error: error.message },
      { status: 500 }
    )
  }
}
