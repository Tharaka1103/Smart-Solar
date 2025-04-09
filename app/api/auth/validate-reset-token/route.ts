import type { NextApiRequest, NextApiResponse } from 'next';
import {connectToDatabase} from '@/lib/db';
import User from '@/models/User';
import OtpVerification from '@/models/OtpVerification';
import bcrypt from 'bcryptjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectToDatabase();
    
    const { email, otp, password } = req.body;
    
    if (!email || !otp || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Verify OTP one more time
    const otpRecord = await OtpVerification.findOne({ 
      email, 
      otp,
      expiresAt: { $gt: new Date() }
    });
    
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    
    // Find user and update password
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Update user's password
    user.password = hashedPassword;
    await user.save();
    
    // Delete the OTP record as it's been used
    await OtpVerification.deleteMany({ email });
    
    return res.status(200).json({ 
      message: 'Password reset successful' 
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
