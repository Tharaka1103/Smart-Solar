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

// Function to generate the next project ID
async function generateNextProjectId() {
  try {
    // Find the project with the highest project ID
    const latestProject = await Project.findOne({}, { projectId: 1 })
      .sort({ projectId: -1 })
      .lean();
    
    if (!latestProject || !latestProject.projectId) {
      // If no projects exist yet, start with PRJ0000001
      return 'PRJ0000001';
    }
    
    // Extract the numeric part
    const numericPart = latestProject.projectId.substring(3); // Remove 'PRJ'
    const nextNumber = parseInt(numericPart, 10) + 1;
    
    // Format to ensure 7 digits with leading zeros
    const nextId = 'PRJ' + nextNumber.toString().padStart(7, '0');
    
    return nextId;
  } catch (error) {
    console.error('Error generating project ID:', error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const projectData = await req.json();
    
    // Generate the next project ID
    const projectId = await generateNextProjectId();
    
    // Add the project ID to the project data
    const projectWithId = {
      ...projectData,
      projectId
    };
    
    const project = await Project.create(projectWithId);
    
    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { message: 'Error creating project', error: error.message },
      { status: 500 }
    );
  }
}
