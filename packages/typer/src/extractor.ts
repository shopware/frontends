// prettier-ignore
import type { Metadata, Property, PropertyMdTableRow } from "./types";
import type { TsDoxFile, TsDoxFunction, TsDoxDict } from "ts-dox";
import { normalizeString } from "./string";

let tableHeader = `
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
`;

export function getFunctionReturnTypeSignature(
  returnType: string,
  metadata: TsDoxFile
) {
  return metadata?.types?.[returnType]?.signature;
}

export function getFunctionReturnType(metadata: TsDoxFunction) {
  return metadata.returnType;
}

// function getFunctionDescriptionOld(metadata: TsDoxFunction) {
//   let description = "\n";
//   if (metadata.signature) {
//     // prettier-ignore
//     description += `
// \n## ${metadata.name}\n

// ${normalizeString(metadata.summary)}

// ### Definition

// \`\`\`ts
// ${metadata.signature}
// \`\`\`\n
// `;
//   }

//   return description + "\n";
// }

export function getParametersTable(rows: PropertyMdTableRow[]) {
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

export async function getTypesTable(
  metadata: Metadata,
  accessor: "properties" | "methods",
  transformRow?: (propertyData: Property) => Promise<PropertyMdTableRow>
) {
  if (!metadata[accessor]) {
    return "";
  }

  let rows = "";
  for (const [key, property] of Object.entries(metadata[accessor])) {
    let rowData: PropertyMdTableRow = {
      key: `<b>${key}</b>`,
      type: `<pre>${normalizeString(property.returnType)}</pre>`,
      description: normalizeString(property.summary),
    };
    if (typeof transformRow === "function") {
      rowData = await transformRow(property);
    }

    rows += `
  <tr>
    <td>${rowData.key}</td>
    <td><pre style="font-size:0.8em;">${rowData.type}</pre></td>
    <td>${rowData.description}</td>
  </tr>`;
  }

  return (
    `
  ${tableHeader}
  ${rows}
  </table>` + "\n"
  );
}

export function getFunctionData(
  metadata: TsDoxFile | TsDoxFunction,
  functionName: keyof TsDoxDict<TsDoxFunction> | undefined
): TsDoxFunction | undefined {
  if (metadata.hasOwnProperty("functions") && functionName) {
    return (metadata as TsDoxFile)?.functions?.[functionName];
  }
  return metadata as TsDoxFunction;
}

export function getFunctionDescription(
  metadata: TsDoxFile | TsDoxFunction,
  functionName: string | undefined
): string | undefined {
  return getFunctionData(metadata, functionName)?.summary;
}

export function getFunctionSignature(
  metadata: TsDoxFile | TsDoxFunction,
  functionName: string | undefined
): string | undefined {
  return getFunctionData(metadata, functionName)?.signature;
}
