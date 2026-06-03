import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Contact from '@/models/Contact';
import { isAuthenticated } from '@/lib/auth-utils';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// GET — list all messages (admin only), newest first.
export async function GET() {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const messages = await Contact.find({}).sort({ createdAt: -1 });
        return NextResponse.json(messages);
    } catch (error) {
        console.error('Fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}

// POST — public contact submission from the landing page.
export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const body = await request.json();

        const name = typeof body.name === 'string' ? body.name.trim() : '';
        const email = typeof body.email === 'string' ? body.email.trim() : '';
        const message = typeof body.message === 'string' ? body.message.trim() : '';
        const company = typeof body.company === 'string' ? body.company.trim() : '';

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required.' },
                { status: 400 }
            );
        }
        if (!EMAIL_RE.test(email)) {
            return NextResponse.json({ error: 'Please provide a valid email.' }, { status: 400 });
        }

        const contact = await Contact.create({ name, email, message, company });
        return NextResponse.json(
            { message: 'Message sent', id: contact._id },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create error:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
