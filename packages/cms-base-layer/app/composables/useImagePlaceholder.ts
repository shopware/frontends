/**
 * Composable that provides an SVG placeholder image as a data URI
 * Note: CSS variables and currentColor don't work in data URIs since SVGs are rendered in isolation
 * For themeable placeholders, use the SwImagePlaceholder component instead
 *
 * @param color - Hex color for the placeholder (optional - defaults to appConfig.imagePlaceholder.color)
 * @returns Base64-encoded SVG data URI
 */
export function useImagePlaceholder(color?: string) {
  const appConfig = useAppConfig();
  const placeholderColor =
    color || appConfig.imagePlaceholder?.color || "#543B95";

  const placeholderSvg = `data:image/svg+xml;base64,${btoa(
    `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
  <rect width="100%" height="100%" fill="${placeholderColor}" opacity="0.1"/>
  <g fill="${placeholderColor}" opacity="0.2">
    <path d="M170 180h60v40h-60z"/>
    <circle cx="180" cy="195" r="8"/>
    <path d="M170 220l15-15 10 10 20-20 15 15v10h-60z"/>
  </g>
</svg>
`.trim(),
  )}`;

  return placeholderSvg;
}
