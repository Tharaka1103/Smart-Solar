import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    // Clear auth cookies
    (await
          // Clear auth cookies
          cookies()).delete('auth-token');
    
    // You could also invalidate tokens in database if you're storing them
    
    return NextResponse.json({ 
      success: true, 
      message: 'Admin signed out successfully' 
    });
  } catch (error: any) {
    console.error('Admin logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Error during admin logout', error: error.message },
      { status: 500 }
    );
  }
}
