import { z } from "zod";

export type PublicShopwareConfig = {
  publicEndpoint: string;
  accessToken: string;
  devStorefrontUrl: string | null;
};

const publicShopwareConfigSchema = z.object({
  publicEndpoint: z.string().min(1),
  accessToken: z.string().min(1),
  devStorefrontUrl: z.string().min(1).nullable(),
});

export function parsePublicShopwareConfig(
  value: unknown,
): PublicShopwareConfig {
  return publicShopwareConfigSchema.parse(value);
}
