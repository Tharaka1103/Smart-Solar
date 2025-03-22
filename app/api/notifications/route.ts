import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Notification from '@/models/Notification';

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
