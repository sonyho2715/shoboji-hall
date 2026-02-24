'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ConfirmDialog } from './ConfirmDialog';

interface BookingDetailActionsProps {
  bookingId: number;
  currentStatus: string;
}

interface StatusAction {
  label: string;
  newStatus: string;
  destructive?: boolean;
  confirmMessage: string;
}

function getAvailableActions(currentStatus: string): StatusAction[] {
  const actions: StatusAction[] = [];

  switch (currentStatus) {
    case 'inquiry':
      actions.push({
        label: 'Mark as Quoted',
        newStatus: 'quoted',
        confirmMessage:
          'Mark this booking as quoted? This will record the quote sent date.',
      });
      break;
    case 'quoted':
      actions.push({
        label: 'Mark as Confirmed',
        newStatus: 'confirmed',
        confirmMessage: 'Confirm this booking?',
      });
      actions.push({
        label: 'Mark Deposit Received',
        newStatus: 'deposit_paid',
        confirmMessage:
          'Record deposit as received? This will set the deposit received date.',
      });
      break;
    case 'confirmed':
      actions.push({
        label: 'Mark Deposit Received',
        newStatus: 'deposit_paid',
        confirmMessage: 'Record deposit as received?',
      });
      actions.push({
        label: 'Mark as Completed',
        newStatus: 'completed',
        confirmMessage: 'Mark this event as completed?',
      });
      break;
    case 'deposit_paid':
      actions.push({
        label: 'Mark as Completed',
        newStatus: 'completed',
        confirmMessage: 'Mark this event as completed?',
      });
      break;
  }

  // Cancel is always available unless already cancelled or completed
  if (currentStatus !== 'cancelled' && currentStatus !== 'completed') {
    actions.push({
      label: 'Cancel Booking',
      newStatus: 'cancelled',
      destructive: true,
      confirmMessage:
        'Are you sure you want to cancel this booking? This action cannot be easily undone.',
    });
  }

  return actions;
}

export function BookingDetailActions({
  bookingId,
  currentStatus,
}: BookingDetailActionsProps) {
  const router = useRouter();
  const [confirm, setConfirm] = useState<StatusAction | null>(null);
  const [loading, setLoading] = useState(false);

  const actions = getAvailableActions(currentStatus);

  const handleStatusChange = async () => {
    if (!confirm) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: confirm.newStatus }),
      });

      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(false);
      setConfirm(null);
    }
  };

  if (actions.length === 0) return null;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action.newStatus}
            onClick={() => setConfirm(action)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              action.destructive
                ? 'border border-red-300 bg-white text-red-600 hover:bg-red-50'
                : 'bg-slate-800 text-white hover:bg-slate-900'
            }`}
          >
            {action.label}
          </button>
        ))}
      </div>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleStatusChange}
        title={confirm?.destructive ? 'Cancel Booking' : 'Update Status'}
        message={confirm?.confirmMessage || ''}
        confirmLabel={confirm?.label || 'Confirm'}
        destructive={confirm?.destructive}
        loading={loading}
      />
    </>
  );
}
