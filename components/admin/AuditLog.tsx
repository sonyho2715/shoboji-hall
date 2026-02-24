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
  };
  return map[action] || action;
}

function formatDetails(action: string, details: unknown): string {
  if (!details || typeof details !== 'object') return '';
  const d = details as Record<string, unknown>;
  if (action === 'status_changed') {
    const from = d.from as string;
    const to = d.to as string;
    const note = d.note as string | null;
    let text = `${from} -> ${to}`;
    if (note) text += `: ${note}`;
    return text;
  }
  if (action === 'updated' && d.fields) {
    return `Fields: ${(d.fields as string[]).join(', ')}`;
  }
  return '';
}

export function AuditLog({ entries }: AuditLogProps) {
  if (entries.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-gray-400">No history yet</p>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => {
        const date = new Date(entry.createdAt);
        const detailText = formatDetails(entry.action, entry.details);

        return (
          <div key={entry.id} className="border-l-2 border-gray-200 pl-3">
            <p className="text-sm font-medium text-gray-700">
              {formatAction(entry.action)}
            </p>
            {detailText && (
              <p className="text-xs text-gray-500">{detailText}</p>
            )}
            <p className="mt-0.5 text-xs text-gray-400">
              {date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}{' '}
              at{' '}
              {date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
              {entry.performedBy && (
                <span className="ml-1">by {entry.performedBy}</span>
              )}
            </p>
          </div>
        );
      })}
    </div>
  );
}
