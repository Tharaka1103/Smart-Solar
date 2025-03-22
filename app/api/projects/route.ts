import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Project from '@/models/Project';

export async function GET() {
  try {
    await connectToDatabase();
    
    const projects = await Project.find();
    
    return NextResponse.json(projects);
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { message: 'Error fetching projects', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const projectData = await req.json();
    
    const project = await Project.create(projectData);
    
    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { message: 'Error creating project', error: error.message },
      { status: 500 }
    );
  }
}