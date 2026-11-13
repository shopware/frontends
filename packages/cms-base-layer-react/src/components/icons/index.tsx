import type { ComponentProps } from "react";

export type IconProps = Omit<ComponentProps<"svg">, "viewBox" | "children">;

function carbon(
  name: string,
  body: ComponentProps<"svg">["children"],
): (props: IconProps) => React.JSX.Element {
  function CarbonIcon({ className, ...props }: IconProps) {
    return (
      <svg
        viewBox="0 0 32 32"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden={props["aria-label"] ? undefined : true}
        focusable="false"
        className={className}
        data-icon={name}
        {...props}
      >
        {body}
      </svg>
    );
  }
  CarbonIcon.displayName = name;
  return CarbonIcon;
}

export const SpinnerIcon = carbon(
  "progress-bar-round",
  <>
    <path d="M16 22a6 6 0 1 1 6-6a6.007 6.007 0 0 1-6 6m0-10a4 4 0 1 0 4 4a4.005 4.005 0 0 0-4-4" />
    <path d="M16 26a10.02 10.02 0 0 1-7.453-3.332l1.49-1.334A8 8 0 1 0 16 8V6a10 10 0 0 1 0 20" />
    <path d="M16 30a14 14 0 1 1 14-14a14.016 14.016 0 0 1-14 14m0-26a12 12 0 1 0 12 12A12.014 12.014 0 0 0 16 4" />
  </>,
);

export const ChevronDownIcon = carbon(
  "chevron-down",
  <path d="M16 22L6 12l1.4-1.4l8.6 8.6l8.6-8.6L26 12z" />,
);

export const ChevronUpIcon = carbon(
  "chevron-up",
  <path d="m16 10l10 10l-1.4 1.4l-8.6-8.6l-8.6 8.6L6 20z" />,
);

export const ChevronLeftIcon = carbon(
  "chevron-left",
  <path d="M10 16L20 6l1.4 1.4l-8.6 8.6l8.6 8.6L20 26z" />,
);

export const ChevronRightIcon = carbon(
  "chevron-right",
  <path d="M22 16L12 26l-1.4-1.4l8.6-8.6l-8.6-8.6L12 6z" />,
);

export const CloseIcon = carbon(
  "close",
  <path d="M17.414 16L24 9.414L22.586 8L16 14.586L9.414 8L8 9.414L14.586 16L8 22.586L9.414 24L16 17.414L22.586 24L24 22.586z" />,
);

export const CloseFilledIcon = carbon(
  "close-filled",
  <path d="M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14s14-6.2 14-14S23.8 2 16 2m5.4 21L16 17.6L10.6 23L9 21.4l5.4-5.4L9 10.6L10.6 9l5.4 5.4L21.4 9l1.6 1.6l-5.4 5.4l5.4 5.4z" />,
);

export const WarningIcon = carbon(
  "warning",
  <>
    <path d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2m0 26a12 12 0 1 1 12-12a12 12 0 0 1-12 12" />
    <path d="M15 8h2v11h-2zm1 14a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 16 22" />
  </>,
);

export const StarIcon = carbon(
  "star",
  <path d="m16 6.52l2.76 5.58l.46 1l1 .15l6.16.89l-4.38 4.3l-.75.73l.18 1l1.05 6.13l-5.51-2.89L16 23l-.93.49l-5.51 2.85l1-6.13l.18-1l-.74-.77l-4.42-4.35l6.16-.89l1-.15l.46-1zM16 2l-4.55 9.22l-10.17 1.47l7.36 7.18L6.9 30l9.1-4.78L25.1 30l-1.74-10.13l7.36-7.17l-10.17-1.48Z" />,
);

export const StarFilledIcon = carbon(
  "star-filled",
  <path d="m16 2l-4.55 9.22l-10.17 1.47l7.36 7.18L6.9 30l9.1-4.78L25.1 30l-1.74-10.13l7.36-7.17l-10.17-1.48Z" />,
);

export const FavoriteIcon = carbon(
  "favorite",
  <path d="M22.45 6a5.47 5.47 0 0 1 3.91 1.64a5.7 5.7 0 0 1 0 8L16 26.13L5.64 15.64a5.7 5.7 0 0 1 0-8a5.48 5.48 0 0 1 7.82 0l2.54 2.6l2.53-2.58A5.44 5.44 0 0 1 22.45 6m0-2a7.47 7.47 0 0 0-5.34 2.24L16 7.36l-1.11-1.12a7.49 7.49 0 0 0-10.68 0a7.72 7.72 0 0 0 0 10.82L16 29l11.79-11.94a7.72 7.72 0 0 0 0-10.82A7.5 7.5 0 0 0 22.45 4" />,
);

export const FavoriteFilledIcon = carbon(
  "favorite-filled",
  <path d="M22.5 4c-2 0-3.9.8-5.3 2.2L16 7.4l-1.1-1.1c-2.9-3-7.7-3-10.6-.1l-.1.1c-3 3-3 7.8 0 10.8L16 29l11.8-11.9c3-3 3-7.8 0-10.8C26.4 4.8 24.5 4 22.5 4" />,
);

export const ShoppingCartIcon = carbon(
  "shopping-cart",
  <>
    <circle cx="10" cy="28" r="2" />
    <circle cx="24" cy="28" r="2" />
    <path d="M28 7H5.82L5 2.8A1 1 0 0 0 4 2H0v2h3.18L7 23.2a1 1 0 0 0 1 .8h18v-2H8.82L8 18h18a1 1 0 0 0 1-.78l2-9A1 1 0 0 0 28 7m-2.8 9H7.62l-1.4-7h20.53Z" />
  </>,
);

