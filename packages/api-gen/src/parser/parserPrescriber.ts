/**
 * Reviver for json5.parse function
 */
export default function prescribe<T>(key: string, value: T): T | undefined {
  // unset the $ref: "_DELETE_" in order to avoid schema loading by json5 parser
  if (key === "$ref" && value === "_DELETE_") {
    return undefined;
  }

  return value;
}
