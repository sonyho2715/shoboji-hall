// ============================================================================
// Shoboji Social Hall - Pricing Engine
// Pure TypeScript calculations (no DB calls) - runs on server and client
// ============================================================================

const STAFFING_RULES = [
  { min: 1, max: 50, staff: 1 },
  { min: 51, max: 150, staff: 2 },
  { min: 151, max: 250, staff: 3 },
  { min: 251, max: 350, staff: 4 },
  { min: 351, max: 450, staff: 5 },
  { min: 451, max: null, staff: 6 },
] as const;

const BASE_HOURS = 4;
const HPD_RATE = 300;

// ---- Types ----

export interface MembershipTierRates {
  hallBaseRate: number;
  hallHourlyRate: number;
  eventSupportBase: number;
  eventSupportHourly: number;
  securityDeposit: number;
}

export interface EquipmentLineItem {
  quantity: number;
  unitRate: number;
}

export interface ServiceLineItem {
  hours: number;
  rateApplied: number;
  rateType: string;
  commissionPct?: number;
}

export interface QuoteInput {
  membershipTier: MembershipTierRates;
  eventDurationHours: number;
  totalAttendees: number;
  isFuneralPackage?: boolean;
  alcoholServed?: boolean;
  equipmentItems?: EquipmentLineItem[];
  serviceItems?: ServiceLineItem[];
}

export interface FuneralTier {
  tierName: string;
  minAttendees: number;
  maxAttendees: number;
  rate: number;
  securityDeposit: number;
}

export interface QuoteResult {
  hallRentalTotal: number;
  eventSupportTotal: number;
  requiredStaff: number;
  equipmentTotal: number;
  servicesTotal: number;
  securityDeposit: number;
  grandTotal: number;
  breakdown: {
    hallBaseRate: number;
    hallOvertimeHours: number;
    hallOvertimeCost: number;
    supportBaseRate: number;
    supportOvertimeHours: number;
    supportOvertimeCost: number;
  };
}

// ---- Helper ----

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

// ---- Calculations ----

/**
 * Calculate hall rental cost.
 * Base rate covers BASE_HOURS (4). Each additional hour billed at hourly rate.
 */
export function calculateHallRental(
  tier: MembershipTierRates,
  durationHours: number
): number {
  const overtimeHours = Math.max(0, durationHours - BASE_HOURS);
  const total = tier.hallBaseRate + overtimeHours * tier.hallHourlyRate;
  return round2(total);
}

/**
 * Determine required staff count based on total attendees.
 */
export function calculateStaffCount(totalAttendees: number): number {
  if (totalAttendees <= 0) return 0;

  for (const rule of STAFFING_RULES) {
    if (rule.max === null) {
      if (totalAttendees >= rule.min) return rule.staff;
    } else {
      if (totalAttendees >= rule.min && totalAttendees <= rule.max) return rule.staff;
    }
  }

  // Fallback to max staffing
  return STAFFING_RULES[STAFFING_RULES.length - 1].staff;
}

/**
 * Calculate event support cost.
 * Base support covers BASE_HOURS (4). Overtime billed per hour per staff member.
 */
export function calculateEventSupport(
  tier: MembershipTierRates,
  durationHours: number,
  totalAttendees: number
): { total: number; staffCount: number } {
  const staffCount = calculateStaffCount(totalAttendees);
  const overtimeHours = Math.max(0, durationHours - BASE_HOURS);
  const total = tier.eventSupportBase + overtimeHours * tier.eventSupportHourly * staffCount;
  return { total: round2(total), staffCount };
}

/**
 * Calculate funeral package rate based on tier name and attendance.
 * Returns the package rate or 0 if no matching tier found.
 */
export function calculateFuneralPackage(
  tierName: string,
  totalAttendees: number,
  funeralTiers: FuneralTier[]
): number {
  const matching = funeralTiers.find(
    (ft) =>
      ft.tierName.toLowerCase() === tierName.toLowerCase() &&
      totalAttendees >= ft.minAttendees &&
      totalAttendees <= ft.maxAttendees
  );
  return matching ? matching.rate : 0;
}

/**
 * Auto-add HPD (Honolulu Police Department) officer cost when alcohol is served.
 * $300/hr for the full event duration.
 */
export function autoAddHPD(alcoholServed: boolean, durationHours: number): number {
  if (!alcoholServed) return 0;
  return round2(HPD_RATE * durationHours);
}

/**
 * Calculate complete quote from all inputs.
 */
// ---- Package Price Estimation ----

