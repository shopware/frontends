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

export const PlusIcon = outline(<path d="M12 5v14M5 12h14" />);

export const ImageIcon = outline(
  <>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="9" cy="10" r="1.5" />
    <path d="m21 16-5-5-9 9" />
  </>,
);

export const TagIcon = outline(
  <>
    <path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z" />
    <circle cx="7.5" cy="7.5" r="1.5" />
  </>,
);

export const PercentageIcon = outline(
  <>
    <path d="M19 5 5 19" />
    <circle cx="7" cy="7" r="2" />
    <circle cx="17" cy="17" r="2" />
  </>,
);

export const UndoIcon = outline(
  <>
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
  </>,
);
