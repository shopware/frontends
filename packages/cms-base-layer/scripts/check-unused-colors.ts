import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

// Load UnoCSS config from a specific path
async function loadUnoConfigFromPath(configPath: string) {
  try {
    const configContent = readFileSync(configPath, "utf-8");

    // Extract colors from the config using regex
    const colorsMatch = configContent.match(
      /colors:\s*{([^}]+(?:{[^}]*}[^}]*)*?)}/s,
    );
    if (!colorsMatch) {
      return [];
    }

    const colorsSection = colorsMatch[1];
    const colorMatches =
      colorsSection?.matchAll(/"([^"]+)":\s*"([^"]+)"/g) || [];

    const colors = Array.from(colorMatches).map((match) => ({
      name: match[1],
      value: match[2],
    }));

    return colors;
  } catch (error) {
    console.warn(`⚠️  Could not load config from ${configPath}: ${error}`);
    return [];
  }
}

// Load cms-base-layer config
async function loadCmsBaseConfig() {
  const configPath = join(rootDir, "uno.config.ts");
  return {
    path: configPath,
    colors: await loadUnoConfigFromPath(configPath),
  };
}

// Load vue-starter-template config
async function loadTemplateConfig() {
  const templateConfigPath = join(
    rootDir,
    "../../templates/vue-starter-template/uno.config.ts",
  );
  return {
    path: templateConfigPath,
    colors: await loadUnoConfigFromPath(templateConfigPath),
  };
}

// Get all Vue/TypeScript files in components directory
function getComponentFiles(dir: string): string[] {
  const files: string[] = [];

  function walkDirectory(currentDir: string) {
    try {
      const items = readdirSync(currentDir);

      for (const item of items) {
        const fullPath = join(currentDir, item);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          walkDirectory(fullPath);
        } else if (item.match(/\.(vue|ts|js)$/)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Directory might not exist, skip it
    }
  }

  walkDirectory(dir);
  return files;
}

// Check if color is used in component files
function isColorUsed(colorName: string, componentFiles: string[]): boolean {
  const colorPrefixes = [
    "bg-",
    "text-",
    "border-",
    "ring-",
    "outline-",
    "decoration-",
    "from-",
    "to-",
    "via-",
    "fill-",
    "stroke-",
    "hover:bg-",
    "hover:text-",
    "hover:border-",
    "focus:bg-",
    "focus:text-",
    "focus:border-",
    "focus:ring-",
    "active:bg-",
    "active:text-",
    "active:border-",
    "disabled:bg-",
    "disabled:text-",
    "disabled:border-",
  ];

  for (const file of componentFiles) {
    try {
      const content = readFileSync(file, "utf-8");

      for (const prefix of colorPrefixes) {
        const classPattern = new RegExp(
          `${prefix}${colorName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w-])`,
          "g",
        );
        if (classPattern.test(content)) {
          return true;
        }
      }
    } catch (error) {
      // Skip files that can't be read
    }
  }

  return false;
}

// Update cms-base config based on template colors and usage
function updateCmsBaseConfig(
  configPath: string,
  templateColors: Array<{ name: string; value: string }>,
  usedColors: string[],
  unusedColors: string[],
) {
  let configContent = readFileSync(configPath, "utf-8");

  // Find the colors section
  const colorsMatch = configContent.match(
    /(colors:\s*{)([^}]+(?:{[^}]*}[^}]*)*?)(})/s,
  );
  if (!colorsMatch) {
    console.error("❌ Could not find colors section in cms-base config");
    return;
  }

  // @ts-ignore
  const [fullMatch, openBrace, currentColorsSection, closeBrace] = colorsMatch;

  // Build new colors section with only used template colors
  const usedTemplateColors = templateColors.filter((color) =>
    usedColors.includes(color.name),
  );

  let newColorsSection = "";
  if (usedTemplateColors.length > 0) {
    newColorsSection = `${usedTemplateColors
      .map((color) => `      "${color.name}": "${color.value}"`)
      .join(",\n")},`;
  }

  // Replace the colors section
  const newColorsBlock = `${openBrace}\n${newColorsSection}\n    ${closeBrace}`;
  configContent = configContent.replace(fullMatch, newColorsBlock);

  // Write back to file
  writeFileSync(configPath, configContent, "utf-8");

  console.log("✅ Updated cms-base config:");
  console.log(`   ➕ Kept ${usedColors.length} used colors`);
  console.log(`   ➖ Removed ${unusedColors.length} unused colors`);
}

