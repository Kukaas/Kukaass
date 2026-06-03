import { Suspense } from 'react';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div className="h-dvh bg-background" />}>
      <AdminDashboard />
    </Suspense>
  );
}
