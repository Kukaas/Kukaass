import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Resume from '@/models/Resume';
import { isAuthenticated } from '@/lib/auth-utils';

// GET all resumes or just the active one
export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const activeOnly = searchParams.get('active') === 'true';

        let resumes;
        if (activeOnly) {
            resumes = await Resume.findOne({ isActive: true }).sort({ createdAt: -1 });
            if (resumes && !resumes.originalFilename) {
                resumes.originalFilename = `${resumes.filename}.pdf`;
            }
        } else {
            const rawResumes = await Resume.find({}).sort({ createdAt: -1 });
            resumes = rawResumes.map(r => {
                const doc = r.toObject();
                if (!doc.originalFilename) {
                    doc.originalFilename = `${doc.filename}.pdf`;
                }
                return doc;
            });
        }

        return NextResponse.json(resumes);
    } catch (error) {
        console.error('Failed to fetch resumes:', error);
        return NextResponse.json({ error: 'Failed to fetch resumes' }, { status: 500 });
    }
}

// POST a new resume (Base64)
export async function POST(request: NextRequest) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const body = await request.json();
        const { label, filename, originalFilename, content, contentType } = body;

        if (!label || !content) {
            return NextResponse.json({ error: 'Label and content are required' }, { status: 400 });
        }

        // Create the new resume.
        // The pre-save hook in the model will handle deactivating others because default isActive is true.
        const newResume = await Resume.create({
            label,
            filename,
            originalFilename,
            content,
            contentType: contentType || 'application/pdf',
            isActive: true, // Always make the new one active
        });

        return NextResponse.json(newResume, { status: 201 });
    } catch (error) {
        console.error('Failed to upload resume:', error);
        return NextResponse.json({ error: 'Failed to upload resume' }, { status: 500 });
    }
}
