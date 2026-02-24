export interface BookingFormData {
  clientInfo: {
    fullName: string;
    organization: string;
    phone: string;
    email: string;
    mailingAddress: string;
    preferredContact: "phone" | "text" | "email";
    membershipTierId: number;
    isMember: boolean;
  };
  eventDetails: {
    eventType: string;
    eventDescription: string;
    eventDate: string;
    eventStartTime: string;
    eventEndTime: string;
    setupHours: number;
    breakdownHours: number;
    adultCount: number;
    childCount: number;
    expectedVehicles: number;
    referralSource: string;
  };
  venueRequirements: {
    bookingType: string;
    roomSetup: string;
    alcoholServed: boolean;
    barType: string;
    specialRequirements: string[];
    additionalNotes: string;
    budgetRange: string;
    readyToReserve: boolean;
  };
  catering: {
    serviceStyle: string;
    cuisines: string[];
    cuisineOther: string;
    dietary: string;
    menuNotes: string;
    dessertNeeded: boolean;
    beverages: string[];
  };
  equipment: Array<{
    equipmentId: number;
    quantity: number;
    unitRate: number;
    name: string;
  }>;
}

export interface MembershipTierOption {
  id: number;
  tierName: string;
  description: string | null;
  hallBaseRate: string;
  hallHourlyRate: string;
  eventSupportBase: string;
  eventSupportHourly: string;
  securityDeposit: string;
}

export interface EquipmentItemOption {
  id: number;
  name: string;
  description: string | null;
  ratePerEvent: string;
  quantityAvailable: number;
}

export interface EquipmentCategoryOption {
  id: number;
  name: string;
  sortOrder: number;
  items: EquipmentItemOption[];
}
