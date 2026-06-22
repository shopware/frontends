import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "0celbjjf",
    dataset: "production",
  },
  // Hostname for the hosted Studio: https://composable-frontends.sanity.studio
  studioHost: "composable-frontends",
  deployment: {
    // Auto-update the deployed studio. https://www.sanity.io/docs/cli#auto-updates
    autoUpdates: true,
  },
});
