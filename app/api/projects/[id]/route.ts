import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Convert to plain object and ensure backward compatibility
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

    return NextResponse.json(projectData);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

            // Convert date strings to Date objects
    const updateData = { ...body };

    // Handle startDate - if not provided, use current date as fallback
    if (updateData.startDate && typeof updateData.startDate === 'string') {
      updateData.startDate = new Date(updateData.startDate);
    } else if (!updateData.startDate) {
      // If no startDate provided, use current date as fallback
      updateData.startDate = new Date();
    }

    if (updateData.endDate && typeof updateData.endDate === 'string' && updateData.endDate.trim() !== '') {
      updateData.endDate = new Date(updateData.endDate);
    } else if (updateData.endDate === '' || updateData.endDate === null) {
      updateData.endDate = null;
    }

    const project = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
