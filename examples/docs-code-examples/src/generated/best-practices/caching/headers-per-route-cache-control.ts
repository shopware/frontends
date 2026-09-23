// Prevent any caching on sensitive routes
"/checkout": {
  ssr: false,
  headers: {
    "Cache-Control": "no-cache, no-store, must-revalidate",
  },
},
// Long-lived, immutable caching for static SVG assets
"/**/*.svg": {
  headers: {
    "Cache-Control": "public, max-age=31536000, immutable",
  },
},
