"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      className="mx-auto flex w-full max-w-screen-2xl flex-col items-start gap-4 px-4 py-16"
    >
      <h1 className="text-2xl font-bold text-surface-on-surface">
        Something went wrong
      </h1>
      <p className="text-surface-on-surface-variant">
        The page could not be loaded. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-brand-on-primary hover:bg-brand-primary-hover"
      >
        Try again
      </button>
    </div>
  );
}
