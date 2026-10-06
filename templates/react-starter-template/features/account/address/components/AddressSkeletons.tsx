const PLACEHOLDER = "rounded-sm bg-surface-surface-container";

function FieldPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className={`h-4 w-24 ${PLACEHOLDER}`} />
      <div className="h-9 w-full rounded-md bg-surface-surface-container" />
    </div>
  );
}

export function AddressFormSkeleton() {
  return (
    <div
      className="flex animate-pulse flex-col gap-4 motion-reduce:animate-none"
      aria-busy="true"
      data-testid="loading"
    >
      <FieldPlaceholder />
      <div className="flex flex-col gap-4 sm:flex-row">
        <FieldPlaceholder className="sm:basis-1/2" />
        <FieldPlaceholder className="sm:basis-1/2" />
      </div>
      <FieldPlaceholder />
      <div className="flex flex-col gap-4 sm:flex-row">
        <FieldPlaceholder className="sm:basis-1/2" />
        <FieldPlaceholder className="sm:basis-1/2" />
      </div>
      <FieldPlaceholder />
      <div className="mt-6 flex gap-4">
        <div className={`h-12 w-36 ${PLACEHOLDER}`} />
        <div className={`h-12 w-24 ${PLACEHOLDER}`} />
      </div>
    </div>
  );
}

export function AddressDataSkeleton() {
  return (
    <div
      className="flex animate-pulse flex-col gap-2 motion-reduce:animate-none"
      aria-busy="true"
      data-testid="loading"
    >
      <div className={`h-6 w-40 ${PLACEHOLDER}`} />
      <div className={`h-6 w-48 ${PLACEHOLDER}`} />
      <div className={`h-6 w-36 ${PLACEHOLDER}`} />
      <div className={`h-6 w-28 ${PLACEHOLDER}`} />
    </div>
  );
}

export function AddressListSkeleton() {
  return (
    <div
      className="block animate-pulse grid-cols-2 gap-10 motion-reduce:animate-none md:grid"
      aria-busy="true"
      data-testid="loading"
    >
      {[0, 1].map((index) => (
        <div key={index} className="mb-10 flex flex-col gap-2 md:mb-0">
          <div className={`h-6 w-40 ${PLACEHOLDER}`} />
          <div className={`h-6 w-48 ${PLACEHOLDER}`} />
          <div className={`h-6 w-36 ${PLACEHOLDER}`} />
          <div className={`mb-6 h-6 w-28 ${PLACEHOLDER}`} />
          <div className="flex gap-4">
            <div className={`h-12 w-36 ${PLACEHOLDER}`} />
            <div className={`h-12 w-36 ${PLACEHOLDER}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
