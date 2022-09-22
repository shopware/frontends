import { join } from "path";
import fs from "fs-extra";
import parser from "prettier/parser-typescript";
import prettier from "prettier";

export function isTypeDefinitionExists(pkg: string, name: string) {
  const typingFilepath = join(
    __dirname,
    `../packages/${pkg}/temp/${name}.d.ts`
  );
  return fs.existsSync(typingFilepath);
}

export async function getTypeDefinition(
  pkg: string,
  name: string
): Promise<string | undefined> {
  const typingFilepath = join(
    __dirname,
    `../packages/${pkg}/temp/${name}.d.ts`
  );

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

export function replacer(
  code: string,
  value: string,
  key: string,
  insert: "head" | "tail" | "none" = "none"
) {
  const START = `<!--${key}_STARTS-->`;
  const END = `<!--${key}_ENDS-->`;
  const regex = new RegExp(`${START}[\\s\\S]*?${END}`, "im");

  const target = value ? `${START}\n${value}\n${END}` : `${START}${END}`;

  if (!code.match(regex)) {
    if (insert === "none") return code;
    else if (insert === "head") return `${target}\n\n${code}`;
    else return `${code}\n\n${target}`;
  }

  return code.replace(regex, target);
}
