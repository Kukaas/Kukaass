import type { Metadata } from 'next';
import NotFoundClient from '@/components/NotFoundClient';

export const metadata: Metadata = {
  title: '404 — Page Not Found | Chester Luke A. Maligaso (Chester Maligaso)',
  description: 'The requested resource or page could not be found in the workspace.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return <NotFoundClient />;
}
