const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  inquiry: {
    label: 'Inquiry',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  quoted: {
    label: 'Quoted',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  confirmed: {
    label: 'Confirmed',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  deposit_paid: {
    label: 'Deposit Paid',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  completed: {
    label: 'Completed',
    className: 'bg-gray-100 text-gray-700 border-gray-200',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
};

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    className: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${config.className} ${sizeClasses}`}
    >
      {config.label}
    </span>
  );
}
