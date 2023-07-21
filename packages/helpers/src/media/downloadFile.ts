/**
 * Download file
 *
 * @param {Blob} file
 * @param {string} name
 */
export function downloadFile(file: Blob, name: string) {
  const media = document.createElement("a");
  media.href = URL.createObjectURL(file);
  media.download = name;

  document.body.appendChild(media);
  media.click();
  document.body.removeChild(media);
}
