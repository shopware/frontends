import type { ReactNode } from "react";

export type StepHeaderProps = {
  step: number;
  label: string;
  children: ReactNode;
};

export function StepHeader({ step, label, children }: StepHeaderProps) {
  const headingId = `checkout-step-${step}-heading`;
  return (
    <section className="mb-10" aria-labelledby={headingId}>
      <div className="mb-8 flex items-center gap-4 border-b border-outline-outline pb-2">
        <div
          aria-hidden="true"
          className="flex size-12.5 shrink-0 items-center justify-center rounded-full bg-brand-secondary text-2xl leading-normal font-normal text-brand-on-secondary"
        >
          {step}
        </div>
        <h2
          id={headingId}
          className="text-2xl leading-9 text-surface-on-surface"
        >
          {label}
        </h2>
      </div>
      <div>{children}</div>
    </section>
  );
}
