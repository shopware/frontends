import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  cacheComponents: true,
  skipTrailingSlashRedirect: true,
  transpilePackages: ["@shopware/cms-base-layer-react"],
  cacheLife: {
    catalog: { stale: 300, revalidate: 86400, expire: 172800 },
    listing: { stale: 60, revalidate: 900, expire: 3600 },
    seo: { stale: 300, revalidate: 3600, expire: 86400 },
    reference: { stale: 3600, revalidate: 604800, expire: 1209600 },
  },
};

export default nextConfig;
