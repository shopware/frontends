import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col items-start gap-4 px-4 py-16">
      <h1 className="text-2xl font-bold text-surface-on-surface">
        Page not found
      </h1>
      <p className="text-surface-on-surface-variant">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-brand-on-primary hover:bg-brand-primary-hover"
      >
        Back to the home page
      </Link>
    </div>
  );
}
