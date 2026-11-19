export function isSpatial<
  MEDIA extends {
    fileExtension?: string;
    url?: string;
  },
>(media: MEDIA | null | undefined): boolean {
  if (!media) return false;
  return media.fileExtension === "glb" || !!media.url?.endsWith(".glb");
}
