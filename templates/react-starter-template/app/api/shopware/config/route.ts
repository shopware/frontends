import { connection } from "next/server";

import { getShopwareConfig } from "@/platform/shopware/config";
import type { PublicShopwareConfig } from "@/platform/shopware/publicConfig";
import { getPublicApiHeaders } from "@/platform/shopware/requestOptions";

export async function GET(): Promise<Response> {
  await connection();
  const { publicEndpoint, accessToken, devStorefrontUrl } = getShopwareConfig();
  const config: PublicShopwareConfig = {
    endpoint: publicEndpoint,
    accessToken,
    devStorefrontUrl,
    headers: getPublicApiHeaders(),
  };
  return Response.json(config, {
    headers: { "Cache-Control": "no-store" },
  });
}
