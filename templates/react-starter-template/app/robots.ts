import type { MetadataRoute } from "next";
import { connection } from "next/server";

import { buildRobots } from "@/platform/seo/robots";
import { getSiteUrl } from "@/platform/seo/siteUrl";

export default async function robots(): Promise<MetadataRoute.Robots> {
  await connection();
  return buildRobots(getSiteUrl());
}
