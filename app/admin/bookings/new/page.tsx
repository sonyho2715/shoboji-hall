'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface MembershipTier {
  id: number;
  tierName: string;
}

export default function NewBookingPage() {
  const router = useRouter();
  const [tiers, setTiers] = useState<MembershipTier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/rates/tiers')
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setTiers(res.data);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const payload = {
      fullName: formData.get('fullName') as string,
      organization: (formData.get('organization') as string) || undefined,
      phone: (formData.get('phone') as string) || undefined,
      email: (formData.get('email') as string) || undefined,
      preferredContact: formData.get('preferredContact') as string,
      membershipTierId: Number(formData.get('membershipTierId')),
      isMember: formData.get('isMember') === 'on',
      eventType: formData.get('eventType') as string,
      eventDescription: (formData.get('eventDescription') as string) || undefined,
      eventDate: formData.get('eventDate') as string,
      eventStartTime: formData.get('eventStartTime') as string,
      eventEndTime: formData.get('eventEndTime') as string,
      setupHours: Number(formData.get('setupHours') || 0),
      breakdownHours: Number(formData.get('breakdownHours') || 0),
      adultCount: Number(formData.get('adultCount') || 0),
      childCount: Number(formData.get('childCount') || 0),
      expectedVehicles: Number(formData.get('expectedVehicles') || 0),
      bookingType: formData.get('bookingType') as string,
      roomSetup: (formData.get('roomSetup') as string) || undefined,
      alcoholServed: formData.get('alcoholServed') === 'on',
      barType: (formData.get('barType') as string) || undefined,
      additionalNotes: (formData.get('additionalNotes') as string) || undefined,
      specialRequirements: [],
      equipmentItems: [],
      serviceItems: [],
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        router.push(`/admin/bookings/${result.data.bookingId}`);
      } else {
        setError(result.error || 'Failed to create booking');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/bookings"
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">New Booking</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Information */}
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-semibold text-gray-900">
                Client Information
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Organization
                  </label>
                  <input
                    type="text"
                    name="organization"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Preferred Contact
                  </label>
                  <select
                    name="preferredContact"
                    defaultValue="email"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="text">Text</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Membership Tier *
                  </label>
                  <select
                    name="membershipTierId"
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
                  >
                    <option value="">Select tier...</option>
                    {tiers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.tierName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isMember"
                    id="isMember"
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label
                    htmlFor="isMember"
                    className="text-sm font-medium text-gray-700"
                  >
                    Active temple member
                  </label>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-semibold text-gray-900">
                Event Details
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Event Type *
                  </label>
                  <input
                    type="text"
                    name="eventType"
                    required
                    placeholder="Wedding reception, birthday, memorial, etc."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Booking Type *
                  </label>
                  <select
                    name="bookingType"
                    required
                    defaultValue="hall_rental"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
                  >
                    <option value="hall_rental">Hall Rental</option>
                    <option value="hall_catering">Hall + Catering</option>
                    <option value="catering_only">Catering Only</option>
                    <option value="funeral_package">Funeral Package</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Room Setup
                  </label>
                  <select
                    name="roomSetup"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
                  >
                    <option value="">Select...</option>
                    <option value="banquet">Banquet</option>
                    <option value="classroom">Classroom</option>
                    <option value="theater">Theater</option>
                    <option value="cocktail">Cocktail</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    name="eventStartTime"
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    End Time *
                  </label>
                  <input
                    type="time"
                    name="eventEndTime"
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Adult Count *
                  </label>
                  <input
                    type="number"
                    name="adultCount"
                    required
                    min={0}
                    defaultValue={0}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Child Count
                  </label>
                  <input
                    type="number"
                    name="childCount"
                    min={0}
                    defaultValue={0}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Setup Hours
                  </label>
                  <input
                    type="number"
                    name="setupHours"
                    min={0}
                    max={4}
                    step={0.5}
                    defaultValue={0}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Breakdown Hours
                  </label>
                  <input
                    type="number"
                    name="breakdownHours"
                    min={0}
                    max={2}
                    step={0.5}
                    defaultValue={0}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Expected Vehicles
                  </label>
                  <input
                    type="number"
                    name="expectedVehicles"
                    min={0}
                    defaultValue={0}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="alcoholServed"
                    id="alcoholServed"
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label
                    htmlFor="alcoholServed"
                    className="text-sm font-medium text-gray-700"
                  >
                    Alcohol will be served
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Event Description
                  </label>
                  <textarea
                    name="eventDescription"
                    rows={2}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
                    placeholder="Brief description of the event..."
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Additional Notes
                  </label>
                  <textarea
                    name="additionalNotes"
                    rows={2}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
                    placeholder="Internal admin notes..."
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3">
              <Link
                href="/admin/bookings"
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-slate-800 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-900 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
