const PLACEHOLDER = "rounded bg-surface-surface-container";

const t = {
  form: {
    loading: "Loading...",
  },
};

export function SuccessSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-screen-2xl animate-pulse px-4 py-10 md:py-20"
      aria-busy="true"
      data-testid="loading"
    >
      <output className="sr-only">{t.form.loading}</output>
      <div className="mb-12 flex items-start gap-4 md:mb-16 md:gap-6">
        <div className="size-12.5 shrink-0 rounded-full bg-surface-surface-container" />
        <div className="max-w-xl flex-1">
          <div className={`mb-4 h-10 w-3/4 ${PLACEHOLDER}`} />
          <div className={`mb-2 h-4 w-full ${PLACEHOLDER}`} />
          <div className={`h-4 w-2/3 ${PLACEHOLDER}`} />
        </div>
      </div>

      <div className="flex flex-col justify-between gap-10 lg:flex-row lg:gap-20">
        <div className="flex w-full flex-col gap-10 lg:w-1/2">
          <div>
            <div className={`mb-6 h-5 w-32 ${PLACEHOLDER}`} />
            {[0, 1].map((row) => (
              <div
                key={row}
                className="flex gap-4 border-b border-outline-outline-variant py-4"
              >
                <div className="size-24 shrink-0 bg-surface-surface-container" />
                <div className="flex-1">
                  <div className={`mb-3 h-4 w-2/3 ${PLACEHOLDER}`} />
                  <div className={`h-3 w-16 ${PLACEHOLDER}`} />
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {[0, 1, 2, 3].map((card) => (
              <div key={card} className="h-32 bg-surface-surface-container" />
            ))}
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <div className="border border-outline-outline">
            <div className="h-16 border-b border-outline-outline-variant" />
            <div className="flex flex-col gap-3 p-6">
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