// Main function
async function checkAndSyncColors() {
  try {
    console.log(
      "🔄 Syncing cms-base-layer colors with vue-starter-template...\n",
    );

    // Load configurations
    const cmsBaseConfig = await loadCmsBaseConfig();
    const templateConfig = await loadTemplateConfig();

    if (templateConfig.colors.length === 0) {
      console.error("❌ No colors found in vue-starter-template config");
      return;
    }

    // Get cms-base component files only
    const cmsComponentsDir = join(rootDir, "components");
    const cmsComponentFiles = getComponentFiles(cmsComponentsDir);

    console.log(
      `📁 Found ${cmsComponentFiles.length} cms-base-layer component files`,
    );
    console.log(
      `🎯 Found ${templateConfig.colors.length} colors in vue-starter-template\n`,
    );

    // Check which template colors are used in cms-base components
    const usedTemplateColors: string[] = [];
    const unusedTemplateColors: string[] = [];

    console.log("🔍 CHECKING TEMPLATE COLORS USAGE IN CMS-BASE:");

    for (const color of templateConfig.colors) {
      if (typeof color.name !== "string") {
        continue;
      }
      const isUsed = isColorUsed(color.name, cmsComponentFiles);

      if (isUsed) {
        usedTemplateColors.push(color.name);
        console.log(`✅ ${color.name} (used in cms-base)`);
      } else {
        unusedTemplateColors.push(color.name);
        console.log(`🔴 ${color.name} (not used in cms-base)`);
      }
    }

    // Check current cms-base colors that are not from template
    const templateColorNames = new Set(
      templateConfig.colors.map((c) => c.name),
    );
    const cmsOnlyColors = cmsBaseConfig.colors.filter(
      (c) => !templateColorNames.has(c.name),
    );

    if (cmsOnlyColors.length > 0) {
      console.log("\n📝 CMS-BASE ONLY COLORS (will be removed):");
      for (const color of cmsOnlyColors) {
        console.log(`   🗑️  ${color.name}: ${color.value}`);
      }
    }

    // Summary
    console.log("\n📊 SYNC SUMMARY:");
    console.log(
      `✅ Template colors to keep: ${usedTemplateColors.length}/${templateConfig.colors.length}`,
    );
    console.log(`🔴 Template colors to remove: ${unusedTemplateColors.length}`);
    console.log(`🗑️  CMS-only colors to remove: ${cmsOnlyColors.length}`);
    console.log(
      `📈 Template usage rate: ${((usedTemplateColors.length / templateConfig.colors.length) * 100).toFixed(1)}%`,
    );

    if (usedTemplateColors.length > 0) {
      console.log("\n✅ COLORS TO KEEP IN CMS-BASE:");
      for (const colorName of usedTemplateColors) {
        const color = templateConfig.colors.find((c) => c.name === colorName);
        console.log(`   ✅ ${colorName}: ${color?.value}`);
      }
    }

    if (unusedTemplateColors.length > 0 || cmsOnlyColors.length > 0) {
      console.log("\n🔴 COLORS TO REMOVE FROM CMS-BASE:");
      for (const colorName of unusedTemplateColors) {
        const color = templateConfig.colors.find((c) => c.name === colorName);
        console.log(
          `   🔴 ${colorName}: ${color?.value} (from template, unused)`,
        );
      }
      for (const color of cmsOnlyColors) {
        console.log(`   🔴 ${color.name}: ${color.value} (cms-only)`);
      }
    }

    // Update the cms-base config
    console.log("\n🔄 Updating cms-base uno.config.ts...");
    updateCmsBaseConfig(
      cmsBaseConfig.path,
      templateConfig.colors.filter(
        (c): c is { name: string; value: string } =>
          typeof c.name === "string" && typeof c.value === "string",
      ),
      usedTemplateColors,
      [...unusedTemplateColors, ...cmsOnlyColors.map((c) => c.name)].filter(
        (name): name is string => typeof name === "string",
      ),
    );

    // Group kept colors by category for better understanding
    if (usedTemplateColors.length > 0) {
      console.log("\n📂 KEPT COLORS BY CATEGORY:");

      const categories = {
        Brand: usedTemplateColors.filter((c) => c.startsWith("brand-")),
        Surface: usedTemplateColors.filter((c) => c.startsWith("surface-")),
        States: usedTemplateColors.filter((c) => c.startsWith("states-")),
        Outline: usedTemplateColors.filter((c) => c.startsWith("outline-")),
        Primary: usedTemplateColors.filter(
          (c) => c.startsWith("primary") && !c.startsWith("brand-primary"),
        ),
        Secondary: usedTemplateColors.filter(
          (c) => c.startsWith("secondary") && !c.startsWith("brand-secondary"),
        ),
        Success: usedTemplateColors.filter((c) => c.startsWith("success")),
        Warning: usedTemplateColors.filter((c) => c.startsWith("warning")),
        Other: usedTemplateColors.filter(
          (c) =>
            ![
              "brand-",
              "surface-",
              "states-",
              "outline-",
              "primary",
              "secondary",
              "success",
              "warning",
            ].some((prefix) => c.startsWith(prefix)),
        ),
      };

      for (const [category, colors] of Object.entries(categories)) {
        if (colors.length > 0) {
          console.log(`\n${category}:`);
          for (const color of colors) {
            console.log(`   ✅ ${color}`);
          }
        }
      }
    }

    console.log("\n🎉 Color sync completed successfully!");
  } catch (error) {
    console.error(
      "❌ Error:",
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  }
}

// Run the script
checkAndSyncColors();
