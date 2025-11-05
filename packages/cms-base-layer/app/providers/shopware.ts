import type { ProviderGetImage } from "@nuxt/image";

/**
 * Shopware Image Provider for Nuxt Image
 *
 * Generates optimized image URLs compatible with Shopware's remote thumbnail generation feature.
 * This provider appends transformation parameters as query strings to image URLs, which are then
 * processed by your configured image transformation backend.
 *
 * @remarks
 * Shopware has built-in thumbnail generation (using GD2 or ImageMagick) that creates predefined
 * sizes (400x400, 800x800, 1920x1920) during upload. However, for **on-the-fly transformations**
 * via query parameters (like `?width=800`), you need to configure remote thumbnail generation:
 * - Shopware Cloud: Uses Fastly CDN (configured automatically)
 * - Self-hosted: Requires external middleware (Thumbor, Sharp, imgproxy) or plugins like FroshPlatformThumbnailProcessor
 *
 * Without remote thumbnail generation, query parameters will have no effect and original/predefined thumbnails are served
 *
 * @param src - The source image URL (e.g., "/media/image/product.jpg")
 * @param options - Configuration options
 * @param options.modifiers - Image transformation modifiers
 * @param options.modifiers.width - Target width in pixels
 * @param options.modifiers.height - Target height in pixels
 * @param options.modifiers.quality - Image quality (0-100)
 * @param options.modifiers.format - Output format (jpg, png, webp, avif)
 * @param options.modifiers.fit - Resize mode (cover, contain, crop, bounds, crop_center)
 *
 * @returns Object containing the transformed image URL with query parameters
 *
 * @example
 * ```typescript
 * // Basic usage
 * const result = getImage('/media/image/product.jpg', {
 *   modifiers: {
 *     width: 800,
 *     height: 600,
 *     quality: 85,
 *     format: 'webp',
 *     fit: 'cover'
 *   }
 * });
 * // Returns: { url: '/media/image/product.jpg?width=800&height=600&quality=85&format=webp&fit=cover' }
 * ```
 *
 * @example
 * ```typescript
 * // With existing query parameters
 * const result = getImage('/media/image/product.jpg?v=123', {
 *   modifiers: { width: 400 }
 * });
 * // Returns: { url: '/media/image/product.jpg?v=123&width=400' }
 * ```
 *
 * @example
 * ```typescript
 * // No modifiers - returns original URL
 * const result = getImage('/media/image/product.jpg');
 * // Returns: { url: '/media/image/product.jpg' }
 * ```
 *
 * @see {@link https://developer.shopware.com/docs/guides/plugins/plugins/content/media/remote-thumbnail-generation.html | Shopware Remote Thumbnail Generation}
 * @see {@link https://image.nuxt.com/providers/custom | Nuxt Image Custom Providers}
 */
export const getImage: ProviderGetImage = (src, { modifiers = {} } = {}) => {
  const params = new URLSearchParams();

  // Map Nuxt Image modifiers to Shopware query parameters
  if (modifiers.width) {
    params.set("width", String(modifiers.width));
  }

  if (modifiers.height) {
    params.set("height", String(modifiers.height));
  }

  if (modifiers.quality) {
    params.set("quality", String(modifiers.quality));
  }

  if (modifiers.format) {
    params.set("format", String(modifiers.format));
  }

  if (modifiers.fit) {
    params.set("fit", String(modifiers.fit));
  }

  const query = params.toString();

  if (!query) {
    return { url: src };
  }

  // Check if URL already has query parameters
  const separator = src.includes("?") ? "&" : "?";

  return {
    url: `${src}${separator}${query}`,
  };
};
