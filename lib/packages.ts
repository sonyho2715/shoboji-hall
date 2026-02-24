// ============================================================================
// Shoboji Social Hall - Event Packages
// Pure TypeScript data (no DB calls) - packages are hardcoded configuration
// ============================================================================

export interface EventPackage {
  id: string;
  name: string;
  tagline: string;
  eventTypes: string[];
  minGuests: number;
  maxGuests: number;
  durationHours: number;
  setupHours: number;
  breakdownHours: number;
  roomSetup: string;
  bookingType: string;
  includedEquipment: Array<{
    name: string;
    quantity: number;
  }>;
  suggestedServices: string[];
  specialRequirements: string[];
  alcoholDefault: boolean;
  cateringDefault: boolean;
  highlights: string[];
  icon: string;
  color: string;
}

export const PACKAGES: EventPackage[] = [
  {
    id: "intimate-gathering",
    name: "Intimate Gathering",
    tagline: "Perfect for small celebrations and private parties",
    eventTypes: [
      "birthday",
      "anniversary",
      "baby_shower",
      "bridal_shower",
      "family_reunion",
      "other",
    ],
    minGuests: 1,
    maxGuests: 50,
    durationHours: 4,
    setupHours: 1,
    breakdownHours: 0.5,
    roomSetup: "banquet",
    bookingType: "hall_rental",
    includedEquipment: [
      { name: "Table, 6 ft", quantity: 6 },
      { name: "Chair", quantity: 50 },
      { name: "Microphone, Wireless (Shure)", quantity: 1 },
      { name: "Stand, Microphone", quantity: 1 },
      { name: 'Monitor, JBL 15"', quantity: 2 },
    ],
    suggestedServices: ["Sound Tech", "Cleanup Supervisor"],
    specialRequirements: ["AV Equipment"],
    alcoholDefault: false,
    cateringDefault: false,
    highlights: [
      "Up to 50 guests",
      "Basic sound system",
      "Tables & chairs included",
      "4-hour minimum",
    ],
    icon: "\u{1F942}",
    color: "amber",
  },
  {
    id: "birthday-bash",
    name: "Birthday Bash",
    tagline: "Celebrate in style with music, lights, and dancing",
    eventTypes: ["birthday"],
    minGuests: 50,
    maxGuests: 150,
    durationHours: 6,
    setupHours: 2,
    breakdownHours: 1,
    roomSetup: "banquet",
    bookingType: "hall_catering",
    includedEquipment: [
      { name: "Table, 6 ft", quantity: 15 },
      { name: "Chair", quantity: 150 },
      { name: "Microphone, Wireless (Shure)", quantity: 2 },
      { name: "Stand, Microphone", quantity: 2 },
      { name: 'Speaker, Wedge 15"', quantity: 4 },
      { name: 'Subwoofer 18"', quantity: 1 },
      { name: "Control Board, Small", quantity: 1 },
      { name: 'Lights, Disco Ball 6"', quantity: 2 },
      { name: "Lights, Flashing Par 25", quantity: 4 },
    ],
    suggestedServices: ["Sound Engineer (Medium)", "Cleanup Supervisor"],
    specialRequirements: [
      "Dance Floor",
      "AV Equipment",
      "Decorations Allowed",
    ],
    alcoholDefault: false,
    cateringDefault: true,
    highlights: [
      "50\u2013150 guests",
      "Dance floor lighting",
      "Full sound system",
      "Catering available",
    ],
    icon: "\u{1F382}",
    color: "pink",
  },
  {
    id: "wedding-reception",
    name: "Wedding Reception",
    tagline: "An unforgettable celebration for your special day",
    eventTypes: ["wedding"],
    minGuests: 50,
    maxGuests: 250,
    durationHours: 8,
    setupHours: 3,
    breakdownHours: 1,
    roomSetup: "banquet",
    bookingType: "hall_catering",
    includedEquipment: [
      { name: "Table, 8 ft", quantity: 20 },
      { name: "Chair", quantity: 200 },
      { name: "Microphone, Wireless (Shure)", quantity: 3 },
      { name: "Microphone, Lavalier (Shure)", quantity: 1 },
      { name: "Stand, Microphone", quantity: 3 },
      { name: "Maui LD, Column Array", quantity: 2 },
      { name: 'Subwoofer 18"', quantity: 2 },
      { name: "Control Board, Large", quantity: 1 },
      { name: "Stage Platform", quantity: 4 },
      { name: "Lights, Flashing Par 25", quantity: 8 },
      { name: 'Lights, Laser 6"', quantity: 2 },
    ],
    suggestedServices: [
      "Sound Engineer (Large)",
      "IT Support (Visual)",
      "Cleanup Supervisor",
      "Parking Attendant",
    ],
    specialRequirements: [
      "Stage",
      "Dance Floor",
      "AV Equipment",
      "Projector / Screen",
      "Decorations Allowed",
    ],
    alcoholDefault: true,
    cateringDefault: true,
    highlights: [
      "50\u2013250 guests",
      "Stage & dance floor",
      "Full AV production",
      "Catering included",
    ],
    icon: "\u{1F48D}",
    color: "rose",
  },
  {
    id: "corporate-event",
    name: "Corporate Event",
    tagline:
      "Professional setup for meetings, seminars, and presentations",
    eventTypes: ["corporate", "seminar", "conference", "workshop"],
    minGuests: 20,
    maxGuests: 200,
    durationHours: 6,
    setupHours: 1,
    breakdownHours: 0.5,
    roomSetup: "classroom",
    bookingType: "hall_rental",
    includedEquipment: [
      { name: "Table, 6 ft", quantity: 20 },
      { name: "Chair", quantity: 100 },
      { name: "Microphone, Wireless (Shure)", quantity: 2 },
      { name: "Microphone, Lavalier (Shure)", quantity: 2 },
      { name: "Stand, Microphone", quantity: 2 },
      { name: "Maui LD, Column Array", quantity: 1 },
      { name: "Control Board, Small", quantity: 1 },
      { name: "Stand, Tripod", quantity: 2 },
    ],
    suggestedServices: ["Sound Tech", "IT Support (Visual)"],
    specialRequirements: [
      "Projector / Screen",
      "Podium",
      "AV Equipment",
    ],
    alcoholDefault: false,
    cateringDefault: false,
    highlights: [
      "20\u2013200 attendees",
      "Podium & projector",
      "Classroom or theater layout",
      "AV tech support",
    ],
    icon: "\u{1F4BC}",
    color: "blue",
  },
  {
    id: "community-celebration",
    name: "Community Celebration",
    tagline:
      "Bring the neighborhood together for a memorable event",
    eventTypes: [
      "community",
      "cultural",
      "fundraiser",
      "festival",
      "other",
    ],
    minGuests: 100,
    maxGuests: 350,
    durationHours: 6,
    setupHours: 2,
    breakdownHours: 1,
    roomSetup: "banquet",
    bookingType: "hall_catering",
    includedEquipment: [
      { name: "Table, 8 ft", quantity: 30 },
      { name: "Chair", quantity: 300 },
      { name: "Microphone, Wireless (Shure)", quantity: 2 },
      { name: "Stand, Microphone", quantity: 2 },
      { name: "Maui LD, Column Array", quantity: 2 },
      { name: 'Subwoofer 15"', quantity: 2 },
      { name: "Control Board, Large", quantity: 1 },
      { name: 'Lights, Strobe 3"', quantity: 2 },
    ],
    suggestedServices: [
      "Sound Engineer (Medium)",
      "Parking Attendant",
      "Cleanup Supervisor",
    ],
    specialRequirements: [
      "Stage",
      "AV Equipment",
      "Decorations Allowed",
    ],
    alcoholDefault: false,
    cateringDefault: true,
    highlights: [
      "100\u2013350 guests",
      "Large format sound",
      "Catering available",
      "Parking attendant",
    ],
    icon: "\u{1F33A}",
    color: "green",
  },
  {
    id: "funeral-reception-small",
    name: "After-Funeral Reception",
    tagline:
      "A peaceful gathering to honor and remember loved ones",
    eventTypes: ["funeral", "memorial"],
    minGuests: 1,
    maxGuests: 100,
    durationHours: 3,
    setupHours: 0.5,
    breakdownHours: 0.5,
    roomSetup: "banquet",
    bookingType: "funeral_package",
    includedEquipment: [
      { name: "Table, 6 ft", quantity: 10 },
      { name: "Chair", quantity: 80 },
      { name: "Microphone, Wireless (Shure)", quantity: 1 },
      { name: "Stand, Microphone", quantity: 1 },
    ],
    suggestedServices: ["Cleanup Supervisor"],
    specialRequirements: ["AV Equipment"],
    alcoholDefault: false,
    cateringDefault: true,
    highlights: [
      "Up to 100 guests",
      "Flat-rate pricing",
      "Catering available",
      "Peaceful atmosphere",
    ],
    icon: "\u{1F54A}\uFE0F",
    color: "slate",
  },
  {
    id: "large-gala",
    name: "Grand Gala",
    tagline:
      "Full production for large-scale celebrations and galas",
    eventTypes: ["gala", "wedding", "fundraiser", "cultural"],
    minGuests: 200,
    maxGuests: 450,
    durationHours: 8,
    setupHours: 3,
    breakdownHours: 1,
    roomSetup: "banquet",
    bookingType: "hall_catering",
    includedEquipment: [
      { name: "Table, 8 ft", quantity: 40 },
      { name: "Chair", quantity: 400 },
      { name: "Microphone, Wireless (Shure)", quantity: 4 },
      { name: "Microphone, Lavalier (Shure)", quantity: 2 },
      { name: "Stand, Microphone", quantity: 4 },
      { name: "Maui LD, Column Array", quantity: 2 },
      { name: 'Subwoofer 18"', quantity: 2 },
      { name: "Amplifier, Crown", quantity: 2 },
      { name: "Control Board, Large", quantity: 1 },
      { name: "Stage Platform", quantity: 6 },
      { name: "Lights, Flashing Par 25", quantity: 8 },
      { name: 'Lights, Laser 6"', quantity: 4 },
      { name: 'Lights, Disco Ball 6"', quantity: 2 },
    ],
    suggestedServices: [
      "Sound Engineer (Large)",
      "IT Support (Visual)",
      "Cleanup Supervisor",
      "Parking Attendant",
      "Security Detail/HPD",
    ],
    specialRequirements: [
      "Stage",
      "Dance Floor",
      "AV Equipment",
      "Projector / Screen",
      "Decorations Allowed",
    ],
    alcoholDefault: true,
    cateringDefault: true,
    highlights: [
      "200\u2013450 guests",
      "Full stage & lighting",
      "Professional AV team",
      "Valet parking support",
    ],
    icon: "\u2728",
    color: "purple",
  },
  {
    id: "cultural-ceremony",
    name: "Cultural Ceremony",
    tagline:
      "Honoring traditions with the right space and setup",
    eventTypes: [
      "cultural",
      "religious",
      "ceremony",
      "graduation",
    ],
    minGuests: 30,
    maxGuests: 200,
    durationHours: 5,
    setupHours: 1,
    breakdownHours: 0.5,
    roomSetup: "theater",
    bookingType: "hall_rental",
    includedEquipment: [
      { name: "Chair", quantity: 150 },
      { name: "Microphone, Wireless (Shure)", quantity: 2 },
      { name: "Microphone, Condenser (Shure)", quantity: 1 },
      { name: "Stand, Microphone", quantity: 3 },
      { name: 'Monitor, JBL 15"', quantity: 2 },
      { name: "Control Board, Small", quantity: 1 },
      { name: "Stage Platform", quantity: 2 },
    ],
    suggestedServices: [
      "Sound Engineer (Small)",
      "IT Support (Visual)",
    ],
    specialRequirements: [
      "Stage",
      "Podium",
      "AV Equipment",
      "Projector / Screen",
    ],
    alcoholDefault: false,
    cateringDefault: false,
    highlights: [
      "30\u2013200 attendees",
      "Theater-style seating",
      "Stage & podium",
      "Ceremony-ready",
    ],
    icon: "\u{1F38B}",
    color: "teal",
  },
];

