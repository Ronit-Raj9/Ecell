import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | E-Cell',
  description: 'Manage E-Cell application resources and users',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      {children}
    </div>
  );
} 