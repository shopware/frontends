const PLACEHOLDER = "rounded-sm bg-surface-surface-container";
const FIELD_LABEL = `h-4 w-24 ${PLACEHOLDER}`;
const FIELD_INPUT = "h-9 w-full rounded-md bg-surface-surface-container";

function FieldPlaceholder({ className }: { className: string }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className={FIELD_LABEL} />
      <div className={FIELD_INPUT} />
    </div>
  );
}

export function RegistrationFormSkeleton() {
  return (
    <div className="animate-pulse" aria-busy="true" data-testid="loading">
      <div className="mb-6 flex flex-col gap-2">
        <div className={`h-8 w-56 ${PLACEHOLDER}`} />
        <div className={`h-4 w-40 ${PLACEHOLDER}`} />
      </div>
      <div className="mb-10 grid grid-cols-12 gap-5">
        <FieldPlaceholder className="col-span-12" />
        <FieldPlaceholder className="col-span-12 md:col-span-4" />
        <FieldPlaceholder className="col-span-12 md:col-span-4" />
        <FieldPlaceholder className="col-span-12 md:col-span-6" />
        <FieldPlaceholder className="col-span-12 md:col-span-4" />
      </div>
      <div className="mb-5 h-7 w-full border-b border-outline-outline-variant pb-2">
        <div className={`h-5 w-32 ${PLACEHOLDER}`} />
      </div>
      <div className="mb-5 grid grid-cols-12 gap-5">
        <FieldPlaceholder className="col-span-12 md:col-span-4" />
        <FieldPlaceholder className="col-span-12 md:col-span-4" />
        <FieldPlaceholder className="col-span-12 md:col-span-4" />
        <FieldPlaceholder className="col-span-12 md:col-span-8" />
      </div>
      <div className="mb-5 flex justify-end">
        <div className={`h-12 w-28 ${PLACEHOLDER}`} />
      </div>
    </div>
  );
}
