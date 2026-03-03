import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { resolve } from "node:path";
import pc from "picocolors";
import { generateAllFiles } from "../php-dto/generator";
import type { GeneratorOptions } from "../php-dto/generator";
import { parseAllDtos } from "../php-dto/schemaParser";
import { loadLocalJSONFile } from "../utils";

export interface PhpDtoOptions {
  action: "generate" | "check";
  schemaFile: string;
  outputDir: string;
  namespace?: string;
  cwd?: string;
}

export async function phpDto(options: PhpDtoOptions): Promise<void> {
  const { action, schemaFile, outputDir, namespace } = options;
  const cwd = options.cwd || process.cwd();
  const outputPath = resolve(cwd, outputDir);

  const schemaPath = resolve(cwd, schemaFile);
  const schema = await loadLocalJSONFile<Record<string, unknown>>(schemaPath);
  if (!schema) {
    throw new Error(`Schema file not found: ${schemaPath}`);
  }
  const dtos = parseAllDtos(schema);

  if (dtos.length === 0) {
    console.log(pc.yellow("No DTO definitions found in the schema."));
    return;
  }

  const generatorOptions: GeneratorOptions = { namespace };
  const files = generateAllFiles(dtos, generatorOptions);

  if (action === "generate") {
    await runGenerate(outputPath, files);
  } else if (action === "check") {
    await runCheck(outputPath, files);
  }
}

async function runGenerate(
  outputPath: string,
  files: { fileName: string; content: string }[],
): Promise<void> {
  if (existsSync(outputPath)) {
    rmSync(outputPath, { recursive: true, force: true });
  }
  mkdirSync(outputPath, { recursive: true });

  for (const file of files) {
    const filePath = resolve(outputPath, file.fileName);
    writeFileSync(filePath, file.content, "utf-8");
  }

  console.log(
    pc.green(`Generated ${files.length} PHP DTO files in ${outputPath}`),
  );
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

  const existingFiles = new Set(
    readdirSync(outputPath).filter((f) => f.endsWith(".php")),
  );
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
