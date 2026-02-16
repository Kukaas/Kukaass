import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Resume from '@/models/Resume';
import { isAuthenticated } from '@/lib/auth-utils';

// PATCH to update resume details or toggle isActive
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const { id } = await params;
        const { isActive, label, filename, originalFilename, content, contentType } = await request.json();

        // Find the resume
        const resume = await Resume.findById(id);
        if (!resume) {
            return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
        }

        // Update fields if provided
        if (label !== undefined) resume.label = label;
        if (filename !== undefined) resume.filename = filename;
        if (isActive !== undefined) resume.isActive = isActive;
        if (content !== undefined) resume.content = content;
        if (contentType !== undefined) resume.contentType = contentType;
        if (originalFilename !== undefined) resume.originalFilename = originalFilename;

        await resume.save(); // This will trigger the pre-save hook to deactivate others ONLY if isActive is true

        return NextResponse.json(resume);
    } catch (error) {
        console.error('Failed to update resume:', error);
        return NextResponse.json({ error: 'Failed to update resume' }, { status: 500 });
    }
}

// DELETE a resume
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const { id } = await params;

        const resume = await Resume.findByIdAndDelete(id);
        if (!resume) {
            return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Resume deleted successfully' });
    } catch (error) {
        console.error('Failed to delete resume:', error);
        return NextResponse.json({ error: 'Failed to delete resume' }, { status: 500 });
    }
}
