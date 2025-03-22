import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/db';
import Notification from '@/models/Notification';

// Bulk delete notifications
export async function DELETE(req: Request) {
  try {
    // Verify admin authorization
 
    // Connect to database
    await connectToDatabase();
    
    // Get IDs from request body
    const { ids } = await req.json();
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request. Expected array of notification IDs' },
        { status: 400 }
      );
    }

    // Delete the notifications
    const result = await Notification.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({
      message: 'Notifications deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting notifications:', error);
    return NextResponse.json(
      { error: 'Failed to delete notifications' },
      { status: 500 }
    );
  }
}
