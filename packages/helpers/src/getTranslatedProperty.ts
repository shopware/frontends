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
  // TODO: Improve this helper so it only accepts string fields.
  return (element as any)?.translated?.[property] || element?.[property] || "";
}
