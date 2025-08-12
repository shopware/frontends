import { readPackageJSON, writePackageJSON } from "pkg-types";
const localPackageJson = await readPackageJSON();

// read URL from browser's current location
const URL = typeof window !== "undefined" ? window.location.href : "";

function extractBranchName(url) {
  const match = url.match(/tree\/(.+?)\/templates/);
  return match ? match[1] : "main"; // fallback to "main" if no match
}

const branchName = extractBranchName(URL);

// find all @shopware dependencies
const shopwareDeps = Object.keys(localPackageJson.dependencies || {}).filter(
  (name) => name.startsWith("@shopware/"),
);

// update dependencies
localPackageJson.dependencies = {
  ...localPackageJson.dependencies,
  ...Object.fromEntries(
    shopwareDeps.map((name) => [
      name,
      `https://pkg.pr.new/${name}@${branchName}`,
    ]),
  ),
};

// do the same for devDeps
const shopwareDevDeps = Object.keys(
  localPackageJson.devDependencies || {},
).filter((name) => name.startsWith("@shopware/"));

localPackageJson.devDependencies = {
  ...localPackageJson.devDependencies,
  ...Object.fromEntries(
    shopwareDevDeps.map((name) => [
      name,
      `https://pkg.pr.new/${name}@${branchName}`,
    ]),
  ),
};

await writePackageJSON("package.json", localPackageJson);
