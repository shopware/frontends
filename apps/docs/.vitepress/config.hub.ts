import { CmsBaseReference } from "./theme/typer/cms-base-plugin";
import { ComposablesBuilder } from "./theme/typer/composables-builder";
import { ReadmeBasedReference } from "./theme/typer/plugin";
import { ReadmeLoader } from "./theme/typer/readme-loader";

/**
 * This file extends the DevHub VitePress configuration.
 * All plugins should work in both contexts:
 *  - DevHub - /apps/docs/src/ is mounted to /src/frontends/ in DevHub, root-source is available under /src/frontends/_source/
 *  - Frontend (standalone) docs
 */
export default (
  original,
  {
    projectRootDir,
    mountPoint,
  }: { projectRootDir: string; mountPoint: string },
) => {
  if (!original.vite) {
    original.vite = {};
  }

  if (!original.vite.plugins) {
    original.vite.plugins = [];
  }

  // add custom plugins
  // they should work in the context of the DevHub and Frontend docs
  original.vite.plugins.push(
    ...[
      ReadmeBasedReference({ projectRootDir, relativeDir: "packages" }),
      CmsBaseReference({
        projectRootDir,
        relativeDir: "packages/cms-base-layer/app/components/public/cms",
      }),
      ReadmeLoader(),
      ComposablesBuilder({
        projectRootDir,
        mountPoint,
        relativeDir: "packages/composables/src",
      }),
    ],
  );

  console.log("Extending", projectRootDir, mountPoint);

  return original;
};
