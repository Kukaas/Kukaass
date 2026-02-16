import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth-utils';

export async function GET() {
    const authenticated = await isAuthenticated();
    return NextResponse.json({ authenticated });
}
