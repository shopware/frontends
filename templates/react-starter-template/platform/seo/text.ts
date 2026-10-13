const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

const MAX_CODE_POINT = 0x10ffff;

function fromCodePoint(code: number): string | null {
  return Number.isInteger(code) && code >= 0 && code <= MAX_CODE_POINT
    ? String.fromCodePoint(code)
    : null;
}

function decodeEntity(entity: string): string | null {
  const lower = entity.toLowerCase();
  if (lower.startsWith("#x")) {
    return fromCodePoint(Number.parseInt(lower.slice(2), 16));
  }
  if (lower.startsWith("#")) {
    return fromCodePoint(Number.parseInt(lower.slice(1), 10));
  }
  return NAMED_ENTITIES[lower] ?? null;
}

export function toPlainText(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(
      /&(#x[0-9a-f]+|#\d+|[a-z]+);/gi,
      (match, entity: string) => decodeEntity(entity) ?? match,
    )
    .replace(/\s+/g, " ")
    .trim();
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}
