/**
 * eviver for json5.parse function

 * @param key
 * @param value
 * @returns any
 */
export default (key: string, value: any): any => {
  // unset the $ref: "_DELETE_" in order to avoid schema loading by json5 parser
  if (key === "$ref" && value === "_DELETE_") {
    return undefined;
  }

  return value;
};
