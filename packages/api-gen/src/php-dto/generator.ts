import type { DtoDefinition, DtoProperty } from "./schemaParser";

export interface GeneratorOptions {
  namespace?: string;
}

function escapePhpDocComment(text: string): string {
  return text.replace(/\*\//g, "* /");
}

function escapePhpSingleQuoted(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function formatPhpDefault(value: string | number | boolean): string {
  if (typeof value === "string") return `'${escapePhpSingleQuoted(value)}'`;
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
}

function renderPropertyBlock(prop: DtoProperty): string {
  const lines: string[] = [];
  const hasTypedArray = prop.isArray && prop.arrayItemType;

  if (hasTypedArray) {
    lines.push("    /**");
    lines.push(
      `     * @var list<${prop.arrayItemType}>${prop.description ? ` ${escapePhpDocComment(prop.description)}` : ""}`,
    );
    lines.push("     */");
  } else if (prop.description) {
    lines.push(`    /** ${escapePhpDocComment(prop.description)} */`);
  }

  if (prop.required && !prop.nullable) {
    lines.push("    #[Assert\\NotNull]");
  }

  if (prop.pattern) {
    lines.push(
      `    #[Assert\\Regex(pattern: '/${escapePhpSingleQuoted(prop.pattern)}/')]`,
    );
  }

  if (prop.enum && prop.enum.length > 0) {
    const choices = prop.enum
      .map((v) => `'${escapePhpSingleQuoted(v)}'`)
      .join(", ");
    lines.push(`    #[Assert\\Choice(choices: [${choices}])]`);
  }

  const typePrefix = prop.nullable ? "?" : "";
  let defaultSuffix = "";
  if (prop.defaultValue !== undefined) {
    defaultSuffix = ` = ${formatPhpDefault(prop.defaultValue)}`;
  } else if (prop.nullable) {
    defaultSuffix = " = null";
  }
  lines.push(
    `    public ${typePrefix}${prop.phpType} $${prop.name}${defaultSuffix};`,
  );

  return lines.join("\n");
}

export function generatePhpClass(
  dto: DtoDefinition,
  options: GeneratorOptions = {},
): string {
  const lines: string[] = [];
  const needsAssert = dto.properties.some(
    (p) =>
      p.pattern || (p.enum && p.enum.length > 0) || (p.required && !p.nullable),
  );

  lines.push("<?php declare(strict_types=1);");
  lines.push("");

  if (options.namespace) {
    lines.push(`namespace ${options.namespace};`);
    lines.push("");
  }

  if (needsAssert) {
    lines.push("use Symfony\\Component\\Validator\\Constraints as Assert;");
    lines.push("");
  }

  if (dto.description) {
    lines.push("/**");
    for (const line of dto.description.split("\n")) {
      lines.push(` * ${escapePhpDocComment(line)}`);
    }
    lines.push(" */");
  }

  lines.push(`class ${dto.name}`);
  lines.push("{");

  const propertyBlocks = dto.properties.map(renderPropertyBlock);
  lines.push(propertyBlocks.join("\n\n"));

  lines.push("}");
  lines.push("");

  return lines.join("\n");
}

export function dtoToFileName(dtoName: string): string {
  return `${dtoName}.php`;
}

export interface GeneratedFile {
  fileName: string;
  content: string;
}

export function generateAllFiles(
  dtos: DtoDefinition[],
  options: GeneratorOptions = {},
): GeneratedFile[] {
  return dtos.map((dto) => ({
    fileName: dtoToFileName(dto.name),
    content: generatePhpClass(dto, options),
  }));
}
