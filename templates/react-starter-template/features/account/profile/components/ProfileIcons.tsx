import type { IconProps } from "@/components/icons";

function meteor(viewBox: string, d: string) {
  return function MeteorIcon({ className, ...props }: IconProps) {
    return (
      <svg
        viewBox={viewBox}
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
        className={className}
        {...props}
      >
        <path fillRule="evenodd" clipRule="evenodd" d={d} />
      </svg>
    );
  };
}

export const EnvelopeIcon = meteor(
  "0 0 24 18",
  "M3.74379 2L10.8531 6.9765C11.5417 7.4585 12.4583 7.4585 13.1469 6.9765L20.2562 2H3.74379zM22 3.22066L14.2938 8.615C12.9166 9.5791 11.0834 9.5791 9.70615 8.615L2 3.22066V15C2 15.5523 2.44772 16 3 16H21C21.5523 16 22 15.5523 22 15V3.22066zM3 0H21C22.6569 0 24 1.34315 24 3V15C24 16.6569 22.6569 18 21 18H3C1.34315 18 0 16.6569 0 15V3C0 1.34315 1.34315 0 3 0z",
);

export const KeyIcon = meteor(
  "0 0 24 14",
  "M18 9V8C18 7.4477 18.4477 7 19 7C19.5523 7 20 7.4477 20 8V9H21C21.5523 9 22 8.5523 22 8V6C22 5.4477 21.5523 5 21 5H11.584C10.8124 3.2341 9.05032 2 7 2C4.23858 2 2 4.23858 2 7C2 9.7614 4.23858 12 7 12C9.05032 12 10.8124 10.7659 11.584 9H14V8C14 7.4477 14.4477 7 15 7C15.5523 7 16 7.4477 16 8V9H18zM21 3C22.6569 3 24 4.34315 24 6V8C24 9.6569 22.6569 11 21 11H12.7457C11.4611 12.8444 9.33628 14 7 14C3.13401 14 0 10.866 0 7C0 3.13401 3.13401 0 7 0C9.33628 0 11.4611 1.15555 12.7457 3H21zM5 8C4.44772 8 4 7.5523 4 7C4 6.4477 4.44772 6 5 6C5.55228 6 6 6.4477 6 7C6 7.5523 5.55228 8 5 8z",
);
