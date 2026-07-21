import { Check } from 'lucide-react';

export const CHECKOUT_STEPS = ['Cart', 'Shipping & Review', 'Confirmation'];

const CheckoutSteps = ({ currentStep }: { currentStep: number }) => (
  <div className="flex items-center mb-10 p-4 rounded-lg bg-accent">
    {CHECKOUT_STEPS.map((step, i) => (
      <div key={step} className="flex items-center flex-1 last:flex-none">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <div
            className={`flex items-center justify-center h-7 w-7 rounded-full text-xs font-medium shrink-0 ${
              i < currentStep
                ? 'bg-accent-foreground text-accent'
                : i === currentStep
                ? 'border-2 border-accent-foreground text-accent-foreground'
                : 'border border-accent-foreground/30 text-accent-foreground/50'
            }`}
          >
            {i < currentStep ? <Check className="h-3.5 w-3.5" /> : i + 1}
          </div>
          <span
            className={`text-sm ${
              i === currentStep ? 'text-accent-foreground font-medium' : 'text-accent-foreground/50'
            }`}
          >
            {step}
          </span>
        </div>
        {i < CHECKOUT_STEPS.length - 1 && (
          <div className={`flex-1 h-px mx-4 ${i < currentStep ? 'bg-accent-foreground' : 'bg-accent-foreground/30'}`} />
        )}
      </div>
    ))}
  </div>
);

export default CheckoutSteps;
