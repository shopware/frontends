import { connection } from "next/server";
import { preconnect } from "react-dom";

import { resourceHintOrigins } from "@/features/layout/resourceHintOrigins";

export async function ResourceHints(): Promise<null> {
  await connection();
  const { media, storeApi } = resourceHintOrigins();
  if (media) preconnect(media);
  if (storeApi) preconnect(storeApi, { crossOrigin: "anonymous" });
  return null;
}
