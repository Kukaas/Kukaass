import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminPassword) {
            console.error('ADMIN_PASSWORD is not set in environment variables');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        if (password === adminPassword) {
            await createSession();
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json(
                { error: 'Incorrect password' },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'An entry error occurred' },
            { status: 500 }
        );
    }
}
