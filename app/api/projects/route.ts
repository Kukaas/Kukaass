import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';

export async function GET() {
  try {
    await dbConnect();
    const projects = await Project.find({}).sort({ createdAt: -1 });

    // Ensure backward compatibility for all projects
    const projectsWithCompatibility = projects.map(project => {
      const projectData = project.toObject();
      if (projectData.isPrivate === undefined) {
        projectData.isPrivate = false;
      }
      // Ensure new date fields exist for backward compatibility
      if (projectData.startDate === undefined) {
        projectData.startDate = null;
      }
      if (projectData.endDate === undefined) {
        projectData.endDate = null;
      }
      if (projectData.isOngoing === undefined) {
        projectData.isOngoing = false;
      }
      return projectData;
    });

    return NextResponse.json(projectsWithCompatibility);
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

            // Convert date strings to Date objects
    const projectData = { ...body };

    // Handle startDate - if not provided, use current date as fallback
    if (projectData.startDate && typeof projectData.startDate === 'string') {
      projectData.startDate = new Date(projectData.startDate);
    } else if (!projectData.startDate) {
      // If no startDate provided, use current date as fallback
      projectData.startDate = new Date();
    }

    if (projectData.endDate && typeof projectData.endDate === 'string' && projectData.endDate.trim() !== '') {
      projectData.endDate = new Date(projectData.endDate);
    } else if (projectData.endDate === '' || projectData.endDate === null) {
      projectData.endDate = null;
    }

    const project = await Project.create(projectData);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Create error:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
