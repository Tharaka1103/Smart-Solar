import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import mongoose from 'mongoose'

let Inquiry: any
try {
  Inquiry = mongoose.model('Inquiry')
} catch {
  // Inquiry model will be defined in the main route file
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const { message } = await req.json()
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid inquiry ID' },
        { status: 400 }
      )
    }
    
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json(
        { message: 'Message content is required' },
        { status: 400 }
      )
    }
    
    await connectToDatabase()
    
    const inquiry = await Inquiry.findById(id)
    
    if (!inquiry) {
      return NextResponse.json(
        { message: 'Inquiry not found' },
        { status: 404 }
      )
    }
    
    // Add user reply
    inquiry.responses.push({
      message: message.trim(),
      respondedBy: 'Customer',
      respondedAt: new Date()
    })
    
    // Update status if it was 'closed'
    if (inquiry.status === 'closed') {
      inquiry.status = 'pending'
    }
    
    await inquiry.save()
    
    return NextResponse.json(inquiry)
  } catch (error: any) {
    console.error('Error adding user reply:', error)
    return NextResponse.json(
      { message: 'Error adding reply', error: error.message },
      { status: 500 }
    )
  }
}
