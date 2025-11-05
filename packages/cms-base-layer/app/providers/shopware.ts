import type { ProviderGetImage } from "@nuxt/image";

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
