import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Notification from '@/models/Notification';
import { getServerSession } from 'next-auth';
// Get all notifications
export async function GET() {
  try {
    await connectToDatabase();
    const notifications = await Notification.find().sort({ createdAt: -1 });
    
    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

// Create a notification
export async function POST(req: Request) {
  try {
 
    const body = await req.json();
    await connectToDatabase();
    
    // Validate request body
    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }
    
    // Create notification
    const notification = await Notification.create({
      title: body.title,
      description: body.description,
      type: body.type || 'info',
      read: body.read || false,
    });
    
    return NextResponse.json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}

// Mark notifications as read
export async function PUT(req: Request) {
  try {
    
    const { ids } = await req.json();
    await connectToDatabase();
    
    const result = await Notification.updateMany(
      { _id: { $in: ids } },
      { $set: { read: true } }
    );
    
    return NextResponse.json({ message: 'Notifications marked as read', updatedCount: result.modifiedCount });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
  }
}
