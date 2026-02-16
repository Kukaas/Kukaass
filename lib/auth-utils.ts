import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'fallback-secret-at-least-32-chars-long';

export async function createSession() {
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const token = jwt.sign({ authenticated: true }, SECRET, { expiresIn: '7d' });

    const cookieStore = await cookies();
    cookieStore.set('admin_session', token, {
        expires,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    if (!token) return null;

    try {
        const payload = jwt.verify(token, SECRET);
        return payload;
    } catch (error) {
        return null;
    }
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
}

export async function isAuthenticated() {
    const session = await getSession();
    return !!session;
}
