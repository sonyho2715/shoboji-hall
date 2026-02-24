"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { StepIndicator } from "./StepIndicator";
import type { StepDef } from "./StepIndicator";
import { ClientInfoForm } from "./ClientInfoForm";
import { EventDetailsForm } from "./EventDetailsForm";
import { VenueRequirementsForm } from "./VenueRequirementsForm";
import { CateringDetailsForm } from "./CateringDetailsForm";
import { EquipmentSelector } from "./EquipmentSelector";
import { QuotePreview } from "./QuotePreview";
import type {
  BookingFormData,
  MembershipTierOption,
  EquipmentCategoryOption,
} from "./types";

interface BookingWizardProps {
  tiers: MembershipTierOption[];
  equipmentCategories: EquipmentCategoryOption[];
}

const initialFormData: BookingFormData = {
  clientInfo: {
    fullName: "",
    organization: "",
    phone: "",
    email: "",
    mailingAddress: "",
    preferredContact: "email",
    membershipTierId: 0,
    isMember: false,
  },
  eventDetails: {
    eventType: "",
    eventDescription: "",
    eventDate: "",
    eventStartTime: "",
    eventEndTime: "",
    setupHours: 0,
    breakdownHours: 0,
    adultCount: 0,
    childCount: 0,
    expectedVehicles: 0,
    referralSource: "",
  },
  venueRequirements: {
    bookingType: "hall_catering",
    roomSetup: "",
    alcoholServed: false,
    barType: "",
    specialRequirements: [],
    additionalNotes: "",
    budgetRange: "",
    readyToReserve: false,
  },
  catering: {
    serviceStyle: "",
    cuisines: [],
    cuisineOther: "",
    dietary: "",
    menuNotes: "",
    dessertNeeded: false,
    beverages: [],
  },
  equipment: [],
};

function hasCateringStep(bookingType: string): boolean {
  return bookingType === "hall_catering" || bookingType === "catering_only";
}

