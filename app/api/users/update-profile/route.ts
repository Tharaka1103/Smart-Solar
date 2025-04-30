import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import UserModel from '@/models/User'
import { verifyJwt } from '@/lib/edge-jwt'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, fullName, phone, district, address } = body
    
    if (!email || !fullName || !phone || !district || !address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Connect to the database
    await connectToDatabase()
    
    // Find the user by email and update
    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      { 
        fullName,
        phone,
        district,
        address,
        updatedAt: new Date()
      },
      { new: true }
    ).select('-password')
    
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Return the updated user data
    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
