export type TokenColors = Record<string, string>;

function declarations(colors: TokenColors): string {
  return Object.entries(colors)
    .map(([name, value]) => `  --color-${name}: ${value};`)
    .join("\n");
}

export function toTailwindTheme(colors: TokenColors): string {
  return `@theme static {\n${declarations(colors)}\n}\n`;
}

export function toCssVariables(colors: TokenColors): string {
  return `:root {\n${declarations(colors)}\n}\n`;
}

export function toJson(colors: TokenColors): string {
  return `${JSON.stringify({ colors }, null, 2)}\n`;
}
