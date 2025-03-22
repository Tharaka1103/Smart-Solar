import { connectToDatabase } from '@/lib/db';
import Notification from '@/models/Notification';

type NotificationType = 'info' | 'warning' | 'success' | 'error';

interface CreateNotificationOptions {
  title: string;
  description: string;
  type?: NotificationType;
}

/**
 * Create a new notification
 */
export async function createNotification({ 
  title, 
  description, 
  type = 'info' 
}: CreateNotificationOptions) {
  try {
    await connectToDatabase();
    
    const notification = await Notification.create({
      title,
      description,
      type,
      read: false,
    });
    
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw new Error('Failed to create notification');
  }
}

/**
 * Create a system notification (info type)
 */
export function createSystemNotification(title: string, description: string) {
  return createNotification({ title, description, type: 'info' });
}

/**
 * Create a warning notification
 */
export function createWarningNotification(title: string, description: string) {
  return createNotification({ title, description, type: 'warning' });
}

/**
 * Create a success notification
 */
export function createSuccessNotification(title: string, description: string) {
  return createNotification({ title, description, type: 'success' });
}

/**
 * Create an error notification
 */
export function createErrorNotification(title: string, description: string) {
  return createNotification({ title, description, type: 'error' });
}
