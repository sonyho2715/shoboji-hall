interface AdminHeaderProps {
  title: string;
  adminName: string;
  children?: React.ReactNode;
}

export function AdminHeader({ title, adminName, children }: AdminHeaderProps) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="pl-10 lg:pl-0">
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          <p className="mt-0.5 text-sm text-gray-500">{today}</p>
        </div>
        <div className="flex items-center gap-4">
          {children}
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">{adminName}</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
