import { z } from 'zod';

export const clientInfoSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  organization: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  mailingAddress: z.string().optional(),
  preferredContact: z.enum(['phone', 'text', 'email']).default('email'),
  membershipTierId: z.number().int().positive('Membership tier is required'),
  isMember: z.boolean().default(false),
});

export const eventDetailsSchema = z.object({
  eventType: z.string().min(2, 'Event type is required'),
  eventDescription: z.string().optional(),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format'),
  eventStartTime: z.string().regex(/^\d{2}:\d{2}$/, 'Start time must be HH:MM format'),
  eventEndTime: z.string().regex(/^\d{2}:\d{2}$/, 'End time must be HH:MM format'),
  setupHours: z.number().min(0).max(4).default(0),
  breakdownHours: z.number().min(0).max(2).default(0),
  rehearsalDatetime: z.string().optional(),
  adultCount: z.number().int().min(0, 'Adult count cannot be negative'),
  childCount: z.number().int().min(0, 'Child count cannot be negative'),
  expectedVehicles: z.number().int().min(0).optional(),
  referralSource: z
    .enum(['social_media', 'website', 'referral', 'walk_in', 'other'])
    .optional(),
});

export const venueRequirementsSchema = z.object({
  bookingType: z.enum([
    'hall_rental',
    'hall_catering',
    'catering_only',
    'funeral_package',
  ]),
  roomSetup: z
    .enum(['banquet', 'classroom', 'theater', 'cocktail', 'custom'])
    .optional(),
  alcoholServed: z.boolean().default(false),
  barType: z.enum(['hosted', 'cash']).optional(),
  specialRequirements: z.array(z.string()).default([]),
  additionalNotes: z.string().optional(),
});

export const equipmentSelectionSchema = z.object({
  items: z.array(
    z.object({
      equipmentId: z.number().int().positive(),
      quantity: z.number().int().min(1),
      unitRate: z.number().min(0),
    })
  ),
});

export const quoteCalculationSchema = z.object({
  membershipTierId: z.number().int().positive('Membership tier is required'),
  eventDate: z.string(),
  eventStartTime: z.string(),
  eventEndTime: z.string(),
  totalAttendees: z.number().int().min(1, 'Must have at least 1 attendee'),
  isFuneralPackage: z.boolean().default(false),
  alcoholServed: z.boolean().default(false),
  equipmentItems: z
    .array(
      z.object({
        quantity: z.number(),
        unitRate: z.number(),
      })
    )
    .default([]),
});

// Combined schema for full booking creation
export const createBookingSchema = z.object({
  // Client info
  fullName: z.string().min(2),
  organization: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  mailingAddress: z.string().optional(),
  preferredContact: z.enum(['phone', 'text', 'email']).default('email'),
  membershipTierId: z.number().int().positive(),
  isMember: z.boolean().default(false),

  // Event details
  eventType: z.string().min(2),
  eventDescription: z.string().optional(),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  eventStartTime: z.string().regex(/^\d{2}:\d{2}$/),
  eventEndTime: z.string().regex(/^\d{2}:\d{2}$/),
  setupHours: z.number().min(0).max(4).default(0),
  breakdownHours: z.number().min(0).max(2).default(0),
  rehearsalDatetime: z.string().optional(),
  adultCount: z.number().int().min(0),
  childCount: z.number().int().min(0),
  expectedVehicles: z.number().int().min(0).optional(),
  referralSource: z.string().optional(),

  // Venue
  bookingType: z.enum([
    'hall_rental',
    'hall_catering',
    'catering_only',
    'funeral_package',
  ]).default('hall_rental'),
  roomSetup: z.string().optional(),
  alcoholServed: z.boolean().default(false),
  barType: z.string().optional(),
  specialRequirements: z.array(z.string()).default([]),
  additionalNotes: z.string().optional(),

  // Equipment
  equipmentItems: z
    .array(
      z.object({
        equipmentId: z.number().int().positive(),
        quantity: z.number().int().min(1),
        unitRate: z.number().min(0),
      })
    )
    .default([]),

  // Services
  serviceItems: z
    .array(
      z.object({
        serviceId: z.number().int().positive(),
        hours: z.number().min(0),
        rateApplied: z.number().min(0),
        rateType: z.string(),
        commissionPct: z.number().optional(),
      })
    )
    .default([]),
});

export type ClientInfo = z.infer<typeof clientInfoSchema>;
export type EventDetails = z.infer<typeof eventDetailsSchema>;
export type VenueRequirements = z.infer<typeof venueRequirementsSchema>;
export type EquipmentSelection = z.infer<typeof equipmentSelectionSchema>;
export type QuoteCalculation = z.infer<typeof quoteCalculationSchema>;
export type CreateBooking = z.infer<typeof createBookingSchema>;
