export function replacer(
  code: string,
  value: string,
  key: string,
  insert: "head" | "tail" | "none" = "none",
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
    //.replaceAll("<", "&lt;")
    //.replaceAll(">", "&gt;")
  );
}

export function getWrappedCodeBlock(
  code: string | undefined,
  lang = "ts",
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
  title = "Click to see the details",
) {
  return `

<details>
<summary> ${title} </summary>
  ${contents}
</details>
\n`;
}

const tableHeader = `
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
`;
export function getParametersTable(
  rows: { key: string; type: string; description: string }[],
) {
  let tableRow = "";
  for (const row of rows) {
    tableRow += `<tr><td>${row.key}</td><td><pre style="font-size:0.8em;">${row.type}</pre></td><td>${row.description}</td></tr>`;
  }

  return `
  ${tableHeader}
  ${tableRow}
  </table>
  `;
}

export function prepareGithubPermalink({
  label,
  project,
  path,
  line,
  inlineStyle,
}: {
  label: string;
  project: string;
  path: string;
  line?: number;
  inlineStyle?: string;
}) {
  return `<a style="${inlineStyle ?? "position:relative;top:-25px;font-size:0.8em;margin:0;"}" href="https://github.com/${project ?? "shopware/frontends"}/tree/main/${path.replaceAll("../", "")}#L${line ?? 1}" target="_blank">${label}</a>\n`;
}
