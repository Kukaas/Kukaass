import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Setting from '@/models/Settings';
import { isAuthenticated } from '@/lib/auth-utils';

export async function GET() {
    try {
        // Publicly readable settings
        await dbConnect();
        // Return all settings as a key-value map for easier frontend consumption
        const settings = await Setting.find({});
        const settingsMap = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, any>);

        return NextResponse.json(settingsMap);
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const { key, value } = await req.json();

        if (!key) {
            return NextResponse.json({ error: 'Key is required' }, { status: 400 });
        }

        const setting = await Setting.findOneAndUpdate(
            { key },
            { value, updatedAt: new Date() },
            { upsert: true, new: true }
        );

        return NextResponse.json(setting);
    } catch (error) {
        console.error('Error updating setting:', error);
        return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
    }
}
