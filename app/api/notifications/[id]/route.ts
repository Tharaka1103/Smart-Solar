import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/db';
import Notification from '@/models/Notification';

// Delete a single notification by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {


    // Connect to database
    await connectToDatabase();

    // Get ID from URL
    const { id } = params;

    // Delete the notification
    const result = await Notification.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Notification deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    );
  }
}
