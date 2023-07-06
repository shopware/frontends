export function replacer(
  code: string,
  value: string,
  key: string,
  insert: "head" | "tail" | "none" = "none"
) {
  const PLACEHOLDER = `<!-- ${key} -->`;
  const regex = new RegExp(`${PLACEHOLDER}[\\s\\S]`, "im");

  const target = value ? `${PLACEHOLDER}\n${value}` : `${PLACEHOLDER}`;

  if (!code.match(regex)) {
    if (insert === "none") return code;
    else if (insert === "head") return `${target}\n\n${code}`;
    else return `${code}\n\n${target}`;
  }

  return code.replace(regex, target);
}

export function normalizeString(word?: string) {
  if (!word) return "";
  return (
    word
      //.replace(/(\r\n|\n|\r)/gm, "")
      .replace(" | >", " | null>")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
  );
}

export function getWrappedCodeBlock(
  code: string | undefined,
  lang = "ts"
): string {
  if (!code) return "";
  return `
\`\`\`${lang}
${code}
\`\`\`
`;
}

export function getToggleContainer(
  contents: string,
  title = "Click to see the details"
) {
  return `

<details>
<summary> ${title} </summary>
  ${contents}
</details>
`;
}
