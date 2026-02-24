import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  alert?: boolean;
  subtitle?: string;
}

export function StatCard({ title, value, icon: Icon, alert, subtitle }: StatCardProps) {
  return (
    <div
      className={`rounded-lg border bg-white p-5 shadow-sm ${
        alert ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p
            className={`mt-1 text-2xl font-bold ${
              alert ? 'text-yellow-700' : 'text-gray-900'
            }`}
          >
            {value}
          </p>
          {subtitle && (
            <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>
          )}
        </div>
        <div
          className={`rounded-lg p-2.5 ${
            alert ? 'bg-yellow-100' : 'bg-slate-100'
          }`}
        >
          <Icon
            className={`h-5 w-5 ${alert ? 'text-yellow-600' : 'text-slate-600'}`}
          />
        </div>
      </div>
    </div>
  );
}
