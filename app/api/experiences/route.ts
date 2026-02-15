import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Experience from '@/models/Experience';

export async function GET() {
    try {
        await dbConnect();
        // Sort by startDate descending (recent first)
        const experiences = await Experience.find({}).sort({ startDate: -1 });
        return NextResponse.json(experiences);
    } catch (error) {
        console.error('Fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch experiences' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const body = await request.json();

        const experienceData = { ...body };

        if (experienceData.startDate && typeof experienceData.startDate === 'string') {
            experienceData.startDate = new Date(experienceData.startDate);
        }

        if (experienceData.endDate && typeof experienceData.endDate === 'string') {
            experienceData.endDate = new Date(experienceData.endDate);
        } else if (experienceData.isCurrent) {
            experienceData.endDate = null;
        }

        const experience = await Experience.create(experienceData);
        return NextResponse.json(experience, { status: 201 });
    } catch (error) {
        console.error('Create error:', error);
        return NextResponse.json(
            { error: 'Failed to create experience' },
            { status: 500 }
        );
    }
}
