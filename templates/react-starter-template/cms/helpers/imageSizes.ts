export const DEFAULT_IMAGE_SIZES: Record<string, string> = {
  1: "(max-width: 768px) 100vw, 100vw",
  2: "(max-width: 768px) 100vw, 50vw",
  3: "(max-width: 768px) 100vw, 33vw",
  default: "(max-width: 768px) 50vw, 25vw",
};

export function getImageSizes(
  slotCount: number,
  config?: Record<string, string>,
): string {
  const sizes = { ...DEFAULT_IMAGE_SIZES, ...config };
  return sizes[slotCount] || sizes.default || "100vw";
}
