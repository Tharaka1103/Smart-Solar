import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Maintenance from '@/models/Maintenance';
import Notification from '@/models/Notification';

export async function GET() {
  try {
    await connectToDatabase();
    
    const maintenanceRecords = await Maintenance.find().sort({ maintenanceDate: 1 });
    
    return NextResponse.json(maintenanceRecords);
  } catch (error: any) {
    console.error('Error fetching maintenance records:', error);
    return NextResponse.json(
      { message: 'Error fetching maintenance records', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const maintenanceData = await req.json();
    
    // Create maintenance record
    const maintenance = await Maintenance.create(maintenanceData);
    
    // Create notification for the new maintenance record
    await Notification.create({
      title: 'New Maintenance Scheduled',
      description: `Maintenance for ${maintenanceData.clientName} (${maintenanceData.systemId}) scheduled on ${new Date(maintenanceData.maintenanceDate).toLocaleDateString()}`,
      type: 'info',
      read: false,
    });
    
    return NextResponse.json(maintenance, { status: 201 });
  } catch (error: any) {
    console.error('Error creating maintenance record:', error);
    return NextResponse.json(
      { message: 'Error creating maintenance record', error: error.message },
      { status: 500 }
    );
  }
}
