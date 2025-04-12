import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Project from '@/models/Project';

export async function GET(req: NextRequest) {
  try {
    // Get the project ID from the URL
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const projectId = pathSegments[pathSegments.length - 1];
    
    // Connect to the database
    await connectToDatabase();
    
    // Find the project by ID
    const project = await Project.findById(projectId);
    
    // If the project doesn't exist, return a 404
    if (!project) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Return the project data
    return NextResponse.json(project);
  } catch (error: any) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { message: 'Error fetching project', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const projectId = pathSegments[pathSegments.length - 1];
    const updateData = await req.json();
    
    await connectToDatabase();
    
    // Ensure projectId field is not modified
    if (updateData.projectId) {
      delete updateData.projectId;
    }
    
    const project = await Project.findByIdAndUpdate(
      projectId,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(project);
  } catch (error: any) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { message: 'Error updating project', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const projectId = pathSegments[pathSegments.length - 1];
    
    await connectToDatabase();
    
    const project = await Project.findByIdAndDelete(projectId);
    
    if (!project) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Project deleted successfully' }
    );
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { message: 'Error deleting project', error: error.message },
      { status: 500 }
    );
  }
}