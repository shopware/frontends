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

function hasDefault(prop: DtoProperty): boolean {
  return prop.defaultValue !== undefined || prop.nullable || !prop.required;
}

function renderConstructorParam(prop: DtoProperty): string {
  const lines: string[] = [];
  const hasTypedArray = prop.isArray && prop.arrayItemType;

  if (hasTypedArray) {
    lines.push("        /**");
    lines.push(
      `         * @var list<${prop.arrayItemType}>${prop.description ? ` ${escapePhpDocComment(prop.description)}` : ""}`,
    );
    lines.push("         */");
  } else if (prop.description) {
    lines.push(`        /** ${escapePhpDocComment(prop.description)} */`);
  }

  if (prop.required && !prop.nullable) {
    if (prop.phpType === "string") {
      lines.push("        #[Assert\\NotBlank]");
    } else {
      lines.push("        #[Assert\\NotNull]");
    }
  }

  if (prop.pattern) {
    lines.push(
      `        #[Assert\\Regex(pattern: '/${escapePhpSingleQuoted(prop.pattern)}/')]`,
    );
  }

  if (prop.nullable) {
    lines.push("        #[PreserveNull]");
  }

  if (prop.enum && prop.enum.length > 0) {
    const choices = prop.enum
      .map((v) => `'${escapePhpSingleQuoted(v)}'`)
      .join(", ");
    lines.push(`        #[Assert\\Choice(choices: [${choices}])]`);
  }

  const needsNullFallback =
    !prop.required && !prop.nullable && prop.defaultValue === undefined;
  const effectiveNullable = prop.nullable || needsNullFallback;
  const typePrefix = effectiveNullable ? "?" : "";
  let defaultSuffix = "";
  if (prop.defaultValue !== undefined) {
    defaultSuffix = ` = ${formatPhpDefault(prop.defaultValue)}`;
  } else if (effectiveNullable) {
    defaultSuffix = " = null";
  }
  lines.push(
    `        public ${typePrefix}${prop.phpType} $${prop.name}${defaultSuffix},`,
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

  const sorted = [...dto.properties].sort((a, b) => {
    const ad = hasDefault(a);
    const bd = hasDefault(b);
    if (ad === bd) return 0;
    return ad ? 1 : -1;
  });

  const paramBlocks = sorted.map(renderConstructorParam);

  lines.push("    public function __construct(");
  lines.push(paramBlocks.join("\n"));
  lines.push("    ) {");
  lines.push("    }");

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

export function generatePreserveNullAttribute(
  options: GeneratorOptions = {},
): string {
  const lines: string[] = [];
  lines.push("<?php declare(strict_types=1);");
  lines.push("");
  if (options.namespace) {
    lines.push(`namespace ${options.namespace};`);
    lines.push("");
  }
  lines.push("#[\\Attribute(\\Attribute::TARGET_PROPERTY)]");
  lines.push("class PreserveNull");
  lines.push("{");
  lines.push("}");
  lines.push("");
  return lines.join("\n");
}

export function generateAllFiles(
  dtos: DtoDefinition[],
  options: GeneratorOptions = {},
): GeneratedFile[] {
  const dtoFiles = dtos.map((dto) => ({
    fileName: dtoToFileName(dto.name),
    content: generatePhpClass(dto, options),
  }));

  return [
    {
      fileName: "PreserveNull.php",
      content: generatePreserveNullAttribute(options),
    },
    ...dtoFiles,
  ];
}
