import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Contact from '@/models/Contact';
import { isAuthenticated } from '@/lib/auth-utils';

// PATCH — toggle read/unread (admin only).
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        await dbConnect();
        const body = await request.json();

        const contact = await Contact.findByIdAndUpdate(
            id,
            { isRead: Boolean(body.isRead) },
            { new: true, runValidators: true }
        );

        if (!contact) {
            return NextResponse.json({ error: 'Message not found' }, { status: 404 });
        }
        return NextResponse.json(contact);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
    }
}

// DELETE — remove a message (admin only).
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        await dbConnect();
        const contact = await Contact.findByIdAndDelete(id);
        if (!contact) {
            return NextResponse.json({ error: 'Message not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Message deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
    }
}
