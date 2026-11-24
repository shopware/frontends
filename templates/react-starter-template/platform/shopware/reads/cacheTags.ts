export function languageCacheTags(
  tag: string,
  languageId: string | null,
): string[] {
  return languageId ? [tag, `${tag}:${languageId}`] : [tag];
}
