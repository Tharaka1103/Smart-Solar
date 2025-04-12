import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Project from '@/models/Project';
import Maintenance from '@/models/Maintenance';
import Notification from '@/models/Notification';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get project ID from URL path
    const projectId = req.url.split('/').pop();
    
    // Find the project
    const project = await Project.findById(projectId);
    
    if (!project) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Update project status to completed
    project.status = 'completed';
    project.completionDate = new Date().toISOString().split('T')[0];
    
    // Add "Project Completed" to progress
    project.progress.push({
      date: new Date(),
      status: 'Project Completed'
    });
    
    await project.save();
    
    // Calculate maintenance date (1 year from now)
    const maintenanceDate = new Date();
    maintenanceDate.setFullYear(maintenanceDate.getFullYear() + 1);
    
    // Create maintenance record
    const maintenanceRecord = await Maintenance.create({
      projectId: project.projectId,
      systemId: `SYS-${project.projectId.substring(3)}`,
      clientName: project.userName,
      email: project.email,
      contact: project.contact,
      location: project.location,
      maintenanceDate: maintenanceDate,
      maintenanceTime: "Any Time",
      duration: 2,
      type: 'routine',
      priority: 'medium',
      description: `Annual maintenance for ${project.systemSize}kW system installed at ${project.location}`,
      notes: 'Automatically scheduled upon project completion',
      status: 'pending'
    });
    
    // Create notification
    await Notification.create({
      title: 'New Maintenance Scheduled',
      description: `Annual maintenance for ${project.userName}'s solar system (${project.projectId}) has been automatically scheduled for ${maintenanceDate.toLocaleDateString()}`,
      type: 'info',
      read: false
    });
    
    return NextResponse.json({ 
      message: 'Project marked as complete and maintenance scheduled',
      project,
      maintenanceRecord 
    });
  } catch (error: any) {
    console.error('Error completing project:', error);
    return NextResponse.json(
      { message: 'Error completing project', error: error.message },
      { status: 500 }
    );
  }
}