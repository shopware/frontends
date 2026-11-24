// With a Chrome origin trial token WebMCP works without a browser flag.
// The tag must be in the first HTML, also in the app shell of client-only pages.
export default defineNitroPlugin((nitroApp) => {
  const { webmcpEnabled, webmcpOriginTrial } = useRuntimeConfig().public;
  const token = String(webmcpOriginTrial ?? "");
  if (!webmcpEnabled || !token) return;
  const content = token.replace(
    /[&"<>]/g,
    (char) => `&#${char.charCodeAt(0)};`,
  );
  nitroApp.hooks.hook("render:html", (html) => {
    html.head.unshift(`<meta http-equiv="origin-trial" content="${content}">`);
  });
});
