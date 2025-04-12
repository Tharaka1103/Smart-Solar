import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import mongoose from 'mongoose'

let Inquiry: any
try {
  Inquiry = mongoose.model('Inquiry')
} catch {
  // Inquiry model will be defined in the main route file
}

export async function PATCH(
  req: NextRequest,
) {
  try {
    // Get ID from URL pathname
    const pathname = req.nextUrl.pathname
    const id = pathname.split('/').pop() || ''
    const { status } = await req.json()
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid inquiry ID' },
        { status: 400 }
      )
    }
    
    if (!status || !['pending', 'responded', 'closed'].includes(status)) {
      return NextResponse.json(
        { message: 'Valid status is required (pending, responded, or closed)' },
        { status: 400 }
      )
    }
    
    await connectToDatabase()
    
    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
    
    if (!inquiry) {
      return NextResponse.json(
        { message: 'Inquiry not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(inquiry)
  } catch (error: any) {
    console.error('Error updating inquiry status:', error)
    return NextResponse.json(
      { message: 'Error updating status', error: error.message },
      { status: 500 }
    )
  }
}