import * as fs from "node:fs";
import * as path from "node:path";
import { type TransformResult, transform } from "automd";

/**
 * This script will search for all markdown files in the project and check if they contain "automd:" term.
 * If they do, it will run the automd transformation and update the file if needed.
 */

const stats: {
  changedFiled: number;
  filesWithIssues: Array<TransformResult & { path: string }>;
} = {
  changedFiled: 0,
  filesWithIssues: [],
};
// read args, see if flag --update is present
const shouldUpdate = process.argv.includes("--update");

async function run() {
  const start = performance.now();

  await findInFiles({
    term: "automd:",
    rootPath: process.cwd(),
    fileTypes: ["md"],
    // exclude node_modules
    exclude: ["node_modules"],
  });

  // display issues
  if (stats.filesWithIssues.length) {
    console.log(`Found ${stats.filesWithIssues.length} files with issues:`);
    for (const resultWithIssue of stats.filesWithIssues) {
      console.log(`- ${resultWithIssue.path}`);
      for (const issue of resultWithIssue.updates) {
        for (const issueMessage of issue.result.issues || []) {
          console.log(`  - ${issueMessage}`);
        }
      }
    }
  }

  // display changhed files:
  console.log(`\nChanged ${stats.changedFiled} files.`);
  const end = performance.now();
  console.log(`Time: ${Math.round(end - start)}ms`);
}

run();

async function findInFiles({
  term,
  rootPath,
  fileTypes,
  exclude,
}: {
  term: string;
  rootPath: string;
  fileTypes: string[];
  exclude: string[];
}): Promise<string[]> {
  const filePaths: string[] = [];

  async function searchDirectory(directory: string) {
    const files = await fs.promises.readdir(directory, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(directory, file.name);

      if (file.isDirectory()) {
        if (!exclude.includes(file.name)) {
          await searchDirectory(fullPath);
        }
      } else if (fileTypes.includes(path.extname(file.name).substring(1))) {
        const content = await fs.promises.readFile(fullPath, "utf8");
        if (content.includes(term)) {
          filePaths.push(fullPath);
          const updatedContent = await transform(content, {
            dir: process.cwd(),
          });
          if (updatedContent.hasIssues) {
            stats.filesWithIssues.push({
              ...updatedContent,
              path: fullPath,
            });
          } else {
            if (updatedContent.hasChanged) {
              if (shouldUpdate) {
                await fs.promises.writeFile(
                  fullPath,
                  updatedContent.contents,
                  "utf8",
                );
                stats.changedFiled++;
              } else {
                // if --update flag is not present, then it's just a check so we throw an error
                throw new Error(
                  `File ${fullPath} should be updated with "automd" script. Run with "pnpm generateAutomd" to fix.`,
                );
              }
            }
          }
        }
      }
    }
  }

  await searchDirectory(rootPath);
  return filePaths;
}
