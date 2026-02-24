const steps = [
  { number: 1, label: "Your Info" },
  { number: 2, label: "Event Details" },
  { number: 3, label: "Venue" },
  { number: 4, label: "Equipment" },
  { number: 5, label: "Review" },
];

interface StepIndicatorProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <nav aria-label="Booking progress" className="mb-8">
      {/* Mobile */}
      <div className="flex items-center justify-between sm:hidden">
        <p className="text-sm font-medium text-stone-600">
          Step {currentStep} of {steps.length}
        </p>
        <p className="text-sm font-semibold text-navy-700">
          {steps[currentStep - 1].label}
        </p>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-200 sm:hidden">
        <div
          className="h-full rounded-full bg-navy-700 transition-all duration-300"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        />
      </div>

      {/* Desktop */}
      <ol className="hidden sm:flex sm:items-center sm:gap-0">
        {steps.map((step, idx) => {
          const isComplete = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const isClickable = isComplete && onStepClick;

          return (
            <li key={step.number} className="flex flex-1 items-center">
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(step.number)}
                className={`flex items-center gap-2.5 ${
                  isClickable ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                    isComplete
                      ? "bg-forest-500 text-white"
                      : isCurrent
                        ? "bg-navy-700 text-white"
                        : "bg-stone-200 text-stone-500"
                  }`}
                >
                  {isComplete ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </span>
                <span
                  className={`hidden text-sm font-medium lg:block ${
                    isCurrent
                      ? "text-navy-700"
                      : isComplete
                        ? "text-forest-600"
                        : "text-stone-400"
                  }`}
                >
                  {step.label}
                </span>
              </button>
              {idx < steps.length - 1 && (
                <div
                  className={`mx-3 h-0.5 flex-1 rounded ${
                    isComplete ? "bg-forest-500" : "bg-stone-200"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
