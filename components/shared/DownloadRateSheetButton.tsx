'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

export function DownloadRateSheetButton() {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/rates/download');

      if (!res.ok) {
        throw new Error('Failed to generate rate sheet');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const year = new Date().getFullYear();
      a.download = `Shoboji-Social-Hall-Rates-${year}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Rate sheet download failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      Download Rate Sheet (PDF)
    </button>
  );
}