/**
 * Simplified base rates for package price estimation (no DB needed).
 * These are approximate member / non-member rates for display purposes.
 * Actual quotes use the DB-driven membership tiers.
 */
interface EstimateRates {
  hallBaseRate: number;
  hallHourlyRate: number;
  eventSupportBase: number;
  eventSupportHourly: number;
}

const ESTIMATE_RATES: { member: EstimateRates; non_member: EstimateRates } = {
  member: {
    hallBaseRate: 600,
    hallHourlyRate: 100,
    eventSupportBase: 150,
    eventSupportHourly: 25,
  },
  non_member: {
    hallBaseRate: 1200,
    hallHourlyRate: 200,
    eventSupportBase: 250,
    eventSupportHourly: 40,
  },
};

export interface PackagePriceEstimate {
  memberEstimate: number;
  nonMemberEstimate: number;
}

/**
 * Estimate a package's price for display on package cards.
 * Uses simplified calculation: hall base + overtime + event support base + overtime.
 * Does NOT include equipment (shown separately) or services.
 * This gives a "starting from" price for quick comparison.
 */
export function estimatePackagePrice(
  durationHours: number,
  guestCount: number,
): PackagePriceEstimate {
  function calc(rates: EstimateRates): number {
    const overtimeHours = Math.max(0, durationHours - BASE_HOURS);
    const hallTotal = rates.hallBaseRate + overtimeHours * rates.hallHourlyRate;
    const staffCount = calculateStaffCount(guestCount);
    const supportTotal =
      rates.eventSupportBase +
      overtimeHours * rates.eventSupportHourly * staffCount;
    return round2(hallTotal + supportTotal);
  }

  return {
    memberEstimate: calc(ESTIMATE_RATES.member),
    nonMemberEstimate: calc(ESTIMATE_RATES.non_member),
  };
}

export function calculateQuote(input: QuoteInput): QuoteResult {
  const {
    membershipTier,
    eventDurationHours,
    totalAttendees,
    isFuneralPackage = false,
    alcoholServed = false,
    equipmentItems = [],
    serviceItems = [],
  } = input;

  // Hall rental
  const hallOvertimeHours = Math.max(0, eventDurationHours - BASE_HOURS);
  const hallOvertimeCost = round2(hallOvertimeHours * membershipTier.hallHourlyRate);
  const hallRentalTotal = isFuneralPackage
    ? 0
    : round2(membershipTier.hallBaseRate + hallOvertimeCost);

  // Event support
  const { total: eventSupportTotal, staffCount: requiredStaff } = calculateEventSupport(
    membershipTier,
    eventDurationHours,
    totalAttendees
  );
  const supportOvertimeHours = Math.max(0, eventDurationHours - BASE_HOURS);
  const supportOvertimeCost = round2(
    supportOvertimeHours * membershipTier.eventSupportHourly * requiredStaff
  );

  // Equipment
  const equipmentTotal = round2(
    equipmentItems.reduce((sum, item) => sum + item.quantity * item.unitRate, 0)
  );

  // Services (including auto-HPD for alcohol)
  let servicesTotal = 0;
  for (const svc of serviceItems) {
    if (svc.rateType === 'commission' && svc.commissionPct) {
      // Commission-based: percentage of hall rental
      servicesTotal += round2(hallRentalTotal * (svc.commissionPct / 100));
    } else if (svc.rateType === 'flat') {
      servicesTotal += round2(svc.rateApplied);
    } else {
      // Hourly
      servicesTotal += round2(svc.hours * svc.rateApplied);
    }
  }
  servicesTotal = round2(servicesTotal);

  // Auto-add HPD cost for alcohol events
  const hpdCost = autoAddHPD(alcoholServed, eventDurationHours);
  const totalServicesWithHPD = round2(servicesTotal + hpdCost);

  // Security deposit
  const securityDeposit = membershipTier.securityDeposit;

  // Grand total
  const grandTotal = round2(
    hallRentalTotal +
    eventSupportTotal +
    equipmentTotal +
    totalServicesWithHPD +
    securityDeposit
  );

  return {
    hallRentalTotal,
    eventSupportTotal,
    requiredStaff,
    equipmentTotal,
    servicesTotal: totalServicesWithHPD,
    securityDeposit,
    grandTotal,
    breakdown: {
      hallBaseRate: membershipTier.hallBaseRate,
      hallOvertimeHours,
      hallOvertimeCost,
      supportBaseRate: membershipTier.eventSupportBase,
      supportOvertimeHours,
      supportOvertimeCost,
    },
  };
}
