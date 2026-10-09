export function PageSkeleton() {
  return (
    <div
      className="mx-auto flex w-full max-w-screen-2xl animate-pulse flex-col gap-6 px-4 py-8"
      aria-busy="true"
      data-testid="loading"
    >
      <div className="h-64 w-full rounded-lg bg-surface-surface-container" />
      <div className="h-8 w-1/2 rounded bg-surface-surface-container" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="h-48 rounded-lg bg-surface-surface-container" />
        <div className="h-48 rounded-lg bg-surface-surface-container" />
        <div className="h-48 rounded-lg bg-surface-surface-container" />
        <div className="h-48 rounded-lg bg-surface-surface-container" />
      </div>
    </div>
  );
}