// Event type options for the suggester dropdown
export const EVENT_TYPE_OPTIONS = [
  { value: "birthday", label: "Birthday Party", icon: "\u{1F382}" },
  { value: "wedding", label: "Wedding / Reception", icon: "\u{1F48D}" },
  { value: "corporate", label: "Corporate / Seminar", icon: "\u{1F4BC}" },
  { value: "cultural", label: "Community / Cultural", icon: "\u{1F33A}" },
  { value: "funeral", label: "After-Funeral Reception", icon: "\u{1F54A}\uFE0F" },
  { value: "graduation", label: "Graduation / Ceremony", icon: "\u{1F393}" },
  { value: "other", label: "Other Celebration", icon: "\u{1F389}" },
  { value: "gala", label: "Gala / Fundraiser", icon: "\u{1FA69}" },
] as const;

/**
 * Find best matching packages for a given guest count and event type.
 * Returns up to 3 suggestions sorted by relevance (exact event type match first).
 */
export function suggestPackages(
  guestCount: number,
  eventType: string
): EventPackage[] {
  return PACKAGES.filter(
    (pkg) =>
      guestCount >= pkg.minGuests &&
      guestCount <= pkg.maxGuests &&
      (pkg.eventTypes.includes(eventType) ||
        pkg.eventTypes.includes("other"))
  )
    .sort((a, b) => {
      // Exact event type match scores higher
      const aMatch = a.eventTypes.includes(eventType) ? 0 : 1;
      const bMatch = b.eventTypes.includes(eventType) ? 0 : 1;
      if (aMatch !== bMatch) return aMatch - bMatch;
      // Tighter guest range = more specific = higher score
      const aRange = a.maxGuests - a.minGuests;
      const bRange = b.maxGuests - b.minGuests;
      return aRange - bRange;
    })
    .slice(0, 3);
}

/**
 * Find a package by its ID.
 */
export function getPackageById(id: string): EventPackage | undefined {
  return PACKAGES.find((pkg) => pkg.id === id);
}
