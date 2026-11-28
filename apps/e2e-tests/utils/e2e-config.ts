export const FEATURES = [
  "wishlist",
  "productReviews",
  "sitemap",
  "companyRegistration",
  "guestCheckout",
] as const;

export type Feature = (typeof FEATURES)[number];

export type E2eConfig = {
  features?: Partial<Record<Feature, boolean>>;
};

export function defineE2eConfig(config: E2eConfig): E2eConfig {
  return config;
}

export function isFeature(name: string): name is Feature {
  return (FEATURES as readonly string[]).includes(name);
}
