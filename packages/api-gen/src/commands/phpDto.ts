import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, relative, resolve } from "node:path";
import pc from "picocolors";
import { generateAllFiles } from "../php-dto/generator";
import type { GeneratorOptions } from "../php-dto/generator";
import type { DtoDefinition } from "../php-dto/schemaParser";
import { parseAllDtos } from "../php-dto/schemaParser";
import { isValidPhpClassName, toPascalCase } from "../php-dto/typeMapper";
import { loadLocalJSONFile } from "../utils";

export interface PhpDtoConfig {
  schemaUrl: string;
  outputDir?: string;
  namespace?: string;
  tag?: string;
  routes?: Record<string, string>;
}

export interface PhpDtoOptions {
  action: "generate" | "check";
  config: string;
  schemaFile?: string;
  rawNames?: boolean;
  cwd?: string;
}

function sanitizeDtoNames(dtos: DtoDefinition[]): DtoDefinition[] {
  const renameMap = new Map<string, string>();

  for (const dto of dtos) {
    const sanitized = toPascalCase(dto.name);
    if (sanitized !== dto.name) {
      renameMap.set(dto.name, sanitized);
    }
  }

  if (renameMap.size === 0) return dtos;

  return dtos.map((dto) => ({
    ...dto,
    name: renameMap.get(dto.name) ?? dto.name,
    properties: dto.properties.map((prop) => ({
      ...prop,
      phpType: renameMap.get(prop.phpType) ?? prop.phpType,
      arrayItemType: prop.arrayItemType
        ? renameMap.get(prop.arrayItemType) ?? prop.arrayItemType
        : prop.arrayItemType,
    })),
  }));
}

function validateDtoNames(dtos: DtoDefinition[]): void {
  const invalidNames = dtos
    .map((d) => d.name)
    .filter((name) => !isValidPhpClassName(name));

  if (invalidNames.length > 0) {
    const list = invalidNames.map((n) => `  - ${n}`).join("\n");
    throw new Error(
      `Invalid PHP class names found:\n${list}\n\nRemove --rawNames to auto-convert names to valid PascalCase.`,
    );
  }
}

async function loadSchema(
  config: PhpDtoConfig,
  schemaFileOverride: string | undefined,
  cwd: string,
): Promise<Record<string, unknown>> {
  if (schemaFileOverride) {
    const schemaPath = resolve(cwd, schemaFileOverride);
    const schema = await loadLocalJSONFile<Record<string, unknown>>(schemaPath);
    if (!schema) {
      throw new Error(`Schema file not found: ${schemaPath}`);
    }
    return schema;
  }

  if (!config.schemaUrl) {
    throw new Error(
      "No schema source: provide schemaUrl in config or use --schemaFile CLI override.",
    );
  }

  console.log(pc.blue(`Fetching schema from ${config.schemaUrl}...`));
  const response = await fetch(config.schemaUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch schema from ${config.schemaUrl}: ${response.status} ${response.statusText}`,
    );
  }
  return (await response.json()) as Record<string, unknown>;
}

export async function phpDto(options: PhpDtoOptions): Promise<void> {
  const { action, config: configPath, schemaFile, rawNames } = options;
  const cwd = options.cwd || process.cwd();

  const resolvedConfigPath = resolve(cwd, configPath);
  const config = await loadLocalJSONFile<PhpDtoConfig>(resolvedConfigPath);
  if (!config) {
    throw new Error(`Config file not found: ${resolvedConfigPath}`);
  }

  const outputDir = config.outputDir ?? "./dto";
  const outputPath = resolve(cwd, outputDir);

  const schema = await loadSchema(config, schemaFile, cwd);
  const rawDtos = parseAllDtos(schema, { tag: config.tag });

  if (rawDtos.length === 0) {
    if (action === "generate") {
      removeDtoFilesInDir(outputPath);
    }
    console.log(pc.yellow("No DTO definitions found in the schema."));
    return;
  }

  let dtos: DtoDefinition[];
  if (rawNames) {
    validateDtoNames(rawDtos);
    dtos = rawDtos;
  } else {
    dtos = sanitizeDtoNames(rawDtos);
  }

  const pathMapping = config.routes;
  const generatorOptions: GeneratorOptions = {
    namespace: config.namespace,
    pathMapping,
  };
  const { files, unmappedPaths } = generateAllFiles(dtos, generatorOptions);

  if (unmappedPaths.length > 0) {
    console.warn(
      pc.yellow(
        `Warning: The following API paths are not mapped in ${configPath}:`,
      ),
    );
    for (const p of unmappedPaths) {
      console.warn(pc.yellow(`  - ${p}`));
    }
    console.warn(
      pc.yellow("Add glob patterns for these paths to generate their DTOs."),
    );
  }

  if (action === "generate") {
    await runGenerate(outputPath, files);
  } else if (action === "check") {
    await runCheck(outputPath, files);
  }
}

function removeDtoFilesInDir(dir: string): void {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    const fullPath = resolve(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      removeDtoFilesInDir(fullPath);
      if (readdirSync(fullPath).length === 0) {
        rmSync(fullPath, { recursive: true });
      }
    } else if (entry.endsWith("DTO.php") || entry === "PreserveNull.php") {
      rmSync(fullPath);
    }
  }
}

async function runGenerate(
  outputPath: string,
  files: { fileName: string; content: string }[],
): Promise<void> {
  removeDtoFilesInDir(outputPath);

  mkdirSync(outputPath, { recursive: true });

  for (const file of files) {
    const filePath = resolve(outputPath, file.fileName);
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, file.content, "utf-8");
  }

  console.log(
    pc.green(`Generated ${files.length} PHP DTO files in ${outputPath}`),
  );
}

function collectPhpFiles(dir: string, base: string): string[] {
  const results: string[] = [];
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir)) {
    const fullPath = resolve(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      results.push(...collectPhpFiles(fullPath, base));
    } else if (entry.endsWith(".php")) {
      results.push(relative(base, fullPath));
    }
  }
  return results;
}

async function runCheck(
  outputPath: string,
  files: { fileName: string; content: string }[],
): Promise<void> {
  const errors: string[] = [];

  if (!existsSync(outputPath)) {
    console.error(pc.red(`Output directory does not exist: ${outputPath}`));
    process.exit(1);
  }

  const existingFiles = new Set(collectPhpFiles(outputPath, outputPath));
  const expectedFiles = new Set(files.map((f) => f.fileName));

  for (const fileName of expectedFiles) {
    if (!existingFiles.has(fileName)) {
      errors.push(`Missing file: ${fileName}`);
    }
  }

  for (const fileName of existingFiles) {
    if (!expectedFiles.has(fileName)) {
      errors.push(`Unexpected file: ${fileName}`);
    }
  }

  for (const file of files) {
    const filePath = resolve(outputPath, file.fileName);
    if (!existsSync(filePath)) continue;

    const existingContent = readFileSync(filePath, "utf-8");
    if (existingContent !== file.content) {
      errors.push(`Content mismatch: ${file.fileName}`);
    }
  }

  if (errors.length > 0) {
    console.error(pc.red("PHP DTO check failed:\n"));
    for (const error of errors) {
      console.error(pc.red(`  - ${error}`));
    }
    process.exit(1);
  }

  console.log(pc.green(`All ${files.length} PHP DTO files are up to date.`));
}
