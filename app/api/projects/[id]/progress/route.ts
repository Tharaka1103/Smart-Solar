import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Project from '@/models/Project';

// Update a project
export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const { status } = await req.json();
    const id = req.nextUrl.pathname.split('/').pop();
    
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!updatedProject) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedProject);
  } catch (error: any) {
    console.error('Error updating project status:', error);
    return NextResponse.json(
      { message: 'Error updating project status', error: error.message },
      { status: 500 }
    );
  }
}