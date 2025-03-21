import { NextRequest, NextResponse } from 'next/server'
import { verifyJwt, getJwtFromRequest } from '@/lib/edge-jwt'
import { connectToDatabase } from '@/lib/db'
import User from '@/models/User'

export async function GET(req: NextRequest) {
  try {
    // Get the token from cookies
    const token = getJwtFromRequest(req)

    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Verify the token
    const payload = await verifyJwt(token)

    // Connect to the database
    await connectToDatabase()

    // Find the user
    const user = await User.findById(payload.userId)
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    // Return user data
    return NextResponse.json({
      id: user._id.toString(),
      name: user.fullName,
      email: user.email,
      role: user.role,
    })
  } catch (error: any) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { message: 'Error getting user', error: error.message },
      { status: 500 }
    )
  }
}
