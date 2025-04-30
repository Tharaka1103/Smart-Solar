import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import UserModel from '@/models/User'
import { verifyJwt } from '@/lib/edge-jwt'

export async function GET(request: NextRequest) {
  try {
    // Get the query parameter for email
    const email = request.nextUrl.searchParams.get('email')
    
    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 })
    }
    
    // Connect to the database
    await connectToDatabase()
    
    // Find the user by email
    const user = await UserModel.findOne({ email }).select('-password')
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Return the user data
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
