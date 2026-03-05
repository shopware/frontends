import type { DtoDefinition, DtoProperty, DtoSource } from "./schemaParser";

export interface GeneratorOptions {
  namespace?: string;
  /** Original base namespace before shared/ resolution, used for computing use statements */
  baseNamespace?: string;
  dtoSourceMap?: Map<string, DtoSource>;
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

const PHP_PRIMITIVE_TYPES = new Set([
  "string",
  "int",
  "float",
  "bool",
  "array",
  "mixed",
]);

function resolveNamespace(
  baseNamespace: string | undefined,
  source: DtoSource,
): string | undefined {
  if (source === "component") {
    return baseNamespace ? `${baseNamespace}\\Shared` : "Shared";
  }
  return baseNamespace;
}

function collectReferencedDtoNames(properties: DtoProperty[]): Set<string> {
  const refs = new Set<string>();
  for (const prop of properties) {
    if (!PHP_PRIMITIVE_TYPES.has(prop.phpType)) {
      refs.add(prop.phpType);
    }
    if (prop.arrayItemType && !PHP_PRIMITIVE_TYPES.has(prop.arrayItemType)) {
      refs.add(prop.arrayItemType);
    }
  }
  return refs;
}

function buildUseStatements(
  baseNamespace: string | undefined,
  referencedNames: Set<string>,
  dtoSourceMap: Map<string, DtoSource>,
  usesPreserveNull: boolean,
): string[] {
  const imports: string[] = [];

  if (usesPreserveNull) {
    const preserveNullNs = baseNamespace;
    const fqcn = preserveNullNs
      ? `${preserveNullNs}\\PreserveNull`
      : "PreserveNull";
    imports.push(fqcn);
  }

  for (const name of referencedNames) {
    const refSource = dtoSourceMap.get(name) ?? "component";
    const refNs = resolveNamespace(baseNamespace, refSource);
    const fqcn = refNs ? `${refNs}\\${name}` : name;
    imports.push(fqcn);
  }

  imports.sort();
  return imports;
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

  const useLines: string[] = [];

  if (needsAssert) {
    useLines.push("use Symfony\\Component\\Validator\\Constraints as Assert;");
  }

  if (options.dtoSourceMap) {
    const usesPreserveNull = dto.properties.some((p) => p.nullable);
    const referencedNames = collectReferencedDtoNames(dto.properties);
    const imports = buildUseStatements(
      options.baseNamespace,
      referencedNames,
      options.dtoSourceMap,
      usesPreserveNull,
    );
    for (const fqcn of imports) {
      useLines.push(`use ${fqcn};`);
    }
  }

  if (useLines.length > 0) {
    useLines.sort();
    for (const line of useLines) {
      lines.push(line);
    }
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
  const dtoSourceMap = new Map<string, DtoSource>();
  for (const dto of dtos) {
    dtoSourceMap.set(dto.name, dto.source ?? "component");
  }

  const dtoFiles = dtos.map((dto) => {
    const source = dto.source ?? "component";
    const dir = source === "component" ? "shared/" : "";
    const effectiveNs = resolveNamespace(options.namespace, source);
    const fileOptions: GeneratorOptions = {
      ...options,
      namespace: effectiveNs,
      baseNamespace: options.namespace,
      dtoSourceMap,
    };
    return {
      fileName: `${dir}${dtoToFileName(dto.name)}`,
      content: generatePhpClass(dto, fileOptions),
    };
  });

  return [
    {
      fileName: "PreserveNull.php",
      content: generatePreserveNullAttribute(options),
    },
    ...dtoFiles,
  ];
}
