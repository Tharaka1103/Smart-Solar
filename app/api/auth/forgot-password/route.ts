import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { connectToDatabase } from '@/lib/db'
import User from '@/models/User'
import { sendEmail } from '@/lib/email'

// Create a model for reset tokens if it doesn't exist
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
    const { email } = await req.json()

    // Connect to the database
    await connectToDatabase()

    // Find the user
    const user = await User.findOne({ email })
    
    // For security, we always return a success response even if the user doesn't exist
    if (!user) {
      return NextResponse.json({ 
        message: "If an account with that email exists, we've sent password reset instructions." 
      })
    }

    // Delete any existing reset tokens for this user
    await PasswordReset.deleteMany({ userId: user._id })

    // Create a reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    
    // Store the reset token
    await PasswordReset.create({
      userId: user._id,
      token: resetToken,
    })

    // Create the reset URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`

    // Send the reset email
    await sendEmail({
      to: user.email,
      subject: 'Reset your Smart Solar password',
      text: `Please use the following link to reset your password: ${resetUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0070f3; text-align: center;">Reset Your Password</h2>
          <p>Hello ${user.fullName},</p>
          <p>We received a request to reset your password for your Smart Solar account. Click the button below to reset it:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
          </div>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
          <p>Thanks,<br>The Smart Solar Team</p>
        </div>
      `,
    })

    return NextResponse.json({ 
      message: "If an account with that email exists, we've sent password reset instructions." 
    })
  } catch (error: any) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { message: 'Error sending password reset email', error: error.message },
      { status: 500 }
    )
  }
}
