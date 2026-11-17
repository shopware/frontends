export function toTailwindTheme(colors: Record<string, string>): string {
  const declarations = Object.entries(colors)
    .map(([name, value]) => `  --color-${name}: ${value};`)
    .join("\n");
  return `@theme static {\n${declarations}\n}\n`;
}
