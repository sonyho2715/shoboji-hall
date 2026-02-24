'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Send, CheckCircle, Loader2, Mail } from 'lucide-react';

interface BookingDocumentsProps {
  bookingId: number;
  bookingNumber: string;
  customerEmail: string | null;
  currentStatus: string;
  quoteSentDate: string | null;
}

export function BookingDocuments({
  bookingId,
  bookingNumber,
  customerEmail,
  currentStatus,
  quoteSentDate,
}: BookingDocumentsProps) {
  const router = useRouter();
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [emailQuoteLoading, setEmailQuoteLoading] = useState(false);
  const [confirmationLoading, setConfirmationLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleDownloadQuote = async () => {
    setDownloadLoading(true);
    try {
      const res = await fetch('/api/admin/quote/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to generate quote');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Quote-${bookingNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      showMessage('success', 'Quote PDF downloaded');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Download failed';
      showMessage('error', msg);
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleEmailQuote = async () => {
    if (!customerEmail) {
      showMessage('error', 'No email address on file for this customer');
      return;
    }

    setEmailQuoteLoading(true);
    try {
      const res = await fetch('/api/admin/quote/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send quote');
      }

      showMessage('success', data.message || 'Quote sent successfully');
      router.refresh();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Send failed';
      showMessage('error', msg);
    } finally {
      setEmailQuoteLoading(false);
    }
  };

  const handleSendConfirmation = async () => {
    if (!customerEmail) {
      showMessage('error', 'No email address on file for this customer');
      return;
    }

    setConfirmationLoading(true);
    try {
      const res = await fetch('/api/admin/email/confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send confirmation');
      }

      showMessage('success', data.message || 'Confirmation email sent');
      router.refresh();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Send failed';
      showMessage('error', msg);
    } finally {
      setConfirmationLoading(false);
    }
  };

  const showConfirmationButton =
    currentStatus === 'deposit_paid' || currentStatus === 'confirmed';

  return (
    <div className="space-y-3">
      {/* Status message */}
      {message && (
        <div
          className={`rounded-md px-3 py-2 text-sm ${
            message.type === 'success'
              ? 'border border-green-200 bg-green-50 text-green-700'
              : 'border border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Download Quote PDF */}
      <button
        onClick={handleDownloadQuote}
        disabled={downloadLoading}
        className="flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
      >
        {downloadLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileText className="h-4 w-4 text-slate-500" />
        )}
        Download Quote PDF
      </button>

      {/* Email Quote */}
      <button
        onClick={handleEmailQuote}
        disabled={emailQuoteLoading || !customerEmail}
        className="flex w-full items-center gap-2 rounded-lg bg-slate-800 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-900 disabled:opacity-50"
      >
        {emailQuoteLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        Email Quote to Customer
      </button>
      {customerEmail && (
        <p className="text-xs text-gray-400">
          Will send to: {customerEmail}
        </p>
      )}
      {!customerEmail && (
        <p className="text-xs text-amber-600">
          No email address on file
        </p>
      )}

      {/* Send Confirmation Email */}
      {showConfirmationButton && (
        <button
          onClick={handleSendConfirmation}
          disabled={confirmationLoading || !customerEmail}
          className="flex w-full items-center gap-2 rounded-lg border border-green-300 bg-green-50 px-3 py-2.5 text-sm font-medium text-green-700 transition-colors hover:bg-green-100 disabled:opacity-50"
        >
          {confirmationLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          Send Confirmation Email
        </button>
      )}

      {/* Quote Sent Date */}
      {quoteSentDate && (
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Mail className="h-3.5 w-3.5" />
          Quote sent: {new Date(quoteSentDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
      )}
    </div>
  );
}
