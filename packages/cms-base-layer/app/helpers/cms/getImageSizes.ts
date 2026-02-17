/**
 * Default mapping of CMS block slot count to responsive `sizes` attribute values.
 * Used by CmsGenericBlock to provide sizing hints to child image elements.
 *
 * Can be overridden via `app.config.ts`:
 * ```ts
 * export default defineAppConfig({
 *   imageSizes: {
 *     1: "(max-width: 768px) 100vw, 1200px",
 *     2: "(max-width: 768px) 100vw, 600px",
 *   },
 * });
 * ```
 */
const DEFAULT_IMAGE_SIZES: Record<string, string> = {
  1: "(max-width: 768px) 100vw, 100vw",
  2: "(max-width: 768px) 100vw, 50vw",
  3: "(max-width: 768px) 100vw, 33vw",
  default: "(max-width: 768px) 50vw, 25vw",
};

/**
 * Returns the responsive `sizes` attribute value for an image
 * based on the number of slots in its parent CMS block.
 *
 * @param slotCount - Number of slots in the block
 * @param config - Optional override map from app.config.ts (imageSizes)
 * @returns A valid HTML `sizes` attribute string
 */
export function getImageSizes(
  slotCount: number,
  config?: Record<string, string>,
): string {
  const sizes = { ...DEFAULT_IMAGE_SIZES, ...config };
  return sizes[slotCount] || sizes.default || "100vw";
}
