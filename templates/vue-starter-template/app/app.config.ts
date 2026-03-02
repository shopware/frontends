export default defineAppConfig({
  // Default cache lifetime (in milliseconds) for CSR (Client-Side Rendering) data (24 hours)
  defaultCSRCacheLifetime: 86400000,

  // Image placeholder configuration (cms-base-layer uses this setting)
  imagePlaceholder: {
    color: "#543B95", // brand-primary - can be overridden in child layers
  },
  backgroundImage: {
    format: "webp",
    quality: 80,
  },
});
