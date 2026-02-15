import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Experience from '@/models/Experience';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const experience = await Experience.findById(params.id);
        if (!experience) {
            return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
        }
        return NextResponse.json(experience);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch experience' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const experience = await Experience.findByIdAndUpdate(
            params.id,
            experienceData,
            { new: true, runValidators: true }
        );

        if (!experience) {
            return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
        }

        return NextResponse.json(experience);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const experience = await Experience.findByIdAndDelete(params.id);
        if (!experience) {
            return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Experience deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
    }
}