export const CheckmarkIcon = carbon(
  "checkmark",
  <path d="m13 24l-9-9l1.414-1.414L13 21.171L26.586 7.586L28 9z" />,
);

export function CheckCircleIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden={props["aria-label"] ? undefined : true}
      focusable="false"
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM7.56066 10.9393L10.5 13.8787L16.4393 7.93934C17.0251 7.35355 17.9749 7.35355 18.5607 7.93934C19.1464 8.52513 19.1464 9.47487 18.5607 10.0607L11.5607 17.0607C10.9749 17.6464 10.0251 17.6464 9.43934 17.0607L5.43934 13.0607C4.85355 12.4749 4.85355 11.5251 5.43934 10.9393C6.02513 10.3536 6.97487 10.3536 7.56066 10.9393Z"
      />
    </svg>
  );
}

export function ExclamationCircleIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden={props["aria-label"] ? undefined : true}
      focusable="false"
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM10.5 7.5V12C10.5 12.8284 11.1716 13.5 12 13.5C12.8284 13.5 13.5 12.8284 13.5 12V7.5C13.5 6.67157 12.8284 6 12 6C11.1716 6 10.5 6.67157 10.5 7.5ZM12 18C12.8284 18 13.5 17.3284 13.5 16.5C13.5 15.6716 12.8284 15 12 15C11.1716 15 10.5 15.6716 10.5 16.5C10.5 17.3284 11.1716 18 12 18Z"
      />
    </svg>
  );
}

export function UserIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 22"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden={props["aria-label"] ? undefined : true}
      focusable="false"
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 2C7.79086 2 6 3.79086 6 6C6 8.20914 7.79086 10 10 10C12.2091 10 14 8.20914 14 6C14 3.79086 12.2091 2 10 2zM10 0C13.3137 0 16 2.68629 16 6C16 9.3137 13.3137 12 10 12C6.68629 12 4 9.3137 4 6C4 2.68629 6.68629 0 10 0zM2 21.099C2 21.6513 1.55228 22.099 1 22.099C0.44772 22.099 0 21.6513 0 21.099V19C0 16.2386 2.23858 14 5 14H15.0007C17.7621 14 20.0007 16.2386 20.0007 19V21.099C20.0007 21.6513 19.553 22.099 19.0007 22.099C18.4484 22.099 18.0007 21.6513 18.0007 21.099V19C18.0007 17.3431 16.6576 16 15.0007 16H5C3.34315 16 2 17.3431 2 19V21.099z"
      />
    </svg>
  );
}

export function ReviewStarIcon({
  filled,
  className,
  ...props
}: IconProps & { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden={props["aria-label"] ? undefined : true}
      focusable="false"
      className={className}
      {...props}
    >
      {filled ? (
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.53339 15.5446C3.85953 15.8416 3.07255 15.536 2.7756 14.8622C2.68261 14.6511 2.64594 14.4196 2.66917 14.1902L3.0508 10.421L0.526591 7.59599C0.0359476 7.04688 0.083346 6.20399 0.632458 5.71335C0.804415 5.5597 1.01328 5.45328 1.23866 5.40448L4.94128 4.60269L6.848 1.32905C7.21862 0.692736 8.0349 0.477347 8.67122 0.847967C8.87048 0.964028 9.03624 1.12979 9.1523 1.32905L11.059 4.60269L14.7616 5.40448C15.4813 5.56033 15.9384 6.2701 15.7826 6.9898C15.7338 7.21517 15.6274 7.42404 15.4737 7.59599L12.9495 10.421L13.3311 14.1902C13.4053 14.9228 12.8715 15.5769 12.1389 15.651C11.9095 15.6743 11.6779 15.6376 11.4669 15.5446L8.00015 14.0169L4.53339 15.5446Z"
        />
      ) : (
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.00015 12.5599L12.0046 14.3245L11.5638 9.97075L14.4795 6.70761L10.2026 5.78147L8.00015 2.00012L5.79771 5.78147L1.52085 6.70761L4.43653 9.97075L3.99572 14.3245L8.00015 12.5599ZM4.53339 15.5446C3.85953 15.8416 3.07255 15.536 2.7756 14.8622C2.68261 14.6511 2.64594 14.4196 2.66917 14.1902L3.0508 10.421L0.526591 7.59599C0.0359476 7.04688 0.083346 6.20399 0.632458 5.71335C0.804415 5.5597 1.01328 5.45328 1.23866 5.40448L4.94128 4.60269L6.848 1.32905C7.21862 0.692736 8.0349 0.477347 8.67122 0.847967C8.87048 0.964028 9.03624 1.12979 9.1523 1.32905L11.059 4.60269L14.7616 5.40448C15.4813 5.56033 15.9384 6.2701 15.7826 6.9898C15.7338 7.21517 15.6274 7.42404 15.4737 7.59599L12.9495 10.421L13.3311 14.1902C13.4053 14.9228 12.8715 15.5769 12.1389 15.651C11.9095 15.6743 11.6779 15.6376 11.4669 15.5446L8.00015 14.0169L4.53339 15.5446Z"
        />
      )}
    </svg>
  );
}
