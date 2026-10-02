import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  cacheComponents: true,
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
