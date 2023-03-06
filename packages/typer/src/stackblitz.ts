export function getStackBlitzExampleEmbedUrl({
  openPath,
  githubTreeUrl,
}: {
  openPath: string;
  githubTreeUrl: string;
}) {
  const stackBlitzIframeOptions = {
    embed: 1, // embedded mode
    theme: "light", // dark
    ctl: 1, // click to load
    initialPath: openPath, // open at specific /path
    view: "preview", // open only a preview
    terminalHeight: 0, // minimize terminal size
    hideNavigation: true, // hide navigation
    hideExplorer: true, // hide explorer
  };

  const queryString = new URLSearchParams(
    stackBlitzIframeOptions as any
  ).toString();

  const exampleUrl = `${githubTreeUrl}?${queryString}`;

  return exampleUrl;
}
