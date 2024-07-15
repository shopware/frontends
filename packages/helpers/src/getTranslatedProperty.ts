/**
 * Get translated property from the given object.
 *
 * @param {T} element object with translated property
 *
 * @public
 */
export function getTranslatedProperty<T>(
  element: T | undefined | null | never,
  property: keyof T,
): string {
  // biome-ignore lint/suspicious/noExplicitAny: TODO: we should improve this helper, to heva only `string` fields of the object
  return (element as any)?.translated[property] || element?.[property] || "";
}
