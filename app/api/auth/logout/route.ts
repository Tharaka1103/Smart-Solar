import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    // Delete the auth token cookie
    const cookieStore = await cookies()
    cookieStore.delete('auth-token')

    return NextResponse.json({
      message: 'Logged out successfully',
    })
  } catch (error: any) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { message: 'Error during logout', error: error.message },
      { status: 500 }
    )
  }
}
