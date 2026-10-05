const PLACEHOLDER = "rounded-sm bg-surface-surface-container";

function StepPlaceholder({ rows }: { rows: number }) {
  return (
    <div className="mb-10">
      <div className="mb-8 flex items-center gap-4 border-b border-outline-outline-variant pb-2">
        <div className="size-12.5 rounded-full bg-surface-surface-container" />
        <div className={`h-7 w-48 ${PLACEHOLDER}`} />
      </div>
      <div className="flex flex-col gap-4">
        {Array.from({ length: rows }, (_, index) => (
          <div
            key={index}
            className="h-10 w-full rounded-md bg-surface-surface-container"
          />
        ))}
      </div>
    </div>
  );
}

export function CheckoutSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-screen-2xl animate-pulse px-4"
      aria-busy="true"
      data-testid="loading"
    >
      <div className={`my-10 h-12 w-56 md:my-20 ${PLACEHOLDER}`} />
      <div className="flex flex-col gap-10 lg:flex-row lg:justify-between lg:gap-20">
        <div className="w-full lg:w-1/2">
          <StepPlaceholder rows={4} />
          <StepPlaceholder rows={2} />
          <StepPlaceholder rows={2} />
        </div>
        <div className="w-full lg:w-1/2">
          <div className="border border-outline-outline-variant">
            <div className="h-16 border-b border-outline-outline-variant" />
            <div className="flex flex-col gap-3 p-6">
              <div className="h-24 w-full bg-surface-surface-container" />
              <div className={`h-4 w-full ${PLACEHOLDER}`} />
              <div className={`h-4 w-full ${PLACEHOLDER}`} />
              <div className={`mt-2 h-5 w-full ${PLACEHOLDER}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
