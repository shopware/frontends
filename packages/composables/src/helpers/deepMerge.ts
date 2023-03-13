/* eslint-disable  @typescript-eslint/no-explicit-any */
/**
 * Check if variable is an object
 *
 * @param {any} object
 * @returns {boolean}
 */
export function isObject(object: any): boolean {
  return object && typeof object === "object" && !Array.isArray(object);
}

/**
 * Merge two objects
 *
 * @param obj1
 * @param obj2
 * @returns merged object
 */
export default function deepMerge(obj1: any, obj2: any): object {
  let output = Object.assign({}, obj1);
  if (isObject(obj1) && isObject(obj2)) {
    Object.keys(obj2).forEach((key) => {
      if (isObject(obj2[key])) {
        if (!(key in obj1)) Object.assign(output, { [key]: obj2[key] });
        else output[key] = deepMerge(obj1[key], obj2[key]);
      } else {
        Object.assign(output, { [key]: obj2[key] });
      }
    });
  }
  return output;
}
