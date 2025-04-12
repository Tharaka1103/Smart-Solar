import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Maintenance from '@/models/Maintenance';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const maintenanceId = params.id;
    const maintenance = await Maintenance.findById(maintenanceId);
    
    if (!maintenance) {
      return NextResponse.json(
        { message: 'Maintenance record not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(maintenance);
  } catch (error: any) {
    console.error('Error fetching maintenance record:', error);
    return NextResponse.json(
      { message: 'Error fetching maintenance record', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const maintenanceId = params.id;
    const updateData = await req.json();
    
    const maintenance = await Maintenance.findByIdAndUpdate(
      maintenanceId,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!maintenance) {
      return NextResponse.json(
        { message: 'Maintenance record not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(maintenance);
  } catch (error: any) {
    console.error('Error updating maintenance record:', error);
    return NextResponse.json(
      { message: 'Error updating maintenance record', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const maintenanceId = params.id;
    
    const maintenance = await Maintenance.findByIdAndDelete(maintenanceId);
    
    if (!maintenance) {
      return NextResponse.json(
        { message: 'Maintenance record not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Maintenance record deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting maintenance record:', error);
    return NextResponse.json(
      { message: 'Error deleting maintenance record', error: error.message },
      { status: 500 }
    );
  }
}
