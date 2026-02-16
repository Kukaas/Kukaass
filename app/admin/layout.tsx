import { isAuthenticated } from '@/lib/auth-utils';
import AdminLogin from '@/components/admin/AdminLogin';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        return <AdminLogin />;
    }

    return <>{children}</>;
}
