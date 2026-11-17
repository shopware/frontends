export const SSR_CONTAINER_WIDTH = 1200;
export const DEFAULT_SLIDE_MIN_WIDTH = 300;

export function parseMinWidth(
  value: string | number | null | undefined,
  fallback = DEFAULT_SLIDE_MIN_WIDTH,
): number {
  return +String(value ?? "").replace(/\D+/g, "") || fallback;
}

export function getSlidesToShow(
  containerWidth: number,
  slotCount: number,
  elMinWidth: number,
): number {
  const slots = slotCount > 0 ? slotCount : 1;
  const minWidth = elMinWidth > 0 ? elMinWidth : DEFAULT_SLIDE_MIN_WIDTH;
  const width = containerWidth || SSR_CONTAINER_WIDTH / slots;
  return Math.max(1, Math.floor(width / minWidth));
}

export function getSsrBreakpoints(
  slidesToShow: number,
  elMinWidth: number,
  slotCount: number,
): Record<string, number> {
  const breakpoints: Record<string, number> = {};
  for (let n = 2; n <= slidesToShow; n++) {
    breakpoints[`(min-width: ${elMinWidth * n * slotCount}px)`] = n;
  }
  return breakpoints;
}
