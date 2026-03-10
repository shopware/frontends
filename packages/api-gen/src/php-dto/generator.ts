import picomatch from "picomatch";
import type { DtoDefinition, DtoProperty, DtoSource } from "./schemaParser";

export interface GeneratorOptions {
  namespace?: string;
  /** Original base namespace before DTO/ resolution, used for computing use statements */
  baseNamespace?: string;
  /** Top-level namespace from config, used for PreserveNull FQCN */
  rootNamespace?: string;
  dtoSourceMap?: Map<string, DtoSource>;
  pathMapping?: Record<string, string>;
}

export interface GenerateResult {
  files: GeneratedFile[];
  unmappedPaths: string[];
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

const FORMAT_ASSERT_MAP: Record<string, string> = {
  email: "#[Assert\\Email]",
  uuid: "#[Assert\\Uuid]",
  uri: "#[Assert\\Url]",
  "date-time":
    "#[Assert\\DateTime(format: \\Shopware\\Core\\Defaults::STORAGE_DATE_TIME_FORMAT)]",
  date: "#[Assert\\Date]",
};

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
    return baseNamespace ? `${baseNamespace}\\DTO` : "DTO";
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
  rootNamespace?: string,
): string[] {
  const imports: string[] = [];

  if (usesPreserveNull) {
    const attrBase = rootNamespace ?? baseNamespace;
    const attrNs = attrBase ? `${attrBase}\\Attributes` : "Attributes";
    imports.push(`${attrNs}\\PreserveNull`);
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

  if (prop.format && FORMAT_ASSERT_MAP[prop.format]) {
    lines.push(`        ${FORMAT_ASSERT_MAP[prop.format]}`);
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
      p.pattern ||
      (p.format && FORMAT_ASSERT_MAP[p.format]) ||
      (p.enum && p.enum.length > 0) ||
      (p.required && !p.nullable),
  );

  lines.push("<?php declare(strict_types=1);");
  lines.push("");
  lines.push("// This file is auto-generated. Do not edit manually.");
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
      options.rootNamespace,
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
  const ns = options.namespace
    ? `${options.namespace}\\Attributes`
    : "Attributes";
  const lines: string[] = [];
  lines.push("<?php declare(strict_types=1);");
  lines.push("");
  lines.push("// This file is auto-generated. Do not edit manually.");
  lines.push("");
  lines.push(`namespace ${ns};`);
  lines.push("");
  lines.push("#[\\Attribute(\\Attribute::TARGET_PROPERTY)]");
  lines.push("class PreserveNull");
  lines.push("{");
  lines.push("}");
  lines.push("");
  return lines.join("\n");
}

function collectTransitiveDeps(
  dtoName: string,
  allDtos: Map<string, DtoDefinition>,
  collected: Set<string>,
): void {
  const dto = allDtos.get(dtoName);
  if (!dto) return;
  for (const prop of dto.properties) {
    for (const typeName of [prop.phpType, prop.arrayItemType]) {
      if (
        typeName &&
        !PHP_PRIMITIVE_TYPES.has(typeName) &&
        !collected.has(typeName)
      ) {
        collected.add(typeName);
        collectTransitiveDeps(typeName, allDtos, collected);
      }
    }
  }
}

interface PathGroup {
  dir: string;
  operationDtos: DtoDefinition[];
  componentDtos: DtoDefinition[];
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function dirToNamespace(dir: string): string {
  return dir.split("/").filter(Boolean).map(capitalizeFirst).join("\\");
}

export function groupDtosByPath(
  dtos: DtoDefinition[],
  pathMapping: Record<string, string>,
): { groups: PathGroup[]; unmappedPaths: string[] } {
  const matchers = Object.entries(pathMapping).map(([glob, dir]) => ({
    match: picomatch(glob),
    dir,
  }));

  const allDtosByName = new Map<string, DtoDefinition>();
  for (const dto of dtos) {
    allDtosByName.set(dto.name, dto);
  }

  const groupMap = new Map<string, DtoDefinition[]>();
  const unmappedPathSet = new Set<string>();

  for (const dto of dtos) {
    if (dto.source !== "operation" || !dto.endpointPath) continue;

    const path = dto.endpointPath;
    const matched = matchers.find((m) => m.match(path));
    if (!matched) {
      unmappedPathSet.add(dto.endpointPath);
      continue;
    }

    const list = groupMap.get(matched.dir) ?? [];
    list.push(dto);
    groupMap.set(matched.dir, list);
  }

  const groups: PathGroup[] = [];
  for (const [dir, opDtos] of groupMap) {
    const neededComponents = new Set<string>();
    for (const opDto of opDtos) {
      collectTransitiveDeps(opDto.name, allDtosByName, neededComponents);
    }

    const componentDtos: DtoDefinition[] = [];
    for (const name of neededComponents) {
      const dto = allDtosByName.get(name);
      if (dto) componentDtos.push(dto);
    }

    groups.push({ dir, operationDtos: opDtos, componentDtos });
  }

  return { groups, unmappedPaths: [...unmappedPathSet].sort() };
}

function generateFilesForGroup(
  dtos: DtoDefinition[],
  dtoSourceMap: Map<string, DtoSource>,
  options: GeneratorOptions,
  prefix: string,
): GeneratedFile[] {
  return dtos.map((dto) => {
    const source = dto.source ?? "component";
    const dir = source === "component" ? "DTO/" : "";
    const effectiveNs = resolveNamespace(options.namespace, source);
    const fileOptions: GeneratorOptions = {
      ...options,
      namespace: effectiveNs,
      baseNamespace: options.namespace,
      rootNamespace: options.rootNamespace,
      dtoSourceMap,
    };
    return {
      fileName: `${prefix}${dir}${dtoToFileName(dto.name)}`,
      content: generatePhpClass(dto, fileOptions),
    };
  });
}

export function generateAllFiles(
  dtos: DtoDefinition[],
  options: GeneratorOptions = {},
): GenerateResult {
  if (options.pathMapping) {
    return generateGroupedFiles(dtos, options);
  }
  return generateFlatFiles(dtos, options);
}

function generateFlatFiles(
  dtos: DtoDefinition[],
  options: GeneratorOptions,
): GenerateResult {
  const dtoSourceMap = new Map<string, DtoSource>();
  for (const dto of dtos) {
    dtoSourceMap.set(dto.name, dto.source ?? "component");
  }

  const dtoFiles = generateFilesForGroup(dtos, dtoSourceMap, options, "");

  const usesPreserveNull = dtos.some((dto) =>
    dto.properties.some((p) => p.nullable),
  );

  if (usesPreserveNull) {
    return {
      files: [
        {
          fileName: "attributes/PreserveNull.php",
          content: generatePreserveNullAttribute(options),
        },
        ...dtoFiles,
      ],
      unmappedPaths: [],
    };
  }

  return { files: dtoFiles, unmappedPaths: [] };
}

function generateGroupedFiles(
  dtos: DtoDefinition[],
  options: GeneratorOptions,
): GenerateResult {
  const pathMapping = options.pathMapping;
  if (!pathMapping) return { files: [], unmappedPaths: [] };
  const { groups, unmappedPaths } = groupDtosByPath(dtos, pathMapping);

  const allFiles: GeneratedFile[] = [];
  let needsPreserveNull = false;

  for (const group of groups) {
    const groupDtos = [...group.operationDtos, ...group.componentDtos];

    const dtoSourceMap = new Map<string, DtoSource>();
    for (const dto of groupDtos) {
      dtoSourceMap.set(dto.name, dto.source ?? "component");
    }

    const dirNs = dirToNamespace(group.dir);
    const groupNs = options.namespace
      ? `${options.namespace}\\${dirNs}`
      : dirNs;

    const groupFiles = generateFilesForGroup(
      groupDtos,
      dtoSourceMap,
      { ...options, namespace: groupNs, rootNamespace: options.namespace },
      `${group.dir}/`,
    );
    allFiles.push(...groupFiles);

    if (groupDtos.some((dto) => dto.properties.some((p) => p.nullable))) {
      needsPreserveNull = true;
    }
  }

  if (needsPreserveNull) {
    allFiles.unshift({
      fileName: "attributes/PreserveNull.php",
      content: generatePreserveNullAttribute(options),
    });
  }

  return { files: allFiles, unmappedPaths };
}
