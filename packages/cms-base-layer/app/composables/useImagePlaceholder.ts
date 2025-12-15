import { useAppConfig } from "nuxt/app";

/**
 * Composable that provides an SVG placeholder image as a data URI
 * Note: CSS variables and currentColor don't work in data URIs since SVGs are rendered in isolation
 *
 * @param color - Hex color for the placeholder (optional - defaults to appConfig.imagePlaceholder.color or #543B95)
 * @returns Base64-encoded SVG data URI
 */
export function useImagePlaceholder(color?: string) {
  const appConfig = useAppConfig();
  const placeholderColor =
    color || appConfig.imagePlaceholder?.color || "#543B95";

  const placeholderSvg = `data:image/svg+xml;base64,${btoa(
    `
<svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="96" height="96" rx="8" fill="${placeholderColor}" opacity="0.08"/>
  <g transform="translate(36, 36)">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M3 22H21C21.5523 22 22 21.5523 22 21V17L17.7071 12.7071C17.3166 12.3166 16.6834 12.3166 16.2929 12.7071L10.5 18.5C10.2239 18.7761 9.77614 18.7761 9.5 18.5C9.22386 18.2239 9.22386 17.7761 9.5 17.5L11 16L8.70711 13.7071C8.31658 13.3166 7.68342 13.3166 7.29289 13.7071L2 19V21C2 21.5523 2.44772 22 3 22ZM21 24H3C1.34315 24 0 22.6569 0 21V3C0 1.34315 1.34315 0 3 0H21C22.6569 0 24 1.34315 24 3V21C24 22.6569 22.6569 24 21 24ZM6.5 9C7.88071 9 9 7.88071 9 6.5C9 5.11929 7.88071 4 6.5 4C5.11929 4 4 5.11929 4 6.5C4 7.88071 5.11929 9 6.5 9Z" fill="${placeholderColor}" opacity="0.4"/>
  </g>
</svg>
`.trim(),
  )}`;

  return placeholderSvg;
}
