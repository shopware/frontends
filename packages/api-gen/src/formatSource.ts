import { format } from "oxfmt";
import type { FormatConfig } from "oxfmt";

const formatConfig = {
  arrowParens: "always",
  bracketSameLine: false,
  bracketSpacing: true,
  endOfLine: "lf",
  printWidth: 80,
  quoteProps: "as-needed",
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
  useTabs: false,
} satisfies FormatConfig;

export async function formatSource(
  fileName: string,
  sourceText: string,
  options?: FormatConfig,
) {
  const result = await format(fileName, sourceText, {
    ...formatConfig,
    ...options,
  });

  if (result.errors.length) {
    const messages = result.errors
      .map((error) => error.message)
      .filter(Boolean)
      .join("\n");
    throw new Error(
      `Could not format ${fileName}${messages ? `:\n${messages}` : ""}`,
    );
  }

  return result.code;
}
