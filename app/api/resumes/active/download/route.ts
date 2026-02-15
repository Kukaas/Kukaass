import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Resume from '@/models/Resume';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        // Find the active resume
        const resume = await Resume.findOne({ isActive: true });

        if (!resume || !resume.content) {
            return NextResponse.json({ error: 'No active resume found' }, { status: 404 });
        }

        // The content is stored as a Base64 string (including data:application/pdf;base64, prefix)
        const base64Data = resume.content.split(',')[1];
        if (!base64Data) {
            return NextResponse.json({ error: 'Invalid resume content' }, { status: 500 });
        }

        const buffer = Buffer.from(base64Data, 'base64');
        const filename = resume.filename || 'Resume';
        const contentType = resume.contentType || 'application/pdf';

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${filename}.pdf"`,
            },
        });
    } catch (error) {
        console.error('Failed to download resume:', error);
        return NextResponse.json({ error: 'Failed to download resume' }, { status: 500 });
    }
}
