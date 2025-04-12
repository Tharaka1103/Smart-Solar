import { NextRequest, NextResponse } from 'next/server';
import {connectToDatabase} from '@/lib/db';
import User from '@/models/User';
import OtpVerification from '@/models/OtpVerification';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { email, otp, password } = await request.json();
    
    if (!email || !otp || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Verify OTP one more time
    const otpRecord = await OtpVerification.findOne({ 
      email, 
      otp,
      expiresAt: { $gt: new Date() }
    });
    
    if (!otpRecord) {
      return NextResponse.json(
        { message: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }
    
    // Find user and update password
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Update user's password
    user.password = hashedPassword;
    await user.save();
    
    // Delete the OTP record as it's been used
    await OtpVerification.deleteMany({ email });
    
    return NextResponse.json(
      { message: 'Password reset successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}