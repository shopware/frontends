const DEFAULT_BG_IMAGE_SIZE = 800;
function roundUp(num: number) {
  return num ? Math.ceil(num / 100) * 100 : DEFAULT_BG_IMAGE_SIZE;
}

const getUrlFromBackgroundImage = (url: string) => {
  const regex = /(?:\(['"]?)(.*?)(?:['"]?\))/;
  if (url.length > 1000) {
    throw new Error("Url is too long");
  }
  const match = url.match(regex);

  return !match ? url : match[1];
};
/* eslint-disable  @typescript-eslint/no-explicit-any */
export function getBackgroundImageUrl<
  T extends {
    backgroundMedia?: any;
  },
>(url: string, element: T): string {
  const backgroundImage = getUrlFromBackgroundImage(url);
  const width = element.backgroundMedia?.metaData?.width ?? 0;
  const height = element.backgroundMedia?.metaData?.height ?? 0;
  const biggestParam =
    width > height
      ? `width=${roundUp(width > 1920 ? 1900 : width)}`
      : `height=${roundUp(height > 1920 ? 1900 : height)}`;
  const srcPath = `${backgroundImage}?${biggestParam}&fit=crop,smart`;

  return 'url("' + srcPath + '")';
}
