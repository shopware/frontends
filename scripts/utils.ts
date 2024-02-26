import { join } from "path";
// import { globby } from "globby";
import { TSDocParser } from "@microsoft/tsdoc";
import fs from "fs-extra";
import prettier from "prettier";
import parser from "prettier/parser-typescript";
import { TypeDocReader } from "typedoc";
// import { markdownTable } from "markdown-table";

export function isTypeDefinitionExists(pkg: string, name: string) {
  deepFindFilePath(name, join(__dirname, `../packages/${pkg}/temp`));
  const typingFilepath = join(
    __dirname,
    `../packages/${pkg}/temp/${name}.d.ts`,
  );
  return fs.existsSync(typingFilepath);
}

async function deepFindFilePath(filename, startPath) {
  // const res = await globby(`${startPath}/**${filename}**`);
  // console.log("FILES:", res);
  // if (!fs.existsSync(startPath)) {
  //   console.log("no dir ", startPath);
  //   return;
  // }
  // // const files = fs.readdirSync(startPath);
  // // for (let i = 0; i < files.length; i++) {
  // //   const filename = files[i];
  // //   const filepath = join(startPath, filename);
  // //   const stat = fs.
  // fs.readdirSync(startPath).forEach((file) => {
  //   console.log("file: ", file);
  // });
}

export async function getTypeDefinition(
  pkg: string,
  name: string,
): Promise<string | undefined> {
  const typingFilepath = join(
    __dirname,
    `../packages/${pkg}/temp/${name}.d.ts`,
  );

  deepFindFilePath(name, join(__dirname, `../packages/${pkg}/temp`));

  if (!fs.existsSync(typingFilepath)) return;

  let types = await fs.readFile(typingFilepath, "utf-8");

  if (!types) return;

  // clean up types
  types = types
    .replace(/import\(.*?\)\./g, "")
    .replace(/import[\s\S]+?from ?["'][\s\S]+?["']/g, "")
    .replace(/export {}/g, "");

  return prettier
    .format(types, {
      semi: false,
      parser: "typescript",
      plugins: [parser],
    })
    .trim();
}

export async function getTypeDefinition2(
  filePath: string,
): Promise<string | undefined> {
  // const typingFilepath = join(
  //   __dirname,
  //   `../packages/${pkg}/temp/${name}.d.ts`
  // );

  // deepFindFilePath(name, join(__dirname, `../packages/${pkg}/temp`));

  if (!fs.existsSync(filePath)) return;

  let types = await fs.readFile(filePath, "utf-8");

  if (!types) return;

  // docParser(types);
  const comment = extractCommentBeforeExport(types, "subtotal");
  // clean up types
  types = types
    .replace(/import\(.*?\)\./g, "")
    .replace(/import[\s\S]+?from ?["'][\s\S]+?["']/g, "")
    .replace(/export {}/g, "");

  return prettier
    .format(types, {
      semi: false,
      parser: "typescript",
      plugins: [parser],
    })
    .trim();
}

export function replacer(
  code: string,
  value: string,
  key: string,
  insert: "head" | "tail" | "none" = "none",
) {
  const START = `<!--${key}_STARTS-->`;
  const END = `<!--${key}_ENDS-->`;
  const regex = new RegExp(`${START}[\\s\\S]*?${END}`, "im");

  const target = value ? `${START}\n${value}\n${END}` : `${START}${END}`;

  if (!code.match(regex)) {
    if (insert === "none") return code;
    if (insert === "head") return `${target}\n\n${code}`;
    return `${code}\n\n${target}`;
  }

  return code.replace(regex, target);
}

// function docParser(docComment: string) {
//   const tsdocParser: TSDocParser = new TSDocParser();

//   // Analyze the input doc comment
//   console.error("parse file", docComment);
//   const comments = extractCommentsFromFileContent(docComment);
//   console.log("extracted comments", comments);
//   const parserContext = tsdocParser.parseString(comments[0]);
//   console.error("context", parserContext.docComment.summarySection);
// }

function extractCommentsFromFileContent(content: string): string[] {
  const regex = /\/\*\*[\s\S]*?\*\//gm;
  const comments = content.match(regex);
  return comments || [];
}

function extractCommentBeforeExport(content: string, name: string): string {
  const regex = new RegExp(
    `\/\\*\\*[\s\S]*?\\*\/[\s\S]*?export[\s\S]*?${name}`,
    "gm",
  );
  //console.log("extracting comment", content);
  //console.log("extracting comment", content);
  const comments = content.match(regex);
  return comments ? comments[0] : "no-comment";
}
