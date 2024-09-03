/**
 * Replace text placeholder with param value
 *
 * @param {string} key
 * @param {} params
 * @returns {string}
 */
export function getCmsTranslate(
  key: string,
  params?: { [key: string]: string | number | null } | null,
) {
  if (!params) return key;

  let translatedText = key;
  for (const param in params) {
    const placeholder = `{${param}}`;
    const paramValue = params[param];
    if (paramValue)
      translatedText = translatedText.replace(
        placeholder,
        paramValue?.toString(),
      );
  }
  return translatedText;
}
