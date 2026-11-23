export type MessageTree = Record<string, unknown>;

function isTree(value: unknown): value is MessageTree {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function deepMerge(
  base: MessageTree,
  override: MessageTree,
): MessageTree {
  const merged: MessageTree = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const current = merged[key];
    merged[key] =
      isTree(current) && isTree(value) ? deepMerge(current, value) : value;
  }
  return merged;
}

export function mergeMessageFiles(files: MessageTree[]): MessageTree {
  return files.reduce<MessageTree>(deepMerge, {});
}