export function BookingWizard({
  tiers,
  equipmentCategories,
}: BookingWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const showCatering = hasCateringStep(formData.venueRequirements.bookingType);

  // Build steps dynamically
  const steps: StepDef[] = useMemo(() => {
    if (showCatering) {
      return [
        { number: 1, label: "Your Info" },
        { number: 2, label: "Event Details" },
        { number: 3, label: "Venue & Budget" },
        { number: 4, label: "Catering" },
        { number: 5, label: "Equipment" },
        { number: 6, label: "Review & Quote" },
      ];
    }
    return [
      { number: 1, label: "Your Info" },
      { number: 2, label: "Event Details" },
      { number: 3, label: "Venue & Budget" },
      { number: 4, label: "Equipment" },
      { number: 5, label: "Review & Quote" },
    ];
  }, [showCatering]);

  // Map logical step to actual step number
  // With catering: 1=Info, 2=Event, 3=Venue, 4=Catering, 5=Equipment, 6=Quote
  // Without catering: 1=Info, 2=Event, 3=Venue, 4=Equipment, 5=Quote
  const equipmentStep = showCatering ? 5 : 4;
  const quoteStep = showCatering ? 6 : 5;
  const cateringStep = 4; // only valid when showCatering

  function goToStep(step: number) {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleClientInfoNext(data: BookingFormData["clientInfo"]) {
    setFormData((prev) => ({ ...prev, clientInfo: data }));
    goToStep(2);
  }

  function handleEventDetailsNext(data: BookingFormData["eventDetails"]) {
    setFormData((prev) => ({ ...prev, eventDetails: data }));
    goToStep(3);
  }

  function handleVenueNext(data: BookingFormData["venueRequirements"]) {
    setFormData((prev) => ({ ...prev, venueRequirements: data }));
    const nextHasCatering = hasCateringStep(data.bookingType);
    if (nextHasCatering) {
      goToStep(4); // Catering step
    } else {
      goToStep(4); // Equipment step (which is step 4 without catering)
    }
  }

  function handleCateringNext(data: BookingFormData["catering"]) {
    setFormData((prev) => ({ ...prev, catering: data }));
    goToStep(equipmentStep);
  }

  function handleEquipmentNext(data: BookingFormData["equipment"]) {
    setFormData((prev) => ({ ...prev, equipment: data }));
    goToStep(quoteStep);
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const includesCatering = hasCateringStep(formData.venueRequirements.bookingType);

      const payload = {
        // Client info
        fullName: formData.clientInfo.fullName,
        organization: formData.clientInfo.organization || undefined,
        phone: formData.clientInfo.phone || undefined,
        email: formData.clientInfo.email || undefined,
        mailingAddress: formData.clientInfo.mailingAddress || undefined,
        preferredContact: formData.clientInfo.preferredContact,
        membershipTierId: formData.clientInfo.membershipTierId,
        isMember: formData.clientInfo.isMember,

        // Event details
        eventType: formData.eventDetails.eventType,
        eventDescription: formData.eventDetails.eventDescription || undefined,
        eventDate: formData.eventDetails.eventDate,
        eventStartTime: formData.eventDetails.eventStartTime,
        eventEndTime: formData.eventDetails.eventEndTime,
        setupHours: formData.eventDetails.setupHours,
        breakdownHours: formData.eventDetails.breakdownHours,
        adultCount: formData.eventDetails.adultCount,
        childCount: formData.eventDetails.childCount,
        expectedVehicles: formData.eventDetails.expectedVehicles,
        referralSource: formData.eventDetails.referralSource || undefined,

        // Venue
        bookingType: formData.venueRequirements.bookingType,
        roomSetup: formData.venueRequirements.roomSetup || undefined,
        alcoholServed: formData.venueRequirements.alcoholServed,
        barType: formData.venueRequirements.barType || undefined,
        specialRequirements: formData.venueRequirements.specialRequirements,
        additionalNotes:
          formData.venueRequirements.additionalNotes || undefined,
        budgetRange: formData.venueRequirements.budgetRange || undefined,
        readyToReserve: formData.venueRequirements.readyToReserve,

        // Catering
        ...(includesCatering
          ? {
              cateringServiceStyle: formData.catering.serviceStyle || undefined,
              cateringCuisines: formData.catering.cuisines,
              cateringDietary: formData.catering.dietary || undefined,
              cateringMenuNotes: formData.catering.menuNotes || undefined,
              cateringDessert: formData.catering.dessertNeeded,
              cateringBeverages: formData.catering.beverages,
            }
          : {}),

        // Equipment
        equipmentItems: formData.equipment.map((e) => ({
          equipmentId: e.equipmentId,
          quantity: e.quantity,
          unitRate: e.unitRate,
        })),

        // No services from public form
        serviceItems: [],
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to submit booking");
      }

      router.push(
        `/book/confirmation?booking=${encodeURIComponent(json.data.bookingNumber)}`
      );
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <StepIndicator
        currentStep={currentStep}
        steps={steps}
        onStepClick={(step) => {
          if (step < currentStep) goToStep(step);
        }}
      />

      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        {currentStep === 1 && (
          <ClientInfoForm
            data={formData.clientInfo}
            tiers={tiers}
            onNext={handleClientInfoNext}
          />
        )}
        {currentStep === 2 && (
          <EventDetailsForm
            data={formData.eventDetails}
            onNext={handleEventDetailsNext}
            onBack={() => goToStep(1)}
          />
        )}
        {currentStep === 3 && (
          <VenueRequirementsForm
            data={formData.venueRequirements}
            onNext={handleVenueNext}
            onBack={() => goToStep(2)}
          />
        )}
        {showCatering && currentStep === cateringStep && (
          <CateringDetailsForm
            data={formData.catering}
            onNext={handleCateringNext}
            onBack={() => goToStep(3)}
          />
        )}
        {currentStep === equipmentStep && (
          <EquipmentSelector
            data={formData.equipment}
            categories={equipmentCategories}
            onNext={handleEquipmentNext}
            onBack={() => goToStep(showCatering ? cateringStep : 3)}
          />
        )}
        {currentStep === quoteStep && (
          <QuotePreview
            formData={formData}
            tiers={tiers}
            onSubmit={handleSubmit}
            onBack={() => goToStep(equipmentStep)}
            onGoToStep={goToStep}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        )}
      </div>
    </div>
  );
}
