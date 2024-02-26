import path from "path";
import fs from "fs/promises";
import { findExports } from "mlly";

async function getAllMarkdownFilesFromDirectory(baseDir: string) {
  const files = await fs.readdir(baseDir, { withFileTypes: true });
  return (
    files
      .filter((dirent) => dirent.isFile() && dirent.name.endsWith(".md"))
      // and remove extention
      .map((dirent) => dirent.name.replace(".md", ""))
  );
}

const packageNames = ["api-client", "composables", "helpers", "types"];

export async function generatePackageDocs(packageName: string) {
  const packagePath = path.join(__dirname, "..", "packages", packageName);
  const docsPackagePath = path.join(
    __dirname,
    "..",
    "apps",
    "docs",
    "src",
    "packages",
    packageName,
  );

  try {
    const distFile = await fs.readFile(
      path.join(packagePath, "dist/index.mjs"),
      "utf-8",
    );
    const exportedNames = findExports(distFile).flatMap((e) => e.names);

    // we can add detecting files with definitions removed from api
    // const existingNames = await getAllMarkdownFilesFromDirectory(
    //   docsPackagePath
    // );

    // filter out names starting with uppercase or containing _
    const filteredNames = exportedNames.filter(
      (name) => !name.startsWith("_") && name[0] === name[0].toLowerCase(),
    );

    for (const name of filteredNames) {
      const fileExistBoolean = await fs
        .access(path.join(docsPackagePath, `${name}.md`))
        .then(() => true)
        .catch(() => false);
      if (!fileExistBoolean) {
        console.log("-> Adding file:", name);
        await fs.writeFile(
          path.join(docsPackagePath, `${name}.md`),
          getDocTemplate({ name, category: packageName }),
        );
      }
    }

    console.log(`+ Processed ${packageName} package.`);
  } catch (e) {
    console.log(`- Error for generating docs in package ${packageName}.`, e);
  }
}

async function run() {
  for (const packageName of packageNames) {
    await generatePackageDocs(packageName);
  }
}

run();

function getDocTemplate(props: { name: string; category?: string }) {
  return `---
category: ${props.category}
---

# ${props.name}

<!-- PLACEHOLDER_DESCRIPTION -->

## Usage

${
  props.category === "composables"
    ? `
\`\`\`vue
<script setup lang="ts">
// TODO: add example
</script>
\`\`\`
`
    : `
\`\`\`ts
// TODO: add example
\`\`\`
    `
}
`;
}
