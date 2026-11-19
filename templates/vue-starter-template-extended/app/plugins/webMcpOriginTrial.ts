// With a Chrome origin trial token WebMCP works without a browser flag.
export default defineNuxtPlugin(() => {
  const { webmcpOriginTrial } = useRuntimeConfig().public;
  if (!webmcpOriginTrial) return;
  useHead({
    meta: [{ "http-equiv": "origin-trial", content: webmcpOriginTrial }],
  });
});
