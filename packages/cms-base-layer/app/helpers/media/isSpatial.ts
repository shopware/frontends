export function isSpatial<
  T extends {
    fileExtension: string;
    url?: string;
  },
>(media: T) {
  return media.fileExtension === "glb" || !!media.url?.endsWith(".glb");
}
