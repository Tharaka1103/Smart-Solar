import { NextRequest, NextResponse } from 'next/server';
import {connectToDatabase} from '@/lib/db';
import User from '@/models/User';
import OtpVerification from '@/models/OtpVerification';
import { sendOTPEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const user = await User.findOne({ email });
    
    if (!user) {
      // For security reasons, don't reveal that the email doesn't exist
      return NextResponse.json({ 
        message: 'If your email exists in our system, you will receive an OTP code shortly' 
      });
    }
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiry time to 10 minutes
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    
    // Delete any existing OTP records for this user
    await OtpVerification.deleteMany({ email });
    
    // Create new OTP record
    await OtpVerification.create({
      email,
      otp,
      expiresAt
    });
    
    // Send OTP email
    await sendOTPEmail(email, otp);
    
    return NextResponse.json({ 
      message: 'If your email exists in our system, you will receive an OTP code shortly' 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
