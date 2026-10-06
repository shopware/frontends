import type { ComponentProps, ReactNode } from "react";

type IconProps = Omit<ComponentProps<"svg">, "viewBox" | "children">;

function outline(paths: ReactNode) {
  return function OutlineIcon({ className, ...props }: IconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
        className={className}
        {...props}
      >
        {paths}
      </svg>
    );
  };
}

export const ChevronLeftIcon = outline(<path d="M15 6l-6 6 6 6" />);

export const ChevronRightIcon = outline(<path d="M9 6l6 6-6 6" />);

export const DownloadIcon = outline(
  <>
    <path d="M12 4v11" />
    <path d="M7 10l5 5 5-5" />
    <path d="M5 19h14" />
  </>,
);

export const DocumentUnknownIcon = outline(
  <>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
    <path d="M10 12.5a2 2 0 1 1 2.6 1.9c-.4.2-.6.5-.6.9v.7" />
    <path d="M12 18h.01" />
  </>,
);
