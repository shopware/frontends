/**
 * Download file
 *
 */
export function downloadFile<T>(file: T, name: string) {
  const media = document.createElement("a");
  media.href = URL.createObjectURL(file as Blob);
  media.download = name;

  document.body.appendChild(media);
  media.click();
  document.body.removeChild(media);
}
