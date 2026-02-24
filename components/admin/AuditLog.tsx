import {
  ArrowRight,
  Mail,
  DollarSign,
  MessageSquare,
  Plus,
  FileText,
} from 'lucide-react';

interface AuditEntry {
  id: number;
  action: string;
  details: unknown;
  performedBy: string | null;
  createdAt: string | Date;
}

interface AuditLogProps {
  entries: AuditEntry[];
}

function formatAction(action: string): string {
  const map: Record<string, string> = {
    created: 'Booking created',
    status_changed: 'Status changed',
    notes_updated: 'Notes updated',
    updated: 'Booking updated',
    quote_sent: 'Quote sent',
    deposit_received: 'Deposit received',
    note_added: 'Note added',
  };
  return map[action] || action;
}

function getActionIcon(action: string) {
  switch (action) {
    case 'status_changed':
      return { icon: ArrowRight, color: 'text-green-600', bg: 'bg-green-100' };
    case 'quote_sent':
      return { icon: Mail, color: 'text-blue-600', bg: 'bg-blue-100' };
    case 'deposit_received':
      return { icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' };
    case 'note_added':
    case 'notes_updated':
      return { icon: MessageSquare, color: 'text-gray-600', bg: 'bg-gray-100' };
    case 'created':
      return { icon: Plus, color: 'text-blue-600', bg: 'bg-blue-100' };
    default:
      return { icon: FileText, color: 'text-gray-500', bg: 'bg-gray-100' };
  }
}

function formatDetails(action: string, details: unknown): string {
  if (!details || typeof details !== 'object') return '';
  const d = details as Record<string, unknown>;
  if (action === 'status_changed') {
    const from = d.from as string;
    const to = d.to as string;
    const note = d.note as string | null;
    let text = `${from.replace(/_/g, ' ')} to ${to.replace(/_/g, ' ')}`;
    if (note) text += `: ${note}`;
    return text;
  }
  if (action === 'updated' && d.fields) {
    return `Fields: ${(d.fields as string[]).join(', ')}`;
  }
  return '';
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  if (diffDays === 1) {
    return `Yesterday at ${date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })}`;
  }
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }) + ' at ' + date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function AuditLog({ entries }: AuditLogProps) {
  if (entries.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-gray-400">
        No activity recorded yet
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => {
        const date = new Date(entry.createdAt);
        const detailText = formatDetails(entry.action, entry.details);
        const { icon: Icon, color, bg } = getActionIcon(entry.action);

        return (
          <div key={entry.id} className="flex gap-3">
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${bg}`}
            >
              <Icon className={`h-3.5 w-3.5 ${color}`} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-700">
                {formatAction(entry.action)}
              </p>
              {detailText && (
                <p className="text-xs text-gray-500">{detailText}</p>
              )}
              <p className="mt-0.5 text-xs text-gray-400">
                {formatRelativeTime(date)}
                {entry.performedBy && (
                  <span className="ml-1">by {entry.performedBy}</span>
                )}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
