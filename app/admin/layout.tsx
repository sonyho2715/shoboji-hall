import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { getSession } from '@/lib/auth';

export const metadata = {
  title: 'Admin | Shoboji Social Hall',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check session - if not logged in, render children without sidebar
  // (login page renders standalone, middleware handles redirect for other admin pages)
  const session = await getSession();

  if (!session.isLoggedIn || !session.isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
