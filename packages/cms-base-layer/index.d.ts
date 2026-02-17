/// <reference types="@nuxt/schema" />

export * from "@shopware/composables";
export * from "./.nuxt/imports";

declare module "nuxt/schema" {
  interface AppConfig {
    /** Placeholder shown while CMS images are loading */
    imagePlaceholder?: {
      /** CSS color value for the placeholder background */
      color?: string;
    };
    /** CDN optimization options applied to CMS background images and synthetic srcsets */
    backgroundImage?: {
      /** Output format passed to the CDN (e.g. "webp", "avif") */
      format?: string;
      /** Image quality 1-100 passed to the CDN */
      quality?: number;
    };
    /**
     * Maps CMS block slot count to a responsive `sizes` attribute value.
     * Used by CmsGenericBlock to provide sizing hints to child image elements.
     * @example
     * ```ts
     * imageSizes: {
     *   1: "(max-width: 768px) 100vw, 100vw",
     *   2: "(max-width: 768px) 100vw, 50vw",
     *   default: "(max-width: 768px) 50vw, 25vw",
     * }
     * ```
     */
    imageSizes?: Record<string | number, string>;
    /** Enable UnoCSS runtime for dynamic class generation */
    unocssRuntime?: boolean;
  }
}
