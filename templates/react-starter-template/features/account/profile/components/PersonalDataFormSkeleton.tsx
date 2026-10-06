const t = {
  form: {
    loading: "Loading...",
  },
};

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

export function PersonalDataFormSkeleton() {
  return (
    <div
      className="flex animate-pulse flex-col gap-4"
      aria-busy="true"
      data-testid="account-personal-data-loading"
    >
      <output className="sr-only">{t.form.loading}</output>
      <FieldPlaceholder className="w-60" />
      <FieldPlaceholder className="w-60" />
      <div className="flex flex-col gap-2 md:flex-row">
        <FieldPlaceholder className="w-full" />
        <FieldPlaceholder className="w-full" />
      </div>
      <div className="h-12 w-full rounded-sm bg-surface-surface-container" />
    </div>
  );
}
